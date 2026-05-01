const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pool } = require('../config/database');

// Configuración de Multer para almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/multimedia/';

    // Determinar carpeta según tipo de archivo
    if (file.mimetype.startsWith('video/')) {
      uploadPath += 'videos/';
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath += 'audio/';
    } else if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    }

    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos
  const allowedMimes = [
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm',
    'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/flac',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
    files: 10 // Máximo 10 archivos por subida
  }
});

// Función para determinar tipo de archivo
const getFileType = (mimetype) => {
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.startsWith('image/')) return 'imagen';
  return 'desconocido';
};

// Controlador de subida de archivos multimedia
const uploadMultimedia = async (req, res) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar que sea docente (solo docentes pueden subir archivos)
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Solo los docentes pueden subir archivos multimedia' });
    }

    // Verificar que se hayan subido archivos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se encontraron archivos para subir' });
    }

    const uploadedFiles = [];
    const userId = req.user.id;

    // Procesar cada archivo subido
    for (const file of req.files) {
      try {
        // Generar URL pública (para desarrollo local)
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const relativePath = path.relative('uploads', file.path).replace(/\\/g, '/');
        const publicUrl = `${baseUrl}/uploads/${relativePath}`;

        // Guardar información en la base de datos
        const result = await pool.query(
          `INSERT INTO multimedia
           (nombre_original, nombre_archivo, tipo, mime_type, tamano, ruta, url_publica, uploaded_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id`,
          [
            file.originalname,
            file.filename,
            getFileType(file.mimetype),
            file.mimetype,
            file.size,
            file.path,
            publicUrl,
            userId
          ]
        );

        const fileId = result.rows[0].id;

        // Agregar a la lista de archivos subidos
        uploadedFiles.push({
          id: fileId,
          tipo: getFileType(file.mimetype),
          url: publicUrl,
          nombre_original: file.originalname,
          tamano: file.size
        });

      } catch (dbError) {
        console.error('Error al guardar archivo en BD:', dbError);
        // Si hay error en BD, eliminar el archivo del disco
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error al eliminar archivo:', unlinkError);
        }
        throw dbError;
      }
    }

    res.json({
      success: true,
      message: `${uploadedFiles.length} archivo(s) subido(s) exitosamente`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Error al subir archivos multimedia:', error);

    // Limpiar archivos subidos en caso de error
    if (req.files) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          console.error('Error al limpiar archivo:', cleanupError);
        }
      });
    }

    res.status(500).json({
      error: 'Error al subir archivos multimedia',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware para servir archivos estáticos
const serveStaticFiles = (req, res, next) => {
  const filePath = path.join(__dirname, '../../uploads', req.path.replace('/uploads/', ''));
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
};

module.exports = {
  upload,
  uploadMultimedia,
  serveStaticFiles
};