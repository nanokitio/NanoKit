# 📧 Email Workflows con SendGrid - Guía Completa

Sistema completo de workflows de emails automatizados usando SendGrid para PrelanderAI.

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Estructura del Sistema](#estructura-del-sistema)
3. [Workflows Disponibles](#workflows-disponibles)
4. [Configuración de Base de Datos](#configuración-de-base-de-datos)
5. [Configuración de Cron Jobs](#configuración-de-cron-jobs)
6. [Uso de la API](#uso-de-la-api)
7. [Personalización](#personalización)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Configuración Inicial

### 1. Crear Cuenta en SendGrid

1. Ve a [sendgrid.com](https://sendgrid.com)
2. Crea una cuenta gratuita (permite 100 emails/día)
3. Verifica tu email

### 2. Obtener API Key

1. En SendGrid Dashboard, ve a **Settings** → **API Keys**
2. Click en **Create API Key**
3. Nombre: `PrelanderAI Production`
4. Permisos: **Full Access** (o mínimo **Mail Send**)
5. Copia el API Key (solo se muestra una vez)

### 3. Verificar Email Sender

**IMPORTANTE:** SendGrid requiere verificar el email "from"

#### Opción A: Single Sender Verification (Más rápido)
1. En SendGrid: **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Completa el formulario con tu email (ej: `noreply@landertag.com`)
4. Verifica el email que recibes

#### Opción B: Domain Authentication (Recomendado para producción)
1. En SendGrid: **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Sigue los pasos para agregar registros DNS
4. Espera 24-48 horas para propagación DNS

### 4. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxx
SENDGRID_SENDER_EMAIL=noreply@landertag.com
SENDGRID_SENDER_NAME=PrelanderAI

# Cron Job Security
CRON_SECRET=tu-token-super-secreto-aleatorio

# App URL
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

### 5. Aplicar Migración de Base de Datos

Ejecuta la migración SQL en tu base de datos Supabase:

```bash
# Opción 1: Desde Supabase Dashboard
# 1. Ve a SQL Editor en Supabase Dashboard
# 2. Copia el contenido de supabase/migrations/create_email_workflows_tables.sql
# 3. Ejecuta el SQL

# Opción 2: Usando Supabase CLI
supabase db push
```

---

## 🏗️ Estructura del Sistema

### Archivos Creados

```
src/
├── lib/
│   ├── sendgrid.ts                  # Módulo SendGrid
│   ├── email-workflows.ts           # Sistema de workflows
│   └── email-templates.ts           # Templates de emails
├── app/
│   └── api/
│       ├── send-email/route.ts              # Enviar email individual
│       ├── send-download-password/route.ts  # Password downloads (actualizado)
│       └── workflows/
│           ├── start/route.ts               # Iniciar workflow
│           ├── stop/route.ts                # Detener workflow
│           └── process-scheduled/route.ts   # Procesar emails programados

supabase/
└── migrations/
    └── create_email_workflows_tables.sql    # Schema de BD
```

### Tablas de Base de Datos

1. **email_workflows** - Instancias activas de workflows
2. **email_logs** - Log completo de todos los emails enviados
3. **email_schedules** - Emails programados para envío futuro
4. **email_preferences** - Preferencias y unsubscribes de usuarios

---

## 📬 Workflows Disponibles

### 1. Onboarding Workflow (`onboarding`)
**Trigger:** Registro de usuario (`user_signup`)

| Email | Delay | Asunto |
|-------|-------|--------|
| Welcome | 0 hrs | 🎉 Welcome to PrelanderAI! |
| Getting Started | 24 hrs | 🚀 Create Your First Prelander |
| Tips & Tricks | 96 hrs | 💡 Pro Tips for Better Prelanders |
| Upgrade Prompt | 216 hrs | ⭐ Unlock Premium Features |

### 2. Prelander Created (`prelander_created`)
**Trigger:** Creación de prelander

| Email | Delay | Asunto |
|-------|-------|--------|
| Creation Success | 0 hrs | ✅ Your Prelander is Ready! |
| Optimization Tips | 48 hrs | 📈 Optimize Your Prelander Performance |

### 3. Download Workflow (`download_workflow`)
**Trigger:** Descarga de prelander

| Email | Delay | Asunto |
|-------|-------|--------|
| Download Password | 0 hrs | 🔐 Your Secure Download Password |
| Hosting Help | 24 hrs | 🌐 Need Help with Hosting? |

### 4. Hosting Workflow (`hosting_workflow`)
**Trigger:** Prelander hosteado

| Email | Delay | Asunto |
|-------|-------|--------|
| Hosting Success | 0 hrs | 🎉 Your Prelander is Live! |
| Performance Check | 168 hrs | 📊 How is Your Prelander Performing? |

### 5. Trial Expiring (`trial_expiring`)
**Trigger:** Expiración de trial próxima

| Email | Delay | Asunto |
|-------|-------|--------|
| 7 Days Warning | 0 hrs | ⏰ Your Trial Expires in 7 Days |
| 3 Days Warning | 96 hrs | ⚠️ Only 3 Days Left in Your Trial |
| 1 Day Warning | 144 hrs | 🚨 Last Day of Your Trial! |

---

## 🔧 Configuración de Cron Jobs

Los emails programados necesitan un cron job que llame al endpoint `/api/workflows/process-scheduled`.

### Opción 1: Vercel Cron (Recomendado)

Crea `vercel.json` en la raíz del proyecto:

```json
{
  "crons": [
    {
      "path": "/api/workflows/process-scheduled",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

Este cron se ejecuta cada 15 minutos.

### Opción 2: Servicio Externo (EasyCron, Cron-Job.org)

1. Regístrate en [cron-job.org](https://cron-job.org) (gratis)
2. Crea un nuevo cron job:
   - **URL:** `https://tudominio.com/api/workflows/process-scheduled`
   - **Intervalo:** Cada 15 minutos
   - **Headers:** 
     ```
     Authorization: Bearer tu-token-super-secreto-aleatorio
     ```

### Opción 3: GitHub Actions

Crea `.github/workflows/process-emails.yml`:

```yaml
name: Process Scheduled Emails
on:
  schedule:
    - cron: '*/15 * * * *'  # Cada 15 minutos
  workflow_dispatch:  # Manual trigger

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger email processing
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://tudominio.com/api/workflows/process-scheduled
```

---

## 🔌 Uso de la API

### Iniciar un Workflow

```typescript
// En tu código cuando un usuario se registra
const response = await fetch('/api/workflows/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'onboarding',
    userEmail: 'user@example.com',
    userId: 'uuid-del-usuario',
    metadata: {
      userName: 'Juan',
      // Cualquier dato extra para personalizar emails
    }
  })
})

const data = await response.json()
console.log('Workflow iniciado:', data.workflowRecordId)
```

### Ejemplos de Uso en Eventos

#### Al Registrar Usuario
```typescript
// src/app/api/auth/signup/route.ts
import { startWorkflow } from '@/lib/email-workflows'

export async function POST(request: Request) {
  // ... código de registro ...
  
  // Iniciar workflow de onboarding
  await startWorkflow('onboarding', user.email, user.id, {
    userName: user.user_metadata.name
  })
}
```

#### Al Crear Prelander
```typescript
// src/app/api/prelanders/create/route.ts
import { startWorkflow } from '@/lib/email-workflows'

export async function POST(request: Request) {
  // ... código de creación ...
  
  await startWorkflow('prelander_created', user.email, user.id, {
    siteName: prelander.name,
    slug: prelander.slug
  })
}
```

#### Al Descargar Prelander
```typescript
// Ya implementado en src/app/api/send-download-password/route.ts
// Se envía automáticamente el email de password
// Puedes agregar:
await startWorkflow('download_workflow', email, user.id, {
  siteName,
  slug,
  isSecurePackage
})
```

### Detener un Workflow

```typescript
const response = await fetch('/api/workflows/stop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowRecordId: 'uuid-del-workflow'
  })
})
```

### Enviar Email Individual

```typescript
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Tu Asunto',
    html: '<h1>Hola!</h1><p>Este es tu email.</p>',
    text: 'Hola! Este es tu email.' // Opcional
  })
})
```

---

## 🎨 Personalización

### Modificar Templates de Emails

Edita `src/lib/email-templates.ts`:

```typescript
export function welcome(data: any) {
  const html = createEmailHTML(
    `<h1>¡Personaliza tu header!</h1>`,
    `<p>Personaliza tu contenido aquí</p>
     <p>Puedes usar datos: ${data.userName}</p>`
  )
  const text = `Versión texto del email`
  return { html, text }
}
```

### Agregar Nuevo Workflow

1. **Edita `src/lib/email-workflows.ts`**, agrega a `EMAIL_WORKFLOWS`:

```typescript
{
  id: 'mi_nuevo_workflow',
  name: 'Mi Workflow Personalizado',
  trigger: 'manual',
  enabled: true,
  steps: [
    {
      id: 'paso_1',
      name: 'Primer Email',
      subject: '📧 Asunto del Email',
      templateKey: 'mi_template',
      delayHours: 0,
    },
    {
      id: 'paso_2',
      name: 'Segundo Email',
      subject: '📧 Seguimiento',
      templateKey: 'mi_template_2',
      delayHours: 24,
    },
  ],
}
```

2. **Crea templates** en `src/lib/email-templates.ts`:

```typescript
export function mi_template(data: any) {
  const html = createEmailHTML(
    `<h1>Mi Template</h1>`,
    `<p>Contenido personalizado</p>`
  )
  const text = `Versión texto`
  return { html, text }
}
```

### Usar SendGrid Dynamic Templates

Si prefieres crear templates en SendGrid Dashboard:

```typescript
import { sendTemplatedEmail } from '@/lib/sendgrid'

await sendTemplatedEmail(
  'user@example.com',
  'd-1234567890abcdef', // Template ID de SendGrid
  {
    userName: 'Juan',
    productName: 'Mi Producto',
    ctaUrl: 'https://miapp.com/action'
  }
)
```

---

## 📊 Monitoreo y Analytics

### Ver Emails Enviados

```sql
-- En Supabase SQL Editor
SELECT 
  email,
  subject,
  status,
  sent_at,
  opened_at,
  clicked_at
FROM email_logs
WHERE user_id = 'uuid-del-usuario'
ORDER BY sent_at DESC
LIMIT 100;
```

### Ver Workflows Activos

```sql
SELECT 
  w.workflow_id,
  w.user_email,
  w.status,
  w.current_step,
  w.started_at,
  w.last_email_sent_at
FROM email_workflows w
WHERE w.status = 'active'
ORDER BY w.started_at DESC;
```

### Ver Emails Programados

```sql
SELECT 
  s.scheduled_for,
  s.status,
  w.workflow_id,
  w.user_email,
  s.step_index
FROM email_schedules s
JOIN email_workflows w ON s.workflow_record_id = w.id
WHERE s.status = 'pending'
ORDER BY s.scheduled_for ASC;
```

---

## 🔍 Troubleshooting

### ❌ Error: "SendGrid not configured"

**Solución:**
1. Verifica que `SENDGRID_API_KEY` esté en `.env.local`
2. Reinicia el servidor de desarrollo
3. En producción, asegúrate de configurar las variables en Vercel/hosting

### ❌ Error: "Unauthorized" al enviar emails

**Solución:**
1. Verifica que el API Key tenga permisos de **Mail Send**
2. Regenera el API Key si es necesario
3. Actualiza la variable de entorno

### ❌ Emails no se envían

**Solución:**
1. Verifica que el email sender esté verificado en SendGrid
2. Revisa logs en SendGrid Dashboard: **Activity**
3. Verifica que no estés en "sandbox mode" de SendGrid

### ❌ Emails programados no se procesan

**Solución:**
1. Verifica que el cron job esté configurado
2. Verifica que `CRON_SECRET` coincida en ambos lados
3. Revisa logs del cron job
4. Ejecuta manualmente: 
   ```bash
   curl -X POST \
     -H "Authorization: Bearer TU_CRON_SECRET" \
     https://tudominio.com/api/workflows/process-scheduled
   ```

### ⚠️ Límite de envío excedido

**SendGrid Free Tier:** 100 emails/día

**Soluciones:**
1. Upgrade a plan pago de SendGrid
2. Implementa rate limiting
3. Agrupa emails por prioridad

### 🔒 Prevenir Spam

**Best Practices implementadas:**
1. ✅ Email sender verificado
2. ✅ Unsubscribe links (implementa en templates)
3. ✅ Rate limiting en workflows
4. ✅ Tabla `email_preferences` para opt-outs

---

## 📝 Checklist de Implementación

- [ ] Cuenta SendGrid creada
- [ ] API Key obtenido
- [ ] Email sender verificado
- [ ] Variables de entorno configuradas
- [ ] Migración de BD ejecutada
- [ ] Cron job configurado
- [ ] Primer workflow probado
- [ ] Emails recibidos correctamente
- [ ] Logs verificados en BD
- [ ] Monitoring configurado

---

## 🎯 Próximos Pasos

1. **Personaliza los templates** con tu branding
2. **Configura unsubscribe links** en los templates
3. **Implementa A/B testing** de subject lines
4. **Agrega analytics** con SendGrid Event Webhook
5. **Configura segmentación** de usuarios

---

## 📚 Recursos Adicionales

- [SendGrid Docs](https://docs.sendgrid.com/)
- [SendGrid Node.js Library](https://github.com/sendgrid/sendgrid-nodejs)
- [Email Best Practices](https://sendgrid.com/en-us/blog/email-best-practices)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions) (alternativa)

---

## 🆘 Soporte

¿Problemas? Abre un issue o contacta:
- Email: support@landertag.com
- Discord: [Tu servidor]

**¡Listo para enviar emails automatizados! 🚀**
