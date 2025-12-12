# 🎨 Canva-Style Editor - User Guide

## ✨ New Features

The editor now includes a **Canva-style floating toolbar** for text editing with advanced formatting options.

## 🎯 How to Use

### 1. **Select Text**
- Click on any editable text element (headline, subheadline, CTA)
- You'll see:
  - 🔵 Blue outline around the text
  - 🎯 4 corner handles (blue circles)
  - 📋 Floating toolbar above the text

### 2. **Floating Toolbar Controls**

The toolbar appears above selected text with these options:

#### Font Family Dropdown
- Click to see 10 available fonts
- Select any font to apply instantly
- Options: Inter, Arial, Helvetica, Times New Roman, Georgia, etc.

#### Font Size Controls
- **[-]** button: Decrease size by 2px
- **Number input**: Type exact size (8-200px)
- **[+]** button: Increase size by 2px

#### Text Formatting
- **B** - Bold toggle
- **I** - Italic toggle
- **U** - Underline toggle

#### Text Alignment
- **⬅** - Align left
- **≡** - Align center
- **➡** - Align right

#### Color Picker
- **🎨** - Click to open color picker
- Select any color for your text

### 3. **Edit Text Content**
- After selecting, click again to enter edit mode
- Type your new text
- Press **Enter** to save
- Press **Escape** to cancel

### 4. **Visual Indicators**

**When Selected:**
```
    ○ ────────────────── ○
    │                    │
    │   Your Text Here   │  ← Blue border
    │                    │
    ○ ────────────────── ○
```

**Toolbar Position:**
```
┌──────────────────────────────────────┐
│ [Font ▼] │ [-][48][+] │ B I U │ 🎨 │  ← Floats above
└──────────────────────────────────────┘
         Your Text Here
```

## 🚀 Currently Available In

- ✅ **Template t6** (Sweet Bonanza / Cyber Wins)
  - Headline editing
  - Subheadline editing

## 🔄 Workflow Example

1. Open editor for any site using template t6
2. Click on the headline text
3. See toolbar appear with all formatting options
4. Change font to "Georgia"
5. Increase size to 60px
6. Make it bold
7. Change color to gold
8. Click again to edit the actual text
9. All changes save automatically

## 🐛 Troubleshooting

### Toolbar doesn't appear?
- Make sure you're in edit mode (check for debug panel in top-left)
- Verify the template is t6
- Try hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Changes don't save?
- Check that edit=1 parameter is in the iframe URL
- Look for postMessage errors in console

### Toolbar position is wrong?
- This can happen if the page is scrolled
- Click away and click again to recalculate position

## 📝 Technical Details

### Components
- `FloatingToolbar.tsx` - The contextual toolbar UI
- `EditableTextCanva.tsx` - Enhanced text editor component
- `useInlineEdit.ts` - Hook with notifyStyleChange function

### Message Types
- `CONTENT_CHANGE` - Text content updates
- `STYLE_CHANGE` - Font, size, bold, italic, color, alignment
- `FONT_SIZE_CHANGE` - Legacy font size updates

## 🎯 Next Steps

To add this to other templates:

1. Import `EditableTextCanva` and `useInlineEdit`
2. Replace `EditableText` with `EditableTextCanva`
3. Add `onStyleChange` callback with `notifyStyleChange`
4. Set `initialStyles` with default formatting

Example:
```tsx
<EditableTextCanva
  value={headline}
  onChange={(val) => {
    setHeadline(val)
    notifyChange('headline', val)
  }}
  onStyleChange={(styles) => notifyStyleChange('headline', styles)}
  initialStyles={{
    fontSize: 48,
    fontFamily: 'Inter',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    textAlign: 'center',
    color: '#ffffff'
  }}
/>
```

## 🎨 Design Philosophy

This editor follows Canva's UX principles:
- **Direct manipulation** - Click what you want to edit
- **Contextual controls** - Toolbar appears where you need it
- **Visual feedback** - Clear selection states
- **Non-destructive** - Easy to undo/cancel
- **Real-time preview** - See changes immediately
