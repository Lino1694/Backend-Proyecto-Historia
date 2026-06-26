const { pool } = require('../config/database');

const consolidacionChallenges = [
  {
    titulo: "La Batalla de Junín",
    descripcion: "Conoce la batalla que abrió el camino a la independencia",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Consolidación",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién lideró la caballería en la Batalla de Junín?",
        opciones: ["San Martín", "Sucre", "Bolívar"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuál fue el resultado de la Batalla de Junín?",
        opciones: ["Victoria realista", "Victoria patriota", "No hubo batalla"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Dónde ocurrió la Batalla de Junín?",
        opciones: ["Lima", "Junín", "Ayacucho"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué táctica usó Sucre?",
        opciones: ["Defensiva", "Ataque frontal", "Guerra de desgaste"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "La Batalla de Ayacucho",
    descripcion: "Conoce la batalla que puso fin al dominio español en el Perú",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Consolidación",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuándo fue la Batalla de Ayacucho?",
        opciones: ["28 de julio de 1821", "6 de agosto de 1824", "9 de diciembre de 1824"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué significó la Capitulación de Ayacucho?",
        opciones: ["El fin de la independencia", "La rendición total del Perú", "Un tratado de paz"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Quién lideró los realistas?",
        opciones: ["La Serna", "Flores", "Canterac"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué ocurrió el 9 de diciembre?",
        opciones: ["Batalla de Junín", "Capitulación de Ayacucho", "Proclamación de la independencia"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "El Gran Mariscal Sucre",
    descripcion: "Descubre al héroe venezolano que selló la independencia sudamericana",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Consolidación",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿De qué nación era Sucre?",
        opciones: ["Argentina", "Perú", "Venezuela"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Quién lo nombró Gran Mariscal de Ayacucho?",
        opciones: ["San Martín", "Bolívar", "El rey español"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué característica tenía Sucre como líder?",
        opciones: ["Cobarde", "Gallardo y valiente", "Miserable"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué ocurrió con el Virrey La Serna?",
        opciones: ["Lo mató en combate", "Lo venció en Ayacucho", "Lo exilió"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "La Conscripción en la Independencia",
    descripcion: "Conoce cómo se reclutaba el ejército independentista",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Consolidación",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué edad debía tener los reclutados?",
        opciones: ["16-30 años", "18-25 años", "20-35 años"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué ocurría si no se alistaba?",
        opciones: ["Multa", "Encarcelamiento", "Nada"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué motivación tenía los soldados?",
        opciones: ["Dinero", "Patriotismo", "Miedo"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué diferencia había con el ejército colonial?",
        opciones: ["Más presos", "Más profesionales", "Mejor armamento"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Consolidación Política del Perú",
    descripcion: "Explora cómo se organizó el nuevo Estado peruano",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Consolidación",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién fue el primer presidente de Perú?",
        opciones: ["San Martín", "Bolívar", "La Serna"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué creó el Congreso de 1822?",
        opciones: ["La Constitución", "El ejército", "Las aduanas"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué importancia tuvo Ayacucho para Perú?",
        opciones: ["Fin de la guerra", "Inicio de la república", "Ninguna"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué ocurrió con los virreyes?",
        opciones: ["Regresaron a España", "Se quedaron", "Fueron juzgados"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "La Batalla de Pichincha",
    descripcion: "Conoce la batalla que ayudó a la independencia del Perú",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Consolidación",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Dónde ocurrió la Batalla de Pichincha?",
        opciones: ["Quito", "Guayaquil", "Lima"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Quién lideró en Pichincha?",
        opciones: ["Sucre", "Bolívar", "San Martín"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué importancia tuvo para el Perú?",
        opciones: ["Ninguna", "Abrió camino a Ayacucho", "Derrota total"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuándo fue esta batalla?",
        opciones: ["1821", "1822", "1824"],
        respuesta_correcta: 1
      }
    ]
  }
];

async function createConsolidacionChallenges() {
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
         ['Profesor Consolidación', 'profesor@consolidacion.edu', 'temporal123', 'teacher']
       );
       teacherId = tempTeacher.rows[0].id;
       console.log('Profesor temporal creado con ID:', teacherId);
     } else {
       teacherId = teacherResult.rows[0].id;
     }

 for (const challenge of consolidacionChallenges) {
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
      console.log('✅ Todos los retos de Consolidación han sido creados exitosamente!');

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error al crear los retos:', error);
      throw error;
    } finally {
      client.release();
    }
  }

module.exports = { createConsolidacionChallenges, consolidacionChallenges };