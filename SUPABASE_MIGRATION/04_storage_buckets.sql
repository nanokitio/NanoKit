-- =====================================================
-- NANOKIT - CONFIGURACIÓN DE STORAGE
-- =====================================================
-- Ejecutar CUARTO en el SQL Editor de Supabase
-- =====================================================

-- =====================================================
-- CREAR BUCKETS
-- =====================================================

-- Bucket para logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos1', 'logos1', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket para backgrounds
INSERT INTO storage.buckets (id, name, public) 
VALUES ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POLÍTICAS PARA BUCKET: logos1
-- =====================================================

-- Permitir a todos ver logos
DROP POLICY IF EXISTS "Anyone can view logos" ON storage.objects;
CREATE POLICY "Anyone can view logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'logos1');

-- Usuarios autenticados pueden subir logos a su carpeta
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload logos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'logos1' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Usuarios pueden actualizar sus propios logos
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
CREATE POLICY "Users can update their own logos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'logos1' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Usuarios pueden eliminar sus propios logos
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;
CREATE POLICY "Users can delete their own logos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'logos1' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- =====================================================
-- POLÍTICAS PARA BUCKET: backgrounds
-- =====================================================

-- Permitir a todos ver backgrounds
DROP POLICY IF EXISTS "Anyone can view backgrounds" ON storage.objects;
CREATE POLICY "Anyone can view backgrounds" ON storage.objects
    FOR SELECT USING (bucket_id = 'backgrounds');

-- Usuarios autenticados pueden subir backgrounds a su carpeta
DROP POLICY IF EXISTS "Authenticated users can upload backgrounds" ON storage.objects;
CREATE POLICY "Authenticated users can upload backgrounds" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'backgrounds' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Usuarios pueden actualizar sus propios backgrounds
DROP POLICY IF EXISTS "Users can update their own backgrounds" ON storage.objects;
CREATE POLICY "Users can update their own backgrounds" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'backgrounds' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Usuarios pueden eliminar sus propios backgrounds
DROP POLICY IF EXISTS "Users can delete their own backgrounds" ON storage.objects;
CREATE POLICY "Users can delete their own backgrounds" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'backgrounds' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Storage buckets y políticas creadas exitosamente!';
    RAISE NOTICE '🎉 MIGRACIÓN COMPLETADA!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Próximos pasos:';
    RAISE NOTICE '   1. Configurar variables de entorno en Vercel';
    RAISE NOTICE '   2. Deploy del proyecto';
    RAISE NOTICE '   3. Probar login/signup';
    RAISE NOTICE '   4. Crear un site de prueba';
END $$;
