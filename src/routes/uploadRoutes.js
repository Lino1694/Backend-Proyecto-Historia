const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { upload, uploadMultimedia, serveStaticFiles } = require('../controllers/uploadController');

/**
 * @swagger
 * /upload/multimedia:
 *   post:
 *     summary: Subir archivos multimedia
 *     tags: [Multimedia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Archivos multimedia (videos, audio, imágenes)
 *     responses:
 *       200:
 *         description: Archivos subidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "2 archivo(s) subido(s) exitosamente"
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID del archivo en la base de datos
 *                       tipo:
 *                         type: string
 *                         enum: [video, audio, imagen]
 *                       url:
 *                         type: string
 *                         description: URL pública del archivo
 *                       nombre_original:
 *                         type: string
 *                         description: Nombre original del archivo
 *                       tamano:
 *                         type: integer
 *                         description: Tamaño del archivo en bytes
 *       400:
 *         description: Error de validación de archivos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Usuario no autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Solo docentes pueden subir archivos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/multimedia', authenticateToken, upload.array('files', 10), uploadMultimedia);

module.exports = router;