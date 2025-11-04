# 🚀 GUÍA DE MIGRACIÓN - NANOKIT

Esta guía completa te ayudará a migrar el proyecto NanoKit a un nuevo Vercel, Supabase y AWS.

---

## 📋 ÍNDICE

1. [Configurar Nuevo Supabase](#1-configurar-nuevo-supabase)
2. [Variables de Entorno para Vercel](#2-variables-de-entorno-para-vercel)
3. [Deploy a Vercel](#3-deploy-a-vercel)
4. [Configurar AWS S3 y SES](#4-configurar-aws-s3-y-ses-opcional)

---

## 1. 🗄️ CONFIGURAR NUEVO SUPABASE

### Paso 1: Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Click en "New project"
3. Configura:
   - **Name**: NanoKit (o el que prefieras)
   - **Database Password**: Guarda esto en un lugar seguro
   - **Region**: Selecciona la más cercana a tus usuarios
4. Espera a que se cree (2-3 minutos)

### Paso 2: Ejecutar Migraciones SQL

Ve al **SQL Editor** de Supabase y ejecuta estos scripts **EN ORDEN**:

#### **SCRIPT 1: Schema Principal** (`fresh-schema.sql`)

```sql
-- =====================================================
-- NANOKIT - COMPLETE DATABASE SCHEMA
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sites table with all templates support
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
  
  -- Game specific
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

-- Create visits table for analytics
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

-- Create site_versions table for rollback functionality
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

-- Create prelander_deployments table
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
-- INDEXES FOR PERFORMANCE
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
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at 
    BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prelander_deployments_timestamp
  BEFORE UPDATE ON prelander_deployments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Generate unique user codes
CREATE OR REPLACE FUNCTION generate_user_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    code VARCHAR(10);
    exists BOOLEAN;
BEGIN
    LOOP
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        SELECT EXISTS(SELECT 1 FROM organizations WHERE user_code = code) INTO exists;
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Add user_code column to organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS user_code VARCHAR(10) UNIQUE;

CREATE OR REPLACE FUNCTION set_user_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_code IS NULL THEN
        NEW.user_code := generate_user_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_user_code
    BEFORE INSERT ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION set_user_code();

-- Create site version on update
CREATE OR REPLACE FUNCTION create_site_version()
RETURNS TRIGGER AS $$
BEGIN
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
                'accent_color', OLD.accent_color
            ),
            auth.uid()
        FROM site_versions 
        WHERE site_id = OLD.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_site_version_trigger
    BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION create_site_version();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prelander_deployments ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their own organizations" ON organizations
    FOR SELECT USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can create organizations" ON organizations
    FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update their own organizations" ON organizations
    FOR UPDATE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete their own organizations" ON organizations
    FOR DELETE USING (auth.uid() = owner_user_id);

-- Sites policies
CREATE POLICY "Users can view their own sites" ON sites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sites" ON sites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sites" ON sites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites" ON sites
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published sites" ON sites
    FOR SELECT USING (status = 'published');

-- Visits policies
CREATE POLICY "Anyone can create visits" ON visits
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view visits for their sites" ON visits
    FOR SELECT USING (
        site_id IN (
            SELECT id FROM sites WHERE user_id = auth.uid()
        )
    );

-- Site versions policies
CREATE POLICY "Users can view versions of their sites" ON site_versions
    FOR SELECT USING (
        site_id IN (
            SELECT id FROM sites WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "System can create site versions" ON site_versions
    FOR INSERT WITH CHECK (true);

-- Prelander deployments policies
CREATE POLICY "Users can view own deployments" 
  ON prelander_deployments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deployments" 
  ON prelander_deployments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deployments" 
  ON prelander_deployments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deployments" 
  ON prelander_deployments 
  FOR DELETE 
  USING (auth.uid() = user_id);
```

#### **SCRIPT 2: Storage Configuration**

```sql
-- =====================================================
-- STORAGE SETUP
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos1', 'logos1', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- Logos bucket policies
CREATE POLICY "Anyone can view logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'logos1');

CREATE POLICY "Authenticated users can upload logos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'logos1' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their own logos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'logos1' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own logos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'logos1' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Backgrounds bucket policies
CREATE POLICY "Anyone can view backgrounds" ON storage.objects
    FOR SELECT USING (bucket_id = 'backgrounds');

CREATE POLICY "Authenticated users can upload backgrounds" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'backgrounds' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their own backgrounds" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'backgrounds' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own backgrounds" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'backgrounds' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
```

### Paso 3: Configurar Authentication

1. Ve a **Authentication** → **Providers**
2. Habilita **Email** provider
3. Configura las URLs permitidas:
   - En **Site URL**: Tu dominio de Vercel (ej: `https://nanokit.vercel.app`)
   - En **Redirect URLs**: Agrega `https://nanokit.vercel.app/auth/callback`

---

## 2. ⚙️ VARIABLES DE ENTORNO PARA VERCEL

### Variables Requeridas

Configura estas variables en Vercel (Settings → Environment Variables):

```bash
# ========================================
# SUPABASE (REQUERIDO)
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aquí

# ========================================
# AWS S3 & SES (Para hosting y emails)
# ========================================
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=tu-secret-key-aquí
AWS_REGION=us-east-1
AWS_S3_BUCKET=landertag
AWS_SES_SENDER_EMAIL=noreply@tudominio.com
AWS_SES_REGION=us-east-1

# ========================================
# OPENAI (Opcional - para generación de contenido)
# ========================================
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# ========================================
# ENCRYPTION (Para packages seguros)
# ========================================
MASTER_ENCRYPTION_KEY=tu-master-key-de-32-caracteres-aqui

# ========================================
# NEXT.JS
# ========================================
NODE_ENV=production
```

### Cómo Obtener las Credenciales

#### **Supabase**
1. Ve a tu proyecto en Supabase
2. Click en **Settings** → **API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### **AWS** (Ver sección 4 para configuración completa)
1. Ve a AWS Console → IAM
2. Crea un nuevo usuario con permisos de S3 y SES
3. Genera Access Keys

#### **Encryption Key**
Genera una key segura con:
```bash
openssl rand -hex 32
```

---

## 3. 🚀 DEPLOY A VERCEL

### Opción A: Desde GitHub (Recomendado)

1. **Push tu código a GitHub** (ya lo hiciste):
   ```bash
   git remote set-url origin git@github.com:nanokitio/NanoKit.git
   git push -u origin main
   ```

2. **Conectar a Vercel**:
   - Ve a https://vercel.com
   - Click en **"Add New Project"**
   - Importa tu repositorio: `nanokitio/NanoKit`
   - Configura las variables de entorno (sección 2)
   - Click en **"Deploy"**

3. **Configurar Dominio** (Opcional):
   - Ve a Settings → Domains
   - Agrega tu dominio personalizado

### Opción B: Desde CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Agregar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... repite para todas las variables
```

### Verificar Deploy

1. Visita la URL de Vercel
2. Intenta crear una cuenta
3. Intenta crear un nuevo site
4. Verifica que las imágenes suban correctamente

---

## 4. ☁️ CONFIGURAR AWS S3 Y SES (OPCIONAL)

Esta sección es necesaria solo si quieres el hosting automático en S3 y envío de emails.

### Paso 1: Configurar S3

1. **Crear Bucket**:
   - Ve a AWS Console → S3
   - Click "Create bucket"
   - Name: `landertag` (o el que prefieras)
   - Region: `us-east-1`
   - Desmarca "Block all public access"
   - Habilita "Static website hosting"

2. **Configurar CORS**:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

3. **Configurar Bucket Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::landertag/*"
       }
     ]
   }
   ```

### Paso 2: Configurar SES (Simple Email Service)

1. **Verificar Dominio**:
   - Ve a AWS Console → SES
   - Click "Verify a New Domain"
   - Ingresa tu dominio
   - Agrega los DNS records que te proporciona AWS

2. **Verificar Email**:
   - Si estás en sandbox mode, verifica los emails receptores
   - Click "Verify a New Email Address"

3. **Salir de Sandbox** (Para producción):
   - Ve a SES → Account Dashboard
   - Click "Request Production Access"
   - Completa el formulario

### Paso 3: Crear Usuario IAM

1. Ve a AWS Console → IAM → Users
2. Click "Add user"
3. User name: `nanokit-app`
4. Access type: **Programmatic access**
5. Permissions: Attach policies directly
   - `AmazonS3FullAccess`
   - `AmazonSESFullAccess`
6. Guarda las credenciales:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### Paso 4: Agregar Variables a Vercel

```bash
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
vercel env add AWS_REGION
vercel env add AWS_S3_BUCKET
vercel env add AWS_SES_SENDER_EMAIL
```

---

## 5. ✅ VERIFICACIÓN FINAL

### Checklist de Migración

- [ ] Supabase creado y configurado
- [ ] Todas las migraciones SQL ejecutadas
- [ ] Storage buckets creados (`logos1`, `backgrounds`)
- [ ] Authentication habilitado
- [ ] Variables de entorno configuradas en Vercel
- [ ] Proyecto deployado en Vercel
- [ ] Login/Signup funcionando
- [ ] Crear site funcionando
- [ ] Upload de imágenes funcionando
- [ ] (Opcional) AWS S3 configurado
- [ ] (Opcional) AWS SES configurado
- [ ] (Opcional) Emails de hosting funcionando

### Troubleshooting

**Error: "Supabase URL not configured"**
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` esté configurado en Vercel
- Redeploy después de agregar variables

**Error: "Failed to upload logo"**
- Verifica que el bucket `logos1` exista en Supabase Storage
- Verifica las políticas de storage

**Error: "AWS credentials not configured"**
- Si no usas AWS, las descargas seguirán funcionando
- Solo afecta el hosting automático en S3

**Error: "Template not rendering"**
- Verifica que `template_id` esté en el CHECK constraint
- Re-ejecuta `007_fix_template_constraint.sql`

---

## 6. 🎯 PRÓXIMOS PASOS

1. **Migrar Datos** (si tienes datos en el Supabase anterior):
   ```bash
   # Exportar desde Supabase antiguo
   pg_dump -h old-project.supabase.co -U postgres -d postgres > backup.sql
   
   # Importar a Supabase nuevo
   psql -h new-project.supabase.co -U postgres -d postgres < backup.sql
   ```

2. **Configurar Dominio Personalizado**:
   - En Vercel: Settings → Domains
   - Agrega tu dominio y configura DNS

3. **Configurar Analytics** (Opcional):
   - Vercel Analytics
   - Google Analytics
   - Posthog, etc.

4. **Configurar Monitoreo**:
   - Sentry para errores
   - Vercel Logs
   - Supabase Dashboard

---

## 📞 SOPORTE

Si encuentras problemas durante la migración:

1. Verifica los logs en Vercel: https://vercel.com/dashboard/logs
2. Verifica los logs en Supabase: Dashboard → Logs
3. Revisa la consola del navegador para errores de cliente

---

## 🎉 ¡MIGRACIÓN COMPLETADA!

Tu proyecto NanoKit ahora está ejecutándose en:
- ✅ Nuevo Supabase
- ✅ Nuevo Vercel
- ✅ (Opcional) AWS S3 y SES

**URL de Producción**: `https://tu-proyecto.vercel.app`

