#!/usr/bin/env node
/**
 * Script de Verificación Completa de SendGrid
 * 
 * Este script verifica:
 * 1. Variables de entorno
 * 2. Conexión con SendGrid API
 * 3. Envío de email de prueba
 * 4. Estado del sender email
 * 
 * Uso: node verify-sendgrid-complete.js
 */

const sgMail = require('@sendgrid/mail')
require('dotenv').config({ path: '.env.local' })

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}🔍 ${msg}${colors.reset}`),
}

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL
const SENDGRID_SENDER_NAME = process.env.SENDGRID_SENDER_NAME

let hasErrors = false

// Header
console.log('\n' + '='.repeat(60))
console.log('🔍 VERIFICACIÓN COMPLETA DE SENDGRID')
console.log('='.repeat(60) + '\n')

// PASO 1: Verificar Variables de Entorno
console.log('📋 PASO 1: Verificando Variables de Entorno...\n')

if (!SENDGRID_API_KEY) {
  log.error('SENDGRID_API_KEY no está configurado en .env.local')
  hasErrors = true
} else {
  log.success(`API Key encontrado: ${SENDGRID_API_KEY.substring(0, 10)}...`)
  
  // Verificar formato del API Key
  if (!SENDGRID_API_KEY.startsWith('SG.')) {
    log.warning('El API Key no tiene el formato correcto (debe empezar con "SG.")')
    hasErrors = true
  }
}

if (!SENDGRID_SENDER_EMAIL) {
  log.error('SENDGRID_SENDER_EMAIL no está configurado en .env.local')
  hasErrors = true
} else {
  log.success(`Sender Email: ${SENDGRID_SENDER_EMAIL}`)
  
  // Verificar formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(SENDGRID_SENDER_EMAIL)) {
    log.warning('El formato del email no es válido')
    hasErrors = true
  }
}

if (!SENDGRID_SENDER_NAME) {
  log.warning('SENDGRID_SENDER_NAME no está configurado (se usará el email como nombre)')
} else {
  log.success(`Sender Name: ${SENDGRID_SENDER_NAME}`)
}

if (hasErrors) {
  console.log('\n' + '='.repeat(60))
  log.error('Se encontraron errores en la configuración. Por favor corrígelos antes de continuar.')
  console.log('='.repeat(60) + '\n')
  process.exit(1)
}

// PASO 2: Configurar SendGrid
console.log('\n📧 PASO 2: Configurando SendGrid API...\n')

try {
  sgMail.setApiKey(SENDGRID_API_KEY)
  log.success('SendGrid API configurado correctamente')
} catch (error) {
  log.error(`Error al configurar SendGrid: ${error.message}`)
  process.exit(1)
}

// PASO 3: Enviar Email de Prueba
console.log('\n🚀 PASO 3: Enviando Email de Prueba...\n')

const testEmail = {
  to: SENDGRID_SENDER_EMAIL,
  from: {
    email: SENDGRID_SENDER_EMAIL,
    name: SENDGRID_SENDER_NAME || 'Test Sender',
  },
  subject: '✅ SendGrid Verificación Completa - ' + new Date().toLocaleString(),
  html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
      <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <h1 style="color: #667eea; margin: 0 0 20px 0; text-align: center;">
          🎉 ¡SendGrid Funciona Perfectamente!
        </h1>
        
        <div style="background: #f0f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">✅ Verificación Completa</h2>
          <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>API Key:</strong> Configurado correctamente ✓</li>
            <li><strong>Sender Email:</strong> ${SENDGRID_SENDER_EMAIL} ✓</li>
            <li><strong>Sender Name:</strong> ${SENDGRID_SENDER_NAME || 'No configurado'} ${SENDGRID_SENDER_NAME ? '✓' : '⚠️'}</li>
            <li><strong>Envío de Emails:</strong> Funcionando ✓</li>
          </ul>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p style="margin: 0; color: #856404;">
            <strong>📊 Estadísticas de este Email:</strong><br>
            • Enviado: ${new Date().toLocaleString()}<br>
            • Destinatario: ${SENDGRID_SENDER_EMAIL}<br>
            • Estado: Entregado exitosamente
          </p>
        </div>
        
        <div style="margin: 30px 0; padding: 20px; background: #e8f5e9; border-radius: 5px;">
          <h3 style="color: #2e7d32; margin: 0 0 10px 0;">🚀 Próximos Pasos</h3>
          <ol style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Verifica que recibiste este email ✓</li>
            <li>Revisa el Dashboard de SendGrid</li>
            <li>Monitorea el Activity Feed</li>
            <li>¡Tu sistema de emails está listo! 🎉</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Email de verificación automática<br>
            Generado por: verify-sendgrid-complete.js<br>
            ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  `,
  text: `
SendGrid Verificación Completa

✅ Verificación Exitosa

Tu configuración de SendGrid está funcionando correctamente:
- API Key: Configurado ✓
- Sender Email: ${SENDGRID_SENDER_EMAIL} ✓
- Sender Name: ${SENDGRID_SENDER_NAME || 'No configurado'} ${SENDGRID_SENDER_NAME ? '✓' : '⚠️'}
- Envío de Emails: Funcionando ✓

Próximos Pasos:
1. Verifica que recibiste este email ✓
2. Revisa el Dashboard de SendGrid
3. Monitorea el Activity Feed
4. ¡Tu sistema de emails está listo! 🎉

Email enviado: ${new Date().toLocaleString()}
Destinatario: ${SENDGRID_SENDER_EMAIL}
  `,
}

