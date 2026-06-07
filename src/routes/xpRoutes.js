const express = require('express');
const router = express.Router();
const { 
  otorgarXP, 
  obtenerPerfilXP, 
  obtenerRanking,
  actualizarRacha,
  obtenerNiveles,
  obtenerInsignias,
  otorgarInsignia,
  configurarCriteriosInsignia,
  evaluarYOtorgarInsigniasAutomaticas
} = require('../controllers/xpController');
const { authenticateToken, authorizeTeacher } = require('../middleware/auth');

/**
 * @swagger
 * /api/xp/otorgar:
 *   post:
 *     summary: Otorgar XP a un usuario
 *     tags: [XP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - cantidad
 *               - tipo
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               cantidad:
 *                 type: integer
 *                 example: 50
 *               tipo:
 *                 type: string
 *                 enum: [actividad_completada, respuesta_correcta, racha_diaria, insignia, bonus_profesor, penalizacion]
 *                 example: actividad_completada
 *               descripcion:
 *                 type: string
 *                 example: Completó el cuestionario del Virreinato
 *               actividad_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: XP otorgado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/otorgar', otorgarXP);

/**
 * @swagger
 * /api/xp/perfil/{id}:
 *   get:
 *     summary: Obtener perfil completo de XP de un usuario
 *     tags: [XP]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Perfil de XP del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/perfil/:id', obtenerPerfilXP);

/**
 * @swagger
 * /api/xp/ranking:
 *   get:
 *     summary: Obtener ranking de usuarios por XP
 *     tags: [XP]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, teacher]
 *         description: Filtrar por rol
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de usuarios a retornar
 *     responses:
 *       200:
 *         description: Lista de usuarios ordenados por XP
 */
router.get('/ranking', obtenerRanking);

/**
 * @swagger
 * /api/xp/niveles:
 *   get:
 *     summary: Obtener todos los niveles disponibles
 *     tags: [XP]
 *     responses:
 *       200:
 *         description: Lista de niveles
 */
router.get('/niveles', obtenerNiveles);

/**
 * @swagger
 * /api/xp/racha:
 *   post:
 *     summary: Actualizar racha diaria de un usuario
 *     tags: [XP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Racha actualizada
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/racha', actualizarRacha);

/**
 * @swagger
 * /api/xp/insignias:
 *   get:
 *     summary: Obtener todas las insignias disponibles
 *     tags: [XP]
 *     responses:
 *       200:
 *         description: Lista de insignias
 */
router.get('/insignias', obtenerInsignias);

/**
 * @swagger
 * /api/xp/insignias/otorgar:
 *   post:
 *     summary: Otorgar insignia a un usuario
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - insignia_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               insignia_id:
 *                 type: integer
 *                 example: 1
 *               motivo:
 *                 type: string
 *                 example: Excelente desempeño en exámenes
 *     responses:
 *       200:
 *         description: Insignia otorgada exitosamente
 *       400:
 *         description: Datos inválidos o ya tiene la insignia
 *       404:
 *         description: Usuario o insignia no encontrada
 */
router.post('/insignias/otorgar', authenticateToken, authorizeTeacher, otorgarInsignia);

/**
 * @swagger
 * /api/xp/insignias/configurar-criterios:
 *   post:
 *     summary: Configurar criterios para insignias automáticas
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - insignia_id
 *               - criterio
 *             properties:
 *               insignia_id:
 *                 type: integer
 *                 example: 1
 *               criterio:
 *                 type: object
 *                 example:
 *                   tipo: "xp_minimo"
 *                   valor: 1000
 *     responses:
 *       200:
 *         description: Criterio configurado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Insignia no encontrada
 */
router.post('/insignias/configurar-criterios', authenticateToken, authorizeTeacher, configurarCriteriosInsignia);

/**
 * @swagger
 * /api/xp/insignias/evaluar-automatica:
 *   post:
 *     summary: Evaluar y otorgar insignias automáticamente
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Evaluación completada
 *       403:
 *         description: No autorizado - Solo profesores
 */
router.post('/insignias/evaluar-automatica', authenticateToken, authorizeTeacher, evaluarYOtorgarInsigniasAutomaticas);

module.exports = router;