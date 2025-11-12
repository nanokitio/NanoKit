# 🚀 Quick Start - Sistema de Emails con SendGrid

**Sistema completo de workflows de emails automatizados implementado exitosamente.**

---

## ✅ Lo que se ha creado

### 📦 Dependencias Instaladas
- `@sendgrid/mail` - Cliente oficial de SendGrid para Node.js

### 📁 Archivos Nuevos Creados

#### Módulos Core (`src/lib/`)
1. **`sendgrid.ts`** - Configuración y funciones de SendGrid
   - `sendEmail()` - Enviar email individual
   - `sendBulkEmails()` - Enviar emails masivos
   - `sendTemplatedEmail()` - Usar templates de SendGrid
   - `scheduleEmail()` - Programar emails

2. **`email-workflows.ts`** - Sistema de workflows automatizados
   - 5 workflows predefinidos (onboarding, prelander_created, download, hosting, trial)
   - `startWorkflow()` - Iniciar secuencia de emails
   - `stopWorkflow()` - Cancelar workflow
   - `sendWorkflowEmail()` - Enviar paso de workflow
   - `processScheduledEmails()` - Procesar emails programados

3. **`email-templates.ts`** - Templates HTML de emails
   - 12 templates profesionales pre-diseñados
   - Responsive y con buenos estilos
   - Personalizables con variables

#### API Routes (`src/app/api/`)
4. **`send-email/route.ts`** - Enviar email individual
5. **`send-download-password/route.ts`** - ✨ ACTUALIZADO para usar SendGrid
6. **`workflows/start/route.ts`** - Iniciar workflow
7. **`workflows/stop/route.ts`** - Detener workflow
8. **`workflows/process-scheduled/route.ts`** - Procesar emails programados (cron)

#### Base de Datos (`supabase/migrations/`)
9. **`create_email_workflows_tables.sql`** - Schema completo
   - Tabla `email_workflows` - Workflows activos
   - Tabla `email_logs` - Historial de emails
   - Tabla `email_schedules` - Emails programados
   - Tabla `email_preferences` - Preferencias de usuario
   - Indexes y RLS policies configurados

#### Documentación
10. **`EMAIL_WORKFLOWS_SETUP.md`** - Guía completa (este archivo)
11. **`SENDGRID_ENV_EXAMPLE.md`** - Variables de entorno
12. **`WORKFLOW_INTEGRATION_EXAMPLES.md`** - Ejemplos de código
13. **`QUICK_START_SENDGRID.md`** - Este archivo (inicio rápido)

---

## 🎯 Lo que NECESITAS hacer ahora

### Paso 1: Configurar SendGrid (10 minutos)

1. **Crear cuenta en SendGrid**
   - Ve a https://sendgrid.com
   - Registro gratuito (100 emails/día)

2. **Obtener API Key**
   - Dashboard → Settings → API Keys
   - Create API Key (permisos: Mail Send)
   - Copia el key

3. **Verificar Sender Email**
   - Settings → Sender Authentication
   - Verify a Single Sender
   - Usa tu email (ej: `noreply@landertag.com`)
   - Verifica el email que recibes

### Paso 2: Configurar Variables de Entorno (2 minutos)

Agrega a `.env.local`:

```bash
# SendGrid
SENDGRID_API_KEY=SG.tu_api_key_aqui
SENDGRID_SENDER_EMAIL=noreply@landertag.com
SENDGRID_SENDER_NAME=PrelanderAI

# Cron Security
CRON_SECRET=genera_un_token_aleatorio_largo

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generar CRON_SECRET:**
```bash
openssl rand -hex 32
```

### Paso 3: Migrar Base de Datos (5 minutos)

1. Abre Supabase Dashboard
2. Ve a **SQL Editor**
3. Copia todo el contenido de:
   ```
   supabase/migrations/create_email_workflows_tables.sql
   ```
4. Pega y ejecuta en SQL Editor
5. Verifica que las 4 tablas se crearon correctamente

### Paso 4: Reiniciar Servidor (1 minuto)

```bash
# Detener servidor
# Ctrl+C

