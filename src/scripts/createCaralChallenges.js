const { pool } = require('../config/database');

const caralChallenges = [
  {
    titulo: "Ubicación y Descubrimiento de Caral",
    descripcion: "Descubre cómo se encontró Caral y dónde está ubicada esta antigua ciudad",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Caral - La primera Ciudad",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Dónde está ubicada la ciudad de Caral?",
        opciones: ["Costa norte del Perú", "Sierra central del Perú", "Amazonía peruana"],
        respuesta_correcta: 0 // Costa norte del Perú
      },
      {
        pregunta: "¿En qué año fue descubierta oficialmente Caral?",
        opciones: ["1900", "1948", "1970"],
        respuesta_correcta: 1 // 1948
      },
      {
        pregunta: "¿Qué río pasa cerca de Caral?",
        opciones: ["Río Supe", "Río Rímac", "Río Mantaro"],
        respuesta_correcta: 0 // Río Supe
      },
      {
        pregunta: "¿Quién descubrió Caral?",
        opciones: ["Julio C. Tello", "Max Uhle", "Alfred Kroeber"],
        respuesta_correcta: 0 // Julio C. Tello
      },
      {
        pregunta: "¿Cuántos años de antigüedad tiene aproximadamente Caral?",
        opciones: ["500 años", "2600 años", "5000 años"],
        respuesta_correcta: 2 // 5000 años
      }
    ]
  },
  {
    titulo: "Arquitectura Sagrada de Caral",
    descripcion: "Explora las construcciones monumentales y sagradas de Caral",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Caral - La primera Ciudad",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuál es la construcción más grande de Caral?",
        opciones: ["La Pirámide Mayor", "El Anfiteatro", "La Huaca de los Ídolos"],
        respuesta_correcta: 0 // La Pirámide Mayor
      },
      {
        pregunta: "¿Con qué material construyeron principalmente en Caral?",
        opciones: ["Piedra tallada", "Adobe y piedra", "Madera"],
        respuesta_correcta: 1 // Adobe y piedra
      },
      {
        pregunta: "¿Cuántas pirámides principales tiene Caral?",
        opciones: ["2", "4", "6"],
        respuesta_correcta: 2 // 6
      },
      {
        pregunta: "¿Qué función tenían las plazas circulares en Caral?",
        opciones: ["Mercados", "Ceremonias religiosas", "Viviendas"],
        respuesta_correcta: 1 // Ceremonias religiosas
      },
      {
        pregunta: "¿Cómo se llaman las construcciones sagradas en forma de U en Caral?",
        opciones: ["Huacas", "Kanchas", "Pirámides"],
        respuesta_correcta: 0 // Huacas
      }
    ]
  },
  {
    titulo: "Economía y Trueque en Caral",
    descripcion: "Conoce cómo funcionaba la economía en la sociedad de Caral",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Caral - La primera Ciudad",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuál era el principal recurso económico de Caral?",
        opciones: ["Oro", "Pesca y agricultura", "Comercio con otros pueblos"],
        respuesta_correcta: 1 // Pesca y agricultura
      },
      {
        pregunta: "¿Qué productos agrícolas cultivaban en Caral?",
        opciones: ["Maíz y papa", "Zapallo, frijoles y ají", "Trigo y cebada"],
        respuesta_correcta: 1 // Zapallo, frijoles y ají
      },
      {
        pregunta: "¿Cómo se llamaba el sistema de intercambio en Caral?",
        opciones: ["Trueque", "Moneda de conchas", "Comercio a larga distancia"],
        respuesta_correcta: 0 // Trueque
      },
      {
        pregunta: "¿Qué animales marinos eran importantes para la economía de Caral?",
        opciones: ["Atún y pez espada", "Anchoas y sardinas", "Ballenas"],
        respuesta_correcta: 1 // Anchoas y sardinas
      },
      {
        pregunta: "¿Qué artesanía era común en Caral?",
        opciones: ["Cerámica", "Textiles de algodón", "Trabajo en metales"],
        respuesta_correcta: 1 // Textiles de algodón
      }
    ]
  },
  {
    titulo: "Religión y Cosmovisión de Caral",
    descripcion: "Descubre las creencias espirituales y la visión del mundo de Caral",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Caral - La primera Ciudad",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué elemento natural era sagrado en Caral?",
        opciones: ["El fuego", "El agua del río", "Las estrellas"],
        respuesta_correcta: 0 // El fuego
      },
      {
        pregunta: "¿Qué representan las huacas en la cosmovisión de Caral?",
        opciones: ["Templos para sacrificios", "Montículos sagrados", "Lugares de reunión"],
        respuesta_correcta: 1 // Montículos sagrados
      },
      {
        pregunta: "¿Cómo se llamaban las piedras sagradas en Caral?",
        opciones: ["Huacos", "Ídolos", "Totems"],
        respuesta_correcta: 0 // Huacos
      },
      {
        pregunta: "¿Qué ritual se realizaba en las plazas circulares?",
        opciones: ["Fiestas con música", "Ceremonias con flautas de hueso", "Danzas guerreras"],
        respuesta_correcta: 1 // Ceremonias con flautas de hueso
      },
      {
        pregunta: "¿Qué simbolizaba el fuego sagrado en Caral?",
        opciones: ["Poder destructivo", "Purificación y renovación", "Calentamiento de alimentos"],
        respuesta_correcta: 1 // Purificación y renovación
      }
    ]
  },
  {
    titulo: "Sociedad sin Guerra de Caral",
    descripcion: "Aprende sobre la organización pacífica de la sociedad de Caral",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Caral - La primera Ciudad",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cómo se organizaba la sociedad de Caral?",
        opciones: ["Con reyes guerreros", "Sin jefes ni ejércitos", "Con emperadores"],
        respuesta_correcta: 1 // Sin jefes ni ejércitos
      },
      {
        pregunta: "¿Qué tipo de sociedad tenían en Caral?",
        opciones: ["Militarista", "Pacífica y cooperadora", "Competitiva"],
        respuesta_correcta: 1 // Pacífica y cooperadora
      },
      {
        pregunta: "¿Cómo tomaban decisiones en Caral?",
        opciones: ["Por votación democrática", "Por consenso entre ancianos", "Por órdenes de jefes"],
        respuesta_correcta: 1 // Por consenso entre ancianos
      },
      {
        pregunta: "¿Qué no existía en Caral según las evidencias arqueológicas?",
        opciones: ["Arte", "Guerras y ejércitos", "Música"],
        respuesta_correcta: 1 // Guerras y ejércitos
      },
      {
        pregunta: "¿Cómo se distribuía el trabajo en Caral?",
        opciones: ["Por castas hereditarias", "Por cooperación voluntaria", "Por esclavitud"],
        respuesta_correcta: 1 // Por cooperación voluntaria
      }
    ]
  }
];

async function createCaralChallenges() {
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
        ['Profesor Caral', 'profesor@caral.edu', 'temporal123', 'teacher']
      );
      teacherId = tempTeacher.rows[0].id;
      console.log('Profesor temporal creado con ID:', teacherId);
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const challenge of caralChallenges) {
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
    console.log('✅ Todos los retos de Caral han sido creados exitosamente!');

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
  createCaralChallenges()
    .then(() => {
      console.log('Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { createCaralChallenges, caralChallenges };