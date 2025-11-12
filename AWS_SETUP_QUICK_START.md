# ⚡ AWS Setup - Guía Rápida (15 minutos)

## 🎯 Objetivo
Configurar AWS para que "Host with Us" funcione y genere links automáticamente.

---

## ✅ PASO 1: Crear Bucket S3 (5 min)

### A. Ir a AWS S3 Console
```
https://s3.console.aws.amazon.com/s3/buckets
```

### B. Create Bucket
1. Click **"Create bucket"**
2. **Bucket name:** `landertag` (o tu nombre preferido)
3. **Region:** `us-east-1` (recomendado)
4. **Object Ownership:** ACLs enabled
5. **Block Public Access:** ❌ **DESMARCAR TODAS** (importante!)
6. Click **"Create bucket"**

### C. Configurar Permisos
1. Click en el bucket `landertag`
2. Tab **"Permissions"**
3. Scroll a **"Bucket policy"**
4. Click **"Edit"**
5. Pegar este JSON:

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

6. Click **"Save changes"**

✅ **Listo! Bucket configurado**

---

## ✅ PASO 2: Configurar AWS SES (Email) (5 min)

### A. Verificar Email de Envío

```
https://console.aws.amazon.com/ses/home?region=us-east-1#/verified-identities
```

1. Click **"Create identity"**
2. **Identity type:** Email address
3. **Email address:** `noreply@nanokit.io` (o tu email)
4. Click **"Create identity"**
5. **Revisar inbox** y hacer click en el link de verificación
6. Esperar a que diga **"Verified"** ✓

### B. Solicitar Acceso a Producción (OPCIONAL - solo si quieres enviar a cualquier email)

Si estás en **"Sandbox mode"**, solo puedes enviar a emails verificados.

Para enviar a cualquier email:
```
SES Dashboard → Account dashboard → "Request production access"
→ Llenar formulario (aprobación en 24-48 horas)
```

**Por ahora:** Puedes usar Sandbox y verificar el email del cliente también.

✅ **Listo! SES configurado**

---

## ✅ PASO 3: Crear IAM User con Permisos (3 min)

### A. Crear Usuario

```
https://console.aws.amazon.com/iam/home#/users
```

1. Click **"Create user"**
2. **User name:** `prelander-deployer`
3. **NO** marcar "Provide user access to AWS Management Console"
4. Click **"Next"**

### B. Asignar Permisos

5. **Permissions:** Attach policies directly
6. Buscar y seleccionar:
   - ✅ **AmazonS3FullAccess**
   - ✅ **AmazonSESFullAccess**
7. Click **"Next"**
8. Click **"Create user"**

### C. Generar Access Keys

9. Click en el usuario `prelander-deployer`
10. Tab **"Security credentials"**
11. **Access keys** → Click **"Create access key"**
12. **Use case:** Application running outside AWS
13. Click **"Next"** → **"Create access key"**
14. **⚠️ COPIAR Y GUARDAR:**
    - **Access key ID:** AKIA...
    - **Secret access key:** wJalr... (solo se muestra una vez!)
15. Click **"Done"**

✅ **Listo! Usuario IAM creado**

---

## ✅ PASO 4: Configurar Variables de Entorno (2 min)

### En Vercel Dashboard:

```
https://vercel.com/dashboard
```

1. Tu proyecto → **Settings** → **Environment Variables**
2. Agregar estas variables:

```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE        # Del paso 3
AWS_SECRET_ACCESS_KEY=wJalrXU...               # Del paso 3
AWS_REGION=us-east-1
AWS_S3_BUCKET=landertag                        # Del paso 1
AWS_SES_REGION=us-east-1
AWS_SES_SENDER_EMAIL=noreply@nanokit.io        # Del paso 2
```

3. Click **"Save"** en cada una

### En Local (.env.local):

También agrégalas a tu archivo local para testing:

```bash
# Abrir .env.local
# Agregar las mismas variables de arriba
```

✅ **Listo! Variables configuradas**

---

## ✅ PASO 5: Redeploy en Vercel (1 min)

Para que las variables tomen efecto:

