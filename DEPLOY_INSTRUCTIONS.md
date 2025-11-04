# 🚀 Instrucciones de Deploy - Password Reset

## 🎯 Estado Actual

El sistema de password reset está en el código local, pero **NO está desplegado en Vercel**.

---

## ✅ PASOS PARA DEPLOY

### 1️⃣ **Verificar Commits**

```bash
# Ver últimos commits
git log --oneline -3
```

Deberías ver:
- ✅ feat: Add complete password reset system
- ✅ fix: Ensure forgot password link is clickable

### 2️⃣ **Forzar Push a GitHub**

```bash
# Asegurar que todo esté en GitHub
git push origin main
```

### 3️⃣ **Verificar en GitHub**

Ve a: **https://github.com/nanokitio/NanoKit**

Verifica que existan estos archivos:
- ✅ `src/app/(auth)/forgot-password/page.tsx`
- ✅ `src/app/(auth)/reset-password/page.tsx`

### 4️⃣ **Forzar Redeploy en Vercel**

**Opción A: Desde Vercel Dashboard**
1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto "NanoKit"
3. Ve a la pestaña **"Deployments"**
4. Click en **"Redeploy"** en el último deployment
5. O click en **"Deploy"** en el botón de arriba

**Opción B: Trigger Automático**
```bash
# Hacer un commit vacío para trigger
git commit --allow-empty -m "chore: trigger vercel redeploy"
git push origin main
```

Vercel debería detectar el push y redesplegar automáticamente en 2-3 minutos.

---

## ⚙️ CONFIGURACIÓN EN SUPABASE (DESPUÉS DEL DEPLOY)

Una vez desplegado, **DEBES configurar esto**:

### 1. Agregar Redirect URLs

1. Ve a **Supabase Dashboard**
2. Click en tu proyecto
3. **Authentication** → **URL Configuration**
4. En **"Redirect URLs"**, agrega:

```
https://nano-mrv2u7mt2-cielo-digital.vercel.app/reset-password
http://localhost:3000/reset-password
```

5. Click en **"Save"**

### 2. Verificar Email Settings

1. **Authentication** → Email
2. Verifica que **"Enable Email Confirmations"** esté activado

---

## 🧪 TESTING DESPUÉS DEL DEPLOY

### 1. Verificar que las Páginas Existen

```
✅ https://nano-mrv2u7mt2-cielo-digital.vercel.app/forgot-password
✅ https://nano-mrv2u7mt2-cielo-digital.vercel.app/reset-password
```

Si estas URLs abren, el deploy fue exitoso.

### 2. Test del Flujo Completo

1. Ve a: `https://nano-mrv2u7mt2-cielo-digital.vercel.app/login`
2. Click en **"Forgot password?"**
3. Debería abrir `/forgot-password`
4. Ingresa un email registrado
5. Click en **"Send Recovery Link"**
6. Revisa el email (o Inbucket en Supabase si es testing)
7. Click en el link del email
8. Ingresa nueva contraseña
9. Debería redirigir a `/login`

---

## 🐛 ERRORES ACTUALES EN CONSOLA

### Error 1: MIME type "text/html" en lugar de JavaScript

```
The script from "...login" was loaded even though its MIME type ("text/html") is not a valid JavaScript MIME type.
```

**Causa:** Hay un archivo `.js` que no existe y devuelve HTML 404.

**Solución:** 
```bash
# Limpiar build de Next.js
rm -rf .next
npm run build
```

### Error 2: neon-effects.js no encontrado

```
Uncaught SyntaxError: expected expression, got '<'
neon-effects.js:1:1
```

**Causa:** Archivo JavaScript faltante o mal referenciado.

**Solución:** Verificar que no haya imports rotos en el código.

---

## 📦 ARCHIVOS DEL SISTEMA PASSWORD RESET

Estos archivos DEBEN estar en GitHub y desplegarse en Vercel:

```
src/app/(auth)/
├── forgot-password/
│   └── page.tsx          ✅ Página para solicitar reset
├── reset-password/
│   └── page.tsx          ✅ Página para crear nueva password
└── login/
    └── page.tsx          ✅ Actualizado con link "Forgot password?"
```

---

## ✅ CHECKLIST DE DEPLOYMENT

Antes de reportar problemas, verifica:

- [ ] **Código en GitHub** - Últimos commits están pusheados
- [ ] **Vercel detectó push** - Nuevo deployment en dashboard
- [ ] **Build exitoso** - Sin errores en Vercel logs
- [ ] **Páginas accesibles** - `/forgot-password` y `/reset-password` abren
- [ ] **Redirect URL en Supabase** - Con tu dominio de Vercel
- [ ] **Email habilitado** - Enable Email Confirmations activo

---

## 🕐 TIEMPOS ESTIMADOS

- **Push a GitHub:** Instantáneo
- **Detección por Vercel:** 10-30 segundos
- **Build en Vercel:** 1-3 minutos
- **Deploy completo:** ~3-5 minutos total

---

## 🔍 VERIFICAR ESTADO DEL DEPLOY

### En GitHub
```
1. Ve a tu repo: https://github.com/nanokitio/NanoKit
2. Verifica que los archivos existan
3. Último commit debería ser: "fix: Ensure forgot password link is clickable"
```

### En Vercel
```
1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Deployments"
4. Último deployment debería decir "Ready" con check verde
5. Click en el deployment → "View Deployment" → probar /forgot-password
```

---

## 🆘 SI VERCEL NO ESTÁ DEPLOYANDO

### Opción 1: Trigger Manual

```bash
# En tu proyecto local
git commit --allow-empty -m "chore: force vercel redeploy"
git push origin main
```

### Opción 2: Redeploy Manual en Dashboard

1. Vercel Dashboard → Tu proyecto
2. Pestaña "Deployments"
3. Botón de 3 puntos (...) en el último deployment
4. Click "Redeploy"

### Opción 3: Crear Nuevo Deployment

1. Vercel Dashboard
2. Click en "Add New" → "Project"
3. Importa tu repo nuevamente (si es necesario)

---

## 📞 DESPUÉS DEL DEPLOY

1. ✅ Espera 3-5 minutos para build completo
2. ✅ Limpia cache del navegador (`Ctrl + Shift + R`)
3. ✅ Ve a `/login` y verifica que funcione "Forgot password?"
4. ✅ Configura Redirect URL en Supabase
5. ✅ Prueba el flujo completo

---

## 💡 NOTA IMPORTANTE

**El botón está "muerto" en producción porque las páginas NO EXISTEN todavía en Vercel.**

Una vez que Vercel despliegue los cambios, el botón funcionará inmediatamente.

No necesitas código adicional - todo está listo, solo falta el deploy.
