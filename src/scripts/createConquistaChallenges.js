const { pool } = require('../config/database');

const conquistaChallenges = [
  {
    titulo: "Los Viajes de Pizarro",
    descripcion: "Descubre las expediciones que llevaron a la conquista del Perú",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Conquista de Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuántas expediciones realizó Francisco Pizarro antes de conquistar el Perú?",
        opciones: ["1", "2", "3"],
        respuesta_correcta: 2 // 3
      },
      {
        pregunta: "¿Dónde sufrió hambre la expedición de Pizarro?",
        opciones: ["Isla de la Gorgona", "Isla del Gallo", "Costa de Colombia"],
        respuesta_correcta: 1 // Isla del Gallo
      },
      {
        pregunta: "¿Cómo se conoce al grupo de 13 hombres que decidió continuar la expedición?",
        opciones: ["Los trece valientes", "Los trece de la fama", "Los trece conquistadores"],
        respuesta_correcta: 1 // Los trece de la fama
      },
      {
        pregunta: "¿En qué año llegó Pizarro por primera vez a territorio peruano?",
        opciones: ["1524", "1526", "1528"],
        respuesta_correcta: 1 // 1526
      },
      {
        pregunta: "¿Dónde estableció Pizarro la primera ciudad española en el Perú?",
        opciones: ["San Miguel de Piura", "San Miguel de Tangarará", "Jauja"],
        respuesta_correcta: 0 // San Miguel de Piura
      }
    ]
  },
  {
    titulo: "Captura de Atahualpa en Cajamarca",
    descripcion: "Conoce el encuentro crucial entre conquistadores y el Imperio Inca",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Conquista de Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Dónde fue capturado Atahualpa?",
        opciones: ["Cusco", "Cajamarca", "Quito"],
        respuesta_correcta: 1 // Cajamarca
      },
      {
        pregunta: "¿Qué religioso participó en la captura de Atahualpa?",
        opciones: ["Fray Vicente de Valverde", "Fray Domingo de Santo Tomás", "Fray Martín de Morúa"],
        respuesta_correcta: 0 // Fray Vicente de Valverde
      },
      {
        pregunta: "¿Qué pidió Pizarro como rescate por Atahualpa?",
        opciones: ["Un cuarto lleno de oro", "Dos cuartos llenos de oro y plata", "Todo el oro del Cusco"],
        respuesta_correcta: 1 // Dos cuartos llenos de oro y plata
      },
      {
        pregunta: "¿Cómo murió Atahualpa?",
        opciones: ["En batalla", "Ahorcado", "Degollado"],
        respuesta_correcta: 1 // Ahorcado
      },
      {
        pregunta: "¿En qué año fue capturado Atahualpa?",
        opciones: ["1531", "1532", "1533"],
        respuesta_correcta: 1 // 1532
      }
    ]
  },
  {
    titulo: "Las Guerras Civiles entre Conquistadores",
    descripcion: "Aprende sobre los conflictos entre los propios conquistadores españoles",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Conquista de Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuál fue el principal conflicto entre conquistadores?",
        opciones: ["Pizarro vs Almagro", "Pizarro vs Hernando de Soto", "Almagro vs Pedro de Valdivia"],
        respuesta_correcta: 0 // Pizarro vs Almagro
      },
      {
        pregunta: "¿Dónde se libró la batalla de Las Salinas?",
        opciones: ["Cusco", "Lima", "Arequipa"],
        respuesta_correcta: 1 // Lima
      },
      {
        pregunta: "¿Quién ganó la batalla de Las Salinas?",
        opciones: ["Diego de Almagro", "Francisco Pizarro", "Gonzalo Pizarro"],
        respuesta_correcta: 1 // Francisco Pizarro
      },
      {
        pregunta: "¿Cómo murió Francisco Pizarro?",
        opciones: ["En batalla", "Asesinado por partidarios de Almagro", "De viejo"],
        respuesta_correcta: 1 // Asesinado por partidarios de Almagro
      },
      {
        pregunta: "¿En qué año murió Francisco Pizarro?",
        opciones: ["1540", "1541", "1542"],
        respuesta_correcta: 1 // 1541
      }
    ]
  },
  {
    titulo: "La Resistencia Inca de Vilcabamba",
    descripcion: "Descubre la resistencia del último bastión inca contra los españoles",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Conquista de Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién fue el primer inca de Vilcabamba?",
        opciones: ["Atahualpa", "Manco Inca", "Paullu Inca"],
        respuesta_correcta: 1 // Manco Inca
      },
      {
        pregunta: "¿Dónde estaba ubicado Vilcabamba?",
        opciones: ["En la selva amazónica", "En los Andes del Cusco", "En la costa norte"],
        respuesta_correcta: 1 // En los Andes del Cusco
      },
      {
        pregunta: "¿Quién sucedió a Manco Inca en Vilcabamba?",
        opciones: ["Sayri Túpac", "Titu Cusi Yupanqui", "Túpac Amaru I"],
        respuesta_correcta: 0 // Sayri Túpac
      },
      {
        pregunta: "¿Cómo se llamaba el inca que negoció con los españoles?",
        opciones: ["Manco Inca", "Sayri Túpac", "Titu Cusi Yupanqui"],
        respuesta_correcta: 2 // Titu Cusi Yupanqui
      },
      {
        pregunta: "¿Cuántos años duró aproximadamente la resistencia de Vilcabamba?",
        opciones: ["10 años", "25 años", "40 años"],
        respuesta_correcta: 2 // 40 años
      }
    ]
  },
  {
    titulo: "El Fin de la Resistencia: Túpac Amaru I",
    descripcion: "Conoce el final de la resistencia inca y la campaña de Toledo",
    tipo: "individual",
    categoria: "Avanzando en la Historia - La Conquista de Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién fue el último inca de Vilcabamba?",
        opciones: ["Titu Cusi Yupanqui", "Túpac Amaru I", "Quisppe Titu"],
        respuesta_correcta: 1 // Túpac Amaru I
      },
      {
        pregunta: "¿Quién dirigió la campaña contra Vilcabamba?",
        opciones: ["Francisco de Toledo", "Martín García Óñez de Loyola", "Lope García de Castro"],
        respuesta_correcta: 0 // Francisco de Toledo
      },
      {
        pregunta: "¿Cómo terminó Túpac Amaru I?",
        opciones: ["Murió en batalla", "Fue decapitado", "Se rindió"],
        respuesta_correcta: 1 // Fue decapitado
      },
      {
        pregunta: "¿En qué año terminó definitivamente la resistencia inca?",
        opciones: ["1569", "1571", "1572"],
        respuesta_correcta: 2 // 1572
      },
      {
        pregunta: "¿Dónde fue ejecutado Túpac Amaru I?",
        opciones: ["Cusco", "Vilcabamba", "Lima"],
        respuesta_correcta: 0 // Cusco
      }
    ]
  }
];

