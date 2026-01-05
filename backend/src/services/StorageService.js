/**
 * StorageService - Servicio de gestión de Google Cloud Storage
 * Maneja todas las operaciones con el bucket de documentos
 */

const { Storage } = require('@google-cloud/storage');
const config = require('../config');

class StorageService {
  constructor() {
    // Inicializar cliente de Google Cloud Storage
    this.storage = new Storage();
    this.bucket = this.storage.bucket(config.BUCKET_NAME);
  }

  /**
   * Lista todos los archivos PDF del bucket
   * @returns {Promise<Array>} Array de objetos con información de archivos
   */
  async listFiles() {
    try {
      const [files] = await this.bucket.getFiles();
      
      return files
        .filter(file => file.name.endsWith('.pdf'))
        .map(file => ({
          name: file.name,
          size: file.metadata.size,
          updated: file.metadata.updated,
          contentType: file.metadata.contentType
        }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list files from storage');
    }
  }

  /**
   * Genera una Signed URL V4 para acceso seguro a un archivo
   * @param {string} filename - Nombre del archivo
   * @param {string} action - Acción permitida ('read' o 'write')
   * @returns {Promise<string>} URL firmada
   */
  async generateSignedUrl(filename, action = 'read') {
    try {
      const file = this.bucket.file(filename);
      
      const options = {
        version: 'v4',
        action: action,
        expires: Date.now() + (config.SIGNED_URL_EXPIRATION * 1000),
      };

      const [url] = await file.getSignedUrl(options);
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Sube un archivo al bucket
   * @param {Object} file - Objeto de archivo de Multer
   * @returns {Promise<Object>} Información del archivo subido
   */
  async uploadFile(file) {
    try {
      const blob = this.bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => {
          console.error('Upload error:', error);
          reject(new Error('Failed to upload file'));
        });

        blobStream.on('finish', async () => {
          // Hacer el archivo público o generar signed URL
          resolve({
            name: file.originalname,
            size: file.size,
            contentType: file.mimetype,
            uploaded: new Date().toISOString()
          });
        });

        blobStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  /**
   * Elimina un archivo del bucket
   * @param {string} filename - Nombre del archivo a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deleteFile(filename) {
    try {
      await this.bucket.file(filename).delete();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file from storage');
    }
  }

  /**
   * Verifica si un archivo existe en el bucket
   * @param {string} filename - Nombre del archivo
   * @returns {Promise<boolean>} True si existe
   */
  async fileExists(filename) {
    try {
      const [exists] = await this.bucket.file(filename).exists();
      return exists;
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }
}

module.exports = new StorageService();
