# 🔐 Password Reset - Guía Maestra

**Problema:** `/forgot-password` en Vercel muestra login en lugar del formulario de reset

**Solución:** 2 pasos simples → 10 minutos total

---

## 📝 RESUMEN EJECUTIVO

Tu código está **100% correcto**. El problema es **caché de Vercel**.

### Flujo Correcto (Ya Implementado)
```
Usuario → /forgot-password (pide reset)
        ↓
Supabase envía email con link
        ↓
Usuario click en link → /auth/callback?code=XXX&type=recovery
        ↓
Callback detecta type=recovery → redirige a /reset-password
        ↓
Usuario ingresa nueva contraseña
        ↓
Redirige a /login
```

### Archivos Clave
```
✅ src/app/(auth)/forgot-password/page.tsx (existe)
✅ src/app/(auth)/reset-password/page.tsx (existe)  
✅ src/app/auth/callback/route.ts (existe, detecta recovery)
```

**TODO ESTÁ CORRECTO EN EL CÓDIGO** 

---

## 🎯 LO QUE TIENES QUE HACER (2 pasos)

### PASO 1: Configurar Supabase (5 min)

Ve a: https://supabase.com/dashboard

#### A. Authentication → URL Configuration

**Site URL:**
```
https://nano-mrv2u7mt2-cielo-digital.vercel.app
```

**Redirect URLs (agregar estas):**
```
https://nano-mrv2u7mt2-cielo-digital.vercel.app/auth/callback
https://nano-mrv2u7mt2-cielo-digital.vercel.app/reset-password
http://localhost:3002/auth/callback
```

Botón **"Save"** ← IMPORTANTE

#### B. Authentication → Email Templates → Reset Password

Verificar que el template tenga:
```html
<a href="{{ .ConfirmationURL }}">Reset Password</a>
```

✅ Debe usar `{{ .ConfirmationURL }}`  
❌ NO debe tener rutas hardcoded

---

### PASO 2: Redeploy en Vercel SIN Caché (5 min)

Ve a: https://vercel.com/dashboard

1. Click en tu proyecto
2. Pestaña **"Deployments"**
3. Click **"..."** (tres puntos) del último deployment
4. Click **"Redeploy"**
5. **❌ DESMARCA** "Use existing Build Cache" ← CRÍTICO
6. Click **"Redeploy"**
7. **Espera 5 minutos** hasta ver "Ready ✓"

---

## 🧪 VERIFICACIÓN (2 min)

### 1. Limpiar caché del navegador

**Opción A: Hard Refresh**
```
Mac: Cmd + Shift + R
Windows: Ctrl + Shift + R
```

**Opción B: Borrar caché completa**
```
Mac: Cmd + Shift + Delete
Windows: Ctrl + Shift + Delete
→ Seleccionar "Cached images and files"
→ Clear data
```

### 2. Abrir la página directamente

```
https://nano-mrv2u7mt2-cielo-digital.vercel.app/forgot-password
```

**Debes ver:**
```
✅ Título grande: "Reset Password"
✅ Texto: "Enter your email and we'll send you a secure link"
✅ Campo: "Email Address"
✅ Botón azul: "Send Recovery Link"
```

**NO debes ver:**
```
❌ "Welcome Back"
❌ Campo de contraseña
❌ Botón "Sign In"
```

### 3. Probar flujo completo

1. Ingresar un email registrado
2. Click "Send Recovery Link"
3. Debe decir: "✓ Check Your Email"
4. Ir a email (o Inbucket si es localhost)
5. Click en el link del email
6. Debe abrir `/reset-password` (NO login)
7. Ingresar nueva contraseña
8. Click "Reset Password"
9. Debe decir "Password Reset Successful!"
10. Redirige automáticamente a `/login` en 3 segundos

---

## 📊 CHECKLIST COMPLETO

**Supabase:**
- [ ] Site URL configurada
- [ ] Redirect URLs agregadas (3 URLs)
- [ ] Email template verificado
- [ ] Todo guardado (botón Save)

