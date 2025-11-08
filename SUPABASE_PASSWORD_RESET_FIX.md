# 🔐 Supabase Password Reset - Configuración Correcta

## ❌ Problema Actual

El link del email muestra este error:
```
error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
```

**Causa:** La configuración de Redirect URLs en Supabase no está correcta.

---

## ✅ SOLUCIÓN (5 minutos)

### PASO 1: Ir a Supabase Dashboard

1. **Ve a:** https://supabase.com/dashboard
2. **Selecciona tu proyecto**
3. **Authentication** (menú lateral)
4. **URL Configuration**

---

### PASO 2: Configurar Site URL

En **"Site URL"** debe estar tu dominio de producción:

```
https://www.nanokit.io
```

O si aún no está en producción:
```
https://nano-mrv2u7mt2-cielo-digital.vercel.app
```

**⚠️ IMPORTANTE:** Sin barra final `/`

---

### PASO 3: Configurar Redirect URLs

En **"Redirect URLs"**, agregar EXACTAMENTE estas URLs:

```
https://www.nanokit.io/auth/callback
https://nano-mrv2u7mt2-cielo-digital.vercel.app/auth/callback
http://localhost:3002/auth/callback
```

**Cómo agregar:**
1. Pegar la URL en el campo
2. Click **"Add URL"**
3. Repetir para cada URL
4. Click **"Save"** al final

---

### PASO 4: Configurar Email Templates

1. En el menú lateral: **Authentication** → **Email Templates**
2. Seleccionar **"Reset Password"**

**Verificar que el template tenga:**

```html
<h2>Reset Password</h2>
<p>Follow this link to reset the password for your account:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

**CRÍTICO:** Debe usar `{{ .ConfirmationURL }}` (generada por Supabase)

**NO debe tener rutas hardcoded** como:
```html
❌ <a href="https://yourdomain.com/reset-password">
```

---

### PASO 5: Ajustar Configuración de Auth

En **Authentication** → **Settings**:

#### A. Email Auth
- ✅ **Enable Email provider**
- ✅ **Confirm email** = OFF (para testing rápido)
  - Si quieres confirmación: ON

#### B. Security Settings
- **JWT Expiry:** 3600 (1 hora)
- **Refresh Token Expiry:** 2592000 (30 días)

---

## 🧪 PROBAR EL FLUJO

### Test Completo:

1. **Ir a:** https://www.nanokit.io/forgot-password
   
2. **Ingresar email** registrado en tu sistema

3. **Click "Send Recovery Link"**

4. **Revisar email** (o Inbucket si es localhost)

5. **Click en el link del email**

6. **Debe abrir:** `/reset-password` (NO debe mostrar error)

7. **Ingresar nueva contraseña**

8. **Click "Reset Password"**

9. **Debe decir:** "Password Reset Successful!"

10. **Redirige a:** `/login` después de 3 segundos

---

## 📊 Flujo Correcto (Después de la Config)

```
Usuario → /forgot-password → Ingresa email
              ↓
Supabase envía email con link especial
              ↓
Link: https://nanokit.io/auth/callback?code=XXX&type=recovery
              ↓
Callback detecta type=recovery → /reset-password
              ↓
Usuario ingresa nueva contraseña
              ↓
Supabase actualiza contraseña
              ↓
Redirige a /login con mensaje de éxito
```

---

## 🔍 Verificar Configuración

### En Supabase Dashboard:

**Authentication → URL Configuration debe mostrar:**

```
Site URL:
https://www.nanokit.io

Redirect URLs:
✓ https://www.nanokit.io/auth/callback
✓ https://nano-mrv2u7mt2-cielo-digital.vercel.app/auth/callback
✓ http://localhost:3002/auth/callback
```

### En Email Template:

Debe contener:
```
{{ .ConfirmationURL }}
```

---

## 🚨 Troubleshooting

### Error: "OTP Expired"
**Causa:** Link usado más de 1 vez o expirado (1 hora)  
**Solución:** Pedir nuevo link (vuelve a /forgot-password)

### Error: "Invalid Redirect URL"
**Causa:** URL no está en la lista de Redirect URLs  
**Solución:** Agregar la URL exacta en Supabase → URL Configuration

### Error: "Access Denied"
**Causa:** Configuración de Site URL incorrecta  
**Solución:** Verificar Site URL en Supabase

### No llega el email
**Causa 1:** Email en spam  
**Solución:** Revisar carpeta spam

**Causa 2:** SMTP de Supabase en límite (2/hora)  
**Solución:** Esperar 1 hora o configurar custom SMTP

### Link abre pero muestra página en blanco
**Causa:** Callback no está manejando correctamente  
**Solución:** Verificar que `/auth/callback/route.ts` existe y está deployado

---

## ✅ Checklist de Configuración

- [ ] Site URL configurada en Supabase
- [ ] 3 Redirect URLs agregadas
- [ ] Click "Save" en URL Configuration
- [ ] Email template usa `{{ .ConfirmationURL }}`
- [ ] Email provider habilitado
- [ ] JWT expiry configurado (3600)
- [ ] Cambios guardados (botón Save)
- [ ] Esperar 1 minuto (propagación)
- [ ] Probar flujo completo

---

## 🎯 Después de Configurar

### 1. Hacer Commit y Push

```bash
git add .
git commit -m "fix: improve password reset flow with better error handling"
git push origin main
```

### 2. Esperar Deploy en Vercel (~3 min)

### 3. Probar en Producción

```
https://www.nanokit.io/forgot-password
```

### 4. Verificar que funciona

- Email llega ✓
- Link abre `/reset-password` ✓
- Nueva contraseña se guarda ✓
- Redirige a login ✓

---

## 💡 Explicación Técnica

### ¿Por qué estaba fallando?

El error `otp_expired` pasa cuando:

1. **Redirect URL no coincide:** Supabase rechaza la redirección
2. **Link expirado:** Han pasado más de 1 hora
3. **Link usado 2 veces:** Los links son de un solo uso

### ¿Qué arreglamos?

1. **Callback mejorado:** Ahora detecta errores y redirige apropiadamente
2. **Error handling:** Muestra mensajes claros al usuario
3. **Logging:** Console logs para debugging
4. **Type parameter:** Explicit `type=recovery` en URL

### ¿Cómo funciona ahora?

```javascript
// En forgot-password/page.tsx:
const redirectUrl = `${window.location.origin}/auth/callback?type=recovery`

// Supabase genera link:
https://nanokit.io/auth/callback?code=ABC123&type=recovery

// Callback detecta type=recovery:
if (type === 'recovery') {
  return redirect('/reset-password')
}

// Usuario ingresa nueva contraseña
// Supabase actualiza → Success!
```

---

## 📞 Si Sigue Sin Funcionar

Después de configurar Supabase y hacer deploy, si **TODAVÍA** no funciona:

**Necesito ver:**

1. Screenshot de Supabase → URL Configuration
2. Screenshot del email que llega
3. La URL completa que abre cuando haces click en el email
4. Screenshot de Vercel deployment (mostrando "Ready")

Con eso puedo diagnosticar el problema exacto.

---

**Tiempo total:** 5 minutos  
**Resultado:** Password reset funcionando perfectamente ✅
