const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeTeacher } = require('../middleware/auth');
const {
  getStudentsProgress,
  getStudentProgress
} = require('../controllers/teacherController');

/**
 * @swagger
 * /teacher/students/progress:
 *   get:
 *     summary: Obtener progreso de todos los estudiantes
 *     tags: [Profesor - Progreso]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes con su progreso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del estudiante
 *                   nombre:
 *                     type: string
 *                     description: Nombre del estudiante
 *                   avatar_url:
 *                     type: string
 *                     description: URL del avatar
 *                   nivel:
 *                     type: integer
 *                     description: Nivel actual
 *                   xp_total:
 *                     type: integer
 *                     description: XP total acumulado
 *                   progreso_general:
 *                     type: integer
 *                     description: Progreso general (0-100)
 *                   progreso_por_tema:
 *                     type: array
 *                     description: Progreso por asignatura/tema
 *                     items:
 *                       type: object
 *                       properties:
 *                         tema:
 *                           type: string
 *                         progreso:
 *                           type: integer
 *                   ultima_actividad:
 *                     type: string
 *                     format: date-time
 *                     description: Última actividad registrada
 *                   estado_activo:
 *                     type: boolean
 *                     description: Si el estudiante está activo (actividad en últimas 2 horas)
 *       403:
 *         description: No autorizado - Solo profesores
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
router.get('/students/progress', authenticateToken, authorizeTeacher, getStudentsProgress);

/**
 * @swagger
 * /teacher/students/{estudiante_id}/progress:
 *   get:
 *     summary: Obtener detalles de progreso de un estudiante específico
 *     tags: [Profesor - Progreso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estudiante_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Detalles completos del progreso del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estudiante:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *                     nivel:
 *                       type: integer
 *                     xp_total:
 *                       type: integer
 *                 progreso_general:
 *                   type: integer
 *                   description: Progreso general (0-100)
 *                 progreso_por_tema:
 *                   type: array
 *                   description: Progreso detallado por asignatura
 *                   items:
 *                     type: object
 *                     properties:
 *                       tema:
 *                         type: string
 *                       progreso:
 *                         type: integer
 *                       lecciones_completadas:
 *                         type: integer
 *                       total_lecciones:
 *                         type: integer
 *                 retos_completados:
 *                   type: integer
 *                   description: Número de retos completados
 *                 retos_totales:
 *                   type: integer
 *                   description: Número total de retos disponibles
 *                 ultima_actividad:
 *                   type: string
 *                   format: date-time
 *                   description: Última actividad registrada
 *                 tiempo_estudiado:
 *                   type: integer
 *                   description: Tiempo estimado estudiado (minutos)
 *       403:
 *         description: No autorizado - Solo profesores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Estudiante no encontrado
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
router.get('/students/:estudiante_id/progress', authenticateToken, authorizeTeacher, getStudentProgress);

module.exports = router;