log.info(`Enviando email de prueba a: ${testEmail.to}`)
log.info(`Desde: ${testEmail.from.email} (${testEmail.from.name})`)

sgMail
  .send(testEmail)
  .then((response) => {
    console.log('\n' + '='.repeat(60))
    log.success('EMAIL ENVIADO EXITOSAMENTE!')
    console.log('='.repeat(60) + '\n')
    
    console.log('📊 Detalles de la Respuesta:\n')
    log.info(`Status Code: ${response[0].statusCode}`)
    log.info(`Message ID: ${response[0].headers['x-message-id']}`)
    
    if (response[0].statusCode === 202) {
      log.success('Status 202: Email aceptado por SendGrid')
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('🎉 VERIFICACIÓN COMPLETA - TODO FUNCIONA CORRECTAMENTE')
    console.log('='.repeat(60) + '\n')
    
    console.log('✅ Checklist Final:\n')
    log.success('Variables de entorno configuradas')
    log.success('SendGrid API conectado')
    log.success('Email de prueba enviado')
    log.success('Response recibida de SendGrid')
    
    console.log('\n📬 Próximos Pasos:\n')
    log.info('1. Revisa tu bandeja de entrada: ' + SENDGRID_SENDER_EMAIL)
    log.info('2. Verifica en SendGrid Dashboard: https://app.sendgrid.com/activity')
    log.info('3. Si el email está en spam, márcalo como "No es spam"')
    log.info('4. Tu sistema de emails está listo para producción! 🚀')
    
    console.log('\n' + '='.repeat(60) + '\n')
  })
  .catch((error) => {
    console.log('\n' + '='.repeat(60))
    log.error('ERROR AL ENVIAR EMAIL')
    console.log('='.repeat(60) + '\n')
    
    if (error.response) {
      log.error(`Status Code: ${error.response.statusCode}`)
      console.log('\n📋 Detalles del Error:\n')
      console.log(JSON.stringify(error.response.body, null, 2))
      
      // Errores comunes
      console.log('\n🔍 Diagnóstico:\n')
      
      switch (error.response.statusCode) {
        case 400:
          log.error('Error 400 (Bad Request)')
          log.warning('Posible causa: Email sender no verificado')
          console.log('\n💡 Solución:')
          console.log('1. Ve a SendGrid Dashboard → Settings → Sender Authentication')
          console.log('2. Click en "Verify a Single Sender"')
          console.log(`3. Verifica el email: ${SENDGRID_SENDER_EMAIL}`)
          console.log('4. Confirma el email de verificación que recibirás')
          break
          
        case 401:
          log.error('Error 401 (Unauthorized)')
          log.warning('Posible causa: API Key inválido')
          console.log('\n💡 Solución:')
          console.log('1. Ve a SendGrid Dashboard → Settings → API Keys')
          console.log('2. Crea un nuevo API Key con permisos "Mail Send"')
          console.log('3. Actualiza SENDGRID_API_KEY en .env.local')
          console.log('4. Reinicia el servidor')
          break
          
        case 403:
          log.error('Error 403 (Forbidden)')
          log.warning('Posible causa: API Key sin permisos suficientes')
          console.log('\n💡 Solución:')
          console.log('1. Ve a SendGrid Dashboard → Settings → API Keys')
          console.log('2. Verifica que el API Key tenga permisos "Mail Send"')
          console.log('3. Si no, crea uno nuevo con los permisos correctos')
          break
          
        default:
          log.error(`Error ${error.response.statusCode}`)
          console.log('\n💡 Solución:')
          console.log('1. Revisa los detalles del error arriba')
          console.log('2. Consulta la documentación: https://docs.sendgrid.com/api-reference/mail-send/errors')
          console.log('3. Contacta a soporte si el problema persiste')
      }
    } else {
      log.error('Error de conexión o configuración')
      console.log(error)
    }
    
    console.log('\n' + '='.repeat(60) + '\n')
    process.exit(1)
  })
