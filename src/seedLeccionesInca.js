const { pool } = require('./config/database');

const leccionesInca = [
  {
    titulo: 'Organización Política y Social del Imperio Inca',
    descripcion: 'Explora la estructura jerárquica del Tawantinsuyo',
    contenido: 'El Imperio Inca estaba organizado en forma de Tawantinsuyo ("las cuatro partes del mundo"), dividido en cuatro suyu: Chinchaysuyo, Antisuyo, Kuntisuyo y Qullasuyu. La organización social estaba basada en el ayllu, la unidad familiar y comunitaria más fundamental. El Sapa Inca era el emperador supremo, considerado hijo de Inti (el Sol). La nobleza estaba compuesta por los panacas, familias reales que mantenían su linaje puramente incá. El sistema de trabajo comunitario incluía la mita (trabajo forzado), el ayni (reciprocidad) y la minca (servicio comunal).',
    preguntas: [
      {
        pregunta: '¿Cuál era el rol principal del Sapa Inca en la sociedad inca?',
        opciones: ['Gobernante y sacerdote', 'Artesano', 'Agricultor', 'Guerrero'],
        respuesta_correcta: 0
      },
      {
        pregunta: '¿Qué unidad social formaba la base de la comunidad inca?',
        opciones: ['Panaca', 'Ayllu', 'Mitima', 'Curaca'],
        respuesta_correcta: 1
      }
    ],
    tema: 'cultura-inca'
  },
  {
    titulo: 'Sistemas de Trabajo Comunitario',
    descripcion: 'Conoce los sistemas de organización laboral del Imperio',
    contenido: 'El mita era un sistema de trabajo forzado donde los campesinos debían prestar servicio al estado una o dos veces por semana. El ayni era la reciprocidad: ayudar al vecino con la cerca de cultivo o construcción de techos a cambio de ayuda futura. La minca era trabajo comunal voluntario para actividades como la construcción de canales o caminos comunales.',
    preguntas: [
      {
        pregunta: '¿Qué sistema de trabajo era voluntario y comunal?',
        opciones: ['Mita', 'Ayni', 'Minca', 'Trabajo personal'],
        respuesta_correcta: 2
      }
    ],
    tema: 'cultura-inca'
  },
  {
    titulo: 'Ingeniería y Arquitectura Inca',
    descripcion: 'Descubre las maravillas de la ingeniería ancestral',
    contenido: 'Los incas dominaron la ingeniería y la arquitectura con técnicas como la cantería seca: piedras talladas con precisión milimétrica sin mortero. Machu Picchu muestra edificios como el Templo de la Tres Ventanas y el Templo del Sol. Sacsayhuamán destaca por sus megalitos de hasta 200 toneladas. Ollantaytambo tiene terrazas escalonadas y el templo de la altura. La red Qhapaq Ñan conectivía el imperio con más de 30,000 km de caminos. Los incas construyeron puentes colgantes con cables de yines y andenes agrícolas en terrazas de montaña.',
    preguntas: [
      {
        pregunta: '¿Cómo se llamaba la técnica de construcción con piedras sin mortero?',
        opciones: ['Cantería húmeda', 'Cantería seca', 'Técnica de adobe', 'Construcción con yeso'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Cuál sitio arqueológico tiene el Templo de las Tres Ventanas?',
        opciones: ['Sacsayhuamán', 'Ollantaytambo', 'Machu Picchu', 'Choquequiraw'],
        respuesta_correcta: 2
      }
    ],
    tema: 'cultura-inca'
  },
  {
    titulo: 'Economía Inca: El Trueque y los Quipus',
    descripcion: 'Sistemas económicos del Imperio sin moneda',
    contenido: 'La economía inca se basaba en el trueque (barter), no en moneda. El producto principal era el maíz, seguido de la llamas y textiles. Los quipus eran cuerdas anudadas que servían para registrar datos numéricos, censos, mercancías y población. Existían tres tipos: quipus de cuenta, quipus de reconciliación y quipus de narración. Los quipucamayocs (encurtidos) eran los especialistas que los manejaban.',
    preguntas: [
      {
        pregunta: '¿Qué sustituía al uso de moneda en la economía inca?',
        opciones: ['Trueque', 'Trueque y trabajo', 'Intercambio con oro', 'Sistema de crédito'],
        respuesta_correcta: 0
      },
      {
        pregunta: '¿Cuál era el producto más importante en la economía inca?',
        opciones: ['Oro', 'Maíz', 'Lana', 'Coca'],
        respuesta_correcta: 1
      }
    ],
    tema: 'cultura-inca'
  },
  {
    titulo: 'Cosmovisión y Religión Inca',
    descripcion: 'El mundo espiritual del Imperio',
    contenido: 'La cosmovisión inca incluía el culto al Sol (Inti), la Pachamama (Madre Tierra) y las huacas (elementos, objetos o lugares considerados sagrados). El Inti Raymi (Fiesta del Sol) se celebraba el 21 de diciembre en Cusco. Los willkas eran sacerdotes que administraban las ceremonias. La religión estaba íntegramente ligada al poder político, y el Sapa Inca era considerado hijo de Inti.',
    preguntas: [
      {
        pregunta: '¿A qué dios estaba dedicado el Inti Raymi?',
        opciones: ['A la luna', 'Al Sol', 'A la tierra', 'A los ancestros'],
        respuesta_correcta: 1
      },
      {
        pregunta: '¿Cómo se llamaba a los sacerdotes en la cultura inca?',
        opciones: ['Panaca', 'Ayllu', 'Willkas', 'Curacas'],
        respuesta_correcta: 2
      }
    ],
    tema: 'cultura-inca'
  }
];

async function seedLecciones() {
  try {
    for (const leccion of leccionesInca) {
      const existe = await pool.query(
        'SELECT id FROM lecciones WHERE titulo = $1 AND tema = $2',
        [leccion.titulo, leccion.tema]
      );
      
      if (existe.rows.length === 0) {
        await pool.query(
          'INSERT INTO lecciones (titulo, descripcion, contenido, preguntas, tema, created_by) VALUES ($1, $2, $3, $4, $5, $6)',
          [leccion.titulo, leccion.descripcion, leccion.contenido, JSON.stringify(leccion.preguntas), leccion.tema, null]
        );
        console.log(`✅ Lección creada: ${leccion.titulo}`);
      } else {
        console.log(`ℹ️ Lección ya existe: ${leccion.titulo}`);
      }
    }
    console.log('✅ Semilla de lecciones Inca completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

module.exports = { seedLecciones };

if (require.main === module) {
  seedLecciones()
    .then(() => {