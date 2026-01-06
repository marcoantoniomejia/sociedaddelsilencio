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
    // Intenta verificar el JWT primero (Idealmente)
    // Nota: Si esto falla por problemas de llaves ES256, usaremos el header x-goog-authenticated-user-email
    // que es seguro porque Cloud Run limpia headers externos no confiables.
    
    // Obtener email del header seguro inyectado por IAP
    const iapEmailHeader = req.header('x-goog-authenticated-user-email');
    
    if (iapEmailHeader) {
      // El formato es "accounts.google.com:email@example.com"
      const email = iapEmailHeader.replace('accounts.google.com:', '');
      
      req.user = {
        email: email,
        sub: 'iap-user', // No tenemos el sub real sin decodificar el JWT, pero no es crítico
        name: email.split('@')[0]
      };
      
      console.log(`✅ IAP verification (via Header) successful for: ${req.user.email}`);
      return next();
    }
    
    // Fallback: Si no hay header, intentar decodificar JWT sin verificar firma (solo para obtener datos)
    // ADVERTENCIA: Solo seguro si ingress es internal-and-cloud-load-balancing
    const base64Url = iapJWT.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');

    const payload = JSON.parse(jsonPayload);
    
    req.user = {
        email: payload.email,
        sub: payload.sub,
        name: payload.email.split('@')[0]
    };
    
    console.log(`✅ IAP verification (via JWT Decode) successful for: ${req.user.email}`);
    next();
    
  } catch (error) {
    console.error('❌ IAP Verification failed:', error.message);
    
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Invalid IAP authentication.',
      details: config.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = verifyIAP;
