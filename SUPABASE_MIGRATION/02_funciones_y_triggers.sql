-- =====================================================
-- NANOKIT - FUNCIONES Y TRIGGERS
-- =====================================================
-- Ejecutar SEGUNDO en el SQL Editor de Supabase
-- =====================================================

-- =====================================================
-- FUNCIONES
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para generar códigos de usuario únicos
CREATE OR REPLACE FUNCTION generate_user_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    code VARCHAR(10);
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generar código alfanumérico de 6 caracteres
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        -- Verificar si el código ya existe
        SELECT EXISTS(SELECT 1 FROM organizations WHERE user_code = code) INTO exists;
        
        -- Salir del loop si el código es único
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Función para asignar user_code automáticamente
CREATE OR REPLACE FUNCTION set_user_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_code IS NULL THEN
        NEW.user_code := generate_user_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para crear versiones de sites automáticamente
CREATE OR REPLACE FUNCTION create_site_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo crear versión si HTML o CSS cambiaron
    IF OLD.generated_html IS DISTINCT FROM NEW.generated_html 
       OR OLD.generated_css IS DISTINCT FROM NEW.generated_css THEN
        
        INSERT INTO site_versions (
            site_id, 
            version_number, 
            generated_html, 
            generated_css,
            brand_config,
            created_by
        )
        SELECT 
            OLD.id,
            COALESCE(MAX(version_number), 0) + 1,
            OLD.generated_html,
            OLD.generated_css,
            jsonb_build_object(
                'brand_name', OLD.brand_name,
                'headline', OLD.headline,
                'subheadline', OLD.subheadline,
                'logo_url', OLD.logo_url,
                'primary_color', OLD.primary_color,
                'secondary_color', OLD.secondary_color,
                'accent_color', OLD.accent_color,
                'background_color', OLD.background_color,
                'background_image', OLD.background_image
            ),
            auth.uid()
        FROM site_versions 
        WHERE site_id = OLD.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para actualizar updated_at en organizations
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en sites
DROP TRIGGER IF EXISTS update_sites_updated_at ON sites;
CREATE TRIGGER update_sites_updated_at 
    BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en prelander_deployments
DROP TRIGGER IF EXISTS update_prelander_deployments_timestamp ON prelander_deployments;
CREATE TRIGGER update_prelander_deployments_timestamp
    BEFORE UPDATE ON prelander_deployments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para asignar user_code automáticamente
DROP TRIGGER IF EXISTS trigger_set_user_code ON organizations;
CREATE TRIGGER trigger_set_user_code
    BEFORE INSERT ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION set_user_code();

-- Trigger para crear versiones de sites
DROP TRIGGER IF EXISTS create_site_version_trigger ON sites;
CREATE TRIGGER create_site_version_trigger
    BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION create_site_version();

-- =====================================================
-- ACTUALIZAR ORGANIZACIONES EXISTENTES
-- =====================================================

-- Asignar user_code a organizaciones que no lo tengan
UPDATE organizations 
SET user_code = generate_user_code() 
WHERE user_code IS NULL;

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Funciones y triggers creados exitosamente!';
    RAISE NOTICE '📋 Siguiente paso: Ejecutar 03_politicas_rls.sql';
END $$;
