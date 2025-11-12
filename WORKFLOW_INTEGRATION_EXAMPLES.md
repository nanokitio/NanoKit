# 🔌 Ejemplos de Integración de Workflows

Guía práctica con ejemplos reales de cómo integrar los workflows de email en tu aplicación.

---

## 📋 Índice
1. [Al Registrar Usuario](#1-al-registrar-usuario)
2. [Al Crear Prelander](#2-al-crear-prelander)
3. [Al Descargar Prelander](#3-al-descargar-prelander)
4. [Al Hostear Prelander](#4-al-hostear-prelander)
5. [Trial Expiring](#5-trial-expiring)
6. [Envío Manual de Emails](#6-envío-manual-de-emails)

---

## 1. Al Registrar Usuario

### Opción A: Desde API Route

```typescript
// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startWorkflow } from '@/lib/email-workflows'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    const supabase = await createClient()
    
    // Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    })

    if (error) throw error

    // ✅ INICIAR WORKFLOW DE ONBOARDING
    if (data.user) {
      await startWorkflow('onboarding', email, data.user.id, {
        userName: name,
      })
      
      console.log(`✅ Onboarding workflow iniciado para ${email}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully' 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
```

### Opción B: Desde Server Action (Next.js)

```typescript
// src/app/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { startWorkflow } from '@/lib/email-workflows'

export async function signUpUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })

  if (error) return { error: error.message }
  
  // ✅ Iniciar workflow
  if (data.user) {
    await startWorkflow('onboarding', email, data.user.id, { userName: name })
  }

  return { success: true }
}
```

### Opción C: Desde Client Component

```typescript
// src/app/signup/page.tsx
'use client'

import { useState } from 'react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Primero, crear usuario con Supabase Auth
    const { data: authData } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })

    if (authData.user) {
      // ✅ Iniciar workflow desde el cliente
      await fetch('/api/workflows/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: 'onboarding',
          userEmail: email,
          userId: authData.user.id,
          metadata: { userName: name }
        })
      })
    }
  }

  return (
    <form onSubmit={handleSignUp}>
      {/* Form fields */}
    </form>
  )
}
```

---

## 2. Al Crear Prelander

```typescript
// src/app/api/prelanders/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startWorkflow } from '@/lib/email-workflows'

