-- =====================================================
-- NANOKIT - POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================
-- Ejecutar TERCERO en el SQL Editor de Supabase
-- =====================================================

-- =====================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prelander_deployments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA ORGANIZATIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own organizations" ON organizations;
CREATE POLICY "Users can view their own organizations" ON organizations
    FOR SELECT USING (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
CREATE POLICY "Users can create organizations" ON organizations
    FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "Users can update their own organizations" ON organizations;
CREATE POLICY "Users can update their own organizations" ON organizations
    FOR UPDATE USING (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "Users can delete their own organizations" ON organizations;
CREATE POLICY "Users can delete their own organizations" ON organizations
    FOR DELETE USING (auth.uid() = owner_user_id);

-- =====================================================
-- POLÍTICAS PARA SITES
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own sites" ON sites;
CREATE POLICY "Users can view their own sites" ON sites
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own sites" ON sites;
CREATE POLICY "Users can create their own sites" ON sites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own sites" ON sites;
CREATE POLICY "Users can update their own sites" ON sites
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own sites" ON sites;
CREATE POLICY "Users can delete their own sites" ON sites
    FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view published sites" ON sites;
CREATE POLICY "Anyone can view published sites" ON sites
    FOR SELECT USING (status = 'published');

-- =====================================================
-- POLÍTICAS PARA VISITS (Visitas anónimas permitidas)
-- =====================================================

DROP POLICY IF EXISTS "Anyone can create visits" ON visits;
CREATE POLICY "Anyone can create visits" ON visits
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view visits for their sites" ON visits;
CREATE POLICY "Users can view visits for their sites" ON visits
    FOR SELECT USING (
        site_id IN (
            SELECT id FROM sites WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- POLÍTICAS PARA SITE_VERSIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view versions of their sites" ON site_versions;
CREATE POLICY "Users can view versions of their sites" ON site_versions
    FOR SELECT USING (
        site_id IN (
            SELECT id FROM sites WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "System can create site versions" ON site_versions;
CREATE POLICY "System can create site versions" ON site_versions
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA PRELANDER_DEPLOYMENTS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own deployments" ON prelander_deployments;
CREATE POLICY "Users can view own deployments" 
  ON prelander_deployments 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own deployments" ON prelander_deployments;
CREATE POLICY "Users can create own deployments" 
  ON prelander_deployments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own deployments" ON prelander_deployments;
CREATE POLICY "Users can update own deployments" 
  ON prelander_deployments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own deployments" ON prelander_deployments;
CREATE POLICY "Users can delete own deployments" 
  ON prelander_deployments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Políticas RLS creadas exitosamente!';
    RAISE NOTICE '📋 Siguiente paso: Ejecutar 04_storage_buckets.sql';
END $$;
