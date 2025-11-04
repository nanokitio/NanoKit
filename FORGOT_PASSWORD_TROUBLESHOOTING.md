# 🔧 Forgot Password - Troubleshooting Guide

## ❌ Problema: Forgot Password No Funciona

---

## ✅ SOLUCIONES PASO A PASO

### 1️⃣ **Configurar Redirect URL en Supabase (CRÍTICO)**

Este es el problema más común. **DEBES hacer esto:**

1. Ve a tu proyecto en **Supabase Dashboard**
2. Click en **Authentication** (menú lateral)
3. Click en **URL Configuration**
4. En **Redirect URLs**, agrega estas URLs:

```
http://localhost:3000/reset-password
https://tu-dominio.vercel.app/reset-password
```

**⚠️ IMPORTANTE:**
- Debe ser la URL **EXACTA** (incluye http/https)
- Para local usa `http://localhost:3000`
- Para producción usa tu dominio de Vercel
- Click en **"Save"** después de agregar

---

### 2️⃣ **Verificar Email Provider en Supabase**

1. Ve a **Supabase → Authentication → Email**
2. Verifica que **"Enable Email Confirmations"** esté ACTIVADO
3. En desarrollo, Supabase usa su propio servicio de email

**Para verificar si el email se envió:**
1. Ve a **Authentication → Email**
2. Click en **"Inbucket"** (esquina superior derecha)
3. Verás TODOS los emails enviados en desarrollo

---

### 3️⃣ **Verificar en la Consola del Navegador**

Abre DevTools (F12) y ve a la pestaña **Console**:

```javascript
// Deberías ver estos logs:
Requesting password reset for: usuario@ejemplo.com
Redirect URL: http://localhost:3000/reset-password
Password reset email sent successfully
```

**Si ves errores:**
- ❌ `User not found` → El email no existe en la BD
- ❌ `Invalid redirect URL` → Falta configurar en Supabase
- ❌ `Rate limit` → Demasiados intentos, espera 5 minutos

---

### 4️⃣ **Verificar que el Usuario Existe**

El sistema solo envía emails a usuarios registrados:

1. Ve a **Supabase → Authentication → Users**
2. Busca el email que estás usando
3. Si NO existe, primero regístrate en `/signup`

---

### 5️⃣ **Probar con un Email Real**

Si estás en **desarrollo local**:
1. Usa cualquier email (no necesita ser real)
2. Ve al **Inbucket** de Supabase para ver el email
3. Copia el link de reset desde ahí

Si estás en **producción**:
1. Usa un email REAL que puedas acceder
2. Espera 1-2 minutos
3. Revisa tu bandeja de entrada Y spam/junk

---

## 🧪 TEST COMPLETO

### Paso 1: Verificar Configuración

```bash
# 1. Abre la consola de Supabase
# 2. Ve a Authentication → URL Configuration
# 3. Verifica que existe: http://localhost:3000/reset-password
```

### Paso 2: Crear Usuario de Prueba

1. Ve a `http://localhost:3000/signup`
2. Regístrate con: `test@example.com` / `password123`
3. Confirma que el usuario aparece en Supabase

### Paso 3: Probar Forgot Password

1. Ve a `http://localhost:3000/login`
2. Click en **"Forgot password?"**
3. Ingresa: `test@example.com`
4. Click en **"Send Recovery Link"**

### Paso 4: Verificar Email Enviado

1. Abre DevTools (F12) → Console
2. Deberías ver: `Password reset email sent successfully`
3. Ve a **Supabase → Authentication → Email → Inbucket**
4. Deberías ver el email ahí

### Paso 5: Usar el Link

1. En el Inbucket, abre el email
2. Copia el link (algo como: `http://localhost:3000/reset-password?token=...`)
3. Pega en el navegador
4. Ingresa nueva contraseña
5. Deberías ser redirigido a `/login`

---

## 🔍 DIAGNÓSTICO ESPECÍFICO

### Error: "Invalid redirect URL"

**Causa:** La URL de redirect no está configurada en Supabase.

**Solución:**
```sql
1. Ve a Supabase Dashboard
2. Authentication → URL Configuration
3. Agregar: http://localhost:3000/reset-password
4. Click Save
```

### Error: "User not found"

**Causa:** El email no existe en la base de datos.

**Solución:**
1. Verifica el email en **Authentication → Users**
2. Si no existe, regístrate primero en `/signup`
3. El sistema mostrará "Email sent" por seguridad, pero no enviará nada

### Error: "Rate limit exceeded"

**Causa:** Demasiados intentos en poco tiempo.

