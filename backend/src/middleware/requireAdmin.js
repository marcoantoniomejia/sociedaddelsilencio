/**
 * Middleware de Autorización RBAC (Role-Based Access Control)
 * Verifica si el usuario tiene permisos de administrador
 */

const config = require('../config');

/**
 * Middleware que requiere permisos de administrador
 * Debe usarse DESPUÉS del middleware verifyIAP
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
function requireAdmin(req, res, next) {
  // Verificar que el usuario fue autenticado por verifyIAP
  if (!req.user || !req.user.email) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'User not authenticated'
    });
  }

  // Verificar si el email está en la lista de administradores
  const isAdmin = config.ADMIN_EMAILS.includes(req.user.email);
  
  if (!isAdmin) {
    console.warn(`⚠️  Access denied for non-admin user: ${req.user.email}`);
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Administrator privileges required for this operation'
    });
  }

  console.log(`✅ Admin access granted to: ${req.user.email}`);
  next();
}

/**
 * Helper function para verificar si un usuario es admin
 * Útil para endpoints que necesitan comportamiento condicional
 * @param {string} email - Email del usuario
 * @returns {boolean} True si es administrador
 */
function isAdmin(email) {
  return config.ADMIN_EMAILS.includes(email);
}

module.exports = {
  requireAdmin,
  isAdmin
};
