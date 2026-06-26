const { pool } = require('../config/database');

const rebelionesLecciones = [
  {
    titulo: 'El grito de Tinta: La gran rebelión de Túpac Amaru II contra los abusos coloniales',
    descripcion: 'La rebelión más importante del siglo XVIII',
    contenido: 'En 1780, José Gabriel Condorcanqui (Túpac Amaru II) inició la gran rebelión en Tinta. Exigía el fin de la mita y demandas justas para los indígenas. Micaela Bastidas lo apoyó como estratega. La rebelión se extendió por Cusco y Puno.',
    preguntas: [
      {
        pregunta: '¿Cómo se llamaba originalmente Túpac Amaru II?',
        opciones: ['José Gabriel Condorcanqui', 'Diego de Almagro', 'Manuel de Amat'],
        respuesta_correcta: 0
      },
      {
        pregunta: '¿Qué demandaba principalmente?',
        opciones: ['Más impuestos', 'Fin de la mita', 'Más esclavos'],
        respuesta_correcta: 1
      }
    ],
    tema: 'rebeliones'
  },
  {
    titulo: 'Micaela Bastidas y las valientes mujeres de la sierra: Estrategas y líderes del ejército rebelde',
    descripcion: 'Las mujeres en la rebelión de Túpac Amaru',
    contenido: 'Micaela Bastidas fue clave en la organización de la rebelión. Participó en la planificación y liderazgo del ejército. Otras mujeres como María Puyruchi también jugaron papeles importantes. El sacrificio de su hijo en combate la motivó más.',
    preguntas: [
      {
        pregunta: '¿Qué rol jugó Micaela Bastidas?',
        opciones: ['Profesora', 'Estratega y líder', 'Monja'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué le sucedió a su hijo?',
        opciones: ['Se casó', 'Murió en combate', 'Se volvió español'],
        respuesta_correcta: 1
      }
    ],
    tema: 'rebeliones'
  },
  {
    titulo: 'Los precursores de la patria: Hipólito Unanue, Toribio Rodríguez de Mendoza y el poder de las ideas ocultas',
    descripcion: 'Ideas que sembraron la independencia',
    contenido: 'Hipólito Unanue, médico y pensador, escribió sobre la necesidad de reformas. Toribio Rodríguez de Mendoza promovió la educación. Sus ideas influyeron en la elite criolla que más tarde lucharía por la independencia.',
    preguntas: [
      {
        pregunta: '¿Qué profesión tenía Hipólito Unanue?',
        opciones: ['Militar', 'Médico', 'Abogado'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué aportaron estos pensadores?',
        opciones: ['Música', 'Ideas de reforma', 'Pintura'],
        respuesta_correcta: 1
      }
    ],
    tema: 'rebeliones'
  },
  {
    titulo: 'Rebeliones en provincias: El valiente Francisco de Zela en Tacna y el levantamiento de los hermanos Angulo en Cusco',
    descripcion: 'Otros movimientos rebeldes',
    contenido: 'Francisco de Zela lideró un levantamiento en Tacna en 1808. Los hermanos Angulo protestaron en Cusco contra los impuestos. Estas rebeliones locales mostraron el descontento generalizado contra el colonialismo.',
    preguntas: [
      {
        pregunta: '¿Dónde ocurrió la rebelión de Francisco de Zela?',
        opciones: ['Arequipa', 'Tacna', 'Cusco'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué motivaba a los hermanos Angulo?',
        opciones: ['Demanda de impuestos', 'Rebelión contra los impuestos', 'Paz con los españoles'],
        respuesta_correcta: 1
      }
    ],
    tema: 'rebeliones'
  }
];

async function createRebelionesLecciones() {
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
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const leccion of rebelionesLecciones) {
      console.log(`Creando lección: ${leccion.titulo}`);
      await client.query(
        'INSERT INTO lecciones (titulo, descripcion, contenido, preguntas, tema, created_by) VALUES ($1, $2, $3, $4, $5, $6)',
        [leccion.titulo, leccion.descripcion, leccion.contenido, JSON.stringify(leccion.preguntas), leccion.tema, teacherId]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Todas las lecciones de Rebeliones han sido creadas exitosamente!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear las lecciones:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createRebelionesLecciones, rebelionesLecciones };

if (require.main === module) {
  createRebelionesLecciones();
}