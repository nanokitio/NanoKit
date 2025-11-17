# 🔵 ¿Para Qué Tenemos Supabase?

## 📋 Resumen Ejecutivo

**Supabase** es tu **Backend-as-a-Service** completo. Reemplaza lo que normalmente serían:
- Un servidor de base de datos PostgreSQL
- Sistema de autenticación de usuarios
- Almacenamiento de archivos (como AWS S3)
- APIs automáticas para todas tus tablas
- Sistema de seguridad con Row Level Security (RLS)

**En pocas palabras:** Supabase es el "cerebro" de tu aplicación donde se guarda y gestiona TODO.

---

## 🎯 Funciones Principales de Supabase en NanoKit

### 1. 🗄️ **Base de Datos PostgreSQL**

Almacena TODA la información de tu plataforma:

#### Tablas Principales:

**`organizations` - Organizaciones de Usuarios**
```sql
- id: Identificador único
- name: Nombre de la organización
- owner_user_id: Quién la creó
- user_code: Código único (ej: "ABC123")
- created_at: Fecha de creación
```

**`sites` - Prelanders Generados**
```sql
- id: Identificador único
- slug: URL única (ej: "mi-casino")
- brand_name: Nombre del negocio
- template_id: Qué template usa (t1, t2, etc.)
- primary_color: Color principal
- logo_url: URL del logo
- hero_title: Título principal
- cta_button_text: Texto del botón
- background_style: Estilo del fondo
- status: published/draft/archived
- is_downloaded: Si fue descargado
- download_count: Cuántas veces se descargó
- organization_id: A qué organización pertenece
```

**`visits` - Analytics de Visitas**
```sql
- site_id: Qué prelander visitaron
- ts: Timestamp de la visita
- source: De dónde vino (google, direct, etc.)
- user_agent: Navegador usado
```

**`email_workflows` - Workflows de Emails**
```sql
- workflow_id: Tipo de workflow (onboarding, etc.)
- user_id: Usuario
- status: pending/active/completed
- current_step: En qué paso va
- metadata: Datos adicionales
```

**`email_logs` - Historial de Emails**
```sql
- user_id: A quién se envió
- email: Dirección de email
- subject: Asunto
- status: sent/failed
- sent_at: Cuándo se envió
```

**`email_schedules` - Emails Programados**
```sql
- workflow_record_id: Workflow al que pertenece
- scheduled_for: Cuándo enviarlo
- status: pending/sent/cancelled
```

**`download_passwords` - Contraseñas de Descarga**
```sql
- site_id: Qué prelander
- password_hash: Contraseña encriptada
- email: Email del usuario
- expires_at: Cuándo expira
```

---

### 2. 🔐 **Autenticación de Usuarios (Supabase Auth)**

Gestiona TODO lo relacionado con usuarios:

```typescript
// Login
await supabase.auth.signInWithPassword({ email, password })

// Signup
await supabase.auth.signUp({ email, password })

// Logout
await supabase.auth.signOut()

// Reset Password
await supabase.auth.resetPasswordForEmail(email)

// Get Current User
const { data: { user } } = await supabase.auth.getUser()
```

**Lo que hace por ti:**
- ✅ Verifica emails
- ✅ Envía emails de confirmación
- ✅ Gestiona sesiones con cookies
- ✅ Refresh tokens automáticos
- ✅ Reset de contraseñas
- ✅ Protección contra ataques
- ✅ OAuth (Google, GitHub, etc.) si lo configuras

---

### 3. 📁 **Storage (Almacenamiento de Archivos)**

Almacena archivos como logos, imágenes, etc.

```typescript
// Subir logo
await supabase.storage
  .from('logos1')
  .upload(fileName, file)

// Obtener URL pública
const { data: { publicUrl } } = supabase.storage
  .from('logos1')
  .getPublicUrl(fileName)
```

**Buckets en tu proyecto:**
- `logos1`: Logos de las marcas
- `prelanders`: Archivos HTML/CSS/JS generados
- `backgrounds`: Imágenes de fondo

---

### 4. 🔄 **API Automática (REST + Realtime)**

Supabase genera automáticamente APIs para TODAS tus tablas.

**Ejemplos de uso en tu código:**

