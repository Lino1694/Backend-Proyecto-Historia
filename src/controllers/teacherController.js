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
      // Calcular progreso general basado en respuestas correctas en retos (0.8% por respuesta correcta)
      const correctAnswersQuery = await pool.query(
        'SELECT COUNT(*) as correctas FROM historial_xp WHERE usuario_id = $1 AND tipo = $2',
        [student.id, 'respuesta_correcta']
      );
      const correctAnswers = parseInt(correctAnswersQuery.rows[0].correctas);

      // Cada respuesta correcta aumenta el progreso en 0.8%
      const progresoGeneral = Math.min(Math.round(correctAnswers * 0.8), 100);

      // Calcular progreso por tema incluyendo retos completados por categoría
      const progresoPorTema = [];

      // Progreso por temas de lecciones (si hay)
      const temasLeccionesQuery = await pool.query(`
        SELECT l.tema, COUNT(*) as total, COUNT(lc.id) as completadas
        FROM lecciones l
        LEFT JOIN lecciones_completadas lc ON l.id = lc.leccion_id AND lc.estudiante_id = $1
        WHERE l.tema IS NOT NULL AND l.tema != ''
        GROUP BY l.tema
      `, [student.id]);

      for (const tema of temasLeccionesQuery.rows) {
        const progresoTema = tema.total > 0 ? Math.round((tema.completadas / tema.total) * 100) : 0;
        progresoPorTema.push({
          tema: tema.tema,
          progreso: progresoTema.toString()
        });
      }

      // Progreso por categorías de retos
      const categoriasRetosQuery = await pool.query(`
        SELECT r.categoria, COUNT(*) as total, COUNT(rp.id) as completados
        FROM retos r
        LEFT JOIN reto_participantes rp ON r.id = rp.reto_id AND rp.usuario_id = $1 AND rp.completed_at IS NOT NULL
        WHERE r.categoria IS NOT NULL AND r.categoria != ''
        GROUP BY r.categoria
      `, [student.id]);

      for (const categoria of categoriasRetosQuery.rows) {
        const progresoCategoria = categoria.total > 0 ? Math.round((categoria.completados / categoria.total) * 100) : 0;
        progresoPorTema.push({
          tema: categoria.categoria.replace('Avanzando en la Historia - ', ''),
          progreso: progresoCategoria.toString()
        });
      }

      // Si no hay progreso específico por tema, usar general
      if (progresoPorTema.length === 0) {
        progresoPorTema.push({
          tema: 'General',
          progreso: progresoGeneral.toString()
        });
      }

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

