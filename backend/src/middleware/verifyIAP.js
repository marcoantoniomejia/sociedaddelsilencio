/**
 * Middleware de Verificación IAP (Identity-Aware Proxy)
 * Valida el token JWT inyectado por Google IAP
 * 
 * CRÍTICO: Este middleware implementa el principio Zero Trust
 * verificando criptográficamente cada petición
 */

const { OAuth2Client } = require('google-auth-library');
const config = require('../config');

const client = new OAuth2Client();

/**
 * Verifica el JWT de IAP y extrae la identidad del usuario
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
async function verifyIAP(req, res, next) {
  // Extraer el JWT del header inyectado por IAP
  const iapJWT = req.header('x-goog-iap-jwt-assertion');
  
  // En desarrollo local, permitir bypass (SOLO PARA TESTING)
  if (config.NODE_ENV === 'development' && !iapJWT) {
    console.warn('⚠️  WARNING: Running in development mode without IAP');
    req.user = {
      email: process.env.DEV_USER_EMAIL || 'dev@localhost',
      sub: 'dev-user-id'
    };
    return next();
  }

  // En producción, el JWT es OBLIGATORIO
  if (!iapJWT) {
    console.error('❌ No IAP JWT found in request headers');
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'No IAP token found. This endpoint must be accessed through the Load Balancer.'
    });
  }

  try {
    // Construir el audience esperado
    // Formato: /projects/PROJECT_NUMBER/global/backendServices/BACKEND_SERVICE_ID
    const expectedAudience = `/projects/${config.PROJECT_NUMBER}/global/backendServices/${config.BACKEND_SERVICE_ID}`;
    
    // Verificar la firma del JWT contra las llaves públicas de Google
    const ticket = await client.verifyIdToken({
      idToken: iapJWT,
      audience: expectedAudience
    });
    
    // Extraer el payload del token verificado
    const payload = ticket.getPayload();
    
    // Validaciones adicionales
    if (!payload.email) {
      throw new Error('No email found in IAP token');
    }

    // Adjuntar la información del usuario al request
    req.user = {
      email: payload.email,
      sub: payload.sub,
      name: payload.name || payload.email.split('@')[0]
    };
    
    console.log(`✅ IAP verification successful for: ${req.user.email}`);
    next();
    
  } catch (error) {
    console.error('❌ JWT Verification failed:', error.message);
    
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Invalid IAP token. Authentication failed.',
      details: config.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = verifyIAP;
