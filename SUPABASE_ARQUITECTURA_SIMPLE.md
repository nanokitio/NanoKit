# 🏗️ Arquitectura Simple: Cómo Funciona NanoKit con Supabase

## 📐 Diagrama Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 FRONTEND (Next.js)                     │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Login   │  │ Dashboard│  │  Create  │  │  Sites   │    │
│  │  Page    │  │   Page   │  │  Page    │  │  Page    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                         │                                     │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          │ Supabase Client
                          │ (JavaScript SDK)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    🔵 SUPABASE (Backend)                     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 🗄️ PostgreSQL Database                │  │
│  │                                                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │organizations│  │    sites    │  │    visits    │  │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │email_workflows│ │ email_logs │  │email_schedules│ │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              🔐 Authentication (Auth)                  │  │
│  │                                                         │  │
│  │  • Sign Up / Sign In                                   │  │
│  │  • Password Reset                                      │  │
│  │  • Session Management                                  │  │
│  │  • Email Verification                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                📁 Storage (Files)                      │  │
│  │                                                         │  │
│  │  • logos1 (bucket)                                     │  │
│  │  • prelanders (bucket)                                 │  │
│  │  • backgrounds (bucket)                                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            🛡️ Row Level Security (RLS)                 │  │
│  │                                                         │  │
│  │  • Usuarios solo ven SUS datos                         │  │
│  │  • Protección automática                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo: Crear un Nuevo Prelander

```
Usuario                     Frontend                Supabase
  │                            │                        │
  │  1. Click "Create Site"    │                        │
  ├───────────────────────────>│                        │
  │                            │                        │
  │  2. Llena formulario       │                        │
  ├───────────────────────────>│                        │
  │                            │                        │
  │  3. Submit                 │                        │
  ├───────────────────────────>│                        │
  │                            │  4. supabase.from('sites')
  │                            │     .insert({ ... })   │
  │                            ├───────────────────────>│
  │                            │                        │
  │                            │  5. ✅ Site guardado   │
  │                            │<───────────────────────┤
  │                            │                        │
  │  6. Redirect a /dashboard  │                        │
  │<───────────────────────────┤                        │
  │                            │                        │
```

---

## 🔐 Flujo: Login de Usuario

```
Usuario              Frontend                Supabase Auth
  │                     │                         │
  │  1. Enter email     │                         │
  │     & password      │                         │
  ├────────────────────>│                         │
  │                     │                         │
  │  2. Click Login     │                         │
  ├────────────────────>│                         │
  │                     │  3. signInWithPassword()│
  │                     ├────────────────────────>│
  │                     │                         │
  │                     │  4. ✅ Valida password  │
  │                     │  5. Crea session       │
  │                     │  6. Guarda cookie      │
  │                     │<────────────────────────┤
  │                     │                         │
  │  7. Redirect to     │                         │
  │     /dashboard      │                         │
  │<────────────────────┤                         │
  │                     │                         │
```

---

## 📊 Flujo: Ver Dashboard

```
Usuario              Frontend                 Supabase DB
  │                     │                         │
  │  1. Visit           │                         │
  │     /dashboard      │                         │
  ├────────────────────>│                         │
  │                     │                         │
  │                     │  2. getUser()           │
  │                     ├────────────────────────>│
  │                     │  3. ✅ User data        │
  │                     │<────────────────────────┤
  │                     │                         │
  │                     │  4. .from('organizations')
  │                     │     .select()           │
  │                     ├────────────────────────>│
  │                     │  5. ✅ Org data         │
  │                     │<────────────────────────┤
  │                     │                         │
  │                     │  6. .from('sites')      │
  │                     │     .select()           │
  │                     ├────────────────────────>│
  │                     │  7. ✅ Sites list       │
  │                     │<────────────────────────┤
  │                     │                         │
  │  8. Render UI       │                         │
  │     with data       │                         │
  │<────────────────────┤                         │
  │                     │                         │
```

---

## 📁 Flujo: Subir Logo

```
Usuario           Frontend            Supabase Storage
  │                  │                      │
  │  1. Select file  │                      │
  ├─────────────────>│                      │
  │                  │                      │
  │  2. Upload       │                      │
  ├─────────────────>│                      │
  │                  │  3. .storage         │
  │                  │     .from('logos1')  │
  │                  │     .upload()        │
  │                  ├─────────────────────>│
  │                  │                      │
  │                  │  4. ✅ File saved    │
  │                  │  5. Get publicUrl   │
  │                  │<─────────────────────┤
  │                  │                      │
  │  6. Show preview │                      │
  │<─────────────────┤                      │
  │                  │                      │
```

---

## 🔒 Row Level Security (RLS) - Cómo Funciona

```
┌────────────────────────────────────────────┐
│            User A hace query:              │
│  SELECT * FROM sites                       │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│         Supabase aplica RLS:               │
│  WHERE user_id = auth.uid()                │
│  (automáticamente)                         │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│       User A solo ve SUS sites:            │
│  ✅ Site 1 (user_id = A)                   │
│  ✅ Site 2 (user_id = A)                   │
│  ❌ Site 3 (user_id = B) <- NO VISIBLE     │
└────────────────────────────────────────────┘
```