```typescript
// SELECT - Leer datos
const { data: sites } = await supabase
  .from('sites')
  .select('*')
  .eq('organization_id', orgId)
  .order('created_at', { ascending: false })

// INSERT - Crear nuevo
const { data } = await supabase
  .from('sites')
  .insert({
    brand_name: 'Mi Casino',
    slug: 'mi-casino',
    template_id: 't1',
    user_id: userId
  })

// UPDATE - Actualizar
await supabase
  .from('sites')
  .update({ status: 'published' })
  .eq('id', siteId)

// DELETE - Eliminar
await supabase
  .from('sites')
  .delete()
  .eq('id', siteId)
```

**Ventajas:**
- ✅ No necesitas escribir código backend
- ✅ No necesitas crear endpoints manualmente
- ✅ TypeScript types automáticos
- ✅ Validación automática
- ✅ Relaciones entre tablas

---

### 5. 🛡️ **Row Level Security (RLS)**

Protege tus datos automáticamente.

**Ejemplo de Políticas:**

```sql
-- Solo puedes ver TUS propios sites
CREATE POLICY "Users can view their own sites"
ON sites FOR SELECT
USING (auth.uid() = user_id);

-- Solo puedes editar TUS sites
CREATE POLICY "Users can update their own sites"
ON sites FOR UPDATE
USING (auth.uid() = user_id);
```

**Qué significa:**
- ✅ Usuario A NO puede ver los sites del Usuario B
- ✅ Cada usuario solo ve SUS datos
- ✅ Protección a nivel de base de datos
- ✅ No puedes hacer trampa desde el frontend

---

### 6. 📧 **SMTP para Emails**

Supabase puede enviar emails usando SMTP configurado:

```typescript
// Configuración en Supabase Dashboard:
Settings → Authentication → SMTP Settings
```

**Emails que envía:**
- ✅ Confirmación de cuenta
- ✅ Reset de contraseña
- ✅ Magic links (login sin password)
- ✅ Cambio de email

---

### 7. ⚡ **Edge Functions (Opcional)**

Puedes correr código serverless en Supabase:

```typescript
// supabase/functions/send-welcome-email/index.ts
export default async function handler(req) {
  // Código que corre en el servidor
  return new Response('Email enviado')
}
```

---

## 🆚 Comparación: Con vs Sin Supabase

### ❌ **SIN Supabase (Lo que tendrías que hacer):**

1. **Base de Datos:**
   - Instalar PostgreSQL en un servidor
   - Configurar conexiones
   - Gestionar backups
   - Monitorear performance
   - **Costo:** $20-50/mes mínimo

2. **Autenticación:**
   - Crear sistema de login completo
   - Hash de passwords
   - JWT tokens
   - Session management
   - Reset password flows
   - **Tiempo:** 2-3 semanas de desarrollo

3. **APIs:**
   - Crear endpoints para cada operación
   - Validación de datos
   - Manejo de errores
   - **Tiempo:** 1 semana por tabla

4. **Storage:**
   - Configurar AWS S3
   - Gestionar uploads
   - URLs públicas
   - **Tiempo:** 1 semana

5. **Seguridad:**
   - Implementar permisos
   - Validar cada request
   - Proteger contra SQL injection
   - **Tiempo:** Constante

**Total:**
- ⏰ **Tiempo:** 2-3 meses
- 💰 **Costo:** $50-100/mes
- 🧠 **Complejidad:** ALTA

---

### ✅ **CON Supabase:**

1. **Base de Datos:** ✅ Incluida
2. **Autenticación:** ✅ Incluida
3. **APIs:** ✅ Automáticas
4. **Storage:** ✅ Incluido
5. **Seguridad:** ✅ RLS automático

**Total:**
- ⏰ **Tiempo:** 1 día de setup
- 💰 **Costo:** $0 (Free tier) o $25/mes (Pro)
- 🧠 **Complejidad:** BAJA

---

## 💰 Costos de Supabase

### Free Tier (Gratis):
- ✅ 500 MB de base de datos
- ✅ 1 GB de storage
- ✅ 2 GB de bandwidth
- ✅ 50,000 usuarios activos mensuales
- ✅ Social OAuth providers
- ✅ 7 días de logs

