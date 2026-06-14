const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  crearReto,
  getRetosActivos,
  getRetosPorCategoria,
  unirseReto,
  completarReto,
  getPreguntasReto,
  responderReto,
  verificarRespuesta,
  getIntentosRestantes,
  eliminarReto,
  actualizarReto,
  obtenerReto
} = require('../controllers/retosController');

/**
 * @swagger
 * /api/retos/crear:
 *   post:
 *     summary: Crear un nuevo reto
 *     tags: [Retos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - tipo
 *               - xp_recompensa
 *               - fecha_fin
 *               - preguntas
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título del reto
 *               descripcion:
 *                 type: string
 *                 description: Descripción opcional del reto
  *               tipo:
  *                 type: string
  *                 enum: [individual, competition]
  *                 description: Tipo de reto
  *               categoria:
  *                 type: string
  *                 description: Categoría del reto (opcional)
 *               xp_recompensa:
 *                 type: integer
 *                 description: Puntos XP que otorga el reto
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *                 description: Fecha límite en formato YYYY-MM-DD
 *               max_intentos:
 *                 type: integer
 *                 description: Máximo número de intentos permitidos (opcional, null = ilimitado)
 *               preguntas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - pregunta
 *                     - opciones
 *                     - respuesta_correcta
 *                   properties:
 *                     pregunta:
 *                       type: string
 *                       description: Texto de la pregunta
 *                     opciones:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Opciones para elegir (para completar espacio, solo una opción con la respuesta correcta)
 *                     respuesta_correcta:
 *                       oneOf:
 *                         - type: integer
 *                           description: Índice de la opción correcta para opción múltiple
 *                         - type: string
 *                           description: Respuesta correcta para completar espacios
 *     responses:
 *       201:
 *         description: Reto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del reto creado
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito
 *       400:
 *         description: Error de validación
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
/**
 * @swagger
 * /api/retos/categorias:
 *   get:
 *     summary: Obtener retos organizados por categorías
 *     tags: [Retos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retos organizados por categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 "Avanzando en la Historia":
 *                   type: object
 *                   properties:
 *                     "Cultura Inca":
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           titulo:
 *                             type: string
 *                           descripcion:
 *                             type: string
 *                           tipo:
 *                             type: string
 *                             enum: [individual, competition]
 *                           categoria:
 *                             type: string
 *                           xp_recompensa:
 *                             type: integer
 *                           participantes:
 *                             type: integer
 *                           estado:
 *                             type: string
 *                             enum: [active, completed]
 *                           fecha_fin:
 *                             type: string
 *                             format: date
 *                           creador_id:
 *                             type: integer
 *                     "Caral - La primera Ciudad":
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reto'
 *                     "El Virreinato en el Perú":
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reto'
 *                     "La Independencia":
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reto'
 *                     "La Conquista de Perú":
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reto'
 *                     "Retos Personalizados":
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reto'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/retos/activos:
 *   get:
 *     summary: Obtener retos activos
 *     tags: [Retos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de retos activos
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
 *                   tipo:
 *                     type: string
 *                     enum: [individual, competition]
 *                   xp_recompensa:
 *                     type: integer
 *                   participantes:
 *                     type: integer
 *                   estado:
 *                     type: string
 *                     enum: [active, completed]
 *                   fecha_fin:
 *                     type: string
 *                     format: date
 *                   creador_id:
 *                     type: integer
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/categorias', authenticateToken, getRetosPorCategoria);
router.get('/activos', authenticateToken, getRetosActivos);

/**
 * @swagger
 * /api/retos/unirse:
 *   post:
 *     summary: Unirse a un reto
 *     tags: [Retos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reto_id
 *             properties:
 *               reto_id:
 *                 type: integer
 *                 description: ID del reto al que unirse
 *     responses:
 *       200:
 *         description: Unido al reto exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *         description: Reto no encontrado
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
router.post('/unirse', authenticateToken, unirseReto);

/**
 * @swagger
 * /api/retos/completar:
 *   post:
 *     summary: Completar un reto
 *     tags: [Retos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reto_id
 *             properties:
 *               reto_id:
 *                 type: integer
 *                 description: ID del reto a completar
 *     responses:
 *       200:
 *         description: Reto completado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 xp_ganado:
 *                   type: integer
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
router.post('/completar', authenticateToken, completarReto);

/**
 * @swagger
 * /api/retos/{id}/preguntas:
 *   get:
 *     summary: Obtener preguntas de un reto
 *     tags: [Retos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reto
 *     responses:
 *       200:
 *         description: Lista de preguntas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   pregunta:
 *                     type: string
 *                   opciones:
 *                     type: array
 *                     items:
 *                       type: string
 *       403:
 *         description: No autorizado o no unido al reto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reto no encontrado
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
router.get('/:id/preguntas', authenticateToken, getPreguntasReto);
router.get('/:id/intentos', authenticateToken, getIntentosRestantes);

/**
 * @swagger
 * /api/retos/{id}/responder:
 *   post:
 *     summary: Enviar respuestas de un reto
 *     tags: [Retos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - respuestas
 *             properties:
 *               respuestas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - pregunta_id
 *                     - respuesta
 *                   properties:
 *                     pregunta_id:
 *                       type: integer
 *                       description: ID de la pregunta
 *                     respuesta:
 *                       type: string
 *                       description: Respuesta (índice para múltiple choice, texto para completar)
 *     responses:
 *       200:
 *         description: Respuestas procesadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 correctas:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 xp_ganado:
 *                   type: integer
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
/**
 * @swagger
 * /api/retos/{id}/verificar:
 *   post:
 *     summary: Verificar respuesta individual
 *     tags: [Retos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pregunta_id
 *               - respuesta
 *             properties:
 *               pregunta_id:
 *                 type: integer
 *                 description: ID de la pregunta
 *               respuesta:
 *                 type: string
 *                 description: Respuesta del estudiante (índice para múltiple choice, texto para completar)
 *     responses:
 *       200:
 *         description: Verificación completada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 correcta:
 *                   type: boolean
 *                 respuesta_correcta:
 *                   type: string
 *                   description: Solo se incluye si es incorrecta (índice o texto correcto)
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: No autorizado o no unido al reto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reto o pregunta no encontrada
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
router.post('/:id/verificar', authenticateToken, verificarRespuesta);

router.post('/:id/responder', authenticateToken, responderReto);

router.post('/crear', authenticateToken, crearReto);

// Obtener reto específico (para edición)
router.get('/:id', authenticateToken, obtenerReto);

// Actualizar reto
router.put('/:id', authenticateToken, actualizarReto);

// Eliminar reto
router.delete('/:id', authenticateToken, eliminarReto);

module.exports = router;