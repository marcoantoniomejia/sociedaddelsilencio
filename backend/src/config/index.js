/**
 * Configuración Central del Backend
 * Gestiona variables de entorno y constantes del sistema
 */

module.exports = {
  // Configuración de Google Cloud Storage
  BUCKET_NAME: process.env.BUCKET_NAME || 'repo-logia',
  
  // Configuración de Google Cloud Project
  PROJECT_ID: process.env.GCP_PROJECT_ID || 'ss322-blog-prod-210625',
  PROJECT_NUMBER: process.env.GCP_PROJECT_NUMBER || '785229525031',
  
  // Configuración de IAP (Identity-Aware Proxy)
  // El BACKEND_SERVICE_ID se obtiene de la consola de GCP
  BACKEND_SERVICE_ID: process.env.BACKEND_SERVICE_ID || 'backend-service-id',
  
  // Lista de emails con permisos de administrador
  // Estos usuarios podrán subir y eliminar documentos
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || 'admin@marcomejia.cloud').split(','),
  
  // Configuración del servidor
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configuración de archivos permitidos
  ALLOWED_FILE_TYPES: ['application/pdf'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  
  // Duración de las Signed URLs (en segundos)
  SIGNED_URL_EXPIRATION: 15 * 60, // 15 minutos
};
