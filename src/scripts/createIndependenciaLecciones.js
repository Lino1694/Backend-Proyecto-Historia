const { pool } = require('../config/database');

const independenciaLecciones = [
  {
    titulo: 'Don José de San Martín y el desembarco en Paracas: Una estrategia para rodear al ejército del Rey',
    descripcion: 'La campaña libertadora desde el sur',
    contenido: 'San Martín desembarcó en Paracas en 1820 con 25 menes de soldados. Su estrategia era rodear al ejército realista por el sur. Con la ayuda de Lord Cochrane y la fragata Libertad, avanzó hacia Lima.',
    preguntas: [
      {
        pregunta: '¿Dónde desembarcó San Martín?',
        opciones: ['Paracas', 'Junín', 'Ayacucho'],
        respuesta_correcta: 0
      },
      {
        pregunta: '¿Cuántos soldados embarcaron inicialmente?',
        opciones: ['150', '1500', '2500'],
        respuesta_correcta: 2
      }
    ],
    tema: 'independencia'
  },
  {
    titulo: '¡El Perú es libre e independiente!: Crónica del histórico 28 de julio de 1821 en la Plaza Mayor de Lima',
    descripcion: 'La proclamación de independencia',
    contenido: 'El 28 de julio de 1821, San Martín proclamó la independencia en la Plaza Mayor. Juró ante la bandera peruana y creó la Biblioteca Nacional. El Perú se separó del virreinato español.',
    preguntas: [
      {
        pregunta: '¿Qué institución creó el mismo día?',
        opciones: ['El Congreso', 'La Biblioteca Nacional', 'La universidad'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué bandera usó San Martín?',
        opciones: ['La argentina', 'La peruana actual', 'Una blanca'],
        respuesta_correcta: 1
      }
    ],
    tema: 'independencia'
  },
  {
    titulo: 'El Protectorado de San Martín: Las primeras leyes para el nacimiento de nuestra patria',
    descripcion: 'Las primeras instituciones del Perú independiente',
    contenido: 'San Martín estableció un protectorado con leyes progresistas. Abolió la esclavitud y promovió la educación. Sin embargo, decidió abdicar por falta de apoyo popular y llamó a Bolívar.',
    preguntas: [
      {
        pregunta: '¿Qué institución abolió San Martín?',
        opciones: ['La moneda', 'La esclavitud', 'El ejército'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué líder llamó desde el exilio?',
        opciones: ['Bolívar', 'Sucre', 'Olaya'],
        respuesta_correcta: 0
      }
    ],
    tema: 'independencia'
  },
  {
    titulo: 'Heroínas y espías secretos: Las hazañas de María Parado de Bellido y el sacrificio del pescador José Olaya',
    descripcion: 'Las figuras anónimas de la independencia',
    contenido: 'María Parado de Bellido llevó mensajes secretos a San Martín. José Olaya, pescador, ayudó al ejército patriota. Estos heroes anónimos fueron clave para la victoria.',
    preguntas: [
      {
        pregunta: '¿Qué hizo María Parado de Bellido?',
        opciones: ['Luchó en batalla', 'Llevó mensajes secretos', 'Fue profesora'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué profesión tenía José Olaya?',
        opciones: ['Médico', 'Pescador', 'Maestro'],
        respuesta_correcta: 1
      }
    ],
    tema: 'independencia'
  }
];

async function createIndependenciaLecciones() {
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
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const leccion of independenciaLecciones) {
      console.log(`Creando lección: ${leccion.titulo}`);
      await client.query(
        'INSERT INTO lecciones (titulo, descripcion, contenido, preguntas, tema, created_by) VALUES ($1, $2, $3, $4, $5, $6)',
        [leccion.titulo, leccion.descripcion, leccion.contenido, JSON.stringify(leccion.preguntas), leccion.tema, teacherId]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Todas las lecciones de Independencia han sido creadas exitosamente!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear las lecciones:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createIndependenciaLecciones, independenciaLecciones };

if (require.main === module) {
  createIndependenciaLecciones();
}