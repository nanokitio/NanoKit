# 🧪 TEST LOCAL - Forgot Password (Paso a Paso)

## ⚠️ IMPORTANTE: Prueba LOCAL Primero

Antes de verificar en Vercel, **DEBES probar en tu computadora local**.

---

## 🎯 LO QUE NECESITO DE TI:

### 1. **¿Dónde estás probando?**
- [ ] Local (http://localhost:3000) ← **EMPIEZA AQUÍ**
- [ ] Producción (Vercel) ← Solo después de que funcione en local

### 2. **¿Está corriendo el servidor local?**
- [ ] Sí, tengo `npm run dev` corriendo
- [ ] No, necesito iniciarlo

---

## 🚀 PASO A PASO (EN TU COMPUTADORA)

### PASO 1: Detener Servidor Actual

En la terminal donde corre `npm run dev`:
```bash
# Presiona:
Ctrl + C
```

### PASO 2: Limpiar Cache de Next.js

```bash
# En tu terminal, dentro del proyecto:
rm -rf .next
rm -rf node_modules/.cache
```

### PASO 3: Verificar Archivos

```bash
# Verifica que existan:
ls -la src/app/\(auth\)/forgot-password/page.tsx
ls -la src/app/\(auth\)/reset-password/page.tsx
```

Deberías ver:
```
✅ src/app/(auth)/forgot-password/page.tsx
✅ src/app/(auth)/reset-password/page.tsx
```

### PASO 4: Reiniciar Servidor

```bash
npm run dev
```

Espera a ver:
```
✓ Ready in X.XXs
○ Compiling / ...
✓ Compiled in XXXms
```

### PASO 5: Abrir en Navegador

Abre esta URL **EXACTA**:
```
http://localhost:3000/forgot-password
```

---

## ✅ VERIFICACIÓN PASO A PASO

### Test 1: Página Forgot Password Abre?

**URL:** `http://localhost:3000/forgot-password`

**Qué deberías ver:**
- ✅ Página con fondo púrpura/negro
- ✅ Título: "Reset Password"
- ✅ Input para email
- ✅ Botón "Send Recovery Link"
- ✅ Link "Back to Login"

**Si NO ves esto:**
- ❌ Vuelve al PASO 1 y repite

### Test 2: Link desde Login Funciona?

1. Ve a: `http://localhost:3000/login`
2. Busca el link **"Forgot password?"** (al lado de "Password")
3. Click en él
4. Debería llevarte a `/forgot-password`

**Si NO funciona:**
```bash
# En tu navegador, presiona F12
# Ve a la pestaña "Console"
# Comparte cualquier error rojo que veas
```

### Test 3: Enviar Email Funciona?

1. En `/forgot-password`
2. Ingresa un email **QUE YA ESTÉ REGISTRADO**
   - Ve a Supabase → Authentication → Users
   - Usa un email de la lista
3. Click en "Send Recovery Link"
4. Deberías ver: "✓ Check Your Email"

**Si NO funciona:**
- Abre F12 → Console
- Comparte los errores

---

## 📋 CHECKLIST DE LO QUE NECESITO SABER

Por favor responde ESTAS preguntas:

### 1. Servidor Local
- [ ] ¿Ejecutaste `npm run dev`?
- [ ] ¿Dice "Ready" en la terminal?
- [ ] ¿Hay errores rojos en la terminal?

### 2. Navegador
- [ ] ¿Abre `http://localhost:3000/forgot-password`?
- [ ] ¿Qué ves en la pantalla? (describe o screenshot)
- [ ] ¿Hay errores en la consola (F12)?

### 3. Link desde Login
- [ ] ¿Ves el link "Forgot password?" en `/login`?
- [ ] ¿Qué pasa cuando haces click?
- [ ] ¿Te lleva a otra página o no hace nada?

---

## 🐛 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "Page Not Found" en /forgot-password

**Causa:** Next.js no detectó la página nueva

**Solución:**
```bash
# Detener servidor
Ctrl + C

# Limpiar todo
rm -rf .next
rm -rf node_modules/.cache

# Reinstalar (solo si es necesario)
npm install

# Reiniciar
npm run dev
```

### Problema 2: Link no hace nada cuando haces click

**Causa:** JavaScript no se está ejecutando

**Solución:**
1. Abre F12 → Console
2. Busca errores rojos
3. Recarga con `Ctrl + Shift + R`

### Problema 3: Botón "Send Recovery Link" no responde

**Causa:** Supabase no configurado o email no existe

**Solución:**
1. Verifica `.env.local`:
```bash
cat .env.local
```

Deberías tener:
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

2. Verifica que el email existe en Supabase:
   - Dashboard → Authentication → Users
   - Busca el email que estás usando

---

## 📸 LO QUE NECESITO DE TI

Para ayudarte, comparte:

### 1. Screenshot de /forgot-password
Abre `http://localhost:3000/forgot-password` y toma screenshot

### 2. Terminal Output
Copia todo lo que aparece cuando corres `npm run dev`

### 3. Consola del Navegador
F12 → Console → Screenshot de cualquier error

### 4. Network Tab
F12 → Network → Intenta enviar email → Screenshot de requests

---

## 🎯 OBJETIVO: PRIMERO FUNCIONA EN LOCAL

**NO intentes en Vercel hasta que funcione en local.**

Una vez que funcione en local:
- ✅ Push a GitHub
- ✅ Vercel desplegará automáticamente
- ✅ Funcionará en producción

---

## 🔄 FLUJO CORRECTO

```
1. ✅ Detener servidor
2. ✅ Limpiar cache (rm -rf .next)
3. ✅ Reiniciar servidor (npm run dev)
4. ✅ Abrir http://localhost:3000/forgot-password
5. ✅ Verificar que la página carga
6. ✅ Ir a /login
7. ✅ Click en "Forgot password?"
8. ✅ Debería llevarte a /forgot-password
9. ✅ Ingresar email registrado
10. ✅ Click "Send Recovery Link"
11. ✅ Ver mensaje de éxito
```

---

## ⏰ TIEMPO ESTIMADO

- Limpiar cache: 10 segundos
- Reiniciar servidor: 30 segundos
- Probar flujo: 2 minutos
- **TOTAL: ~3 minutos**

---

## 💬 RESPONDE ESTO:

1. **¿En qué paso estás?**
   - [ ] No he iniciado el servidor local
   - [ ] Servidor corriendo pero página no carga
   - [ ] Página carga pero link no funciona
   - [ ] Link funciona pero envío falla

2. **¿Qué ves cuando abres /forgot-password?**
   - Describe o envía screenshot

3. **¿Hay errores en la consola?**
   - F12 → Console → Copia errores

---

## 🎉 CUANDO FUNCIONE EN LOCAL

Si todo funciona en local, entonces:
1. ✅ El código está bien
2. ✅ Solo falta desplegar en Vercel
3. ✅ Será automático con el próximo push

**¡Avísame cuando hayas probado estos pasos!** 🚀
