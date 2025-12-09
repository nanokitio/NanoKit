# Guía de Edición Inline (Tipo Wix)

## ✅ Implementado

Se ha implementado la edición inline tipo Wix en los siguientes templates:
- ✅ **Template 6 (t6)** - Classic Overlay
- ✅ **Template 7 (t7)** - Sweet Bonanza

## 🎯 Cómo Funciona

### 1. Dashboard - Iconos de Sort Siempre Visibles
Los iconos de ordenamiento ahora se muestran siempre en todas las columnas del dashboard:
- **Activo**: Muestra ChevronUp (↑) o ChevronDown (↓) según la dirección
- **Inactivo**: Muestra ChevronDown con opacidad 30%

### 2. Edición Inline en Templates

Cuando estás en el editor (`/sites/[slug]/edit`), los textos son editables directamente:

**Textos Editables:**
- ✏️ **Headline** (Título principal)
- ✏️ **Subheadline** (Subtítulo)
- ✏️ **CTA** (Texto del botón)

**Cómo Editar:**
1. Haz hover sobre cualquier texto editable → aparece borde punteado azul
2. Haz click en el texto
3. Edita directamente
4. Presiona Enter o haz click fuera para guardar
5. Los cambios se sincronizan automáticamente con el panel lateral

## 📝 Cómo Agregar Edición Inline a Otros Templates

### Paso 1: Importar Dependencias

```tsx
import { EditableText } from '@/components/EditableText'
import { useInlineEdit } from '@/hooks/useInlineEdit'
```

### Paso 2: Inicializar el Hook

```tsx
export function TemplateX({ brand }: TemplateProps) {
  const { isEditMode, notifyChange } = useInlineEdit()
  
  // Estados locales para los textos
  const [headline, setHeadline] = useState(brand.copy.headline || 'DEFAULT HEADLINE')
  const [subheadline, setSubheadline] = useState(brand.copy.subheadline || '')
  const [ctaText, setCtaText] = useState(brand.copy.cta || 'CLICK HERE')
  
  // ... resto del código
}
```

### Paso 3: Reemplazar Textos Estáticos

**ANTES:**
```tsx
<h1 className="text-4xl font-bold">
  {brand.copy.headline}
</h1>
```

**DESPUÉS:**
```tsx
{isEditMode ? (
  <EditableText
    value={headline}
    onChange={(val) => {
      setHeadline(val)
      notifyChange('headline', val)
    }}
    as="h1"
    className="text-4xl font-bold"
    placeholder="YOUR TITLE HERE"
  />
) : (
  <h1 className="text-4xl font-bold">
    {headline}
  </h1>
)}
```

### Paso 4: Deshabilitar Clicks en Modo Edición

Para botones CTA, prevenir que se abran links cuando estás editando:

```tsx
<button 
  onClick={() => !isEditMode && brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}
>
  {isEditMode ? (
    <EditableText
      value={ctaText}
      onChange={(val) => {
        setCtaText(val)
        notifyChange('cta', val)
      }}
      as="span"
      placeholder="BUTTON TEXT"
    />
  ) : (
    ctaText
  )}
</button>
```

## 🔧 Componentes Creados

### `EditableText` Component
Ubicación: `/src/components/EditableText.tsx`

**Props:**
- `value`: string - Texto actual
- `onChange`: (value: string) => void - Callback cuando cambia
- `className?`: string - Clases CSS
- `placeholder?`: string - Placeholder cuando está vacío
- `as?`: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' - Elemento HTML
- `multiline?`: boolean - Si permite múltiples líneas
- `maxLength?`: number - Longitud máxima
- `style?`: React.CSSProperties - Estilos inline

### `useInlineEdit` Hook
Ubicación: `/src/hooks/useInlineEdit.ts`

**Retorna:**
- `isEditMode`: boolean - Si está en modo edición
- `notifyChange`: (field: string, value: string) => void - Notifica cambios al editor

## 🎨 Estilos de Edición

Cuando un elemento es editable:
- **Hover**: Borde punteado azul con outline-offset
- **Edición**: Input con borde azul sólido y shadow
- **Icono**: Emoji ✏️ aparece a la derecha en hover

## 🔄 Flujo de Datos

```
Template (iframe)
    ↓ (usuario edita)
EditableText
    ↓ (onChange)
notifyChange('field', 'value')
    ↓ (postMessage)
Editor Page
    ↓ (actualiza estado)
Panel Lateral
```

## 📋 Templates Pendientes

Para agregar edición inline a los siguientes templates, sigue los pasos anteriores:

- ⏳ Template 9 (t9) - Fisherman Slot
- ⏳ Template 14 (t14)
- ⏳ Template 15 (t15)
- ⏳ Template 16 (t16)
- ⏳ Template 17 (t17)
- ⏳ Template 18 (t18)

## 🚀 Beneficios

1. **UX Mejorada**: Edición directa como Wix/Webflow
2. **Feedback Inmediato**: Los cambios se ven instantáneamente
3. **Sincronización**: Panel lateral se actualiza automáticamente
4. **Intuitivo**: No necesitas buscar en el panel lateral

## 🐛 Troubleshooting

**Problema**: Los cambios no se sincronizan
- Verifica que el parámetro `edit=1` esté en la URL del iframe
- Revisa la consola para ver los mensajes postMessage

**Problema**: El texto no es editable
- Asegúrate de que `isEditMode` sea `true`
- Verifica que estés dentro de un iframe (editor)

**Problema**: El input no tiene los estilos correctos
- Verifica que hayas pasado el `className` correcto
- Los estilos inline en `style` prop sobrescriben className
