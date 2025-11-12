// Test Script para Verificar SendGrid
// Uso: node test-sendgrid.js

const sgMail = require('@sendgrid/mail')

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL
const SENDGRID_SENDER_NAME = process.env.SENDGRID_SENDER_NAME

// Validar configuración
if (!SENDGRID_API_KEY) {
  console.error('❌ ERROR: SENDGRID_API_KEY no está configurado en .env.local')
  process.exit(1)
}

if (!SENDGRID_SENDER_EMAIL) {
  console.error('❌ ERROR: SENDGRID_SENDER_EMAIL no está configurado en .env.local')
  process.exit(1)
}

console.log('🔍 Verificando configuración...')
console.log('✅ API Key encontrado:', SENDGRID_API_KEY.substring(0, 10) + '...')
console.log('✅ Sender Email:', SENDGRID_SENDER_EMAIL)
console.log('✅ Sender Name:', SENDGRID_SENDER_NAME)

// Configurar SendGrid
sgMail.setApiKey(SENDGRID_API_KEY)

// Email de prueba
const msg = {
  to: SENDGRID_SENDER_EMAIL, // Enviar a ti mismo para probar
  from: {
    email: SENDGRID_SENDER_EMAIL,
    name: SENDGRID_SENDER_NAME,
  },
  subject: '🧪 Test Email - SendGrid Funcionando!',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #667eea;">🎉 ¡SendGrid Funciona!</h1>
      <p>Si recibes este email, significa que tu configuración de SendGrid está correcta.</p>
      
      <div style="background: #f0f9ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">✅ Configuración Correcta:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>API Key: Configurado ✓</li>
          <li>Sender Email: ${SENDGRID_SENDER_EMAIL} ✓</li>
          <li>Sender Name: ${SENDGRID_SENDER_NAME} ✓</li>
        </ul>
      </div>
      
      <p><strong>Próximo paso:</strong> Ejecuta la migración SQL en Supabase</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Email enviado por: test-sendgrid.js<br>
        Fecha: ${new Date().toLocaleString()}
      </p>
    </div>
  `,
  text: `
¡SendGrid Funciona!

Si recibes este email, tu configuración está correcta.

Configuración:
- API Key: Configurado ✓
- Sender Email: ${SENDGRID_SENDER_EMAIL} ✓
- Sender Name: ${SENDGRID_SENDER_NAME} ✓

Próximo paso: Ejecuta la migración SQL en Supabase
  `,
}

console.log('\n📧 Enviando email de prueba...')
console.log('To:', msg.to)
console.log('From:', msg.from)

sgMail
  .send(msg)
  .then((response) => {
    console.log('\n✅ ¡EMAIL ENVIADO EXITOSAMENTE!')
    console.log('Status Code:', response[0].statusCode)
    console.log('Message ID:', response[0].headers['x-message-id'])
    console.log('\n🎉 SendGrid está configurado correctamente!')
    console.log('📬 Revisa tu bandeja de entrada:', SENDGRID_SENDER_EMAIL)
  })
  .catch((error) => {
    console.error('\n❌ ERROR AL ENVIAR EMAIL:')
    
    if (error.response) {
      console.error('Status Code:', error.response.statusCode)
      console.error('Error Body:', JSON.stringify(error.response.body, null, 2))
      
      // Mensajes de error comunes
      if (error.response.statusCode === 403) {
        console.error('\n⚠️  PROBLEMA: API Key inválido o sin permisos')
        console.error('Solución: Verifica tu SENDGRID_API_KEY en .env.local')
      } else if (error.response.statusCode === 400) {
        console.error('\n⚠️  PROBLEMA: Email sender no verificado')
        console.error('Solución: Verifica tu email en SendGrid Dashboard → Settings → Sender Authentication')
      }
    } else {
      console.error(error)
    }
    
    process.exit(1)
  })