---

## 🎯 Ejemplo Práctico: Crear y Ver un Site

### Paso 1: Usuario crea un site

```typescript
// En el frontend
const { data } = await supabase
  .from('sites')
  .insert({
    brand_name: 'Super Casino',
    slug: 'super-casino',
    template_id: 't1',
    user_id: user.id  // ← ID del usuario actual
  })
```

**Lo que pasa en Supabase:**
```sql
INSERT INTO sites (
  brand_name, 
  slug, 
  template_id, 
  user_id
) VALUES (
  'Super Casino',
  'super-casino',
  't1',
  '123-abc-456'  -- user.id
);
```

### Paso 2: Usuario ve sus sites

```typescript
// En el frontend
const { data: sites } = await supabase
  .from('sites')
  .select('*')
```

**Lo que pasa en Supabase (con RLS):**
```sql
SELECT * FROM sites
WHERE user_id = '123-abc-456'  -- ← RLS agrega esto automáticamente
```

**Resultado:**
```json
[
  {
    "id": "abc-123",
    "brand_name": "Super Casino",
    "slug": "super-casino",
    "user_id": "123-abc-456"
  }
]
```

---

## 💡 Analogías para Entender Supabase

### 🏦 Supabase = Banco

- **Database (PostgreSQL)** = Bóveda donde guardas el dinero
- **Auth** = Cajero que verifica tu identidad
- **Storage** = Caja de seguridad para objetos valiosos
- **RLS** = Seguridad que asegura que solo veas TU cuenta
- **API** = Ventanilla donde haces transacciones

### 🏢 Supabase = Edificio de Oficinas

- **Database** = Archiveros con todos los documentos
- **Auth** = Recepción que da pases de entrada
- **Storage** = Almacén para archivos grandes
- **RLS** = Cada oficina tiene llave, no puedes entrar a otras
- **API** = Sistema de intercomunicación

---

## 🔢 Datos Reales de Tu Proyecto

### Tablas y Relaciones:

```
organizations (1)  ──┬── (N) sites
      │              │
      │              ├── (N) visits
      │              │
      │              └── (N) download_passwords
      │
      └── (N) email_workflows
               │
               ├── (N) email_logs
               │
               └── (N) email_schedules
```

**Explicación:**
- 1 organización puede tener MUCHOS sites
- 1 site puede tener MUCHAS visitas
- 1 organización puede tener MUCHOS workflows de email

---

## 🛠️ Herramientas que Usas

### En tu código:

```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

### Métodos principales:

```typescript
// Auth
supabase.auth.signUp()
supabase.auth.signIn()
supabase.auth.signOut()
supabase.auth.getUser()

// Database
supabase.from('tabla').select()
supabase.from('tabla').insert()
supabase.from('tabla').update()
supabase.from('tabla').delete()

// Storage
supabase.storage.from('bucket').upload()
supabase.storage.from('bucket').getPublicUrl()
```

---

## ✅ Checklist: ¿Qué Necesitas de Supabase?

- [x] ✅ PostgreSQL Database
- [x] ✅ Authentication
- [x] ✅ Storage (logos)
- [x] ✅ RLS Policies
- [x] ✅ Auto-generated APIs
- [ ] ⚠️ SMTP Configuration (para emails auth)
- [ ] 🔄 Edge Functions (opcional)
- [ ] 🔄 Realtime subscriptions (opcional)

---

## 📚 Recursos Rápidos

| Recurso | URL |
|---------|-----|
| Dashboard | https://supabase.com/dashboard |
| Tu Proyecto | https://supabase.com/dashboard/project/[TU_ID] |
| SQL Editor | Dashboard → SQL Editor |
| Table Editor | Dashboard → Table Editor |
| Auth Users | Dashboard → Authentication → Users |
| Storage | Dashboard → Storage |
| Logs | Dashboard → Logs |

---

## 🎓 Resumen para No-Técnicos

**Pregunta:** ¿Qué hace Supabase?  
**Respuesta:** Guarda todo y gestiona usuarios.

**Pregunta:** ¿Puedo verlo?  
**Respuesta:** Sí, ve a https://supabase.com/dashboard

**Pregunta:** ¿Cuánto cuesta?  
**Respuesta:** $0 para empezar, $25/mes cuando crezcas.

**Pregunta:** ¿Es necesario?  
**Respuesta:** 100% SÍ. Sin Supabase no hay app.

**Pregunta:** ¿Qué pasa si lo elimino?  
**Respuesta:** Se pierde TODO. Nunca eliminar.

**Pregunta:** ¿Está seguro?  
**Respuesta:** Muy seguro. Mejor que hacerlo tú mismo.

---

**Última actualización:** 17 de Noviembre, 2025
