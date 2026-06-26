const { pool } = require('../config/database');

const organizacionVirreinatoChallenges = [
  {
    titulo: "Organización del Virreinato",
    descripcion: "Descubre cómo se organizó el Virreinato del Perú en el siglo XVI",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Organización del Virreinato",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Cuándo se creó el Virreinato del Perú?",
        opciones: ["1532", "1542", "1717"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Quién fundó Lima como capital del Virreinato?",
        opciones: ["Francisco Pizarro", "Diego de Almagro", "Manuel de Amat"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué sistema administrativo se creó para gobernar el Perú?",
        opciones: ["El sistema de encomiendas", "El sistema de intendencias", "El sistema de mitas"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué ciudad fue fundada como Puerta del Sol del Virreinato?",
        opciones: ["Cusco", "Lima", "Potosí"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Sociedad del Virreinato",
    descripcion: "Conoce las diferentes clases sociales del Perú colonial",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Organización del Virreinato",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quiénes eran los criollos en el Virreinato?",
        opciones: ["Españoles nacidos en España", "Peruanos nacidos en el Perú con padres españoles", "Indígenas del altiplano"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué grupo tenía más poder en la sociedad colonial?",
        opciones: ["Los mestizos", "Los españoles peninsulares", "Los indígenas"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Cómo se llamaba el trabajo forzado en minas?",
        opciones: ["Encomienda", "Mita", "Yanaconaje"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué impuestos pagaban los indígenas al virrey?",
        opciones: ["El impuesto a la tierra", "El tributo", "El impuesto de nacimiento"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Primeros Virreyes del Perú",
    descripcion: "Conoce a los primeros gobernantes del Virreinato",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Organización del Virreinato",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Quién fue el primer virrey del Perú?",
        opciones: ["Blasco Núñez Vela", "Carlos I de España", "Manuel de Amat y Junyent"],
        respuesta_correcta: 2
      },
      {
        pregunta: "¿Qué importante virrey inició la fundación de Lima?",
        opciones: ["Manuel de Amat", "José de la Serna", "Antonio de Ulloa"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿En qué año llegó el primer virrey al Perú?",
        opciones: ["1535", "1542", "1551"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué funcionario administrativo trabajó con el primer virrey?",
        opciones: ["El corregidor", "El audiencia", "El alcalde mayor"],
        respuesta_correcta: 1
      }
    ]
  },
  {
    titulo: "Economía Colonial",
    descripcion: "Descubre la economía basada en minería y agricultura",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Organización del Virreinato",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué mineral era principal en la economía colonial?",
        opciones: ["Plata", "Oro", "Cobre"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué producto representativo se exportaba al Virreinato?",
        opciones: ["Papa", "Cacao", "Algodón"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué animal ayudó en el transporte de minas?",
        opciones: ["El caballo", "El camello", "La mula"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Dónde se fundó la Basílica de los Remedios?",
        opciones: ["Cusco", "Lima", "Arequipa"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "Religión y Evangelización",
    descripcion: "Conoce el papel de la Iglesia en el Virreinato",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Organización del Virreinato",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Qué orden religiosa evangelizó primero?",
        opciones: ["Franciscanos", "Dominicos", "Jesuitas"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué construcción religiosa es emblemática de la época?",
        opciones: ["La catedral de Cusco", "La iglesia de Roma", "El templo de Ayacucho"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Qué festividad se celebraba en el Virreinato?",
        opciones: ["Inti Raymi", "La Virgen de la Candelaria", "La independencia"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué mestizo destacado ayudó en la evangelización?",
        opciones: ["Túpac Amaru", "Pablo Neruda", "César Vallejo"],
        respuesta_correcta: 0
      }
    ]
  },
  {
    titulo: "Las Mita y Trabajo Forzado",
    descripcion: "Explora el sistema laboral indígena en las minas",
    tipo: "individual",
    categoria: "Avanzando en la Historia - Organización del Virreinato",
    xp_recompensa: 16,
    fecha_fin: "2026-12-31",
    max_intentos: 3,
    preguntas: [
      {
        pregunta: "¿Para qué servía el sistema de mita?",
        opciones: ["Educación", "Trabajo forzado en minas", "Cultivo de tierras"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué mineral extraían con la mita?",
        opciones: ["Plata", "Oro", "Mercurio"],
        respuesta_correcta: 0
      },
      {
        pregunta: "¿Quién imponía la mita en los pueblos?",
        opciones: ["El curaca", "El virrey", "El obispo"],
        respuesta_correcta: 1
      },
      {
        pregunta: "¿Qué consecuencia tuvo la mita?",
        opciones: ["Beneficios para los indígenas", "Reducción de población", "Aumento de cultivos"],
        respuesta_correcta: 1
      }
    ]
  }
];

async function createOrganizacionVirreinatoChallenges() {
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
        ['Profesor Virreinal', 'profesor@virreinal.edu', 'temporal123', 'teacher']
      );
      teacherId = tempTeacher.rows[0].id;
      console.log('Profesor temporal creado con ID:', teacherId);
    } else {
      teacherId = teacherResult.rows[0].id;
    }

for (const challenge of organizacionVirreinatoChallenges) {
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
     console.log('✅ Todos los retos de Organización del Virreinato han sido creados exitosamente!');

   } catch (error) {
     await client.query('ROLLBACK');
     console.error('❌ Error al crear los retos:', error);
     throw error;
   } finally {
     client.release();
   }
 }

module.exports = { createOrganizacionVirreinatoChallenges, organizacionVirreinatoChallenges };