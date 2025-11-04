# 🔧 SOLUCIÓN: No puedo cambiar el background

## 🎯 Problema
No se pueden cambiar los colores o imágenes de fondo en los templates.

---

## ✅ SOLUCIONES (En orden)

### 1️⃣ **Verificar que las columnas existen en Supabase**

El problema más común es que las columnas `background_color` y `background_image` no existen en tu tabla `sites`.

**SOLUCIÓN:**

Ve a **Supabase** → **SQL Editor** y ejecuta:

```sql
-- Agregar columnas si no existen
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a1a2e',
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Verificar que se crearon
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'sites' 
AND column_name IN ('background_color', 'background_image');
```

Si el resultado está vacío, las columnas NO existen. Ejecuta el `ALTER TABLE` de arriba.

---

### 2️⃣ **Verificar que tu template soporta backgrounds**

Solo estos templates soportan background customization:

✅ **Templates con Background:**
- `t6` - Classic Overlay (Cyberpunk)
- `t7` - Sweet Bonanza
- `t14` - Fortune Wheel Underwater
- `t15` - Fortune Wheel China
- `t16` - Fortune Wheel Christmas
- `t17` - Fortune Wheel Pirates
- `t18` - Big Cash Scratch Card

❌ **Templates SIN Background:**
- `t9`, `t10`, `t11`, `t12`, `t13` - Usan juegos iframe (no se puede personalizar fondo)

**Cómo verificar tu template:**
1. Abre el editor de tu site
2. Sección "Template" → Mira el ID (ej: "T7 - Sweet Bonanza")
3. Si es t9-t13, NO tiene background editable

---

### 3️⃣ **Verificar el bucket de storage para imágenes**

Si no puedes SUBIR imágenes de fondo:

**Ve a Supabase → Storage → Verifica que existe:**
- ✅ Bucket: `backgrounds` (público)

**Si NO existe, créalo:**

```sql
-- Crear bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acceso
CREATE POLICY "Anyone can view backgrounds" ON storage.objects
    FOR SELECT USING (bucket_id = 'backgrounds');

CREATE POLICY "Authenticated users can upload backgrounds" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'backgrounds' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
```

---

### 4️⃣ **Verificar que estás guardando los cambios**

Después de cambiar el background:

1. ✅ Click en **"💾 Save Changes"** (botón azul arriba a la derecha)
2. ✅ Espera el mensaje "Site updated successfully"
3. ✅ Recarga el preview o abre en nueva pestaña

**El preview en el editor actualiza en tiempo real**, pero si no guardas, al recargar la página se pierden los cambios.

---

### 5️⃣ **Limpiar caché del navegador**

A veces el navegador cachea el CSS viejo:

```
Chrome/Edge: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
Firefox: Ctrl + F5 (Windows) / Cmd + Shift + R (Mac)
Safari: Cmd + Option + R
```

O abre el editor en **modo incógnito**.

---

### 6️⃣ **Verificar en la consola del navegador**

Abre DevTools (F12) y verifica errores:

```
1. Click derecho → Inspeccionar
2. Ve a la pestaña "Console"
3. Busca errores rojos relacionados con:
   - "background_color"
   - "background_image"
   - Storage errors
   - 404 errors
```

Si ves errores de "column does not exist", ejecuta el script del paso 1.

---

## 🧪 TEST RÁPIDO

Para verificar que todo funciona:

### Test 1: Cambiar color de fondo

1. Abre un site con template **t7** (Sweet Bonanza)
2. Expande sección **"Content"** → Scroll hasta **"Background"**
3. Verás: **"🎨 Background Color"** con badge **PREMIUM**
4. Click en el color picker → Elige un color (ej: rojo)
5. Debes ver el preview cambiar **INMEDIATAMENTE**
6. Click en **"Save Changes"**
7. Recarga la página → El color debe persistir

### Test 2: Agregar imagen de fondo

1. En la misma sección **"Background"**
2. Campo **"🖼️ Background Image URL"**
3. Pega una URL de imagen (ej: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809`)
4. El preview debe mostrar la imagen **INMEDIATAMENTE**
5. Click en **"Save Changes"**
6. Recarga → La imagen debe persistir

---

## 🔍 DIAGNÓSTICO AVANZADO

Si nada de lo anterior funciona, ejecuta este SQL en Supabase:

```sql
-- Ver la estructura actual de la tabla sites
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'sites'
ORDER BY ordinal_position;

-- Ver un site específico (reemplaza 'tu-slug' con el slug real)
SELECT id, slug, template_id, background_color, background_image
FROM sites
WHERE slug = 'tu-slug';
```

**Lo que debes ver:**
- ✅ Columna `background_color` existe con default `'#1a1a2e'`
- ✅ Columna `background_image` existe (puede ser NULL)
- ✅ El site tiene valores en esas columnas

---

## 📝 MIGRACIÓN MANUAL (Si acabas de migrar)

Si acabas de migrar a un nuevo Supabase y las columnas no existen:

```sql
-- Script completo de migración para backgrounds
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a1a2e',
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Crear índice para performance
CREATE INDEX IF NOT EXISTS idx_sites_background_color ON sites(background_color);

-- Comentarios
COMMENT ON COLUMN sites.background_color IS 'Background color in hex format (e.g., #1a1a2e)';
COMMENT ON COLUMN sites.background_image IS 'URL to custom background image (optional)';

-- Actualizar sites existentes con valor default
UPDATE sites 
SET background_color = '#1a1a2e' 
WHERE background_color IS NULL;
```

---

## ✅ CHECKLIST FINAL

- [ ] Columnas `background_color` y `background_image` existen en tabla `sites`
- [ ] Template es uno de los que soporta backgrounds (t6, t7, t14-t18)
- [ ] Bucket `backgrounds` existe en Storage
- [ ] Políticas de storage configuradas
- [ ] Cambios guardados con "Save Changes"
- [ ] Caché del navegador limpiado
- [ ] No hay errores en la consola del navegador

---

## 🆘 ÚLTIMA OPCIÓN

Si nada funciona, **comparte**:

1. Screenshot de la consola del navegador (F12 → Console)
2. Template ID que estás usando (ej: t7)
3. Screenshot de la sección Background en el editor
4. Resultado del SQL de diagnóstico

---

## 🎉 FUNCIONÓ?

Una vez funcionando, deberías poder:
- ✅ Cambiar color de fondo en tiempo real
- ✅ Subir o pegar URL de imagen de fondo
- ✅ Ver preview instantáneo en el editor
- ✅ Guardar y persistir los cambios
- ✅ Ver los cambios en el site publicado

El background es una feature **PREMIUM** pero está completamente funcional si las columnas existen.
