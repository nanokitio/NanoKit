'use client'

import { useState } from 'react'
import { HelpCircle, X, MessageCircle, ChevronRight, Send } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
  category: 'editing' | 'templates' | 'colors' | 'general'
}

const FAQS: FAQ[] = [
  // Editing
  {
    question: '¿Cómo edito un texto?',
    answer: 'Haz clic directamente sobre cualquier texto con borde punteado. Se abrirá un editor con opciones de fuente, tamaño, color y más.',
    category: 'editing'
  },
  {
    question: '¿Cómo cambio el color del texto?',
    answer: 'Al editar un texto, haz clic en el ícono de paleta 🎨 en la barra de herramientas. Puedes elegir colores predefinidos o seleccionar cualquier color del espectro.',
    category: 'editing'
  },
  {
    question: '¿Cómo cambio la fuente?',
    answer: 'En la barra de edición, haz clic en el nombre de la fuente (ej: "Default") para ver todas las fuentes disponibles. Selecciona la que más te guste.',
    category: 'editing'
  },
  {
    question: '¿Cómo cambio el tamaño del texto?',
    answer: 'En la barra de edición, haz clic en el número del tamaño (ej: "48") para ver todos los tamaños disponibles.',
    category: 'editing'
  },
  {
    question: '¿Cómo guardo mis cambios?',
    answer: 'Los cambios se guardan automáticamente. También puedes hacer clic en ✓ (check verde) o presionar Enter para confirmar.',
    category: 'editing'
  },
  {
    question: '¿Cómo cancelo una edición?',
    answer: 'Haz clic en ✗ (X roja) o presiona Escape para cancelar y volver al texto original.',
    category: 'editing'
  },
  // Templates
  {
    question: '¿Cómo cambio de template?',
    answer: 'En el panel izquierdo, busca la sección "Template" y selecciona el diseño que prefieras de la lista.',
    category: 'templates'
  },
  {
    question: '¿Qué es el Wheel Fortune?',
    answer: 'Es un juego interactivo de ruleta de la fortuna. El usuario puede girar la rueda y ganar premios. Ideal para captar leads.',
    category: 'templates'
  },
  {
    question: '¿Qué es el Scratch Card?',
    answer: 'Es un juego de raspa y gana. El usuario rasca las casillas para descubrir si ganó un premio. Muy efectivo para conversiones.',
    category: 'templates'
  },
  // Colors
  {
    question: '¿Cómo cambio los colores del template?',
    answer: 'En el panel izquierdo, busca la sección "Colores". Puedes cambiar el color primario, secundario y de acento de todo el template.',
    category: 'colors'
  },
  {
    question: '¿Puedo usar mis colores de marca?',
    answer: 'Sí, usa el selector de color para ingresar el código hexadecimal exacto de tu marca (ej: #FF5500).',
    category: 'colors'
  },
  // General
  {
    question: '¿Cómo subo mi logo?',
    answer: 'En el panel izquierdo, busca la sección de logo y haz clic para subir una imagen. Recomendamos formato PNG con fondo transparente.',
    category: 'general'
  },
  {
    question: '¿Cómo publico mi sitio?',
    answer: 'Una vez satisfecho con tu diseño, haz clic en el botón "Publicar" en la parte superior. Tu sitio estará disponible inmediatamente.',
    category: 'general'
  },
  {
    question: '¿Puedo previsualizar en móvil?',
    answer: 'Sí, usa los botones de vista (desktop/móvil) en la parte superior del editor para ver cómo se verá en diferentes dispositivos.',
    category: 'general'
  },
]

const CATEGORIES = [
  { id: 'all', label: 'Todas', icon: '📚' },
  { id: 'editing', label: 'Edición de texto', icon: '✏️' },
  { id: 'templates', label: 'Templates', icon: '🎨' },
  { id: 'colors', label: 'Colores', icon: '🌈' },
  { id: 'general', label: 'General', icon: '⚙️' },
]

export function EditorHelpBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Help Button - Fixed position */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        title="¿Necesitas ayuda?"
      >
        <HelpCircle className="w-7 h-7 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
      </button>

      {/* Help Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden border border-slate-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Centro de Ayuda</h2>
                    <p className="text-white/70 text-sm">¿En qué puedo ayudarte?</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar pregunta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
                <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="p-3 border-b border-slate-700 overflow-x-auto">
              <div className="flex gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ List */}
            <div className="overflow-y-auto max-h-[40vh] p-4 space-y-2">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No encontré respuestas para tu búsqueda.</p>
                  <p className="text-sm mt-2">Intenta con otras palabras.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-lg overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-white font-medium pr-4">{faq.question}</span>
                      <ChevronRight 
                        className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                          expandedFaq === index ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="bg-slate-900/50 rounded-lg p-3 text-slate-300 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
              <p className="text-slate-400 text-xs text-center">
                💡 Tip: Los textos con <span className="text-cyan-400">borde punteado</span> son editables. ¡Solo haz clic!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