async function createConquistaChallenges() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Obtener un usuario profesor existente
    const teacherResult = await client.query(
      "SELECT id FROM usuarios WHERE role = 'teacher' LIMIT 1"
    );

    let teacherId;
    if (teacherResult.rows.length === 0) {
      // Crear un profesor temporal si no existe ninguno
      const tempTeacher = await client.query(
        "INSERT INTO usuarios (nombre, correo, contrasena, role) VALUES ($1, $2, $3, $4) RETURNING id",
        ['Profesor Conquista', 'profesor@conquista.edu', 'temporal123', 'teacher']
      );
      teacherId = tempTeacher.rows[0].id;
      console.log('Profesor temporal creado con ID:', teacherId);
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const challenge of conquistaChallenges) {
      console.log(`Creando reto: ${challenge.titulo}`);

      // Crear el reto
      const retoResult = await client.query(
        'INSERT INTO retos (titulo, descripcion, tipo, categoria, xp_recompensa, fecha_fin, max_intentos, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [
          challenge.titulo,
          challenge.descripcion,
          challenge.tipo,
          challenge.categoria,
          challenge.xp_recompensa,
          challenge.fecha_fin,
          challenge.max_intentos,
          teacherId
        ]
      );

      const retoId = retoResult.rows[0].id;
      console.log(`Reto creado con ID: ${retoId}`);

      // Crear las preguntas
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
    console.log('✅ Todos los retos de la Conquista han sido creados exitosamente!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear los retos:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ejecutar la función si se llama directamente
if (require.main === module) {
  createConquistaChallenges()
    .then(() => {
      console.log('Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { createConquistaChallenges, conquistaChallenges };