### Pro ($25/mes):
- ✅ 8 GB de base de datos
- ✅ 100 GB de storage
- ✅ 250 GB de bandwidth
- ✅ 100,000 usuarios activos mensuales
- ✅ Daily backups
- ✅ 7 días de point-in-time recovery
- ✅ Prioridad en soporte

---

## 📊 Tu Uso Actual de Supabase

### En tu proyecto estás usando:

1. ✅ **PostgreSQL** - 8 tablas principales
2. ✅ **Auth** - Login/Signup/Reset Password
3. ✅ **Storage** - Bucket 'logos1' para logos
4. ✅ **RLS** - Políticas de seguridad configuradas
5. ✅ **Triggers** - Generación automática de user_code
6. ✅ **Functions** - generate_user_code(), set_user_code()
7. ⚠️ **SMTP** - Necesita configuración (para emails de auth)
8. ⚠️ **Edge Functions** - send-welcome-email (opcional)

---

## 🎯 ¿Cuándo Necesitas Supabase?

### ✅ SIEMPRE que:
- Guardas datos del usuario
- Necesitas login/signup
- Almacenas archivos
- Quieres analytics
- Gestionas múltiples usuarios
- Necesitas APIs automáticas

### ❌ NO lo necesitas si:
- Solo sitio estático (HTML puro)
- No hay usuarios
- No guardas datos
- Todo es público

---

## 🔄 Alternativas a Supabase

Si no tuvieras Supabase, tendrías que usar:

1. **Firebase** (Google) - Similar pero más caro
2. **AWS Amplify** - Más complejo de configurar
3. **MongoDB Atlas + Auth0 + AWS S3** - Múltiples servicios
4. **Backend propio** - Node.js + Express + PostgreSQL

**Conclusión:** Supabase es la mejor opción para tu caso.

---

## 🚀 Comandos Más Usados en Tu Proyecto

```typescript
// Obtener usuario actual
const { data: { user } } = await supabase.auth.getUser()

// Obtener sites del usuario
const { data: sites } = await supabase
  .from('sites')
  .select('*')
  .eq('user_id', user.id)

// Crear nuevo site
const { data } = await supabase
  .from('sites')
  .insert({ ...siteData })

// Actualizar site
await supabase
  .from('sites')
  .update({ status: 'published' })
  .eq('id', siteId)

// Subir logo
await supabase.storage
  .from('logos1')
  .upload(fileName, file)

// Iniciar workflow de email
await supabase
  .from('email_workflows')
  .insert({ workflow_id: 'onboarding', user_id })
```

---

## 📚 Recursos

- **Dashboard:** https://supabase.com/dashboard
- **Docs:** https://supabase.com/docs
- **SQL Editor:** Dashboard → SQL Editor
- **Auth Settings:** Dashboard → Authentication
- **Storage:** Dashboard → Storage
- **Database:** Dashboard → Database

---

## ✅ Conclusión

**Supabase es el corazón de tu aplicación.**

Sin Supabase:
- ❌ No hay login/signup
- ❌ No se guardan prelanders
- ❌ No hay dashboard de usuario
- ❌ No hay analytics
- ❌ No hay storage de logos
- ❌ No hay emails automatizados

**En resumen:** Supabase hace posible que tu app exista. Es como el sistema nervioso de tu plataforma. 🧠

---

**Preguntas Frecuentes:**

**Q: ¿Puedo cambiar de Supabase a otra cosa?**  
A: Sí, pero tendrías que reescribir TODO el backend. No recomendado.

**Q: ¿Cuánto cuesta alojar mi proyecto?**  
A: Free tier es suficiente para empezar. Pro ($25/mes) cuando tengas más usuarios.

**Q: ¿Supabase es seguro?**  
A: Sí, muy seguro. Usado por miles de empresas. Tiene certificaciones SOC2 Type 2.

**Q: ¿Qué pasa si Supabase cae?**  
A: Tienen 99.9% uptime. Si cae (rarísimo), tu app también cae. Puedes hacer self-hosting como backup.

**Q: ¿Puedo exportar mis datos?**  
A: Sí, siempre. Es PostgreSQL estándar. Puedes hacer dump de la DB cuando quieras.

---

**Última actualización:** 17 de Noviembre, 2025  
**Autor:** Documentación NanoKit
