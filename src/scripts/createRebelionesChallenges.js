const { pool } = require('../config/database');

const rebelionesChallenges = [
  {
    titulo: "La Rebelión de Túpac Amaru II",
    descripcion: "Descubre la gran rebelión liderada por Túpac Amaru II y Micaela Bastidas en 1780",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Rebeliones",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cómo se llamaba originalmente Túpac Amaru II?",
        opciones: ["José Gabriel Condorcanqui", "Francisco Pizarro", "Diego de Almagro"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Quién fue Micaela Bastidas en la rebelión?",
        opciones: ["La esposa de Túpac Amaru II", "Una monja española", "Una soldado realista"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué impuso el corregidor Antonio de Arriaga que causó la rebelión?",
        opciones: ["Nuevos impuestos altos", "Más libertad para los indígenas", "Menos trabajo en minas"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿En qué año comenzó la gran rebelión?",
        opciones: ["1776", "1780", "1821"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Las Rebeliones Andinas",
    descripcion: "Explora otros levantamientos indígenas contra el colonialismo",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Rebeliones",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué rebelión ocurrió en Ayacucho en 1814?",
        opciones: ["La rebelión de Pumacahua", "La rebelión de Túpac Amaru II", "La rebelión de los Moxos"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Quién lideró la rebelión en Puno?",
        opciones: ["Túpac Amaru II", "Micaela Bastidas", "Mateo Pumacahua"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué motivaba a los curacas rebeldes?",
        opciones: ["Más impuestos", "Defensa de sus privilegios", "Más encomiendas"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué resultado tuvo la rebelión de Pumacahua?",
        opciones: ["Independencia inmediata", "Fraccionamiento del movimiento", "Muerte del líder"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "La Rebelión de los Moxos",
    descripcion: "Conoce la resistencia indígena en las selvas bolivianas",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Rebeliones",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién fue el líder de la rebelión moxa?",
        opciones: ["Túpac Amaru II", "Francisco Tancara", "Manuel Mollón"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Por qué los moxos se rebelaron?",
        opciones: ["Menos trabajo", "Explotación laboral", "Nuevos impuestos"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué técnica usaron los moxos?",
        opciones: ["Armas de fuego", "Guerra de desgaste", "Diplomacia"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué resultado tuvo esta rebelión?",
        opciones: ["Victoria total", "Represión violenta", "Acuerdo de paz"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "La Rebelión de los Chunchos",
    descripcion: "Explora la resistencia en las selvas del Perú",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Rebeliones",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Dónde ocurrió la rebelión de los chunchos?",
        opciones: ["Cusco", "Lima", "Selva amazónica"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Cuándo estalló esta rebelión?",
        opciones: ["1780", "1781", "1782"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué exigían los chunchos?",
        opciones: ["Más evangelización", "Fin del tributo", "Libertad de culto"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cómo se contuvo esta rebelión?",
        opciones: ["Combate directo", "Enfermedades", "Diálogo"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Consecuencias de las Rebeliones",
    descripcion: "Analiza los efectos de los levantamientos indígenas",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Rebeliones",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué castigo recibió Túpac Amaru II?",
        opciones: ["Exilio", "Encarcelamiento", "Ejecución"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué reforma implementó el rey después de la rebelión?",
        opciones: ["Reformas Borbónicas", "Reformas de Isabel II", "Nada"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Cómo impactó en la sociedad criolla?",
        opciones: ["Más miedo a España", "Preparación para independencia", "Más lealtad"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué pasó con los líderes moxos?",
        opciones: ["Fueron liberados", "Fueron condenados", "Huilaron"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Micaela Bastidas y la Rebelión",
    descripcion: "Conoce a la mujer que luchó al lado de Túpac Amaru II",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Rebeliones",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué papel jugó Micaela Bastidas?",
        opciones: ["Líder espiritual", "Líder militar y estratégica", "Médica"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué hacía Micaela en Tinta?",
        opciones: ["Cosechar papas", "Organizar la rebelión", "Tejer"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué tragedia sucedió a su familia?",
        opciones: ["Muerte de su hijo en combate", "Secuestro de su esposo", "Hambre"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué legado dejó Micaela Bastidas?",
        opciones: ["Riqueza", "Inspiración para otros movimientos", "Título nobiliario"],
        respuesta_correcta: 1
      }
    ]
  }
];

async function createRebelionesChallenges() {
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
         ['Profesor Rebeliones', 'profesor@rebeliones.edu', 'temporal123', 'teacher']
       );
       teacherId = tempTeacher.rows[0].id;
       console.log('Profesor temporal creado con ID:', teacherId);
     } else {
       teacherId = teacherResult.rows[0].id;
     }

 for (const challenge of rebelionesChallenges) {
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
      console.log('✅ Todos los retos de Rebeliones han sido creados exitosamente!');

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error al crear los retos:', error);
      throw error;
    } finally {
      client.release();
    }
  }

module.exports = { createRebelionesChallenges, rebelionesChallenges };