# 🗄️ SCRIPTS DE MIGRACIÓN SUPABASE

## 📋 ORDEN DE EJECUCIÓN

Ejecuta estos scripts **EN ORDEN** en el SQL Editor de tu nuevo proyecto Supabase:

### 1️⃣ `01_schema_principal.sql`
- ✅ Crea todas las tablas principales
- ✅ Crea índices para performance
- ✅ Tables: `organizations`, `sites`, `visits`, `site_versions`, `prelander_deployments`

### 2️⃣ `02_funciones_y_triggers.sql`
- ✅ Funciones auxiliares (generar códigos, actualizar timestamps)
- ✅ Triggers automáticos (versiones, códigos de usuario)
- ✅ Actualización de datos existentes

### 3️⃣ `03_politicas_rls.sql`
- ✅ Habilita Row Level Security
- ✅ Políticas de acceso para cada tabla
- ✅ Seguridad multi-usuario

### 4️⃣ `04_storage_buckets.sql`
- ✅ Crea buckets: `logos1` y `backgrounds`
- ✅ Políticas de storage público/privado
- ✅ Permisos de upload por usuario

---

## 🚀 CÓMO EJECUTAR

### Método 1: Desde Supabase Dashboard

1. Ve a tu proyecto en Supabase
2. Click en **SQL Editor** en el menú lateral
3. Click en **+ New query**
4. Copia y pega el contenido de `01_schema_principal.sql`
5. Click en **Run** (o Ctrl/Cmd + Enter)
6. Repite para los scripts 02, 03 y 04

### Método 2: Todos a la vez (Avanzado)

Si prefieres ejecutar todo de una vez:

```bash
cat 01_schema_principal.sql \
    02_funciones_y_triggers.sql \
    03_politicas_rls.sql \
    04_storage_buckets.sql > full_migration.sql
```

Luego ejecuta `full_migration.sql` en el SQL Editor.

---

## ✅ VERIFICACIÓN

Después de ejecutar todos los scripts, verifica:

### 1. Tablas creadas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Deberías ver:
- ✅ organizations
- ✅ sites
- ✅ visits
- ✅ site_versions
- ✅ prelander_deployments

### 2. Storage buckets
```sql
SELECT * FROM storage.buckets;
```

Deberías ver:
- ✅ logos1
- ✅ backgrounds

### 3. RLS habilitado
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Todas las tablas deben tener `rowsecurity = true`

---

## 📝 NOTAS IMPORTANTES

### Templates Soportados
El schema soporta estos templates:
- `t1` - `t7` (Legacy)
- `t9` - `t13` (Game templates)
- `t14` - `t18` (Fortune Wheels & Cards)

### Campos Importantes

**sites table:**
- `template_id`: ID del template (t6, t7, t9, etc.)
- `user_id`: UUID del usuario owner
- `slug`: URL única del prelander
- `game_balance`: Balance inicial para juegos
- `wheel_values`: Valores para Fortune Wheels (CSV)
- `background_color` + `background_image`: Fondos personalizables

**organizations table:**
- `user_code`: Código único de 6 caracteres (auto-generado)
- `owner_user_id`: UUID del usuario

**prelander_deployments table:**
- `package_type`: 'quick' | 'standard' | 'secure' | 'aws_hosted'
- `hosted_url`: URL si está en S3
- `s3_key`: Path en S3

---

## 🔧 TROUBLESHOOTING

### Error: "relation already exists"
✅ Normal si re-ejecutas los scripts. Los `IF NOT EXISTS` previenen errores.

### Error: "permission denied"
❌ Asegúrate de estar en el SQL Editor con permisos de admin.

### Error: "function already exists"
✅ Los scripts incluyen `CREATE OR REPLACE`, puedes re-ejecutarlos.

### Error: "policy already exists"
✅ Los scripts incluyen `DROP POLICY IF EXISTS` antes de crear.

---

## 🎯 PRÓXIMOS PASOS

Después de ejecutar estos scripts:

1. ✅ Copia tu **Project URL** y **anon key** desde Settings → API
2. ✅ Configura las variables de entorno en Vercel
3. ✅ Deploy tu proyecto
4. ✅ Crea una cuenta de prueba
5. ✅ Crea un site de prueba

---

## 📞 SOPORTE

Si encuentras errores:

1. Revisa los logs en el SQL Editor
2. Verifica que ejecutaste los scripts en orden
3. Confirma que el proyecto Supabase está activo
4. Intenta ejecutar script por script individualmente

---

## 🎉 ¡LISTO!

Tu base de datos Supabase está configurada y lista para usar con NanoKit.

**Siguiente paso:** Configurar variables de entorno en Vercel (ver `MIGRATION_GUIDE.md`)
