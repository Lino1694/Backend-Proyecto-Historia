const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  crearLeccion,
  getLecciones,
  updateLeccion,
  completarLeccion,
  asignarLeccion,
  obtenerLeccionesAsignadas
} = require('../controllers/leccionesController');

/**
 * @swagger
 * /api/lecciones/crear:
 *   post:
 *     summary: Crear una nueva lección
 *     tags: [Lecciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título de la lección
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la lección
 *               contenido:
 *                 type: string
 *                 description: Contenido rico de la lección
 *               preguntas:
 *                 type: array
 *                 description: Array de preguntas de evaluación
 *               asignatura:
 *                 type: string
 *                 description: Asignatura o materia
 *               nivel_dificultad:
 *                 type: string
 *                 description: Nivel de dificultad
 *               tiempo_estimado:
 *                 type: integer
 *                 description: Tiempo estimado en minutos
 *     responses:
 *       201:
 *         description: Lección creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 leccion:
 *                   type: object
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: No autorizado
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
router.post('/crear', authenticateToken, crearLeccion);

/**
 * @swagger
 * /api/lecciones:
 *   get:
 *     summary: Obtener todas las lecciones
 *     tags: [Lecciones]
 *     responses:
 *       200:
 *         description: Lista de lecciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   contenido:
 *                     type: string
 *                   preguntas:
 *                     type: array
 *                   asignatura:
 *                     type: string
 *                   nivel_dificultad:
 *                     type: string
 *                   tiempo_estimado:
 *                     type: integer
 *                   created_by:
 *                     type: integer
 *                   creador_nombre:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getLecciones);

/**
 * @swagger
 * /api/lecciones/{id}:
 *   put:
 *     summary: Actualizar una lección
 *     tags: [Lecciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la lección
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               contenido:
 *                 type: string
 *               preguntas:
 *                 type: array
 *               asignatura:
 *                 type: string
 *               nivel_dificultad:
 *                 type: string
 *               tiempo_estimado:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lección actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 leccion:
 *                   type: object
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lección no encontrada
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
router.put('/:id', authenticateToken, updateLeccion);

/**
 * @swagger
 * /api/lecciones/completar:
 *   post:
 *     summary: Completar una lección
 *     tags: [Lecciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leccion_id
 *               - puntuacion
 *               - total_preguntas
 *             properties:
 *               leccion_id:
 *                 type: integer
 *                 description: ID de la lección completada
 *               puntuacion:
 *                 type: integer
 *                 description: Número de respuestas correctas
 *               total_preguntas:
 *                 type: integer
 *                 description: Total de preguntas en la lección
 *     responses:
 *       200:
 *         description: Lección completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 xp_ganado:
 *                   type: integer
 *                 puntuacion:
 *                   type: integer
 *                 total_preguntas:
 *                   type: integer
 *                 porcentaje:
 *                   type: integer
 *       400:
 *         description: Error de validación o lección ya completada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: No autorizado - Solo estudiantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lección no encontrada
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
router.post('/completar', authenticateToken, completarLeccion);

/**
 * @swagger
 * /api/lecciones/asignar:
 *   post:
 *     summary: Asignar lección a estudiantes o grupo
 *     tags: [Lecciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leccion_id
 *               - tipo_asignacion
 *             properties:
 *               leccion_id:
 *                 type: integer
 *                 description: ID de la lección a asignar
 *               tipo_asignacion:
 *                 type: string
 *                 enum: [estudiantes, grupo]
 *                 description: Tipo de asignación
 *               estudiantes_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs de estudiantes (requerido si tipo_asignacion es "estudiantes")
 *               grupo_id:
 *                 type: integer
 *                 description: ID del grupo/clase (opcional si tipo_asignacion es "grupo")
 *               titulo_personalizado:
 *                 type: string
 *                 description: Título personalizado para la asignación
 *               fecha_vencimiento:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha límite para completar
 *     responses:
 *       201:
 *         description: Lección asignada exitosamente
 *       400:
 *         description: Error de validación
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Lección no encontrada
 */
router.post('/asignar', authenticateToken, asignarLeccion);

/**
 * @swagger
 * /api/lecciones/asignadas:
 *   get:
 *     summary: Obtener lecciones asignadas
 *     tags: [Lecciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de lecciones asignadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   tipo_asignacion:
 *                     type: string
 *                   fecha_asignacion:
 *                     type: string
 *                   activa:
 *                     type: boolean
 */
router.get('/asignadas', authenticateToken, obtenerLeccionesAsignadas);

module.exports = router;