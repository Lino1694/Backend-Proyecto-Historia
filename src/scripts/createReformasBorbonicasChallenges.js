const { pool } = require('../config/database');

const reformasBorbonicasChallenges = [
  {
    titulo: "Las Reformas Borbónicas",
    descripcion: "Explora los cambios administrativos impuestos por los reyes Borbones",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Reformas Borbónicas",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué rey impuso las Reformas Borbónicas con mayor rigor?",
        opciones: ["Felipe V", "Carlos III", "Fernando VII"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuál fue el objetivo principal de las reformas?",
        opciones: ["Dar libertad a los indígenas", "Aumentar la recaudación de impuestos", "Eliminar el sistema feudal"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué sistema administrativo reemplazó a las encomiendas?",
        opciones: ["Mita", "Intendencias", "Curatos"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cuándo se crearon las intendencias?",
        opciones: ["1717", "1750", "1800"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "Sistemas Administrativos Coloniales",
    descripcion: "Conoce los cambios en la administración española",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Reformas Borbónicas",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué cargo reemplazó al encomendero?",
        opciones: ["El corregidor", "El intendente", "El curaca"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cómo se llamaban los nuevos territorios administrativos?",
        opciones: ["Encomiendas", "Audiencias", "Corregimientos"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué función tenía el Real Consulado?",
        opciones: ["Administrar minas", "Controlar el comercio", "Evangelizar"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué aduana se creó para Lima?",
        opciones: ["La Aduana de Trujillo", "La Aduana de Lima", "La Aduana de Cusco"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "La Crisis de Legitimidad",
    descripcion: "Descubre cómo fue afectada la monarquía española",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Reformas Borbónicas",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién invadió España en 1808?",
        opciones: ["Inglaterra", "Francia", "Portugal"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué sucedió con Fernando VII?",
        opciones: ["Murió en batalla", "Fue capturado por Napoleón", "Abdicó"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué evento creó dudas sobre la legitimidad monárquica?",
        opciones: ["La Guerra de la Independencia", "La invasión de Napoleón", "La conquista"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Quién fue el rey de España bajo captura?",
        opciones: ["Carlos IV", "Fernando VII", "José Bonaparte"],
        respuesta_correcta: 2
      }
    ]
  },
  {
    titulo: "La Sociedad Criolla Organizada",
    descripcion: "Explora los grupos que buscaban cambios políticos",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Reformas Borbónicas",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué grupo de intelectuales se formó en Lima?",
        opciones: ["Los masones", "Los realistas", "Los ilustrados"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué institución educativa fue importante?",
        opciones: ["Universidad de San Marcos", "Real Convictorio de San Carlos", "Colegio San Ignacio"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué pensador escribió sobre la situación colonial?",
        opciones: ["Hipólito Unanue", "Viscardo y Guzmán", "Riva Palacio"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué ideas influyeron en la elite criolla?",
        opciones: ["Feudalismo", "Ilustración", "Nacionalismo"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Los Nuevos Impuestos",
    descripcion: "Conoce los gravámenes que generaron malestar popular",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Reformas Borbónicas",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué impuesto afectó a los indígenas?",
        opciones: ["El tobacco", "El tobacco real", "El impuesto de nacimiento"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué tributo se intensificó?",
        opciones: ["El tributo de ayllus", "El repuesto real", "El aporte mita"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué producto se cartó con más estricto control?",
        opciones: ["La papa", "El cacao", "La bebida"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué consecuencia tuvieron los nuevos impuestos?",
        opciones: ["Aumento de productividad", "Rebeliones populares", "Menor tributación"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Los Planes de Libertad",
    descripcion: "Descubre los documentos que inspiraron la independencia",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Reformas Borbónicas",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué escribieron Viscardo y otros criollos?",
        opciones: ["Un diario", "Una carta", "Un mapa"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿A quién se dirigió la Carta de 1812?",
        opciones: ["Al papa", "A los españoles peninsulares", "A los americanos"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué reclamaban en la carta?",
        opciones: ["Más impuestos", "Representación política", "Mantener la esclavitud"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué respuesta recibió?",
        opciones: ["Aprobación inmediata", "Silencio", "Represión"],
        respuesta_correcta: 1
      }
    ]
  }
];

async function createReformasBorbonicasChallenges() {
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
         ['Profesor Reformas', 'profesor@reformas.edu', 'temporal123', 'teacher']
       );
       teacherId = tempTeacher.rows[0].id;
       console.log('Profesor temporal creado con ID:', teacherId);
     } else {
       teacherId = teacherResult.rows[0].id;
     }

 for (const challenge of reformasBorbonicasChallenges) {
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
      console.log('✅ Todos los retos de Reformas Borbónicas han sido creados exitosamente!');

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error al crear los retos:', error);
      throw error;
    } finally {
      client.release();
    }
  }

module.exports = { createReformasBorbonicasChallenges, reformasBorbonicasChallenges };