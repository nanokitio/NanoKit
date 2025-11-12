# ✅ Configuración de Supabase para Password Reset

## 1. Ve a Supabase Dashboard

**URL:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID

---

## 2. Authentication → URL Configuration

### Site URL
Debe ser tu URL de producción:
```
https://nano-mrv2u7mt2-cielo-digital.vercel.app
```

### Redirect URLs (Agregar estas 3)
```
https://nano-mrv2u7mt2-cielo-digital.vercel.app/auth/callback
https://nano-mrv2u7mt2-cielo-digital.vercel.app/reset-password
http://localhost:3002/auth/callback
```

**IMPORTANTE:** Click en "Add URL" para cada una y luego "Save"

---

## 3. Authentication → Email Templates

### Reset Password Email Template

Verifica que el template tenga este link:
```html
<a href="{{ .ConfirmationURL }}">Reset Password</a>
```

**NO debe tener:**
- Rutas hardcoded como `/reset-password`
- URLs fijas

**Debe usar:** `{{ .ConfirmationURL }}` que Supabase genera automáticamente

---

## 4. Authentication → Email Settings

### SMTP (Si usas custom SMTP)

Si estás usando SMTP por defecto de Supabase:
- ✅ No cambies nada
- ✅ Usa Inbucket para testing (localhost)

Si configuraste SMTP personalizado:
- Verifica que `From Email` sea válido
- Verifica que las credenciales sean correctas

---

## 5. Verificación Final

Después de configurar todo:

1. **Guardar cambios** en Supabase
2. **Esperar 1 minuto** (propagación)
3. **Probar el flujo:**
   - Ir a `/forgot-password`
   - Ingresar email
   - Revisar email en Inbucket (localhost) o tu inbox
   - Click en link del email
   - Debe abrir `/reset-password`

---

## ⚠️ Errores Comunes

### Error: "Email not confirmed"
**Solución:** En Supabase → Authentication → Settings → Enable "Email Confirmations"

### Error: "Invalid redirect URL"
**Solución:** Agregar la URL exacta (con https) a Redirect URLs

### Error: "Link expired"
**Solución:** Los links expiran en 1 hora, pedir nuevo link

---

## 🎯 Checklist

- [ ] Site URL configurada
- [ ] 3 Redirect URLs agregadas
- [ ] Email template usa `{{ .ConfirmationURL }}`
- [ ] Todo guardado (botón Save clickeado)
- [ ] Esperado 1 minuto de propagación