**Solución:**
1. Espera 5-10 minutos
2. Intenta de nuevo
3. Supabase limita a ~3 requests por minuto

### Error: "Network error"

**Causa:** Problema de conexión o Supabase no configurado.

**Solución:**
1. Verifica `NEXT_PUBLIC_SUPABASE_URL` en `.env.local`
2. Verifica `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`
3. Reinicia el servidor: `npm run dev`

---

## 📧 CONFIGURAR EMAIL EN PRODUCCIÓN

Para que funcione en producción con emails reales:

### Opción 1: Usar Email de Supabase (Limitado)

Por defecto Supabase envía emails, pero tiene límites:
- ✅ Fácil de configurar (ya está)
- ❌ Solo 2 emails por hora en plan free
- ❌ Puede ir a spam

### Opción 2: Configurar SMTP Propio (Recomendado)

1. Ve a **Supabase → Settings → Authentication**
2. Scroll hasta **SMTP Settings**
3. Configura con uno de estos:

#### **Resend (Recomendado)**
```
SMTP Host: smtp.resend.com
Port: 465 (SSL)
Username: resend
Password: [tu API key de Resend]
```

#### **Gmail (Para testing)**
```
SMTP Host: smtp.gmail.com
Port: 587 (TLS)
Username: tu-email@gmail.com
Password: [App password de Gmail]
```

#### **SendGrid**
```
SMTP Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [tu API key de SendGrid]
```

---

## 🎯 CHECKLIST COMPLETO

Antes de reportar que no funciona, verifica:

- [ ] Redirect URL configurada en Supabase
- [ ] Enable Email Confirmations activado
- [ ] Usuario existe en la base de datos
- [ ] Email es válido (formato correcto)
- [ ] No hay errores en consola del navegador
- [ ] Esperaste al menos 1-2 minutos
- [ ] Revisaste spam/junk (en producción)
- [ ] Revisaste Inbucket (en desarrollo)
- [ ] Variables de entorno correctas
- [ ] Servidor reiniciado después de cambios

---

## 📱 TESTING EN MÓVIL

Si estás probando en móvil:

1. La URL debe ser accesible desde el móvil
2. En local: usa tu IP local (ej: `http://192.168.1.100:3000`)
3. Agrega esa URL a Redirect URLs en Supabase
4. O usa ngrok para testing: `ngrok http 3000`

---

## 🐛 DEBUGGING AVANZADO

Si nada funciona, ejecuta este test:

```javascript
// En la consola del navegador (F12)
const supabase = createClient()

// Test 1: Verificar conexión
supabase.auth.getSession()
  .then(d => console.log('Session:', d))
  .catch(e => console.error('Session error:', e))

// Test 2: Intentar reset
supabase.auth.resetPasswordForEmail('test@example.com', {
  redirectTo: window.location.origin + '/reset-password'
})
  .then(d => console.log('Reset result:', d))
  .catch(e => console.error('Reset error:', e))
```

---

## 📞 ÚLTIMA OPCIÓN

Si después de TODO esto sigue sin funcionar:

1. **Verifica logs de Supabase:**
   - Dashboard → Logs → Auth
   - Busca errores relacionados con email

2. **Comparte esta info:**
   - Screenshot de la consola del navegador
   - Screenshot de URL Configuration en Supabase
   - Screenshot del error que aparece
   - ¿Estás en development o production?

3. **Alternativa temporal:**
   - Pide al usuario que contacte soporte
   - Resetea manualmente desde Supabase Dashboard:
     - Authentication → Users
     - Click en el usuario
     - "Send recovery email"

---

## ✅ DEBERÍA FUNCIONAR SI...

✅ Redirect URL está configurada  
✅ Usuario existe en la BD  
✅ Email provider habilitado  
✅ No hay rate limits activos  
✅ Variables de entorno correctas  

**Si cumples todo esto, el sistema FUNCIONARÁ.** 🎉

---

## 🔄 REINTENTAR DESPUÉS DE FIXES

```bash
# 1. Detén el servidor
Ctrl + C

# 2. Limpia cache
rm -rf .next

# 3. Reinstala dependencias (solo si cambiaste packages)
npm install

# 4. Reinicia servidor
npm run dev

# 5. Intenta de nuevo
```

---

## 💡 CONSEJO PRO

**Usa Inbucket en desarrollo:**
1. Nunca necesitas emails reales
2. Todos los emails van al Inbucket
3. Puedes copiar los links directamente
4. Es instantáneo (no esperas delivery)

**Acceso directo:** `https://tu-proyecto.supabase.co/project/default/auth/emails`
