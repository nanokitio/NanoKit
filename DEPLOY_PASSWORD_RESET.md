# 🚀 Deploy de Password Reset - SIN CACHÉ

## Problema Actual
La página `/forgot-password` en Vercel muestra login en lugar del formulario de reset.

**Causa:** Caché de Vercel sirviendo versión antigua

---

## ✅ SOLUCIÓN: Force Deploy Sin Caché

### Opción 1: Desde Vercel Dashboard (Recomendado)

1. **Ve a:** https://vercel.com/dashboard
2. **Click en tu proyecto**
3. **Pestaña "Deployments"**
4. **Click en "..."** (tres puntos) del último deployment
5. **Click "Redeploy"**
6. **MUY IMPORTANTE:** ❌ **DESMARCA** "Use existing Build Cache"
7. **Click "Redeploy"**
8. **Espera 3-5 minutos** hasta que diga "Ready ✓"

### Opción 2: Desde Git (Alternativa)

Si prefieres hacer push desde Git:

```bash
# Hacer un cambio mínimo para forzar rebuild
echo "# Force rebuild $(date)" >> README.md
git add README.md
git commit -m "chore: force rebuild for password reset pages"
git push origin main
```

**Nota:** Esto también usa caché, por eso Opción 1 es mejor

---

## 🧪 VERIFICACIÓN DESPUÉS DEL DEPLOY

### Test 1: Abrir forgot-password directamente

```
https://nano-mrv2u7mt2-cielo-digital.vercel.app/forgot-password
```

**Debes ver:**
- ✅ Título: "Reset Password"
- ✅ Input: "Email Address"
- ✅ Botón: "Send Recovery Link"

**NO debes ver:**
- ❌ "Welcome Back" (eso es login)
- ❌ Input de contraseña

### Test 2: Limpiar caché del navegador

**CRÍTICO:** Aunque Vercel despliegue bien, tu navegador puede tener caché

**Chrome/Edge:**
```
1. Cmd + Shift + Delete (Mac) o Ctrl + Shift + Delete (Windows)
2. Seleccionar "Cached images and files"
3. Click "Clear data"
4. Cerrar navegador completamente
5. Abrir de nuevo
```

**Safari:**
```
1. Cmd + Option + E (vaciar caché)
2. Cmd + Q (cerrar Safari)
3. Abrir de nuevo
```

**Hard Refresh:**
```
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)
```

### Test 3: Modo Incógnito

Para estar 100% seguro:

```
1. Abrir ventana de incógnito
2. Ir a: https://nano-mrv2u7mt2-cielo-digital.vercel.app/forgot-password
3. Verificar que se vea el formulario correcto
```

---

## 📊 Timeline Esperado

| Paso | Tiempo | Acción |
|------|--------|--------|
| 1. Redeploy en Vercel | 3-5 min | Esperar "Ready ✓" |
| 2. Limpiar caché navegador | 1 min | Hard refresh |
| 3. Verificar página | 30 seg | Abrir /forgot-password |
| 4. Probar flujo completo | 2 min | Enviar email reset |
| **TOTAL** | **~8 min** | |

---

## 🎯 Checklist de Deploy

- [ ] Redeploy SIN caché en Vercel
- [ ] Deployment dice "Ready ✓"
- [ ] Esperar 5 minutos completos
- [ ] Limpiar caché del navegador
- [ ] Hard refresh (Cmd+Shift+R)
- [ ] Abrir `/forgot-password` directamente
- [ ] Verificar que NO es la página de login
- [ ] Verificar que SÍ es el formulario de reset
- [ ] Probar enviando un email de reset

---

## ⚠️ Si Sigue Mostrando Login

Si después de todo esto sigue mostrando login:

### Verificar Build Logs

1. Vercel Dashboard → Deployment → "Build Logs"
2. Buscar errores relacionados con:
   - `forgot-password`
   - `(auth)`
   - Route errors

### Verificar que el archivo existe en el deployment

1. Vercel Dashboard → Deployment → "Functions"
2. Buscar: `app/(auth)/forgot-password`
3. Debe aparecer como función serverless

### Último Recurso: Invalidar TODA la caché de Vercel

```bash
# En tu terminal local
npx vercel --prod --force
```

Esto elimina TODA la caché y redespliega desde cero.

---

## 📞 Siguiente Paso

Después de hacer el redeploy SIN caché:

**Dame un screenshot de:**
1. Vercel deployment (mostrando "Ready ✓")
2. La página `/forgot-password` en el navegador

Con eso puedo ver exactamente si se arregló o qué más falta.

---

**Última actualización:** Nov 7, 2025 7:12 PM
