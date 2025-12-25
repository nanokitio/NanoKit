# Guía Completa: Configuración de Registro con Redes Sociales (Google & Facebook)

## 📋 Resumen
Este documento explica cómo configurar el registro de usuarios mediante Google y Facebook OAuth en tu aplicación NanoKit usando Supabase Authentication.

## 🎯 Prerrequisitos
- Acceso al dashboard de Supabase
- Cuenta de Google Cloud Console
- Cuenta de Meta Developers (Facebook)
- URL de tu aplicación (ej: https://tuapp.com)

---

## 🔧 Parte 1: Configurar Google OAuth

### Paso 1: Crear Proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombra el proyecto: "NanoKit Auth" o similar

### Paso 2: Configurar OAuth Consent Screen
1. En el menú lateral, ve a **APIs & Services** → **OAuth consent screen**
2. Selecciona **External** (si es para producción) o **Internal** (para pruebas)
3. Completa la información:
   - **App name**: NanoKit
   - **User support email**: tu-email@dominio.com
   - **Developer contact information**: tu-email@dominio.com
4. Haz clic en **Save and Continue**

### Paso 3: Configurar Scopes (Permisos)
1. En la sección **Scopes**, haz clic en **Add or Remove Scopes**
2. Busca y añade estos scopes:
   - `openid`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
3. Haz clic en **Save and Continue**

### Paso 4: Crear Credenciales OAuth
1. Ve a **APIs & Services** → **Credentials**
2. Haz clic en **Create Credentials** → **OAuth client ID**
3. Selecciona **Web application**
4. Nombre: "NanoKit Web Client"
5. En **Authorized redirect URIs**, añade:
   ```
   https://[TU-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   *(Reemplaza [TU-PROJECT-REF] con tu ID de proyecto Supabase)*
6. Haz clic en **Create**

### Paso 5: Obtener Credenciales
1. Copia el **Client ID** y el **Client Secret**
2. Guárdalos temporalmente, los necesitarás en Supabase

---

## 🔧 Parte 2: Configurar Facebook OAuth

### Paso 1: Crear App en Meta Developers
1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Haz clic en **Create App**
3. Selecciona **Business** como tipo de app
4. Nombre de la app: "NanoKit"
5. Correo electrónico de contacto: tu-email@dominio.com
6. Selecciona **Business Account** (crea uno si no tienes)
7. Haz clic en **Create App**

### Paso 2: Configurar Productos de la App
1. En el dashboard de tu app, ve a **Add Products**
2. Añade **Facebook Login**
3. Configura Facebook Login:
   - Selecciona **Web**
   - Site URL: `https://tuapp.com`
4. Haz clic en **Save**

### Paso 3: Configurar OAuth Redirect URI
1. En **Facebook Login** → **Settings**
2. En **Valid OAuth Redirect URIs**, añade:
   ```
   https://[TU-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   *(Reemplaza [TU-PROJECT-REF] con tu ID de proyecto Supabase)*
3. Haz clic en **Save Changes**

### Paso 4: Obtener Credenciales
1. Ve a **Settings** → **Basic**
2. Copia el **App ID** y el **App Secret**
3. Si no ves el App Secret, haz clic en **Show** y confirma tu contraseña

---

## 🔧 Parte 3: Configurar Supabase

### Paso 1: Habilitar Proveedores OAuth en Supabase
1. Ve al dashboard de [Supabase](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Providers**
4. Busca **Google** y haz clic en el ícono de configuración ⚙️
5. Activa **Enable Sign in with Google**
6. Completa los campos:
   - **Client ID**: [pegar Client ID de Google]
   - **Client Secret**: [pegar Client Secret de Google]
7. Haz clic en **Save**

### Paso 2: Configurar Facebook en Supabase
1. En la misma sección de **Providers**
2. Busca **Facebook** y haz clic en el ícono de configuración ⚙️
3. Activa **Enable Sign in with Facebook**
4. Completa los campos:
   - **Client ID**: [pegar App ID de Facebook]
   - **Client Secret**: [pegar App Secret de Facebook]
5. Haz clic en **Save**

### Paso 3: Verificar URL de Callback
1. En **Authentication** → **URL Configuration**
2. Asegúrate que **Redirect URLs** contenga:
   ```
   https://[TU-PROJECT-REF].supabase.co/auth/v1/callback
   ```
3. También añade tu URL local para desarrollo:
   ```
   http://localhost:3000/auth/callback
   ```

---

## 🧪 Parte 4: Probar la Configuración

### Paso 1: Probar en Desarrollo
1. Inicia tu aplicación localmente:
   ```bash
   npm run dev
   ```
2. Ve a `http://localhost:3000/signup`
3. Haz clic en "Continue with Google" o "Continue with Facebook"
4. Debería redirigirte al proveedor OAuth y luego volver a tu app

### Paso 2: Verificar en Supabase
1. Ve a **Authentication** → **Users**
2. Deberías ver nuevos usuarios creados con el provider "google" o "facebook"

---

## 🔍 Troubleshooting Común

### Error: "redirect_uri_mismatch"
- **Causa**: La URL de redirect no coincide exactamente
- **Solución**: Verifica que la URL en Google/Facebook coincida exactamente con la de Supabase

### Error: "Invalid client"
- **Causa**: Client ID o Secret incorrectos
- **Solución**: Verifica que hayas copiado correctamente las credenciales

### Error: "Provider not enabled"
- **Causa**: El proveedor no está habilitado en Supabase
- **Solución**: Activa el proveedor en Authentication → Providers

### Error: "Email already registered"
- **Causa**: El email ya existe con otro método de autenticación
- **Solución**: El usuario debe usar el mismo método o registrar otro email

---

## 🚀 Parte 5: Configuración Adicional (Opcional)

### Personalizar Datos de Usuario
Puedes personalizar qué datos se guardan cuando un usuario se registra con OAuth:

```javascript
// En tu callback de OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
  }
})
```

### Manejar Post-Registro
Para ejecutar acciones después del registro (como crear perfil en otra tabla):

```javascript
// En /auth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  
  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Crear perfil de usuario si no existe
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            email: user.email,
            provider: user.app_metadata.provider,
            created_at: new Date().toISOString()
          })
      }
    }
  }
  
  return NextResponse.redirect(`${origin}${next}`)
}
```

---

## 📝 Checklist Final

- [ ] Proyecto creado en Google Cloud Console
- [ ] OAuth consent screen configurado en Google
- [ ] Credenciales OAuth creadas en Google
- [ ] App creada en Meta Developers
- [ ] Facebook Login configurado
- [ ] Credenciales obtenidas de Facebook
- [ ] Proveedores habilitados en Supabase
- [ ] URLs de redirect configuradas
- [ ] Pruebas exitosas en desarrollo
- [ ] Verificación de usuarios en dashboard de Supabase

---

## 🎉 ¡Listo!

Una vez completados estos pasos, los usuarios podrán registrarse en tu aplicación NanoKit usando sus cuentas de Google y Facebook. El flujo será:

1. Usuario hace clic en "Continue with Google/Facebook"
2. Redirección al proveedor OAuth
3. Usuario autoriza la aplicación
4. Redirección de vuelta a tu app
5. Usuario autenticado y redirigido al dashboard

Para soporte adicional, revisa la [documentación de Supabase Auth](https://supabase.com/docs/guides/auth).
