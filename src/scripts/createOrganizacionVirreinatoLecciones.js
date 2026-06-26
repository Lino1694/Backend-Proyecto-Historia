const { pool } = require('../config/database');

const organizacionVirreinatoLecciones = [
  {
    titulo: 'El nacimiento de una nueva era: ¿Cómo se fundó el Virreinato del Perú y por qué se eligió a Lima como capital?',
    descripcion: 'Explora los orígenes del Virreinato y la elección de Lima como capital',
    contenido: 'El Virreinato del Perú fue creado en 1542 por el rey Carlos I de España como respuesta a la necesidad de un gobierno más eficiente. Lima fue fundada en 1535 por Francisco Pizarro y se convirtió en la capital por su ubicación estratégica: puerto natural, clima agradable y cercanía al Valle de los ríos. La elección marcó el inicio de una nueva era administrativa y cultural.',
    preguntas: [
      {
        pregunta: '¿En qué año se creó el Virreinato del Perú?',
        opciones: ['1532', '1542', '1717'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Qué característica motivó la elección de Lima como capital?',
        opciones: ['Su tamaño poblacional', 'Su ubicación estratégica como puerto', 'Su riqueza en oro'],
        respuesta_correcta: 1
      }
    ],
    tema: 'organizacion-virreinato'
  },
  {
    titulo: 'El Virrey Francisco de Toledo: El gran organizador del Imperio español en los Andes',
    descripcion: 'Conoce a este virrey reformador y su legado administrativo',
    contenido: 'Francisco de Toledo (1572-1581) fue el virrey más destacado del Perú. Creó el sistema de intendencias en 1717 como órganos administrativos descentralizados. Reorganizó la economía, redujo la encomienda y fortaleció el control colonial. Su sistema permitió una mejor recaudación de impuestos y control sobre los pueblos indígenas.',
    preguntas: [
      {
        pregunta: '¿Qué importante sistema creó Francisco de Toledo?',
        opciones: ['El sistema de encomiendas', 'El sistema de intendencias', 'El sistema de mitas'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿En qué año se crearon las intendencias?',
        opciones: ['1542', '1572', '1717'],
        respuesta_correcta: 2
      }
    ],
    tema: 'organizacion-virreinato'
  },
  {
    titulo: 'La vida en las minas de Potosí y Huancavelica: El duro trabajo de la mita',
    descripcion: 'Descubre la realidad laboral en las minas coloniales',
    contenido: 'Las minas de Potosí (Bolivia) y Huancavelica (Perú) eran los centros de producción de plata más importantes del Virreinato. La mita obligaba a los indígenas a trabajar 1-2 semanas mensuales en condiciones extremas. Los trabajadores extraían la plata usando hornos de amalgamación con mercurio, lo que causó graves problemas de salud.',
    preguntas: [
      {
        pregunta: '¿Qué mineral principal se extraía en las minas del Virreinato?',
        opciones: ['Oro', 'Plata', 'Cobre', 'Mercurio'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Cuánto tiempo debían trabajar los indígenas bajo la mita?',
        opciones: ['1-2 semanas al mes', '1 mes al año', 'Toda la vida'],
        respuesta_correcta: 0
      }
    ],
    tema: 'organizacion-virreinato'
  },
  {
    titulo: '¿Cómo estaba dividida la sociedad virreinal? Conociendo las diferencias entre españoles, criollos, indígenas y esclavos',
    descripcion: 'Explora la jerarquía social colonial',
    contenido: 'La sociedad virreinal tenía una estricta jerarquía: peninsulares (más poder), criollos (nacidos en el Perú con padres españoles), mestizos (hijo de un español y una indígena), indígenas (población nativa) y afroperuanos/esclavos. Cada grupo tenía derechos y obligaciones diferentes, con los peninsulares gobernando el poder político y económico.',
    preguntas: [
      {
        pregunta: '¿Qué grupo tenía más poder en la sociedad colonial?',
        opciones: ['Los criollos', 'Los mestizos', 'Los españoles peninsulares', 'Los indígenas'],
        respuesta_correcta: 2
      },
      {
        pregunta: '¿Quiénes eran los criollos?',
        opciones: ['Españoles nacidos en España', 'Peruanos nacidos en el Perú con padres españoles', 'Indígenas del altiplano'],
        respuesta_correcta: 1
      }
    ],
    tema: 'organizacion-virreinato'
  }
];

async function createOrganizacionVirreinatoLecciones() {
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
        ['Profesor Virreinato', 'profesor@virreinato.edu', 'temporal123', 'teacher']
      );
      teacherId = tempTeacher.rows[0].id;
    } else {
      teacherId = teacherResult.rows[0].id;
    }

    for (const leccion of organizacionVirreinatoLecciones) {
      console.log(`Creando lección: ${leccion.titulo}`);
      await client.query(
        'INSERT INTO lecciones (titulo, descripcion, contenido, preguntas, tema, created_by) VALUES ($1, $2, $3, $4, $5, $6)',
        [leccion.titulo, leccion.descripcion, leccion.contenido, JSON.stringify(leccion.preguntas), leccion.tema, teacherId]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Todas las lecciones de Organización del Virreinato han sido creadas exitosamente!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear las lecciones:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createOrganizacionVirreinatoLecciones, organizacionVirreinatoLecciones };

if (require.main === module) {
  createOrganizacionVirreinatoLecciones();
}