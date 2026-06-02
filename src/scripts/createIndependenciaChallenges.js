const { pool } = require('../config/database');

const independenciaChallenges = [
  {
    titulo: "Los Precursores de la Independencia",
    descripcion: "Conoce a los primeros líderes que lucharon por la libertad",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia del Perú",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién fue el precursor más importante de la independencia?",
        opciones: ["José de San Martín", "Simón Bolívar", "Manuel Belgrano"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿En qué año se dio el primer grito independentista en América?",
        opciones: ["1808", "1810", "1816"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Dónde se declaró la independencia de Argentina?",
        opciones: ["Buenos Aires", "Córdoba", "Tucumán"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué título tenía San Martín cuando llegó al Perú?",
        opciones: ["General", "Protector", "Libertador"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "La Expedición Libertadora",
    descripcion: "Descubre cómo llegó la libertad al Perú desde Argentina y Chile",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia del Perú",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Desde qué país llegó San Martín al Perú?",
        opciones: ["Argentina", "Chile", "Colombia"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué puerto peruano recibió a las tropas de San Martín?",
        opciones: ["Callao", "Pisco", "Mollendo"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuál fue el primer departamento liberado?",
        opciones: ["Ica", "Arequipa", "Ayacucho"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué batalla permitió a San Martín entrar a Lima?",
        opciones: ["Junín", "Ayacucho", "Pasco"],
        respuesta_correcta: 2
      }
    ]
  },
  {
    titulo: "Simón Bolívar y la Liberación Final",
    descripcion: "Conoce la llegada de Bolívar y las batallas finales",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia del Perú",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿En qué año llegó Bolívar al Perú?",
        opciones: ["1823", "1824", "1825"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Cuál fue la primera batalla importante de Bolívar en el Perú?",
        opciones: ["Junín", "Ayacucho", "Bombón"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Dónde se libró la batalla de Ayacucho?",
        opciones: ["Cusco", "Arequipa", "Huamanga"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Quién fue el general vencedor en Ayacucho?",
        opciones: ["Antonio José de Sucre", "Simón Bolívar", "José de San Martín"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "Los Héroes Peruanos de la Independencia",
    descripcion: "Descubre a los peruanos que lucharon por la libertad",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia del Perú",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién fue el primer presidente constitucional del Perú?",
        opciones: ["José de San Martín", "José de la Mar", "Agustín Gamarra"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué título recibió Bolívar del Congreso peruano?",
        opciones: ["Dictador", "Libertador", "Emperador"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuál fue la contribución más importante de Francisco de Paula Otero?",
        opciones: ["Batalla naval", "Periodismo independentista", "Diplomacia"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué batalla naval fue decisiva para la independencia?",
        opciones: ["Angamos", "Ayacucho", "Maipú"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "La Formación de la República",
    descripcion: "Aprende sobre el nacimiento del Perú independiente",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia del Perú",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué constituyó la primera constitución peruana?",
        opciones: ["1823", "1826", "1828"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Dónde se reunió el primer Congreso Constituyente?",
        opciones: ["Lima", "Cusco", "Arequipa"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué conflicto hubo entre Bolívar y el Congreso peruano?",
        opciones: ["Impuestos", "Poder dictatorio", "Límites territoriales"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuándo renunció Bolívar a la presidencia?",
        opciones: ["1825", "1826", "1827"],
        respuesta_correcta: 2
      }
    ]
  }
];

async function createIndependenciaChallenges() {
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
        ['Profesor Independencia', 'profesor@independencia.edu', 'temporal123', 'teacher']
      );
      teacherId = tempTeacher.rows[0].id;
      console.log('Profesor temporal creado con ID:', teacherId);
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const challenge of independenciaChallenges) {
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
    console.log('✅ Todos los retos de la Independencia han sido creados exitosamente!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear los retos:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  createIndependenciaChallenges()
    .then(() => {
      console.log('Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { createIndependenciaChallenges, independenciaChallenges };