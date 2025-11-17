# 🔧 Fix: Error 405 al hacer Sign Out

## 🐛 Problema

Cuando los usuarios intentaban hacer sign out, recibían el error:

```
Error code: 405 Method Not Allowed
https://www.nanokit.io/ sent back an error.
```

## 🔍 Causa Raíz

El middleware de Supabase (`src/lib/supabase/middleware.ts`) estaba bloqueando la ruta `/auth/signout` porque:

1. **No estaba en la lista de rutas permitidas** sin autenticación
2. El middleware intentaba validar al usuario antes de permitir el sign out
3. Esto causaba un conflicto donde la ruta no podía procesar correctamente la solicitud POST

### Código problemático:

```typescript
if (
  !user &&
  !request.nextUrl.pathname.startsWith('/login') &&
  !request.nextUrl.pathname.startsWith('/signup') &&
  !request.nextUrl.pathname.startsWith('/forgot-password') &&
  !request.nextUrl.pathname.startsWith('/reset-password') &&
  !request.nextUrl.pathname.startsWith('/auth/callback') &&
  // ❌ FALTABA: !request.nextUrl.pathname.startsWith('/auth/signout') &&
  !request.nextUrl.pathname.startsWith('/sites') &&
  request.nextUrl.pathname !== '/'
) {
  // Redirect to login
}
```

## ✅ Solución Implementada

### 1. Actualizar Middleware de Supabase

**Archivo:** `src/lib/supabase/middleware.ts`

Agregamos `/auth/signout` a la lista de rutas permitidas:

```typescript
if (
  !user &&
  !request.nextUrl.pathname.startsWith('/login') &&
  !request.nextUrl.pathname.startsWith('/signup') &&
  !request.nextUrl.pathname.startsWith('/forgot-password') &&
  !request.nextUrl.pathname.startsWith('/reset-password') &&
  !request.nextUrl.pathname.startsWith('/auth/callback') &&
  !request.nextUrl.pathname.startsWith('/auth/signout') && // ✅ AGREGADO
  !request.nextUrl.pathname.startsWith('/sites') &&
  request.nextUrl.pathname !== '/'
) {
  // Redirect to login
}
```

### 2. Mejorar Ruta de Sign Out

**Archivo:** `src/app/auth/signout/route.ts`

Mejoras implementadas:

1. **Manejo de errores** con try-catch
2. **Soporte para GET y POST** para evitar 405
3. **Logging** de errores para debugging
4. **Fallback seguro** que siempre redirige a home

```typescript
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Soporte adicional para GET
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
```

## 🧪 Testing

### Prueba Local

1. Inicia sesión en el dashboard
2. Click en "Sign Out"
3. Deberías ser redirigido a la home page sin errores

### Prueba en Producción

1. Deploy los cambios a Vercel
2. Inicia sesión en https://www.nanokit.io
3. Click en "Sign Out"
4. Verificar que funciona correctamente

## 📋 Checklist de Verificación

- [x] Ruta `/auth/signout` agregada al middleware
- [x] Soporte para método POST
- [x] Soporte para método GET (fallback)
- [x] Manejo de errores implementado
- [x] Logging de errores agregado
- [x] Redirect a home page funciona
- [x] Testing en ambiente local
- [ ] Testing en producción

## 🔄 Archivos Modificados

1. **`src/lib/supabase/middleware.ts`**
   - Línea 54: Agregada ruta `/auth/signout` a la whitelist

2. **`src/app/auth/signout/route.ts`**
   - Agregado try-catch para manejo de errores
   - Agregado método GET como fallback
   - Agregado logging de errores

## 📊 Comportamiento Anterior vs Nuevo

### Antes ❌
1. Usuario hace click en "Sign Out"
2. Form envía POST a `/auth/signout`
3. Middleware bloquea la ruta (no está en whitelist)
4. **Error 405: Method Not Allowed**
5. Usuario se queda en la página con error

### Después ✅
1. Usuario hace click en "Sign Out"
2. Form envía POST a `/auth/signout`
3. Middleware permite la ruta (está en whitelist)
4. Ruta procesa el sign out exitosamente
5. Usuario es redirigido a home page
6. Sesión cerrada correctamente

## 🚀 Deploy

Para aplicar estos cambios en producción:

```bash
# Commit los cambios
git add .
git commit -m "fix: Resolver error 405 en sign out agregando ruta al middleware"

# Push a GitHub
git push origin main

# Vercel automáticamente desplegará los cambios
```

## 🔐 Consideraciones de Seguridad

- ✅ La ruta `/auth/signout` ahora es pública (no requiere autenticación)
- ✅ Esto es correcto y seguro: cualquier usuario puede hacer signout
- ✅ El signout siempre limpia la sesión del lado del servidor
- ✅ No hay riesgo de seguridad al permitir esta ruta públicamente

## 📚 Recursos Relacionados

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405)

## 🆘 Troubleshooting

### Si el problema persiste:

1. **Verificar que el build sea exitoso:**
   ```bash
   npm run build
   ```

2. **Limpiar caché de Next.js:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Verificar variables de entorno:**
   ```bash
   # Asegúrate de que estas estén configuradas
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

4. **Revisar logs de Vercel:**
   - Ve a Vercel Dashboard
   - Selecciona tu proyecto
   - Ve a la pestaña "Logs"
   - Busca errores relacionados con `/auth/signout`

5. **Verificar middleware config:**
   - Asegúrate de que el middleware esté configurado correctamente
   - Revisa que las rutas estén en el matcher

## ✅ Estado

**Status:** ✅ Resuelto  
**Fecha:** 16 de Noviembre, 2025  
**Versión:** v1.0.1  
**Severity:** Alta (bloqueaba funcionalidad crítica)  
**Impacto:** Todos los usuarios que intentaban hacer sign out

---

**Última actualización:** 16 de Noviembre, 2025  
**Autor:** manupor  
**Commit:** (Pendiente de push)
