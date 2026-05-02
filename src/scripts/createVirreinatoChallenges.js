const { pool } = require('../config/database');

const virreinatoChallenges = [
  {
    titulo: "Fundación del Virreinato",
    descripcion: "Conoce cómo se fundó el Virreinato del Perú y su organización inicial",
    tipo: "individual",
    categoria: "Avanzando en la Historia - El Virreinato en el Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién fue el primer virrey del Perú?",
        opciones: ["Francisco Pizarro", "Blasco Núñez Vela", "Diego de Almagro"],
        respuesta_correcta: 1 // Blasco Núñez Vela
      },
      {
        pregunta: "¿En qué año se creó el Virreinato del Perú?",
        opciones: ["1532", "1542", "1550"],
        respuesta_correcta: 1 // 1542
      },
      {
        pregunta: "¿Qué documento oficial creó el Virreinato?",
        opciones: ["La capitulación", "La real cédula", "Las leyes nuevas"],
        respuesta_correcta: 1 // La real cédula
      },
      {
        pregunta: "¿Cuál fue la capital inicial del Virreinato?",
        opciones: ["Cusco", "Lima", "Quito"],
        respuesta_correcta: 1 // Lima
      },
      {
        pregunta: "¿Qué territorio incluía inicialmente el Virreinato?",
        opciones: ["Solo Perú", "Perú, Chile y parte de Argentina", "Todo Sudamérica española"],
        respuesta_correcta: 1 // Perú, Chile y parte de Argentina
      }
    ]
  },
  {
    titulo: "El Sistema de Repartos y Mitas",
    descripcion: "Aprende sobre el sistema laboral y económico del Virreinato",
    tipo: "individual",
    categoria: "Avanzando en la Historia - El Virreinato en el Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué era la mita minera?",
        opciones: ["Un impuesto en plata", "Trabajo forzado en minas", "Un mercado de minerales"],
        respuesta_correcta: 1 // Trabajo forzado en minas
      },
      {
        pregunta: "¿Dónde se implementó principalmente la mita?",
        opciones: ["Cusco", "Potosí", "Lima"],
        respuesta_correcta: 1 // Potosí
      },
      {
        pregunta: "¿Qué eran los obrajes?",
        opciones: ["Talleres textiles", "Minas de plata", "Tierras agrícolas"],
        respuesta_correcta: 0 // Talleres textiles
      },
      {
        pregunta: "¿Qué impuesto pagaban los indígenas?",
        opciones: ["La alcabala", "El tributo", "La aduana"],
        respuesta_correcta: 1 // El tributo
      },
      {
        pregunta: "¿Cómo se llamaba el sistema de distribución de mercancías?",
        opciones: ["La encomienda", "Los repartos", "El corregimiento"],
        respuesta_correcta: 1 // Los repartos
      }
    ]
  },
  {
    titulo: "La Iglesia y la Evangelización",
    descripcion: "Descubre el rol de la Iglesia Católica en el Virreinato",
    tipo: "individual",
    categoria: "Avanzando en la Historia - El Virreinato en el Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Dónde se celebraron los primeros concilios limenses?",
        opciones: ["Cusco", "Lima", "Arequipa"],
        respuesta_correcta: 1 // Lima
      },
      {
        pregunta: "¿Quién fue Santo Toribio de Mogrovejo?",
        opciones: ["Un conquistador", "Arzobispo de Lima", "Un virrey"],
        respuesta_correcta: 1 // Arzobispo de Lima
      },
      {
        pregunta: "¿Cuál santa limeña es patrona de las Américas?",
        opciones: ["Santa Rosa de Lima", "Santa Teresa de Ávila", "Santa Clara de Asís"],
        respuesta_correcta: 0 // Santa Rosa de Lima
      },
      {
        pregunta: "¿Qué significaba 'extirpación de idolatrías'?",
        opciones: ["Destruir templos", "Convertir indígenas al catolicismo", "Buscar ídolos escondidos"],
        respuesta_correcta: 1 // Convertir indígenas al catolicismo
      },
      {
        pregunta: "¿Qué institución educaba a los indígenas?",
        opciones: ["Las universidades", "Las reducciones jesuitas", "Los conventos"],
        respuesta_correcta: 1 // Las reducciones jesuitas
      }
    ]
  },
  {
    titulo: "El Auge del Virreinato Tardío",
    descripcion: "Conoce las reformas y conflictos del último período virreinal",
    tipo: "individual",
    categoria: "Avanzando en la Historia - El Virreinato en el Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué dinastía realizó las reformas borbónicas?",
        opciones: ["Los Austrias", "Los Borbones", "Los Capetos"],
        respuesta_correcta: 1 // Los Borbones
      },
      {
        pregunta: "¿Quién lideró la rebelión de Túpac Amaru II?",
        opciones: ["Túpac Amaru I", "José Gabriel Condorcanqui", "Diego Cristóbal"],
        respuesta_correcta: 1 // José Gabriel Condorcanqui
      },
      {
        pregunta: "¿Cuándo ocurrió la rebelión de Túpac Amaru II?",
        opciones: ["1780-1782", "1800-1802", "1820-1822"],
        respuesta_correcta: 0 // 1780-1782
      },
      {
        pregunta: "¿Qué nuevo virreinato se creó en 1776?",
        opciones: ["Virreinato de Nueva Granada", "Virreinato del Río de la Plata", "Virreinato de Nueva España"],
        respuesta_correcta: 1 // Virreinato del Río de la Plata
      },
      {
        pregunta: "¿Cuál fue la capital administrativa del Virreinato del Río de la Plata?",
        opciones: ["Buenos Aires", "Lima", "Santiago"],
        respuesta_correcta: 0 // Buenos Aires
      }
    ]
  },
  {
    titulo: "El Fin del Virreinato",
    descripcion: "Aprende sobre la transición del Virreinato a la República",
    tipo: "individual",
    categoria: "Avanzando en la Historia - El Virreinato en el Perú",
    xp_recompensa: 20,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién declaró la independencia del Perú?",
        opciones: ["Simón Bolívar", "José de San Martín", "José de la Mar"],
        respuesta_correcta: 1 // José de San Martín
      },
      {
        pregunta: "¿En qué año se declaró la independencia?",
        opciones: ["1810", "1821", "1830"],
        respuesta_correcta: 1 // 1821
      },
      {
        pregunta: "¿Dónde se declaró la independencia?",
        opciones: ["Cusco", "Lima", "Ayacucho"],
        respuesta_correcta: 1 // Lima
      },
      {
        pregunta: "¿Cuál fue la batalla final que acabó con el Virreinato?",
        opciones: ["Batalla de Chacabuco", "Batalla de Maipú", "Batalla de Ayacucho"],
        respuesta_correcta: 2 // Batalla de Ayacucho
      },
      {
        pregunta: "¿En qué año terminó definitivamente el Virreinato?",
        opciones: ["1821", "1824", "1826"],
        respuesta_correcta: 1 // 1824
      }
    ]
  }
];

async function createVirreinatoChallenges() {
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
        ['Profesor Virreinato', 'profesor@virreinato.edu', 'temporal123', 'teacher']
      );
      teacherId = tempTeacher.rows[0].id;
      console.log('Profesor temporal creado con ID:', teacherId);
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const challenge of virreinatoChallenges) {
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
    console.log('✅ Todos los retos del Virreinato han sido creados exitosamente!');

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
  createVirreinatoChallenges()
    .then(() => {
      console.log('Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { createVirreinatoChallenges, virreinatoChallenges };