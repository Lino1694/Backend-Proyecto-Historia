const { pool } = require('../config/database');

const reformasBorbonicasLecciones = [
  {
    titulo: 'Reyes nuevos, reglas nuevas: ¿Quiénes fueron los Borbones y por qué cambiaron todo en el Perú?',
    descripcion: 'Explora la llegada de los Borbones al trono español',
    contenido: 'Los Borbones llegaron al trono español en 1700 con Felipe V. Buscaron centralizar el poder y aumentar la recaudación. En el Perú, las reformas impactaron profundamente al sistema colonial, cambiando la administración, los impuestos y el comercio.',
    preguntas: [
      {
        pregunta: '¿En qué año llegaron los Borbones al trono español?',
        opciones: ['1542', '1700', '1808'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué buscaban los Borbones principalmente?',
        opciones: ['Menos impuestos', 'Centralizar el poder y recaudar más', 'Más libertad para los indígenas'],
        respuesta_correcta: 1
      }
    ],
    tema: 'reformas-borbonicas'
  },
  {
    titulo: 'El nuevo mapa de Sudamérica: Cómo el Virreinato del Perú perdió territorio y nacen las Intendencias',
    descripcion: 'Cambios territoriales y administrativos borbónicos',
    contenido: 'Los Borbones crearon el Virrey de la Nueva Granada en 1717, separando buen parte del territorio. Las intendencias surgieron como órganos administrativos descentralizados para gobernar mejor. Esto redujo el poder del virrey y aumentó la burocracia.',
    preguntas: [
      {
        pregunta: '¿En qué año se creó el Virrey de la Nueva Granada?',
        opciones: ['1700', '1717', '1808'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Cuál era el objetivo de las intendencias?',
        opciones: ['Aumentar el poder del virrey', 'Gobernar de manera descentralizada', 'Eliminar las lecciones'],
        respuesta_correcta: 1
      }
    ],
    tema: 'reformas-borbonicas'
  },
  {
    titulo: 'Más impuestos y menos libertad comercial: El descontento económico de los comerciantes criollos',
    descripcion: 'Conflictos económicos borbónicos',
    contenido: 'Los nuevos impuestos como el tobacco real y el repuesto afectaron a todos. Las restricciones al comercio con limitado a una sola empresa. Los criollos se rebelaron por la falta de representación política.',
    preguntas: [
      {
        pregunta: '¿Qué impuesto afectó especialmente a los indígenas?',
        opciones: ['El tobacco', 'El tobacco real', 'El tributo'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué empresa tenía el monopolio del comercio?',
        opciones: ['La Real Compañía de Filipinas', 'La Casa de Contratación', 'La Real Audiencia'],
        respuesta_correcta: 1
      }
    ],
    tema: 'reformas-borbonicas'
  },
  {
    titulo: 'La expulsión de los jesuitas: El día que la corona española botó a los maestros más queridos del virreinato',
    descripcion: 'El destierro de los jesuitas en 1767',
    contenido: 'Los jesuitas fueron expulsos en 1767 por orden del rey Carlos III. Tenían gran influencia y riquezes. Su salida generó malestar entre la población educada y dejó vacíos en la educación colonial.',
    preguntas: [
      {
        pregunta: '¿Qué rey ordenó la expulsión de los jesuitas?',
        opciones: ['Felipe V', 'Carlos III', 'Fernando VII'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Por qué razón se expulsaron?',
        opciones: ['No enseñaban religión', 'Tenían mucho poder e influencia', 'No querían enseñar'],
        respuesta_correcta: 1
      }
    ],
    tema: 'reformas-borbonicas'
  }
];

async function createReformasBorbonicasLecciones() {
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
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const leccion of reformasBorbonicasLecciones) {
      console.log(`Creando lección: ${leccion.titulo}`);
      await client.query(
        'INSERT INTO lecciones (titulo, descripcion, contenido, preguntas, tema, created_by) VALUES ($1, $2, $3, $4, $5, $6)',
        [leccion.titulo, leccion.descripcion, leccion.contenido, JSON.stringify(leccion.preguntas), leccion.tema, teacherId]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Todas las lecciones de Reformas Borbónicas han sido creadas exitosamente!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear las lecciones:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createReformasBorbonicasLecciones, reformasBorbonicasLecciones };

if (require.main === module) {
  createReformasBorbonicasLecciones();
}