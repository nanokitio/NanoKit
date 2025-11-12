# Guía: Campos de Equipo Agregados

## ✅ Cambios Implementados

Se agregaron dos campos simples para agregar nombres de miembros del equipo:
- **Jugador/a Destacado/a** (Featured Player)
- **Director/a Deportivo/a** (Sport Director)

---

## 📝 Dónde Aparecen los Campos

### En el Editor:
1. Ve a cualquier sitio en el Dashboard
2. Click en "Edit"
3. En la barra lateral izquierda, busca la sección **"⚽ Team Members"**
4. Verás dos campos:
   - **Featured Player**: Ingresa "Ale Miranda"
   - **Sport Director**: Ingresa "Nicolás Cantudo"

---

## 💾 Paso 1: Actualizar Base de Datos (IMPORTANTE)

Antes de usar los campos, ejecuta este SQL en Supabase:

```sql
-- Agregar columnas a la tabla sites
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS featured_player TEXT,
ADD COLUMN IF NOT EXISTS sport_director TEXT;
```

### Cómo ejecutarlo:
1. Ve a tu proyecto en Supabase
2. Click en "SQL Editor" en el menú lateral
3. Copia y pega el comando de arriba
4. Click "Run"

---

## 🎨 Cómo se Muestran

Los nombres aparecen automáticamente en la sección de testimonios/equipo con:
- **Icono de fútbol ⚽** para el/la jugador/a
- **Icono de trofeo 🏆** para el/la director/a
- Diseño limpio que mantiene el look & feel existente

### Ejemplo visual:

```
┌────────────────────────────────────┐
│    ⚽                      🏆        │
│  Ale Miranda         Nicolás Cantudo│
│  Featured Player    Sport Director  │
└────────────────────────────────────┘
```

---

## 🔧 Uso Paso a Paso

### 1. Abrir el Editor
```
Dashboard → Tu sitio → Edit
```

### 2. Llenar los Campos
Scroll down en el panel izquierdo hasta ver:
```
⚽ Team Members
├── Featured Player: [Ale Miranda]
└── Sport Director: [Nicolás Cantudo]
```

### 3. Guardar
- Click en "Save" (botón superior derecho)
- Los campos se guardan automáticamente
- Se regenera el HTML con los nombres

### 4. Vista Previa
Los nombres aparecen inmediatamente en el preview del lado derecho

---

## ✨ Características

### ✅ Simple y Directo
- Solo dos campos de texto
- Sin complicaciones
- Opcionales (puedes dejarlos vacíos)

### ✅ Mantiene el Look & Feel
- Se integra con el diseño existente
- Usa los colores del tema
- No rompe ningún template

### ✅ Funciona en Todos los Templates
- Template 1 (ya actualizado)
- Puedes agregarlo fácilmente a otros templates
- Mismo diseño consistente

---

## 🎯 Archivos Modificados

### 1. Tipos TypeScript
- `src/lib/types.ts` - Agregados campos en `BrandConfig` y `Site`

### 2. Base de Datos
- `add-team-fields.sql` - Script SQL para agregar columnas

### 3. Editor
- `src/app/sites/[slug]/edit/page.tsx` - Formulario con campos nuevos

### 4. Renderizado
- `src/app/sites/[slug]/page.tsx` - Pasa los datos al template

### 5. Template Ejemplo
- `src/templates/t1/index.tsx` - Muestra los nombres

---

## 💡 Próximos Pasos (Opcional)

Si quieres agregar los campos a otros templates:

### Ejemplo para agregar a cualquier template:

```tsx
{/* Team Members */}
{(brand.featuredPlayer || brand.sportDirector) && (
  <div className="team-section">
    {brand.featuredPlayer && (
      <div className="team-member">
        <span className="icon">⚽</span>
        <div>
          <p className="name">{brand.featuredPlayer}</p>
          <p className="role">Featured Player</p>
        </div>
      </div>
    )}
    {brand.sportDirector && (
      <div className="team-member">
        <span className="icon">🏆</span>
        <div>
          <p className="name">{brand.sportDirector}</p>
          <p className="role">Sport Director</p>
        </div>
      </div>
    )}
  </div>
)}
```

---

## 🐛 Troubleshooting

### No aparecen los campos en el editor
**Solución:** Asegúrate de ejecutar el SQL en Supabase primero

### Los cambios no se guardan
**Solución:** 
1. Verifica que las columnas existan en la tabla `sites`
2. Check la consola del navegador por errores
3. Intenta hacer un hard refresh (Cmd+Shift+R)

### No se ven los nombres en el preview
**Solución:**
1. Verifica que llenaste los campos
2. Click en "Save"
3. Espera unos segundos
4. El preview se actualiza automáticamente

---

## 📊 Ejemplo Completo

### Input en el Editor:
```
Featured Player: Ale Miranda
Sport Director: Nicolás Cantudo
```

### Output en la Landing Page:
Se muestra una sección limpia con:
- Foto/icono del jugador → "Ale Miranda" → "Featured Player"
- Foto/icono del director → "Nicolás Cantudo" → "Sport Director"

---

## ✅ Checklist de Implementación

- [ ] Ejecutar SQL en Supabase para crear columnas
- [ ] Recargar el editor
- [ ] Llenar los campos de equipo
- [ ] Guardar cambios
- [ ] Verificar en preview
- [ ] Publicar sitio

---

**Listo! 🎉** 

Los campos están agregados de manera simple, sin complicaciones, manteniendo el mismo look and feel de tus templates existentes.
