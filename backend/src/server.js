/**
 * Server Principal - Backend Zero Trust
 * Sociedad del Silencio 322 - Sistema de Gestión Documental
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Configuración y servicios
const config = require('./config');
const verifyIAP = require('./middleware/verifyIAP');
const { requireAdmin } = require('./middleware/requireAdmin');
const filesController = require('./controllers/filesController');

// Inicializar Express
const app = express();

// ============================================================================
// MIDDLEWARES GLOBALES
// ============================================================================

// Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'"],
      scriptSrcAttr: ["'unsafe-inline'"], // Permitir onclick inline
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://storage.googleapis.com"]
    }
  }
}));

// CORS (aunque IAP ya maneja el perímetro de seguridad)
app.use(cors({
  origin: config.NODE_ENV === 'development' ? '*' : false,
  credentials: true
}));

// Parsers (aumentados para uploads grandes)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Configuración de Multer para manejo de archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// ============================================================================
// RUTAS PÚBLICAS (Sin autenticación - Servidas directamente)
// ============================================================================

// Servir archivos estáticos desde /public
// Servir archivos estáticos bajo el prefijo /privado
app.use('/privado', express.static(path.join(__dirname, '../public')));

// Redirección raíz a /privado/repositorio.html por si acaso
app.get('/', (req, res) => {
  res.redirect('/privado/repositorio.html');
});

// Health check (para Cloud Run)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'repo-privado',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// RUTAS API (Protegidas por IAP + JWT Validation)
// ============================================================================

// Aplicar middleware de verificación IAP a todas las rutas /api/*
// Aplicar middleware de verificación IAP a todas las rutas /privado/api/*
app.use('/privado/api', verifyIAP);

// Información del usuario autenticado
app.get('/privado/api/me', filesController.getMe);

// Listar archivos (Todos los usuarios autenticados)
app.get('/privado/api/files', filesController.listFiles);

// Subir archivo (Solo Admins)
app.post('/privado/api/upload', requireAdmin, upload.single('file'), filesController.uploadFile);

// Eliminar archivo (Solo Admins)
app.delete('/privado/api/files/:name', requireAdmin, filesController.deleteFile);

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Error de Multer
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: config.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🔒 Backend Zero Trust - Sociedad del Silencio 322');
  console.log('='.repeat(60));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`🪣 Bucket: ${config.BUCKET_NAME}`);
  console.log(`👥 Admin emails: ${config.ADMIN_EMAILS.join(', ')}`);
  console.log('='.repeat(60));
});

module.exports = app;
