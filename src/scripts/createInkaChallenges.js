const { pool } = require('../config/database');

const inkaChallenges = [
  {
    titulo: "Comida Inca",
    descripcion: "Descubre los alimentos que consumían los incas en su imperio",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuál de estos alimentos NO consumían los incas?",
        opciones: ["Papa", "Mango", "Maíz"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué bebida fermentada preparaban los incas con maíz?",
        opciones: ["Chicha de jora", "Pisco", "Agua de coca"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué animal doméstico criaban los incas para obtener carne?",
        opciones: ["Pollo", "Cuy", "Vaca"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuál de estos era un cereal básico en la dieta inca?",
        opciones: ["Arroz", "Quinua", "Trigo"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Dioses Incas",
    descripcion: "Conoce a las principales deidades del panteón inca",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién era el dios del sol, el más importante para los incas?",
        opciones: ["Pachamama", "Inti", "Viracocha"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué diosa representaba a la luna?",
        opciones: ["Mama Quilla", "Illapa", "Pachamama"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Quién era el dios creador del mundo según los incas?",
        opciones: ["Inti", "Viracocha", "Illapa"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué diosa representaba a la tierra y la fertilidad?",
        opciones: ["Mama Quilla", "Pachamama", "Inti"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Sociedad Inca",
    descripcion: "Aprende sobre la organización social del Imperio Inca",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuál era el título del rey supremo de los incas?",
        opciones: ["Curaca", "Sapa Inca", "Orejon"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cómo se llamaba la comunidad familiar básica de los incas?",
        opciones: ["Ayllu", "Suyo", "Mitima"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué grupo social estaba compuesto por la familia real?",
        opciones: ["Yanaconas", "Orejones", "Hatun Runa"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cómo se llamaban los servidores personales del Inca?",
        opciones: ["Curacas", "Yanaconas", "Mitimaes"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Territorio Inca",
    descripcion: "Explora las tierras que conformaban el Tahuantinsuyo",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cómo se llamaba el imperio de los incas?",
        opciones: ["Inkarri", "Tahuantinsuyo", "Pachacamac"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuántas regiones o 'suyos' dividía el territorio inca?",
        opciones: ["3", "4", "5"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuál era la capital del Imperio Inca?",
        opciones: ["Cusco", "Lima", "Quito"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué región estaba al norte del Cusco?",
        opciones: ["Collasuyo", "Chinchaysuyo", "Contisuyo"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Cultura Inca General",
    descripcion: "Conocimientos generales sobre la civilización inca",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué técnica agrícola usaban los incas para cultivar en terrenos difíciles?",
        opciones: ["Andenes", "Quipus", "Tambos"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué sistema usaban los incas para registrar información numérica?",
        opciones: ["Escritura", "Quipus", "Calendario"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuál era la red de caminos más extensa de América precolombina?",
        opciones: ["Qhapaq Ñan", "Camino Real", "Camino del Inca"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué construcción inca es considerada una de las maravillas del mundo?",
        opciones: ["Pisac", "Machu Picchu", "Ollantaytambo"],
        respuesta_correcta: 1
      }
    ]
  }
];

async function createInkaChallenges() {
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
        ['Profesor Inca', 'profesor@inca.edu', 'temporal123', 'teacher']
      );
      teacherId = tempTeacher.rows[0].id;
      console.log('Profesor temporal creado con ID:', teacherId);
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const challenge of inkaChallenges) {
      console.log(`Creando reto: ${challenge.titulo}`);

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
    console.log('✅ Todos los retos de cultura inca han sido creados exitosamente!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear los retos:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  createInkaChallenges()
    .then(() => {
      console.log('Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { createInkaChallenges, inkaChallenges };