const { pool } = require('../config/database');

const consolidacionLecciones = [
  {
    titulo: 'La última esperanza patriota: La llegada de Simón Bolívar y el norte organizado',
    descripcion: 'La llegada de Bolívar al Perú',
    contenido: 'Bolívar llegó al Perú en 1823 para ayudar a la causa independentista. Organizó el ejército del norte con ayuda de Sucre. Su objetivo era derrotar los realistas definitivamente.',
    preguntas: [
      {
        pregunta: '¿Qué general llegó en 1823?',
        opciones: ['Sucre', 'Bolívar', 'San Martín'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Cuál era el objetivo de Bolívar?',
        opciones: ['Volver a España', 'Derrotar a los realistas', 'Paz inmediata'],
        respuesta_correcta: 1
      }
    ],
    tema: 'consolidacion'
  },
  {
    titulo: 'La Batalla de Junín: El glorioso y rápido choque de caballerías que devolvió la fe al Perú',
    descripcion: 'La batalla decisiva del 6 de agosto de 1824',
    contenido: 'El 6 de agosto de 1824, Antonio José de Sucre lideró la caballería en Junín. La batalla duró solo minutos y resultó en victoria patriota. Esto abrió el camino a Ayacucho.',
    preguntas: [
      {
        pregunta: '¿Quién lideró la caballería en Junín?',
        opciones: ['San Martín', 'Bolívar', 'Sucre'],
        respuesta_correcta: 2
      },
      {
        pregunta: '¿Qué resultado tuvo la batalla?',
        opciones: ['Derrota realista', 'Victoria patriota', 'Empate'],
        respuesta_correcta: 1
      }
    ],
    tema: 'consolidacion'
  },
  {
    titulo: 'La Batalla de Ayacucho: El Mariscal Sucre y la pampa histórica donde se decidió el futuro de América',
    descripcion: 'La batalla final de la independencia',
    contenido: 'El 9 de diciembre de 1824, Sucre derrotó al ejército realista en Ayacucho. La capitulación significó el fin del dominio español. Esta batalla selló la independencia de toda América.',
    preguntas: [
      {
        pregunta: '¿Cuándo fue la Batalla de Ayacucho?',
        opciones: ['6 de agosto de 1824', '9 de diciembre de 1824', '28 de julio de 1821'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué significó este combate?',
        opciones: ['Inicio de la independencia', 'Fin del dominio español', 'Capitulación temprana'],
        respuesta_correcta: 1
      }
    ],
    tema: 'consolidacion'
  },
  {
    titulo: 'La Capitulación de Ayacucho: El documento que selló la paz y expulsó definitivamente al poder español',
    descripcion: 'El fin de la guerra de independencia',
    contenido: 'El 9 de diciembre, el Virrey La Serna firmó la capitulación. El ejército se disolvió y los peninsular españoles se exiliaron. El Perú se convirtió en una república.',
    preguntas: [
      {
        pregunta: '¿Qué ocurrió el 9 de diciembre?',
        opciones: ['Batalla de Junín', 'Capitulación de Ayacucho', 'Proclamación de independencia'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué pasó con los peninsulares?',
        opciones: ['Tuvieron poder', 'Se exiliaron', 'Se quedaron'],
        respuesta_correcta: 1
      }
    ],
    tema: 'consolidacion'
  }
];

async function createConsolidacionLecciones() {
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
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const leccion of consolidacionLecciones) {
      console.log(`Creando lección: ${leccion.titulo}`);
      await client.query(
        'INSERT INTO lecciones (titulo, descripcion, contenido, preguntas, tema, created_by) VALUES ($1, $2, $3, $4, $5, $6)',
        [leccion.titulo, leccion.descripcion, leccion.contenido, JSON.stringify(leccion.preguntas), leccion.tema, teacherId]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Todas las lecciones de Consolidación han sido creadas exitosamente!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear las lecciones:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createConsolidacionLecciones, consolidacionLecciones };

if (require.main === module) {
  createConsolidacionLecciones();
}