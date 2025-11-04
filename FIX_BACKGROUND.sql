-- =====================================================
-- FIX: Background Customization Not Working
-- =====================================================
-- Ejecuta esto en Supabase SQL Editor si no puedes cambiar backgrounds
-- =====================================================

-- PASO 1: Agregar columnas si no existen
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a1a2e',
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- PASO 2: Actualizar sites existentes
UPDATE sites 
SET background_color = '#1a1a2e' 
WHERE background_color IS NULL;

-- PASO 3: Crear índice para performance
CREATE INDEX IF NOT EXISTS idx_sites_background_color ON sites(background_color);

-- PASO 4: Agregar comentarios
COMMENT ON COLUMN sites.background_color IS 'Background color in hex format (e.g., #1a1a2e)';
COMMENT ON COLUMN sites.background_image IS 'URL to custom background image (optional)';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver que las columnas se crearon correctamente
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'sites' 
AND column_name IN ('background_color', 'background_image')
ORDER BY column_name;

-- Resultado esperado:
-- background_color  | text | '#1a1a2e'::text | YES
-- background_image  | text | NULL            | YES

-- Ver un site de ejemplo (CAMBIA 'tu-slug-aqui' por un slug real)
-- SELECT id, slug, template_id, background_color, background_image
-- FROM sites
-- WHERE slug = 'tu-slug-aqui'
-- LIMIT 1;

-- =====================================================
-- MENSAJE FINAL
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Columnas background_color y background_image agregadas/verificadas!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Próximos pasos:';
    RAISE NOTICE '   1. Recarga el editor de tu site';
    RAISE NOTICE '   2. Verifica que veas la sección "Background" en Content';
    RAISE NOTICE '   3. Cambia el color o agrega una imagen';
    RAISE NOTICE '   4. Click en "Save Changes"';
    RAISE NOTICE '   5. Recarga el preview';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE: Solo templates t6, t7, t14-t18 soportan backgrounds';
END $$;
