const { pool } = require('../config/database');

const inkaChallenges = [
  {
    titulo: "Comida Inca",
    descripcion: "Descubre los alimentos que consumían los incas en su imperio",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 20, // Base XP, will add 20 more for completion
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuál de estos alimentos NO consumían los incas?",
        opciones: ["Papa", "Mango", "Maíz"],
        respuesta_correcta: 1 // Mango
      },
      {
        pregunta: "¿Qué bebida fermentada preparaban los incas con maíz?",
        opciones: ["Chicha de jora", "Pisco", "Agua de coca"],
        respuesta_correcta: 0 // Chicha de jora
      },
      {
        pregunta: "¿Qué animal doméstico criaban los incas para obtener carne?",
        opciones: ["Pollo", "Cuy", "Vaca"],
        respuesta_correcta: 1 // Cuy
      },
      {
        pregunta: "¿Cuál de estos era un cereal básico en la dieta inca?",
        opciones: ["Arroz", "Quinua", "Trigo"],
        respuesta_correcta: 1 // Quinua
      },
      {
        pregunta: "¿Qué especia usaban los incas para dar sabor a sus comidas?",
        opciones: ["Canela", "Ají", "Pimienta negra"],
        respuesta_correcta: 1 // Ají
      }
    ]
  },
  {
    titulo: "Dioses Incas",
    descripcion: "Conoce a las principales deidades del panteón inca",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién era el dios del sol, el más importante para los incas?",
        opciones: ["Pachamama", "Inti", "Viracocha"],
        respuesta_correcta: 1 // Inti
      },
      {
        pregunta: "¿Qué diosa representaba a la luna?",
        opciones: ["Mama Quilla", "Illapa", "Pachamama"],
        respuesta_correcta: 0 // Mama Quilla
      },
      {
        pregunta: "¿Quién era el dios creador del mundo según los incas?",
        opciones: ["Inti", "Viracocha", "Illapa"],
        respuesta_correcta: 1 // Viracocha
      },
      {
        pregunta: "¿Qué diosa representaba a la tierra y la fertilidad?",
        opciones: ["Mama Quilla", "Pachamama", "Illapa"],
        respuesta_correcta: 1 // Pachamama
      },
      {
        pregunta: "¿Quién era el dios del rayo y la lluvia?",
        opciones: ["Inti", "Illapa", "Viracocha"],
        respuesta_correcta: 1 // Illapa
      }
    ]
  },
  {
    titulo: "Sociedad Inca",
    descripcion: "Aprende sobre la organización social del Imperio Inca",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuál era el título del rey supremo de los incas?",
        opciones: ["Curaca", "Sapa Inca", "Orejon"],
        respuesta_correcta: 1 // Sapa Inca
      },
      {
        pregunta: "¿Cómo se llamaba la comunidad familiar básica de los incas?",
        opciones: ["Ayllu", "Suyo", "Mitima"],
        respuesta_correcta: 0 // Ayllu
      },
      {
        pregunta: "¿Qué grupo social estaba compuesto por la familia real?",
        opciones: ["Yanaconas", "Orejones", "Hatun Runa"],
        respuesta_correcta: 1 // Orejones
      },
      {
        pregunta: "¿Cómo se llamaban los servidores personales del Inca?",
        opciones: ["Curacas", "Yanaconas", "Mitimaes"],
        respuesta_correcta: 1 // Yanaconas
      },
      {
        pregunta: "¿Qué pueblo era considerado común en la sociedad inca?",
        opciones: ["Hatun Runa", "Orejones", "Coyas"],
        respuesta_correcta: 0 // Hatun Runa
      }
    ]
  },
  {
    titulo: "Territorio Inca",
    descripcion: "Explora las tierras que conformaban el Tahuantinsuyo",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cómo se llamaba el imperio de los incas?",
        opciones: ["Inkarri", "Tahuantinsuyo", "Pachacamac"],
        respuesta_correcta: 1 // Tahuantinsuyo
      },
      {
        pregunta: "¿Cuántas regiones o 'suyos' dividía el territorio inca?",
        opciones: ["3", "4", "5"],
        respuesta_correcta: 1 // 4
      },
      {
        pregunta: "¿Cuál era la capital del Imperio Inca?",
        opciones: ["Cusco", "Lima", "Quito"],
        respuesta_correcta: 0 // Cusco
      },
      {
        pregunta: "¿Qué región estaba al norte del Cusco?",
        opciones: ["Collasuyo", "Chinchaysuyo", "Contisuyo"],
        respuesta_correcta: 1 // Chinchaysuyo
      },
      {
        pregunta: "¿Dónde se encuentra el lago más sagrado para los incas?",
        opciones: ["Titicaca", "Junín", "Poopó"],
        respuesta_correcta: 0 // Titicaca
      }
    ]
  },
  {
    titulo: "Cultura Inca General",
    descripcion: "Conocimientos generales sobre la civilización inca",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Cultura Inca",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué técnica agrícola usaban los incas para cultivar en terrenos difíciles?",
        opciones: ["Andenes", "Quipus", "Tambos"],
        respuesta_correcta: 0 // Andenes
      },
      {
        pregunta: "¿Qué sistema usaban los incas para registrar información numérica?",
        opciones: ["Escritura", "Quipus", "Calendario"],
        respuesta_correcta: 1 // Quipus
      },
      {
        pregunta: "¿Cuál era la red de caminos más extensa de América precolombina?",
        opciones: ["Qhapaq Ñan", "Camino Real", "Camino del Inca"],
        respuesta_correcta: 0 // Qhapaq Ñan
      },
      {
        pregunta: "¿Qué construcción inca es considerada una de las maravillas del mundo?",
        opciones: ["Pisac", "Machu Picchu", "Ollantaytambo"],
        respuesta_correcta: 1 // Machu Picchu
      },
      {
        pregunta: "¿Qué animal sagrado era considerado hijo del sol?",
        opciones: ["Puma", "Cóndor", "Llama"],
        respuesta_correcta: 2 // Llama
      }
    ]
  }
];

async function createInkaChallenges() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Obtener un usuario profesor existente (o crear uno temporal)
    const teacherResult = await client.query(
      "SELECT id FROM usuarios WHERE role = 'teacher' LIMIT 1"
    );

    let teacherId;
    if (teacherResult.rows.length === 0) {
      // Crear un profesor temporal si no existe ninguno
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
    console.log('✅ Todos los retos de cultura inca han sido creados exitosamente!');

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