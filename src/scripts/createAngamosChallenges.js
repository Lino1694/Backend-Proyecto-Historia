const { pool } = require('../config/database');

const angamosChallenges = [
  {
    titulo: "Contexto de la Guerra del Pacífico",
    descripcion: "Conoce los antecedentes de la guerra entre Perú, Chile y Bolivia",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Batalla de Angamos",
    xp_recompensa: 16,
    dificultad: "Fácil",
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuál era el conflicto principal entre Perú y Chile?",
        opciones: ["Salitre y minería", "Soberanía territorial", "Desastre marino"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿En qué año comenzó la Guerra del Pacífico?",
        opciones: ["1875", "1879", "1883"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué región disputaban Perú y Chile?",
        opciones: ["Tarapacá", "Arequipa", "Lima"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Quién era el presidente de Perú en 1879?",
        opciones: ["Castilla", "Grau", "Pierola"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Batallas Navales Importantes",
    descripcion: "Descubre las batajas clave del conflicto marítimo",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Batalla de Angamos",
    xp_recompensa: 16,
    dificultad: "Intermedio",
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué general chileno murió en la Batalla de San Francisco?",
        opciones: ["Saavedra", "Blanco Encalada", "Latorre"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué armada ganó en el primer conflicto naval?",
        opciones: ["Peruana", "Chilena", "Boliviana"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Cuál era el objetivo de la flota peruana en 1879?",
        opciones: ["Bloquear a Chile", "Expulsar a invasores", "Defender Antofagasta"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué destructor peruano participó en la Batalla de Angamos?",
        opciones: ["Huáscar", "Union", "Independencia"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "La Batalla de Angamos",
    descripcion: "Estudia la batalla naval decisiva del 8 de octubre de 1879",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Batalla de Angamos",
    xp_recompensa: 16,
    dificultad: "Intermedio",
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿En qué fecha ocurrió la Batalla de Angamos?",
        opciones: ["20 de junio de 1879", "8 de octubre de 1879", "21 de diciembre de 1879"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué general chileno murió abordando el Huáscar?",
        opciones: ["Saavedra", "Latorre", "Uribe"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuál era el nombre del crucero peruano hundido?",
        opciones: ["Independencia", "America", "Union"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué efecto tuvo esta batalla en la guerra?",
        opciones: ["Perú ganó", "Chile ganó", "Empate"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Consecuencias de la Guerra",
    descripcion: "Aprende los resultados de la Guerra del Pacífico",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Batalla de Angamos",
    xp_recompensa: 16,
    dificultad: "Difícil",
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué departamento perdió Perú en 1883?",
        opciones: ["Tarapacá", "Arequipa", "Puno"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué ciudad se convirtió en capital regional peruana?",
        opciones: ["Tacna", "Arica", "Ilo"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Quién firmó el tratado de paz?",
        opciones: ["Salamanca", "Prado", "Cruz"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué cambió la frontera marítima?",
        opciones: ["Se mantuvo igual", "Se corrió 200 leguas", "Se desistió"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Heroes y Memoria Histórica",
    descripcion: "Conoce a los personajes que marcaron esta epoca",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Batalla de Angamos",
    xp_recompensa: 16,
    dificultad: "Fácil",
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién fue el comandante del Huáscar?",
        opciones: ["Grau", "Latorre", "Silva"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué honor recibió Latorre postumamente?",
        opciones: ["General", "Mariscal", "Almirante"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué monumento conmemora la batalla?",
        opciones: ["Plaza Angamos", "Monumento Marítimo", "Cristo Rey"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué día se conmemora la batalla?",
        opciones: ["8 de octubre", "28 de julio", "9 de diciembre"],
        respuesta_correcta: 0
      }
    ]
  }
];

async function createAngamosChallenges() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const teacherResult = await client.query(
      "SELECT id FROM usuarios WHERE role = 'teacher' LIMIT 1"
    );

    let teacherId;
    if (teacherResult.rows.length === 0) {
      const tempTeacher = await client.query(
        "INSERT INTO usuarios (nombre, correo, contrasena, role) VALUES ($1, $2, $3, $4) RETURNING id",
        ['Profesor Angamos', 'profesor@angamos.edu', 'temporal123', 'teacher']
      );
      teacherId = tempTeacher.rows[0].id;
      console.log('Profesor temporal creado con ID:', teacherId);
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const challenge of angamosChallenges) {
      console.log(`Creando reto: ${challenge.titulo}`);

const retoResult = await client.query(
    'INSERT INTO retos (titulo, descripcion, tipo, categoria, xp_recompensa, dificultad, fecha_fin, max_intentos, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
    [
      challenge.titulo,
      challenge.descripcion,
      challenge.tipo,
      challenge.categoria,
      challenge.xp_recompensa,
      challenge.dificultad || 'Intermedio',
      challenge.fecha_fin,
      challenge.max_intentos,
      teacherId
    ]
  );

      const retoId = retoResult.rows[0].id;
      console.log(`Reto creado con ID: ${retoId}`);

      for (const pregunta of challenge.preguntas) {
        await client.query(
          'INSERT INTO preguntas_reto (reto_id, pregunta, opciones, respuesta_correcta, tipo_pregunta) VALUES ($1, $2, $3, $4, $5)',
          [
            retoId,
            pregunta.pregunta,
            JSON.stringify(pregunta.opciones),
            pregunta.respuesta_correcta.toString(),
            'multiple_choice'
          ]
        );
      }

      console.log(`Preguntas creadas para reto: ${challenge.titulo}`);
    }

    await client.query('COMMIT');
    console.log('✅ Todos los retos de Angamos han sido creados exitosamente!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear los retos:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function updateExistingRetos() {
  const client = await pool.connect();
  try {
    console.log('Actualizando dificultad de retos existentes...');
    await client.query(`
      UPDATE retos SET dificultad = 'Intermedio' 
      WHERE dificultad IS NULL
    `);
    console.log('Retos actualizados exitosamente');
  } catch (error) {
    console.error('Error al actualizar retos:', error);
  } finally {
    client.release();
  }
}

if (require.main === module) {
  createAngamosChallenges()
    .then(() => {
      console.log('Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { createAngamosChallenges, angamosChallenges, updateExistingRetos };