# Reiniciar
npm run dev
```

### Paso 5: Probar (5 minutos)

#### Test 1: Enviar Email de Prueba

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "TU_EMAIL@example.com",
    "subject": "🧪 Test Email",
    "html": "<h1>Funciona!</h1><p>Email enviado exitosamente.</p>"
  }'
```

✅ Deberías recibir el email en tu bandeja de entrada.

#### Test 2: Iniciar Workflow

Agrega esto en tu ruta de signup o crea un endpoint de prueba:

```typescript
import { startWorkflow } from '@/lib/email-workflows'

await startWorkflow('onboarding', 'tu@email.com', 'user-id-aqui', {
  userName: 'Tu Nombre'
})
```

✅ Deberías recibir el primer email del workflow inmediatamente.

---

## 📧 Workflows Disponibles

### 1. `onboarding` - Onboarding de Usuario
- ✉️ Welcome (inmediato)
- ✉️ Getting Started (24 hrs después)
- ✉️ Tips & Tricks (4 días después)
- ✉️ Upgrade Prompt (9 días después)

### 2. `prelander_created` - Post-Creación
- ✉️ Creation Success (inmediato)
- ✉️ Optimization Tips (2 días después)

### 3. `download_workflow` - Post-Descarga
- ✉️ Download Password (inmediato)
- ✉️ Hosting Help (1 día después)

### 4. `hosting_workflow` - Post-Hosting
- ✉️ Hosting Success (inmediato)
- ✉️ Performance Check (7 días después)

### 5. `trial_expiring` - Expiración de Trial
- ✉️ 7 Days Warning (inmediato)
- ✉️ 3 Days Warning (4 días después)
- ✉️ 1 Day Warning (6 días después)

---

## 🔌 Cómo Usarlo en Tu Código

### Al registrar usuario:
```typescript
import { startWorkflow } from '@/lib/email-workflows'

await startWorkflow('onboarding', user.email, user.id, {
  userName: user.name
})
```

### Al crear prelander:
```typescript
await startWorkflow('prelander_created', user.email, user.id, {
  siteName: prelander.name,
  slug: prelander.slug
})
```

### Al descargar prelander:
Ya implementado automáticamente en:
```
src/app/api/send-download-password/route.ts
```

---

## ⚙️ Configurar Cron Job para Emails Programados

Los emails con delay (ej: "24 hrs después") necesitan un cron job.

### Opción A: Vercel Cron (Recomendado si usas Vercel)

Agrega/actualiza `vercel.json`:

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

### Opción B: EasyCron (Gratis)

1. Regístrate en https://www.easycron.com
2. Crear cron job:
   - **URL:** `https://tudominio.com/api/workflows/process-scheduled`
   - **Interval:** Every 15 minutes
   - **HTTP Header:** 
     ```
     Authorization: Bearer TU_CRON_SECRET
     ```

---

## 📖 Documentación Completa

- **📘 Setup Completo:** `EMAIL_WORKFLOWS_SETUP.md`
- **🔌 Ejemplos de Integración:** `WORKFLOW_INTEGRATION_EXAMPLES.md`
- **🔐 Variables de Entorno:** `SENDGRID_ENV_EXAMPLE.md`

---

## 🆘 Problemas Comunes

### ❌ "SendGrid not configured"
→ Verifica que `SENDGRID_API_KEY` esté en `.env.local` y reinicia el servidor

### ❌ "Sender not verified"
→ Ve a SendGrid Dashboard > Settings > Sender Authentication y verifica tu email

### ❌ Emails no llegan
→ Revisa SendGrid Dashboard > Activity para ver el status

### ❌ Emails programados no se envían
→ Verifica que el cron job esté configurado y funcionando

---

## 🎉 ¡Listo para Empezar!

Tu sistema de emails automatizados está completo. Solo necesitas:

1. ✅ Configurar SendGrid (API Key + Sender)
2. ✅ Agregar variables de entorno
3. ✅ Ejecutar migración SQL
4. ✅ Configurar cron job
5. ✅ Integrar workflows en tus eventos

**¿Necesitas ayuda?** Lee `EMAIL_WORKFLOWS_SETUP.md` para más detalles.

---

**Desarrollado con ❤️ para PrelanderAI**