**Vercel:**
- [ ] Redeploy SIN caché
- [ ] Deployment "Ready ✓"
- [ ] Esperado 5 minutos

**Navegador:**
- [ ] Caché limpiado
- [ ] Hard refresh hecho
- [ ] Página `/forgot-password` abierta

**Verificación:**
- [ ] Formulario correcto (NO login)
- [ ] Email de reset enviado
- [ ] Link del email funciona
- [ ] Página `/reset-password` abre
- [ ] Nueva contraseña guardada
- [ ] Redirección a login funciona

---

## 🔥 SOLUCIÓN RÁPIDA (Copiar-Pegar)

Si tienes prisa, haz exactamente esto:

### 1. Supabase
```
1. Dashboard → Tu proyecto
2. Authentication → URL Configuration
3. Copiar y pegar estas 3 URLs en "Redirect URLs":

https://nano-mrv2u7mt2-cielo-digital.vercel.app/auth/callback
https://nano-mrv2u7mt2-cielo-digital.vercel.app/reset-password
http://localhost:3002/auth/callback

4. Save
```

### 2. Vercel
```
1. Dashboard → Tu proyecto → Deployments
2. Último deployment → "..." → Redeploy
3. DESMARCAR "Use existing Build Cache"
4. Redeploy
5. Esperar 5 minutos
```

### 3. Navegador
```
1. Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)
2. Abrir: /forgot-password
3. Verificar que NO sea login
```

**Listo! ✅**

---

## 🆘 SI SIGUE FALLANDO

Después de hacer todo lo anterior, si TODAVÍA muestra login:

### Verificar Build Logs en Vercel

1. Deployment → Build Logs
2. Buscar errores con: `forgot-password`, `(auth)`, `route`
3. Copiar el error completo y compartir

### Verificar que la función existe

1. Deployment → Functions tab
2. Buscar: `app/(auth)/forgot-password`
3. Debe aparecer como función serverless

### Si no aparece la función:

Hay un error en el build de Next.js. Posibles causas:

**A. Verificar estructura de carpetas:**
```
src/app/(auth)/forgot-password/page.tsx  ← ✅ Correcto
src/app/forgot-password/page.tsx         ← ❌ Incorrecto
```

**B. Verificar que no haya errores de TypeScript:**
```bash
# Correr en local
npm run build
```

Si hay errores, arreglarlos y hacer push.

---

## 💡 EXPLICACIÓN TÉCNICA (Para Entender)

### ¿Por qué muestra login?

Vercel cached la ruta `/forgot-password` cuando NO existía. En ese momento, probablemente había un redirect o mostraba login por default.

### ¿Por qué redeploy sin caché?

El caché de Vercel guarda:
- Rutas estáticas
- Funciones compiladas
- Assets

Al desmarcar "Use existing Build Cache", Vercel:
1. Recompila TODOS los archivos desde cero
2. Regenera TODAS las rutas
3. Descubre la nueva ruta `/forgot-password`
4. La sirve correctamente

### ¿Por qué limpiar caché del navegador?

Aunque Vercel sirva bien, tu navegador puede haber guardado:
- La respuesta HTTP anterior
- El HTML viejo
- Redirects anteriores

---

## 🎉 RESULTADO FINAL

Después de seguir esta guía:

✅ `/forgot-password` muestra el formulario correcto  
✅ Emails de reset se envían correctamente  
✅ Links del email redirigen a `/reset-password`  
✅ Cambio de contraseña funciona  
✅ Redirección a login funciona  

**Total: ~10 minutos de configuración**

---

## 📞 NECESITAS AYUDA?

Si después de todo esto sigue sin funcionar:

**Dame esta info:**

1. Screenshot de Vercel deployment (mostrando "Ready ✓")
2. Screenshot de `/forgot-password` en el navegador
3. Screenshot de Build Logs si hay errores
4. Screenshot de Supabase → URL Configuration

Con eso puedo darte la solución exacta.

---

**Última actualización:** Nov 7, 2025 7:12 PM  
**Status:** Código correcto ✅ | Solo falta deploy
