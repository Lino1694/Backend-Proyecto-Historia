const express = require('express');
const router = express.Router();
const { 
  otorgarXP, 
  obtenerPerfilXP, 
  obtenerRanking,
  actualizarRacha,
  obtenerNiveles
} = require('../controllers/xpController');

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
 * /api/xp/niveles:
 *   get:
 *     summary: Obtener todos los niveles disponibles
 *     tags: [XP]
 *     responses:
 *       200:
 *         description: Lista de niveles
 */
router.get('/niveles', obtenerNiveles);

module.exports = router;