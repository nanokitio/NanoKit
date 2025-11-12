# 🔐 Guía de Login y Configuración SendGrid

## 📧 Tus Credenciales
```
Email: admin@olavivo.com
Username: olavivo
Password: Sicario2016
```

---

## 🌐 Opciones de Login

### Opción 1: Login Directo
**URL:** https://app.sendgrid.com/login

1. Ingresa: `admin@olavivo.com` o `olavivo`
2. Password: `Sicario2016`
3. Click "Sign In"

### Opción 2: Login desde Homepage
**URL:** https://sendgrid.com

1. Click en "Login" (esquina superior derecha)
2. Ingresa credenciales
3. Click "Sign In"

---

## ❌ Si el Login No Funciona

### Problema 1: "Invalid credentials"

**Solución A: Reset Password**
1. Ve a: https://app.sendgrid.com/login
2. Click en "Forgot Password?"
3. Ingresa: `admin@olavivo.com`
4. Revisa tu email para el link de reset
5. Crea una nueva contraseña

**Solución B: Verifica el Email**
- Asegúrate de estar usando: `admin@olavivo.com` (no solo `olavivo`)
- Sin espacios al inicio o final
- Verifica que el email esté correcto

### Problema 2: "Account locked" o "Too many attempts"

**Solución:**
1. Espera 15-30 minutos
2. Usa el "Forgot Password" para resetear
3. Intenta desde una ventana de incógnito

### Problema 3: "Email not verified"

**Solución:**
1. Revisa tu bandeja de entrada de `admin@olavivo.com`
2. Busca email de SendGrid con asunto "Verify your email"
3. Click en el link de verificación
4. Intenta login nuevamente

### Problema 4: La página no carga / Error de red

**Solución:**
1. Verifica tu conexión a internet
2. Intenta desde otro navegador (Chrome, Firefox, Safari)
3. Limpia cache y cookies:
   - Chrome: Cmd+Shift+Delete (Mac) / Ctrl+Shift+Delete (Windows)
   - Selecciona "Cookies" y "Cached images"
   - Click "Clear data"
4. Intenta en ventana de incógnito
5. Desactiva VPN si estás usando uno

---

## ✅ Una Vez que Entres al Dashboard

### Paso A: Verificar Estado de la Cuenta

1. **Verifica que estés en el dashboard correcto**
   - Deberías ver: "Dashboard" con gráficas de emails
   - URL: https://app.sendgrid.com/

2. **Verifica el plan**
   - En el menú superior, verás tu plan actual
   - Free: 100 emails/día
   - Si necesitas más, puedes upgradear

---

## 🔑 Paso B: Obtener/Crear API Key

### Si Ya Tienes un API Key

1. Ve a: **Settings** → **API Keys**
   - URL directa: https://app.sendgrid.com/settings/api_keys

2. Deberías ver una lista de API Keys existentes

3. **IMPORTANTE:** Si ya existe un key pero NO lo recuerdas:
   - ❌ NO puedes ver el key completo de nuevo
   - ✅ Debes crear uno nuevo

### Crear Nuevo API Key

1. **Settings** → **API Keys** → **Create API Key**

2. Completa:
   ```
   API Key Name: PrelanderAI Production
   API Key Permissions: ● Full Access
   ```
   (O "Restricted Access" → solo marca "Mail Send")

3. **Click:** "Create & View"

4. **⚠️ COPIA EL KEY AHORA:**
   ```
   SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   Solo se muestra UNA VEZ

5. **Guárdalo inmediatamente:**
   - Pégalo en tu `.env.local`
   - O guárdalo en un archivo temporal
   - NO cierres la página hasta guardarlo

---

## ✉️ Paso C: Verificar Sender Email

### Verificar si `admin@olavivo.com` Ya Está Verificado

1. Ve a: **Settings** → **Sender Authentication**
   - URL: https://app.sendgrid.com/settings/sender_auth

2. Busca sección "Single Sender Verification"

3. ¿Ves `admin@olavivo.com` con un ✓ verde?
   - ✅ SI: Está verificado, puedes usar ese email
   - ❌ NO: Necesitas verificarlo

### Si NO Está Verificado

**Opción 1: Verificar admin@olavivo.com**

1. **Settings** → **Sender Authentication** → **Verify a Single Sender**

2. Click "Create New Sender"

3. Completa:
   ```
   From Name: Olavivo / PrelanderAI
   From Email Address: admin@olavivo.com
   Reply To: admin@olavivo.com
   Company Address: [tu dirección]
   City: [tu ciudad]
   Country: [tu país]
   ```

4. Click "Create"

5. **Revisa** tu email `admin@olavivo.com`

6. **Click en el link** de verificación

7. Espera que aparezca ✓ verde

**Opción 2: Usar noreply@olavivo.com**

Si prefieres usar `noreply@olavivo.com`:

1. Mismo proceso pero usa `noreply@olavivo.com` como "From Email"
2. Verifica ese email

---

## 🔧 Paso D: Configurar Variables de Entorno

Una vez que tengas:
- ✅ API Key
- ✅ Email verificado

**Agrega a `.env.local`:**

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.tu_api_key_completo_que_copiaste

# Usa el email que verificaste
SENDGRID_SENDER_EMAIL=admin@olavivo.com
# O si verificaste otro:
# SENDGRID_SENDER_EMAIL=noreply@olavivo.com

SENDGRID_SENDER_NAME=Olavivo

# Genera un token secreto
CRON_SECRET=genera_con_openssl_rand_hex_32

# URL de tu app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Paso E: Probar Configuración

1. **Reinicia tu servidor:**
   ```bash
   # Ctrl+C para detener
   npm run dev
   ```

2. **Ejecuta el test:**
   ```bash
   node test-sendgrid.js
   ```

3. **Deberías recibir un email en `admin@olavivo.com`**

---

## 🆘 Ayuda de Emergencia

### Si NADA funciona con el login:

**Plan B: Crear Nueva Cuenta**

1. Ve a: https://sendgrid.com
2. Click "Start for Free"
3. Usa otro email (ej: `support@olavivo.com` o `dev@olavivo.com`)
4. Completa el registro
5. Sigue la guía original

**O Contacta Soporte de SendGrid:**
- Email: support@sendgrid.com
- Help Center: https://support.sendgrid.com
- Chat: Disponible en el dashboard (si puedes entrar)

---

## ✅ Checklist

- [ ] Login exitoso en https://app.sendgrid.com
- [ ] Dashboard visible
- [ ] API Key obtenido y copiado
- [ ] Email sender verificado (✓ verde)
- [ ] Variables en `.env.local` configuradas
- [ ] Test ejecutado con éxito
- [ ] Email de prueba recibido

---

## 📞 Necesitas Ayuda?

Dime exactamente qué error ves:
- ¿"Invalid credentials"?
- ¿"Account locked"?
- ¿La página no carga?
- ¿Otro mensaje de error?

Y te ayudo específicamente con ese problema.
