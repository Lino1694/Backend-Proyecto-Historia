const { pool } = require('../config/database');

// Obtener progreso de todos los estudiantes
const getStudentsProgress = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden acceder al progreso de estudiantes'
      });
    }

    // Obtener todos los estudiantes con su progreso
    const studentsQuery = `
      SELECT
        u.id,
        u.nombre,
        u.avatar_url,
        COALESCE(u.nivel, 1) as nivel,
        COALESCE(u.xp_total, 0) as xp_total,
        u.ultima_actividad
      FROM usuarios u
      WHERE u.role = 'student'
      ORDER BY u.nombre
    `;

    const studentsResult = await pool.query(studentsQuery);

    // Para cada estudiante, calcular el progreso
    const studentsWithProgress = [];
    for (const student of studentsResult.rows) {
      // Calcular progreso por tema directamente desde las tablas
      const progressQuery = `
        SELECT l.tema,
               COUNT(lc.id) as lecciones_completadas,
               COUNT(DISTINCT l.id) as total_lecciones,
               ROUND(COALESCE((COUNT(lc.id) * 100.0 / NULLIF(COUNT(DISTINCT l.id), 0)), 0), 2) as progreso
        FROM lecciones l
        LEFT JOIN lecciones_completadas lc ON l.id = lc.leccion_id AND lc.estudiante_id = $1
        WHERE l.tema IS NOT NULL AND l.tema != ''
        GROUP BY l.tema
        ORDER BY l.tema
      `;

      const progressResult = await pool.query(progressQuery, [student.id]);
      const progresoPorTema = progressResult.rows;

      // Calcular progreso general como promedio
      const progresoGeneral = progresoPorTema.length > 0
        ? Math.round(progresoPorTema.reduce((sum, tema) => sum + parseFloat(tema.progreso || 0), 0) / progresoPorTema.length)
        : 0;

      // Verificar si está activo (actividad en últimas 2 horas)
      const dosHorasAtras = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const ultimaActividad = student.ultima_actividad ? new Date(student.ultima_actividad) : new Date(0);
      const estadoActivo = ultimaActividad > dosHorasAtras;

      studentsWithProgress.push({
        id: student.id,
        nombre: student.nombre,
        avatar_url: student.avatar_url,
        nivel: student.nivel,
        xp_total: student.xp_total,
        progreso_general: progresoGeneral,
        progreso_por_tema: progresoPorTema.map(t => ({
          tema: t.tema,
          progreso: parseFloat(t.progreso || 0)
        })),
        ultima_actividad: student.ultima_actividad ? student.ultima_actividad.toISOString() : null,
        estado_activo: estadoActivo
      });
    }

    res.json(studentsWithProgress);

  } catch (error) {
    console.error('Error al obtener progreso de estudiantes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener detalles de progreso de un estudiante específico
const getStudentProgress = async (req, res) => {
  const { estudiante_id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden acceder al progreso de estudiantes'
      });
    }

    // Verificar que el estudiante existe
    const studentQuery = `
      SELECT id, nombre, avatar_url, nivel, xp_total
      FROM usuarios
      WHERE id = $1 AND role = 'student'
    `;
    const student = await pool.query(studentQuery, [estudiante_id]);

    if (student.rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const studentData = student.rows[0];

    // Obtener progreso por tema con detalles calculados directamente
    const progressQuery = `
      SELECT l.tema,
             COUNT(lc.id) as lecciones_completadas,
             COUNT(DISTINCT l.id) as total_lecciones,
             ROUND(COALESCE((COUNT(lc.id) * 100.0 / NULLIF(COUNT(DISTINCT l.id), 0)), 0), 1) as progreso
      FROM lecciones l
      LEFT JOIN lecciones_completadas lc ON l.id = lc.leccion_id AND lc.estudiante_id = $1
      WHERE l.tema IS NOT NULL AND l.tema != ''
      GROUP BY l.tema
      ORDER BY l.tema
    `;

    const progressResult = await pool.query(progressQuery, [estudiante_id]);

    // Calcular progreso general
    const progresoPorTema = progressResult.rows;
    const progresoGeneral = progresoPorTema.length > 0
      ? Math.round(progresoPorTema.reduce((sum, tema) => sum + parseFloat(tema.progreso || 0), 0) / progresoPorTema.length)
      : 0;

    // Retos completados
    const retosCompletadosQuery = await pool.query(
      'SELECT COUNT(*)::integer FROM reto_participantes WHERE usuario_id = $1 AND completed_at IS NOT NULL',
      [estudiante_id]
    );

    // Total de retos disponibles
    const retosTotalesQuery = await pool.query(
      'SELECT COUNT(*)::integer FROM retos WHERE fecha_fin >= CURRENT_DATE'
    );

    // Última actividad
    const ultimaActividadQuery = await pool.query(
      'SELECT MAX(created_at) as ultima_actividad FROM historial_xp WHERE usuario_id = $1',
      [estudiante_id]
    );

    // Tiempo estudiado (estimado en minutos basado en actividades)
    const tiempoEstudiadoQuery = await pool.query(
      `SELECT COUNT(*) * 15 as tiempo_estudiado FROM historial_xp
       WHERE usuario_id = $1 AND tipo IN ('actividad_completada', 'leccion_completada', 'reto_completado')`,
      [estudiante_id]
    );

    const progressData = {
      progreso_general: progresoGeneral,
      progreso_por_tema: progresoPorTema,
      retos_completados: parseInt(retosCompletadosQuery.rows[0].count),
      retos_totales: parseInt(retosTotalesQuery.rows[0].count),
      ultima_actividad: ultimaActividadQuery.rows[0].ultima_actividad,
      tiempo_estudiado: parseInt(tiempoEstudiadoQuery.rows[0].tiempo_estudiado || 0)
    };

    const response = {
      estudiante: {
        id: studentData.id,
        nombre: studentData.nombre,
        avatar_url: studentData.avatar_url,
        nivel: studentData.nivel,
        xp_total: studentData.xp_total
      },
      progreso_general: Math.round(progressData.progreso_general),
      progreso_por_tema: progressData.progreso_por_tema,
      retos_completados: progressData.retos_completados,
      retos_totales: progressData.retos_totales,
      ultima_actividad: progressData.ultima_actividad,
      tiempo_estudiado: progressData.tiempo_estudiado || 0
    };

    res.json(response);

  } catch (error) {
    console.error('Error al obtener progreso del estudiante:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  getStudentsProgress,
  getStudentProgress
};