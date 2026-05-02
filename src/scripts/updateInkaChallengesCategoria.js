const { pool } = require('../config/database');

async function updateInkaChallengesCategoria() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Lista de títulos de retos Inca para actualizar
    const inkaTitles = [
      'Comida Inca',
      'Dioses Incas',
      'Sociedad Inca',
      'Territorio Inca',
      'Cultura Inca General'
    ];

    for (const title of inkaTitles) {
      console.log(`Actualizando categoría para reto: ${title}`);

      await client.query(
        'UPDATE retos SET categoria = $1 WHERE titulo = $2',
        ['Avanzando en la Historia - Cultura Inca', title]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Categorías de retos Inca actualizadas exitosamente!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al actualizar categorías:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ejecutar la función si se llama directamente
if (require.main === module) {
  updateInkaChallengesCategoria()
    .then(() => {
      console.log('Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { updateInkaChallengesCategoria };