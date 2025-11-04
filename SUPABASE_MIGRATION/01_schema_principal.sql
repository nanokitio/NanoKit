-- =====================================================
-- NANOKIT - SCHEMA PRINCIPAL
-- =====================================================
-- Ejecutar PRIMERO en el SQL Editor de Supabase
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLAS
-- =====================================================

-- Tabla de organizaciones
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  user_code VARCHAR(10) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sites (prelanders)
CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  template_id TEXT NOT NULL CHECK (template_id IN ('t1', 't2', 't3', 't4', 't5', 't6', 't7', 't9', 't10', 't11', 't12', 't13', 't14', 't15', 't16', 't17', 't18')),
  
  -- Branding
  logo_url TEXT,
  custom_logo TEXT,
  brand_name TEXT,
  industry TEXT,
  description TEXT,
  
  -- Colors
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  background_color TEXT DEFAULT '#1a1a2e',
  background_image TEXT,
  
  -- Content
  headline TEXT,
  subheadline TEXT,
  cta TEXT,
  cta_url TEXT,
  
  -- Game specific fields
  game_balance INTEGER DEFAULT 150000,
  popup_title TEXT,
  popup_message TEXT,
  popup_prize TEXT,
  wheel_values TEXT,
  
  -- Images
  hero_image TEXT,
  feature_image1 TEXT,
  feature_image2 TEXT,
  sections JSONB DEFAULT '{}',
  
  -- Generated output
  generated_html TEXT,
  generated_css TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  archived BOOLEAN DEFAULT FALSE,
  is_downloaded BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  is_demo BOOLEAN DEFAULT FALSE,
  
  -- Tracking
  download_count INTEGER DEFAULT 0,
  downloaded_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de visitas (analytics)
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  referrer TEXT
);

-- Tabla de versiones de sites (rollback)
CREATE TABLE IF NOT EXISTS site_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  generated_html TEXT,
  generated_css TEXT,
  brand_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabla de deployments (tracking de descargas y hosting)
CREATE TABLE IF NOT EXISTS prelander_deployments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  
  -- Deployment info
  email VARCHAR(255) NOT NULL,
  affiliate_code VARCHAR(50),
  package_type VARCHAR(20) NOT NULL CHECK (package_type IN ('quick', 'standard', 'secure', 'aws_hosted')),
  
  -- AWS hosting specific
  hosted_url TEXT,
  s3_key TEXT,
  domain_lock VARCHAR(255),
  
  -- Tracking
  downloads_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_user_site_deployment UNIQUE (user_id, site_id, package_type)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_organizations_owner_user_id ON organizations(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_sites_org_id ON sites(org_id);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);
CREATE INDEX IF NOT EXISTS idx_sites_template_id ON sites(template_id);
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_archived ON sites(archived);
CREATE INDEX IF NOT EXISTS idx_sites_created_at ON sites(created_at);
CREATE INDEX IF NOT EXISTS idx_visits_site_id ON visits(site_id);
CREATE INDEX IF NOT EXISTS idx_visits_ts ON visits(ts);
CREATE INDEX IF NOT EXISTS idx_visits_country ON visits(country);
CREATE INDEX IF NOT EXISTS idx_site_versions_site_id ON site_versions(site_id);
CREATE INDEX IF NOT EXISTS idx_site_versions_created_at ON site_versions(created_at);
CREATE INDEX IF NOT EXISTS idx_prelander_deployments_user_id ON prelander_deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_prelander_deployments_site_id ON prelander_deployments(site_id);
CREATE INDEX IF NOT EXISTS idx_prelander_deployments_package_type ON prelander_deployments(package_type);
CREATE INDEX IF NOT EXISTS idx_prelander_deployments_created_at ON prelander_deployments(created_at DESC);

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Schema principal creado exitosamente!';
    RAISE NOTICE '📋 Siguiente paso: Ejecutar 02_funciones_y_triggers.sql';
END $$;