export async function POST(request: NextRequest) {
  try {
    const { name, template, vertical } = await request.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Crear prelander en la base de datos
    const { data: prelander, error } = await supabase
      .from('sites')
      .insert({
        user_id: user.id,
        name: name,
        slug: generateSlug(name),
        template: template,
        vertical: vertical,
      })
      .select()
      .single()

    if (error) throw error

    // ✅ INICIAR WORKFLOW DE PRELANDER CREADO
    await startWorkflow('prelander_created', user.email!, user.id, {
      siteName: prelander.name,
      slug: prelander.slug,
      template: template,
      vertical: vertical,
    })

    return NextResponse.json({ 
      success: true, 
      prelander 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

---

## 3. Al Descargar Prelander

**Ya implementado** en `src/app/api/send-download-password/route.ts`

Pero si quieres agregar el workflow completo:

```typescript
// src/app/api/prelanders/download/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startWorkflow } from '@/lib/email-workflows'
import { sendEmail } from '@/lib/sendgrid'

export async function POST(request: NextRequest) {
  try {
    const { siteId, isSecurePackage } = await request.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener datos del prelander
    const { data: site } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single()

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    // Generar password
    const password = generatePassword()

    // Guardar password en BD con expiración
    await supabase.from('download_passwords').insert({
      site_id: siteId,
      password: password,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })

    // Enviar email inmediato con password
    await sendEmail({
      to: user.email!,
      subject: isSecurePackage ? '🛡️ Your Secure Package Password' : '🔐 Your Download Password',
      html: generatePasswordEmail(password, site.name, site.slug, isSecurePackage),
    })

    // ✅ INICIAR WORKFLOW DE DOWNLOAD (emails de seguimiento)
    await startWorkflow('download_workflow', user.email!, user.id, {
      siteName: site.name,
      slug: site.slug,
      isSecurePackage,
      password, // Incluir en metadata por si se necesita
    })

    return NextResponse.json({ 
      success: true,
      message: 'Password sent to your email',
      // NO incluir password en response en producción
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

function generatePassword(): string {
  return Math.random().toString(36).slice(-8).toUpperCase()
}
```

---

## 4. Al Hostear Prelander

```typescript
// src/app/api/prelanders/host/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startWorkflow } from '@/lib/email-workflows'
import { sendHostingEmail } from '@/lib/aws-ses' // O sendEmail de sendgrid

export async function POST(request: NextRequest) {
  try {
    const { siteId, domainLock } = await request.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener site
    const { data: site } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single()

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    // Hostear en AWS (tu lógica aquí)
    const hostedUrl = await hostToAWS(site, domainLock)

    // Actualizar site con URL
    await supabase
      .from('sites')
      .update({ 
        hosted_url: hostedUrl,
        domain_lock: domainLock,
        hosted_at: new Date().toISOString()
      })
      .eq('id', siteId)

    // Enviar email inmediato de confirmación
    await sendHostingEmail({
      to: user.email!,
      brandName: site.name,
      hostedUrl: hostedUrl,
      domainLock: domainLock,
    })

    // ✅ INICIAR WORKFLOW DE HOSTING (email de seguimiento en 7 días)
    await startWorkflow('hosting_workflow', user.email!, user.id, {
      brandName: site.name,
      hostedUrl: hostedUrl,
      domainLock: domainLock,
    })

    return NextResponse.json({ 
      success: true, 
      hostedUrl 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
```

---

## 5. Trial Expiring

### Opción A: Cron Job que revisa expiración

```typescript
// src/app/api/cron/check-trials/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startWorkflow } from '@/lib/email-workflows'

export async function GET(request: NextRequest) {
  try {
    // Verificar autorización del cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // ✅ ENCONTRAR USUARIOS CON TRIAL QUE EXPIRA EN 7 DÍAS
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const { data: usersExpiring7Days } = await supabase
      .from('profiles')
      .select('user_id, email')
      .eq('subscription_status', 'trial')
      .gte('trial_expires_at', new Date().toISOString())
      .lte('trial_expires_at', sevenDaysFromNow.toISOString())

    // Iniciar workflows para cada usuario
    for (const user of usersExpiring7Days || []) {
      // Verificar que no hayamos enviado ya este workflow
      const { data: existingWorkflow } = await supabase
        .from('email_workflows')
        .select('id')
        .eq('user_id', user.user_id)
        .eq('workflow_id', 'trial_expiring')
        .in('status', ['active', 'completed'])
        .single()

      if (!existingWorkflow) {
        await startWorkflow('trial_expiring', user.email, user.user_id, {
          trialExpiresAt: user.trial_expires_at,
        })
        console.log(`✅ Trial expiring workflow iniciado para ${user.email}`)
      }
    }

    return NextResponse.json({ 
      success: true,
      processed: usersExpiring7Days?.length || 0
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
```

Configurar en `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-trials",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Opción B: Al momento de actualizar subscription

```typescript
// src/app/api/subscription/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startWorkflow } from '@/lib/email-workflows'

export async function POST(request: NextRequest) {
  const { action } = await request.json() // 'start_trial', 'cancel', etc.
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (action === 'start_trial') {
    const trialExpiresAt = new Date()
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 14) // 14 días trial

    // Actualizar profile
    await supabase
      .from('profiles')
      .update({
        subscription_status: 'trial',
        trial_expires_at: trialExpiresAt.toISOString()
      })
      .eq('user_id', user.id)

    // ✅ INICIAR WORKFLOW DE TRIAL (envía recordatorios a los 7, 3, 1 días)
    await startWorkflow('trial_expiring', user.email!, user.id, {
      trialExpiresAt: trialExpiresAt.toISOString(),
    })
  }

  return NextResponse.json({ success: true })
}
```

---

## 6. Envío Manual de Emails

### Enviar email único (no workflow)

```typescript
// src/app/api/send-custom-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/sendgrid'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, subject, message } = await request.json()
    
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    // Verificar que el usuario actual es admin
    if (!currentUser || currentUser.user_metadata.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener email del usuario destinatario
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', userId)
      .single()

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // ✅ ENVIAR EMAIL
    const result = await sendEmail({
      to: targetUser.email,
      subject: subject,
      html: `
        <h1>${subject}</h1>
        <p>${message}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Este es un mensaje directo del equipo de PrelanderAI.
        </p>
      `,
      text: `${subject}\n\n${message}`,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Log en BD
    await supabase.from('email_logs').insert({
      user_id: userId,
      email: targetUser.email,
      subject: subject,
      status: 'sent',
      provider: 'sendgrid',
      provider_message_id: result.messageId,
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
```

---

## 🎯 Mejores Prácticas

### 1. Evitar Duplicados

Siempre verifica que no exista un workflow activo antes de iniciar uno nuevo:

```typescript
const { data: existing } = await supabase
  .from('email_workflows')
  .select('id')
  .eq('user_id', user.id)
  .eq('workflow_id', 'onboarding')
  .eq('status', 'active')
  .single()

if (!existing) {
  await startWorkflow('onboarding', user.email, user.id, metadata)
}
```

### 2. Manejo de Errores

```typescript
try {
  await startWorkflow('onboarding', user.email, user.id, metadata)
} catch (error) {
  // No bloquear la operación principal si el email falla
  console.error('Failed to start email workflow:', error)
  // Opcional: Log a error tracking service (Sentry, etc.)
}
```

### 3. Rate Limiting

Implementa rate limiting para prevenir spam:

```typescript
// Verificar cuántos emails ha recibido el usuario hoy
const { count } = await supabase
  .from('email_logs')
  .select('*', { count: 'exact', head: true })
  .eq('email', user.email)
  .gte('sent_at', new Date().toISOString().split('T')[0])

if (count && count > 20) {
  console.warn('Rate limit exceeded for', user.email)
  return // No enviar
}

await startWorkflow(...)
```

---

## 📊 Dashboard de Workflows

Ejemplo de cómo mostrar workflows activos a un usuario:

```typescript
// src/app/dashboard/emails/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function EmailsPage() {
  const [workflows, setWorkflows] = useState([])
  const supabase = createClient()

  useEffect(() => {
    async function loadWorkflows() {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data } = await supabase
        .from('email_workflows')
        .select('*')
        .eq('user_id', user?.id)
        .order('started_at', { ascending: false })
      
      setWorkflows(data || [])
    }
    loadWorkflows()
  }, [])

  const stopWorkflow = async (workflowId: string) => {
    await fetch('/api/workflows/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowRecordId: workflowId })
    })
    // Reload workflows
  }

  return (
    <div>
      <h1>My Email Workflows</h1>
      {workflows.map((workflow) => (
        <div key={workflow.id}>
          <h3>{workflow.workflow_id}</h3>
          <p>Status: {workflow.status}</p>
          <p>Step: {workflow.current_step}</p>
          {workflow.status === 'active' && (
            <button onClick={() => stopWorkflow(workflow.id)}>
              Stop Workflow
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

¿Necesitas más ejemplos? Revisa `EMAIL_WORKFLOWS_SETUP.md` para la documentación completa.
