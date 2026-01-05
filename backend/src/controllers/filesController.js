/**
 * Files Controller - Controlador de endpoints de gestión de archivos
 * Maneja todas las operaciones CRUD sobre documentos
 */

const storageService = require('../services/StorageService');
const { isAdmin } = require('../middleware/requireAdmin');
const config = require('../config');

/**
 * GET /api/me
 * Retorna información del usuario autenticado
 */
async function getMe(req, res) {
  try {
    const userIsAdmin = isAdmin(req.user.email);
    
    res.json({
      email: req.user.email,
      name: req.user.name,
      isAdmin: userIsAdmin,
      role: userIsAdmin ? 'admin' : 'user'
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/files
 * Lista todos los archivos PDF del bucket con Signed URLs
 */
async function listFiles(req, res) {
  try {
    const files = await storageService.listFiles();
    
    // Generar Signed URLs para cada archivo
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        try {
          const downloadUrl = await storageService.generateSignedUrl(file.name, 'read');
          return {
            ...file,
            downloadUrl
          };
        } catch (error) {
          console.error(`Error generating URL for ${file.name}:`, error);
          return {
            ...file,
            downloadUrl: null,
            error: 'Failed to generate download URL'
          };
        }
      })
    );

    res.json({
      files: filesWithUrls,
      count: filesWithUrls.length
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ 
      error: 'Failed to list files',
      message: error.message 
    });
  }
}

/**
 * POST /api/upload
 * Sube un nuevo archivo PDF (Solo Admins)
 * Requiere middleware: verifyIAP + requireAdmin + multer
 */
async function uploadFile(req, res) {
  try {
    // Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please provide a PDF file'
      });
    }

    // Validar tipo de archivo
    if (!config.ALLOWED_FILE_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type',
        message: 'Only PDF files are allowed'
      });
    }

    // Validar tamaño
    if (req.file.size > config.MAX_FILE_SIZE) {
      return res.status(400).json({ 
        error: 'File too large',
        message: `Maximum file size is ${config.MAX_FILE_SIZE / 1024 / 1024}MB`
      });
    }

    // Verificar si el archivo ya existe
    const exists = await storageService.fileExists(req.file.originalname);
    if (exists) {
      return res.status(409).json({ 
        error: 'File already exists',
        message: 'A file with this name already exists in the repository'
      });
    }

    // Subir el archivo
    const uploadedFile = await storageService.uploadFile(req.file);
    
    console.log(`📤 File uploaded by ${req.user.email}: ${uploadedFile.name}`);
    
    res.status(201).json({
      message: 'File uploaded successfully',
      file: uploadedFile
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      error: 'Failed to upload file',
      message: error.message 
    });
  }
}

/**
 * DELETE /api/files/:name
 * Elimina un archivo del bucket (Solo Admins)
 */
async function deleteFile(req, res) {
  try {
    const filename = req.params.name;

    if (!filename) {
      return res.status(400).json({ 
        error: 'Missing filename',
        message: 'Please provide a filename to delete'
      });
    }

    // Verificar que el archivo existe
    const exists = await storageService.fileExists(filename);
    if (!exists) {
      return res.status(404).json({ 
        error: 'File not found',
        message: 'The specified file does not exist'
      });
    }

    // Eliminar el archivo
    await storageService.deleteFile(filename);
    
    console.log(`🗑️  File deleted by ${req.user.email}: ${filename}`);
    
    res.json({
      message: 'File deleted successfully',
      filename
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      error: 'Failed to delete file',
      message: error.message 
    });
  }
}

module.exports = {
  getMe,
  listFiles,
  uploadFile,
  deleteFile
};
