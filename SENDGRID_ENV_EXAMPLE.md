# 🔐 Variables de Entorno para SendGrid

Copia estas variables a tu archivo `.env.local`:

```bash
# =====================================================
# SENDGRID EMAIL CONFIGURATION
# =====================================================

# Tu API Key de SendGrid (obtén en: https://app.sendgrid.com/settings/api_keys)
# IMPORTANTE: Debe tener permisos de "Mail Send" como mínimo
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email verificado en SendGrid que aparecerá como remitente
# Debe estar verificado en: Settings > Sender Authentication
SENDGRID_SENDER_EMAIL=noreply@landertag.com

# Nombre que aparecerá como remitente del email
SENDGRID_SENDER_NAME=PrelanderAI

# =====================================================
# CRON JOB SECURITY
# =====================================================

# Token secreto para proteger el endpoint de cron jobs
# Genera uno aleatorio: openssl rand -hex 32
CRON_SECRET=tu-token-super-secreto-aleatorio-de-64-caracteres-minimo

# =====================================================
# APPLICATION URL
# =====================================================

# URL base de tu aplicación (sin trailing slash)
# Desarrollo:
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Producción:
# NEXT_PUBLIC_APP_URL=https://tudominio.com
```

---

## 📋 Checklist de Configuración

### 1. SendGrid Setup
- [ ] Cuenta creada en [sendgrid.com](https://sendgrid.com)
- [ ] API Key generado con permisos "Mail Send"
- [ ] Email sender verificado (Single Sender o Domain Authentication)
- [ ] Variables `SENDGRID_API_KEY`, `SENDGRID_SENDER_EMAIL`, `SENDGRID_SENDER_NAME` configuradas

### 2. Cron Job Setup
- [ ] Token secreto generado para `CRON_SECRET`
- [ ] Cron job configurado (Vercel Cron, EasyCron, o GitHub Actions)
- [ ] Endpoint `/api/workflows/process-scheduled` protegido con el token

### 3. Base de Datos
- [ ] Migración SQL ejecutada en Supabase
- [ ] Tablas creadas: `email_workflows`, `email_logs`, `email_schedules`, `email_preferences`
- [ ] RLS policies configuradas

### 4. Testing
- [ ] Email de prueba enviado correctamente
- [ ] Workflow iniciado y email recibido
- [ ] Logs verificados en tabla `email_logs`
- [ ] Cron job ejecutado manualmente y funcionando

---

## 🚀 Configuración Rápida (5 minutos)

```bash
# 1. Instalar dependencias (ya hecho)
npm install @sendgrid/mail

# 2. Crear archivo .env.local
touch .env.local

# 3. Agregar variables (edita .env.local con tus valores)
echo "SENDGRID_API_KEY=SG.tu_api_key" >> .env.local
echo "SENDGRID_SENDER_EMAIL=noreply@tudominio.com" >> .env.local
echo "SENDGRID_SENDER_NAME=PrelanderAI" >> .env.local
echo "CRON_SECRET=$(openssl rand -hex 32)" >> .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local

# 4. Ejecutar migración en Supabase (copia el SQL y ejecútalo en SQL Editor)

# 5. Reiniciar servidor
npm run dev

# 6. Probar enviando un email
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "tu-email@example.com",
    "subject": "Test Email",
    "html": "<h1>Hola!</h1><p>Este es un email de prueba.</p>"
  }'
```

---

## 🔧 Generar Token Secreto

### Opción 1: OpenSSL (Mac/Linux)
```bash
openssl rand -hex 32
```

### Opción 2: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Opción 3: Online
Usa: https://www.random.org/strings/

---

## 🌐 Configuración por Ambiente

### Desarrollo (`.env.local`)
```bash
SENDGRID_API_KEY=SG.tu_api_key_de_dev
SENDGRID_SENDER_EMAIL=dev@landertag.com
SENDGRID_SENDER_NAME=PrelanderAI Dev
CRON_SECRET=dev-secret-token-no-usar-en-prod
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Producción (Vercel/Hosting)
```bash
SENDGRID_API_KEY=SG.tu_api_key_de_prod
SENDGRID_SENDER_EMAIL=noreply@landertag.com
SENDGRID_SENDER_NAME=PrelanderAI
CRON_SECRET=super-secret-prod-token-muy-largo-y-aleatorio
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

**IMPORTANTE:** Nunca compartas tu `SENDGRID_API_KEY` o `CRON_SECRET` en Git o públicamente.

---

## 📝 Verificar Configuración

### Test 1: Verificar Variables
```typescript
// En cualquier API route
console.log('SendGrid configured:', !!process.env.SENDGRID_API_KEY)
console.log('Sender:', process.env.SENDGRID_SENDER_EMAIL)
```

### Test 2: Enviar Email de Prueba
```bash
# Usando la API
curl -X POST https://tudominio.com/api/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-token-de-auth" \
  -d '{
    "to": "tu-email@example.com",
    "subject": "🧪 Test Email",
    "html": "<h1>Funciona!</h1>"
  }'
```

### Test 3: Iniciar Workflow de Prueba
```bash
curl -X POST https://tudominio.com/api/workflows/start \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "onboarding",
    "userEmail": "test@example.com",
    "userId": "uuid-del-usuario",
    "metadata": {}
  }'
```

---

## ⚠️ Troubleshooting

### Error: "SendGrid not configured"
→ Verifica que `SENDGRID_API_KEY` esté en `.env.local` y reinicia el servidor

### Error: "Unauthorized" desde SendGrid
→ Verifica que el API Key tenga permisos correctos y no esté expirado

### Error: "Sender not verified"
→ Ve a SendGrid > Settings > Sender Authentication y verifica tu email

### Emails no llegan
→ Revisa Activity en SendGrid Dashboard para ver el status de envío

---

## 🎯 Próximos Pasos

Después de configurar:

1. ✅ Lee `EMAIL_WORKFLOWS_SETUP.md` para documentación completa
2. ✅ Personaliza templates en `src/lib/email-templates.ts`
3. ✅ Configura cron job para emails programados
4. ✅ Implementa workflows en tus eventos (signup, download, etc.)

---

¿Necesitas ayuda? Consulta `EMAIL_WORKFLOWS_SETUP.md` o contacta soporte.