// Obtener reportes de rendimiento por lección
const getLeccionReports = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden acceder a los reportes'
      });
    }

    // Obtener todas las lecciones
    const lessonsQuery = 'SELECT id, titulo FROM lecciones ORDER BY titulo';
    const lessons = await pool.query(lessonsQuery);

    // Obtener todos los estudiantes
    const studentsQuery = 'SELECT id, nombre, avatar_url FROM usuarios WHERE role = $1 ORDER BY nombre';
    const students = await pool.query(studentsQuery, ['student']);

    const reports = [];

    for (const lesson of lessons.rows) {
      // Calcular estadísticas para cada lección
      const completionsQuery = `
        SELECT lc.puntuacion, lc.total_preguntas, u.nombre, u.avatar_url
        FROM lecciones_completadas lc
        JOIN usuarios u ON lc.estudiante_id = u.id
        WHERE lc.leccion_id = $1 AND u.role = $2
      `;
      const completions = await pool.query(completionsQuery, [lesson.id, 'student']);

      const totalEstudiantes = students.rows.length;
      const estudiantesCompletaron = completions.rows.length;

      // Calcular promedio de puntuaciones
      let promedioPuntuacion = 0;
      if (completions.rows.length > 0) {
        const totalScore = completions.rows.reduce((sum, comp) => {
          const score = comp.total_preguntas > 0 ? (comp.puntuacion / comp.total_preguntas) * 100 : 0;
          return sum + score;
        }, 0);
        promedioPuntuacion = Math.round(totalScore / completions.rows.length);
      }

      // Calcular tasa de completitud
      const tasaCompletitud = totalEstudiantes > 0 ? Math.round((estudiantesCompletaron / totalEstudiantes) * 100) : 0;

      // Preparar lista de estudiantes con su estado
      const estudiantes = students.rows.map(student => {
        const completion = completions.rows.find(c => c.nombre === student.nombre);
        let estado = 'no_iniciado';
        let puntuacion = 0;

        if (completion) {
          estado = 'completado';
          puntuacion = completion.total_preguntas > 0 ? Math.round((completion.puntuacion / completion.total_preguntas) * 100) : 0;
        }

        return {
          nombre: student.nombre,
          avatar_url: student.avatar_url,
          puntuacion: puntuacion,
          estado: estado
        };
      });

      // Por ahora, no implementaremos preguntas difíciles ya que requeriría más complejidad
      const preguntasDificiles = [];

      reports.push({
        id: lesson.id,
        titulo: lesson.titulo,
        promedio_puntuacion: promedioPuntuacion,
        tasa_completitud: tasaCompletitud,
        total_estudiantes: totalEstudiantes,
        estudiantes: estudiantes,
        preguntas_dificiles: preguntasDificiles
      });
    }

    res.json(reports);

  } catch (error) {
    console.error('Error al obtener reportes de lecciones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener detalles de rendimiento de una lección específica
const getLeccionReportDetail = async (req, res) => {
  const { leccion_id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden acceder a los reportes'
      });
    }

    // Obtener información de la lección
    const lessonQuery = 'SELECT id, titulo, descripcion FROM lecciones WHERE id = $1';
    const lesson = await pool.query(lessonQuery, [leccion_id]);

    if (lesson.rows.length === 0) {
      return res.status(404).json({ error: 'Lección no encontrada' });
    }

    const leccion = lesson.rows[0];

    // Obtener todas las completaciones de esta lección
    const completionsQuery = `
      SELECT lc.*, u.nombre, u.avatar_url, lc.completado_at as fecha_completado
      FROM lecciones_completadas lc
      JOIN usuarios u ON lc.estudiante_id = u.id
      WHERE lc.leccion_id = $1 AND u.role = $2
      ORDER BY lc.completado_at DESC
    `;
    const completions = await pool.query(completionsQuery, [leccion_id, 'student']);

    // Calcular estadísticas generales
    const totalEstudiantes = completions.rows.length;
    let promedioGeneral = 0;
    let tiempoPromedio = 0; // Por ahora no calculamos tiempo

    if (totalEstudiantes > 0) {
      const totalScore = completions.rows.reduce((sum, comp) => {
        const score = comp.total_preguntas > 0 ? (comp.puntuacion / comp.total_preguntas) * 100 : 0;
        return sum + score;
      }, 0);
      promedioGeneral = Math.round(totalScore / totalEstudiantes);
    }

    // Calcular distribución de puntuaciones
    const distribucion = {
      excelente: 0, // 80-100
      bueno: 0,     // 60-79
      regular: 0,   // 40-59
      deficiente: 0 // 0-39
    };

    completions.rows.forEach(comp => {
      const score = comp.total_preguntas > 0 ? (comp.puntuacion / comp.total_preguntas) * 100 : 0;
      if (score >= 80) distribucion.excelente++;
      else if (score >= 60) distribucion.bueno++;
      else if (score >= 40) distribucion.regular++;
      else distribucion.deficiente++;
    });

    // Preparar lista de estudiantes con detalles
    const estudiantes = completions.rows.map(comp => ({
      id: comp.estudiante_id,
      nombre: comp.nombre,
      avatar_url: comp.avatar_url,
      puntuacion: comp.total_preguntas > 0 ? Math.round((comp.puntuacion / comp.total_preguntas) * 100) : 0,
      tiempo_completado: 0, // Por ahora no calculamos tiempo
      fecha_completado: comp.fecha_completado,
      respuestas: [] // Por ahora no tenemos detalle de respuestas individuales
    }));

    // Análisis de preguntas (simplificado)
    const analisisPreguntas = [];

    const estadisticas = {
      promedio_general: promedioGeneral,
      tasa_completitud: totalEstudiantes, // Simplificado
      tiempo_promedio: tiempoPromedio,
      distribucion_puntuaciones: distribucion
    };

    res.json({
      leccion: {
        id: leccion.id,
        titulo: leccion.titulo,
        descripcion: leccion.descripcion
      },
      estadisticas: estadisticas,
      estudiantes: estudiantes,
      analisis_preguntas: analisisPreguntas
    });

  } catch (error) {
    console.error('Error al obtener detalles de reporte de lección:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener reportes de rendimiento por reto
const getRetoReports = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden acceder a los reportes'
      });
    }

    // Obtener todos los retos
    const retosQuery = 'SELECT id, titulo, categoria FROM retos ORDER BY titulo';
    const retos = await pool.query(retosQuery);

    // Obtener todos los estudiantes
    const studentsQuery = 'SELECT id, nombre, avatar_url FROM usuarios WHERE role = $1 ORDER BY nombre';
    const students = await pool.query(studentsQuery, ['student']);

    const reports = [];

    for (const reto of retos.rows) {
      // Calcular estadísticas para cada reto
      const completionsQuery = `
        SELECT rp.*, u.nombre, u.avatar_url
        FROM reto_participantes rp
        JOIN usuarios u ON rp.usuario_id = u.id
        WHERE rp.reto_id = $1 AND u.role = $2
      `;
      const completions = await pool.query(completionsQuery, [reto.id, 'student']);

      const totalEstudiantes = students.rows.length;
      const estudiantesCompletaron = completions.rows.filter(c => c.completed_at !== null).length;

      // Calcular promedio de puntuaciones
      let promedioPuntuacion = 0;
      if (completions.rows.length > 0) {
        const totalScore = completions.rows.reduce((sum, comp) => {
          return sum + (comp.xp_ganado || 0);
        }, 0);
        promedioPuntuacion = Math.round(totalScore / completions.rows.length);
      }

      // Calcular tasa de completitud
      const tasaCompletitud = totalEstudiantes > 0 ? Math.round((estudiantesCompletaron / totalEstudiantes) * 100) : 0;

      // Preparar lista de estudiantes con su estado
      const estudiantes = students.rows.map(student => {
        const completion = completions.rows.find(c => c.nombre === student.nombre);
        let estado = 'no_iniciado';
        let puntuacion = 0;

        if (completion) {
          if (completion.completed_at) {
            estado = 'completado';
            puntuacion = completion.xp_ganado || 0;
          } else {
            estado = 'en_progreso';
            puntuacion = completion.xp_ganado || 0;
          }
        }

        return {
          nombre: student.nombre,
          avatar_url: student.avatar_url,
          puntuacion: puntuacion,
          estado: estado
        };
      });

      reports.push({
        id: reto.id,
        titulo: reto.titulo,
        promedio_puntuacion: promedioPuntuacion,
        tasa_completitud: tasaCompletitud,
        total_estudiantes: totalEstudiantes,
        estudiantes: estudiantes,
        preguntas_dificiles: []
      });
    }

    res.json(reports);

  } catch (error) {
    console.error('Error al obtener reportes de retos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener detalles de rendimiento de un reto específico
const getRetoReportDetail = async (req, res) => {
  const { reto_id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden acceder a los reportes'
      });
    }

    // Obtener información del reto
    const retoQuery = 'SELECT id, titulo, descripcion, categoria, xp_recompensa FROM retos WHERE id = $1';
    const reto = await pool.query(retoQuery, [reto_id]);

    if (reto.rows.length === 0) {
      return res.status(404).json({ error: 'Reto no encontrado' });
    }

    const retoData = reto.rows[0];

    // Obtener todas las completaciones de este reto
    const completionsQuery = `
      SELECT rp.*, u.nombre, u.avatar_url, rp.completed_at as fecha_completado
      FROM reto_participantes rp
      JOIN usuarios u ON rp.usuario_id = u.id
      WHERE rp.reto_id = $1 AND u.role = $2
      ORDER BY rp.completed_at DESC
    `;
    const completions = await pool.query(completionsQuery, [reto_id, 'student']);

    // Calcular estadísticas generales
    const totalEstudiantes = completions.rows.length;
    let promedioGeneral = 0;

    if (totalEstudiantes > 0) {
      const totalScore = completions.rows.reduce((sum, comp) => {
        return sum + (comp.xp_ganado || 0);
      }, 0);
      promedioGeneral = Math.round(totalScore / totalEstudiantes);
    }

    // Calcular distribución de puntuaciones
    const distribucion = {
      excelente: 0, // 80-100 XP
      bueno: 0,     // 40-79 XP
      regular: 0,   // 10-39 XP
      deficiente: 0 // 0-9 XP
    };

    completions.rows.forEach(comp => {
      const xp = comp.xp_ganado || 0;
      if (xp >= 80) distribucion.excelente++;
      else if (xp >= 40) distribucion.bueno++;
      else if (xp >= 10) distribucion.regular++;
      else distribucion.deficiente++;
    });

    // Preparar lista de estudiantes con detalles
    const estudiantes = completions.rows.map(comp => ({
      id: comp.usuario_id,
      nombre: comp.nombre,
      avatar_url: comp.avatar_url,
      puntuacion: comp.xp_ganado || 0,
      tiempo_completado: 0,
      fecha_completado: comp.fecha_completado,
      respuestas: []
    }));

    const estadisticas = {
      promedio_general: promedioGeneral,
      tasa_completitud: totalEstudiantes,
      tiempo_promedio: 0,
      distribucion_puntuaciones: distribucion
    };

    res.json({
      reto: {
        id: retoData.id,
        titulo: retoData.titulo,
        descripcion: retoData.descripcion,
        xp_recompensa: retoData.xp_recompensa
      },
      estadisticas: estadisticas,
      estudiantes: estudiantes,
      analisis_preguntas: []
    });

  } catch (error) {
    console.error('Error al obtener detalles de reporte de reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  getStudentsProgress,
  getStudentProgress,
  getLeccionReports,
  getLeccionReportDetail,
  getRetoReports,
  getRetoReportDetail
};