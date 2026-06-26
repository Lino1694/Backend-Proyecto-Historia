const { pool } = require('../config/database');

const independenciaChallenges = [
  {
    titulo: "La Expedición Libertadora del Sur",
    descripcion: "Descubre cómo José de San Martín liberó al Perú del yugo español",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Dónde desembarcó San Martín en el Perú?",
        opciones: ["Paracas", "Junín", "Ayacucho"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué bandera creó San Martín?",
        opciones: ["La bandera roja y blanca", "La bandera peruana actual", "Ninguna, usó la argentina"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Quién era Lord Cochrane para San Martín?",
        opciones: ["Un almirante británico", "Un general español", "Un político"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿En qué fecha se proclamó la independencia del Perú?",
        opciones: ["28 de julio de 1821", "9 de diciembre de 1824", "6 de agosto de 1824"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "Héroes Anónimos de la Independencia",
    descripcion: "Conoce a las personas que ayudaron a San Martín sin ser líderes conocidos",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién ayudó a San Martín llevando mensajes secretos?",
        opciones: ["José Olaya", "María Parado de Bellido", "Un fraile"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué hizo María Parado de Bellido?",
        opciones: ["Le puso fuego a un depósito real", "Llevó mensajes al ejército patriota", "Escribió el himno"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué institución creó San Martín en el Perú?",
        opciones: ["La policía", "La Biblioteca Nacional", "El ejército"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuál era el rol de los ciudadanos civiles?",
        opciones: ["Combatir con armas", "Ayudar con información y recursos", "Gobernar", "Nada"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "La Batalla de San Mateo",
    descripcion: "Conoce la primera victoria militar de la independencia peruana",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Dónde ocurrió la Batalla de San Mateo?",
        opciones: ["Lima", "Pisco", "Arequipa"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Quién lideró en San Mateo?",
        opciones: ["San Martín", "Sucre", "Cochrane"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué importancia tuvo este combate?",
        opciones: ["Fue la última batalla", "Abrió el camino a Lima", "Derrota total"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué unidad destacó en San Mateo?",
        opciones: ["Los chilenos", "Los argentinos", "Los peruanos"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "La Entrada Triunfal a Lima",
    descripcion: "Explora el proceso de liberación de la ciudad capital",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué fecha se considera la entrada triunfal?",
        opciones: ["28 de julio de 1821", "1824", "1825"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué juramento hizo San Martín?",
        opciones: ["Juramento a la bandera", "Juramento a la libertad", "Juramento a España"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué institución creó el mismo día?",
        opciones: ["El Congreso", "La Biblioteca Nacional", "La Universidad"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué medida adoptó por la falta de apoyo?",
        opciones: ["Salío del Perú", "Abdicó", "Invitó a Bolívar"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Preparativos del Desembarco",
    descripcion: "Conoce los planes secretos antes de la campaña libertadora",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Dónde se planeó el desembarco?",
        opciones: ["Buenos Aires", "Lima", "Arica"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Cuántos soldados embarcaron inicialmente?",
        opciones: ["1000", "2500", "500"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué embarcación importante se usó?",
        opciones: ["La fragata Libertad", "El cañón", "El hércules"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué aliado internacional ayudó?",
        opciones: ["Chile", "Perú", "Bolivia"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "La Batalla de Junín",
    descripcion: "Conoce la batalla que selló la independencia peruana",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Independencia",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién lideró la caballería en Junín?",
        opciones: ["San Martín", "Sucre", "Bolívar"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué táctica usó Sucre?",
        opciones: ["Defensiva", "Ataque frontal", "Guerra de desgaste"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué resultado tuvo Junín?",
        opciones: ["Derrota realista", "Victoria patriota", "Sin efecto"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué importancia tuvo este combate?",
        opciones: ["Fue la primera batalla", "Abrió el camino al Alto Perú", "Casi no importó"],
        respuesta_correcta: 1
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
      console.log('✅ Todos los retos de Independencia han sido creados exitosamente!');

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error al crear los retos:', error);
      throw error;
    } finally {
      client.release();
    }
  }

module.exports = { createIndependenciaChallenges, independenciaChallenges };