1. Vercel Dashboard → **Deployments**
2. Último deployment → **"..."** → **"Redeploy"**
3. Click **"Redeploy"**
4. Esperar 3-5 minutos

✅ **Listo! Todo funcionando**

---

## 🧪 PROBAR EL SISTEMA

### Test 1: Crear un Prelander

1. Ir a **nanokit.io**
2. Login → Dashboard
3. Crear un nuevo prelander
4. Click **"Edit"**

### Test 2: Host with Us

5. Click botón **"Download"** (icono download arriba)
6. Modal abre con 4 opciones
7. Seleccionar **"🚀 Host with Us"** (morado)
8. Ingresar email: `tu-email@example.com`
9. Click **"Host with Us"**
10. Esperar ~5 segundos
11. Debe mostrar alert con URL: `https://landertag.s3.amazonaws.com/...`

### Test 3: Verificar Email

12. Revisar inbox del email ingresado
13. Debe llegar email con:
    - Subject: "Your Prelander is Ready!"
    - Botón con link al prelander
    - URL pública que funciona globalmente

### Test 4: Verificar URL Funciona

14. Copiar la URL del email
15. Abrir en navegador
16. Debe cargar el prelander correctamente
17. Probar desde otro dispositivo/red → debe funcionar

✅ **Si todo funciona = AWS configurado correctamente**

---

## 📊 VERIFICAR EN SUPABASE

### Ver Deployments

```sql
-- En Supabase SQL Editor:
SELECT * FROM prelander_deployments 
WHERE package_type = 'aws_hosted' 
ORDER BY created_at DESC 
LIMIT 10;
```

Debe mostrar:
- ✅ `hosted_url`: URL de S3
- ✅ `s3_key`: Path del archivo
- ✅ `email`: Email del usuario
- ✅ `created_at`: Timestamp

---

## 🚨 TROUBLESHOOTING

### Error: "AWS credentials not configured"
**Causa:** Variables de entorno no están en Vercel  
**Solución:** Verificar Paso 4 y redeploy

### Error: "Access Denied" al subir a S3
**Causa:** Bucket policy no permite escritura  
**Solución:** Verificar IAM user tiene `AmazonS3FullAccess`

### Error: "Email not verified" en SES
**Causa:** Email sender no verificado  
**Solución:** Verificar email en SES console (Paso 2)

### No llega el email
**Causa 1:** Estás en SES Sandbox y email destino no verificado  
**Solución:** Verificar también el email destino o solicitar production access

**Causa 2:** Email en spam  
**Solución:** Revisar carpeta spam/junk

### URL funciona pero no carga contenido
**Causa:** Bucket policy no permite public read  
**Solución:** Verificar policy del Paso 1

---

## 💰 COSTOS (Estimados)

Para **1000 prelanders hosteados/mes**:

- **S3 Storage:** ~$0.001/mes (50MB total)
- **S3 Requests:** ~$0.02/mes (upload + downloads)
- **Data Transfer:** ~$0.05/mes (visitas)
- **SES Emails:** ~$0.10/mes (1000 emails)

**Total: ~$0.20 USD/mes** 🎉

Prácticamente gratis!

---

## ✅ CHECKLIST FINAL

- [ ] Bucket S3 creado (`landertag`)
- [ ] Bucket policy configurado (public read)
- [ ] Email verificado en SES
- [ ] IAM user creado (`prelander-deployer`)
- [ ] Access keys generados y copiados
- [ ] Variables de entorno en Vercel
- [ ] Variables de entorno en .env.local
- [ ] Redeploy en Vercel completado
- [ ] Test de "Host with Us" exitoso
- [ ] Email recibido con link
- [ ] URL pública funciona

---

## 🎉 RESULTADO FINAL

Después de estos pasos:

✅ Usuarios pueden crear prelanders en nanokit.io  
✅ Click "Host with Us" → sube automáticamente a AWS  
✅ Genera URL pública instantánea  
✅ Envía email profesional con el link  
✅ Link funciona globalmente  
✅ Tracking completo en Supabase  

**Estado:** PRODUCTION READY 🚀

---

**Tiempo total:** ~15 minutos  
**Costo:** ~$0.20/mes para 1000 deployments
