# 🚨 FIX RÁPIDO: Botón "Forgot password?" No Funciona

## ⚡ SOLUCIÓN INMEDIATA

El problema es que **el servidor no ha detectado las páginas nuevas**.

### Paso 1: Detener el Servidor

Presiona `Ctrl + C` en tu terminal donde está corriendo `npm run dev`

### Paso 2: Limpiar Cache de Next.js

```bash
# En la terminal, en la carpeta del proyecto:
rm -rf .next
```

### Paso 3: Reiniciar el Servidor

```bash
npm run dev
```

### Paso 4: Probar de Nuevo

1. Ve a `http://localhost:3000/login`
2. Click en **"Forgot password?"**
3. Debería abrirse `/forgot-password`

---

## 🧪 TEST DIRECTO

Si después de reiniciar sigue sin funcionar, prueba acceder directamente:

```
http://localhost:3000/forgot-password
```

Si al pegar esta URL en el navegador **sí funciona**, entonces el link está bien pero hay un problema de caché en el navegador.

**Solución:** Presiona `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac) para forzar recarga.

---

## 🔍 VERIFICAR QUE LOS ARCHIVOS EXISTEN

En tu terminal, ejecuta:

```bash
# Verifica que existe la página forgot-password
ls -la src/app/\(auth\)/forgot-password/page.tsx

# Verifica que existe la página reset-password
ls -la src/app/\(auth\)/reset-password/page.tsx
```

Deberías ver:
```
✅ src/app/(auth)/forgot-password/page.tsx
✅ src/app/(auth)/reset-password/page.tsx
```

---

## 🐛 DEBUGGING PASO A PASO

### 1. Verificar el Link en Consola

Abre DevTools (F12) y ejecuta en la consola:

```javascript
// Verificar que el elemento existe
document.querySelector('a[href="/forgot-password"]')
```

Debería retornar algo como:
```
<a href="/forgot-password" class="text-xs...">Forgot password?</a>
```

### 2. Verificar Rutas de Next.js

Después de reiniciar el servidor, busca en los logs de terminal:

```
✓ Ready in X.XXs
✓ Compiled / in XXXms
```

Si ves errores de compilación, cópialos y compártelos.

### 3. Test Manual del Link

En el archivo `/src/app/(auth)/login/page.tsx`, el link debería verse así:

```tsx
<Link
  href="/forgot-password"
  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors duration-300"
>
  Forgot password?
</Link>
```

---

## 🔧 FIX ALTERNATIVO: Link Directo con onClick

Si el problema persiste, podemos usar navegación programática:

```tsx
<button
  onClick={() => router.push('/forgot-password')}
  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors duration-300 bg-transparent border-none cursor-pointer"
>
  Forgot password?
</button>
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de continuar, verifica:

- [ ] **Servidor reiniciado** después de agregar las páginas
- [ ] **Cache limpiado** (`rm -rf .next`)
- [ ] **No hay errores** en la terminal del servidor
- [ ] **Link existe** en el HTML (verificar con DevTools)
- [ ] **URL directa funciona** (`http://localhost:3000/forgot-password`)
- [ ] **Navegador actualizado** con `Ctrl + Shift + R`

---

## 🎯 PRUEBA FINAL

Ejecuta este comando en tu proyecto:

```bash
# Limpia todo y reinicia
rm -rf .next && npm run dev
```

Luego ve a:
```
http://localhost:3000/login
```

Y haz click en "Forgot password?". **Debería funcionar.**

---

## 📞 SI SIGUE SIN FUNCIONAR

Comparte:
1. Screenshot de la consola del navegador (F12 → Console)
2. Output de la terminal donde corre `npm run dev`
3. Screenshot del botón "Forgot password?" (para ver si está visible)
4. Resultado de acceder directamente a `/forgot-password`

---

## 💡 CAUSA MÁS COMÚN

**90% de las veces** el problema es que:
1. El servidor no fue reiniciado después de crear las páginas nuevas
2. Next.js cachea las rutas y necesita limpieza

**Solución:** `rm -rf .next && npm run dev`
