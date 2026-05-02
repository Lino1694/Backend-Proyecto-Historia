const { pool } = require('../config/database');

// Función simple para probar el endpoint de categorías
async function testCategoriasEndpoint() {
  try {
    console.log('=== PRUEBA DEL ENDPOINT DE CATEGORÍAS ===');

    // Simular la lógica del getRetosPorCategoria
    const retos = await pool.query(`
      SELECT
        r.id,
        r.titulo,
        r.descripcion,
        r.tipo,
        r.categoria,
        r.xp_recompensa,
        COUNT(rp.usuario_id) as participantes,
        CASE WHEN r.fecha_fin >= CURRENT_DATE THEN 'active' ELSE 'completed' END as estado,
        r.fecha_fin,
        r.created_by as creador_id,
        r.created_at
      FROM retos r
      LEFT JOIN reto_participantes rp ON r.id = rp.reto_id
      GROUP BY r.id
      ORDER BY r.categoria, r.created_at DESC
    `);

    console.log(`Total de retos encontrados: ${retos.rows.length}`);

    // Organizar por categorías
    const categorias = {
      "Avanzando en la Historia": {
        "Cultura Inca": [],
        "Caral - La primera Ciudad": [],
        "El Virreinato en el Perú": [],
        "La Independencia": [],
        "La Conquista de Perú": [],
        "Retos Personalizados": []
      }
    };

    retos.rows.forEach(reto => {
      console.log(`- ID: ${reto.id}, Título: ${reto.titulo}, Categoría: ${reto.categoria}`);
      const categoria = reto.categoria;
      if (categoria && categoria.startsWith("Avanzando en la Historia")) {
        const subcategoria = categoria.replace("Avanzando en la Historia - ", "");
        if (categorias["Avanzando en la Historia"][subcategoria]) {
          categorias["Avanzando en la Historia"][subcategoria].push(reto);
        } else {
          // Si no existe la subcategoría, agregarla
          categorias["Avanzando en la Historia"][subcategoria] = [reto];
        }
      } else {
        // Retos sin categoría o de otras categorías
        if (!categorias["Otros"]) {
          categorias["Otros"] = [];
        }
        categorias["Otros"].push(reto);
      }
    });

    console.log('\n=== ESTRUCTURA DE CATEGORÍAS ===');
    console.log(JSON.stringify(categorias, null, 2));

    // Verificar que los retos Inca estén en la categoría correcta
    const culturaInca = categorias["Avanzando en la Historia"]["Cultura Inca"];
    console.log(`\nRetos en 'Cultura Inca': ${culturaInca.length}`);
    culturaInca.forEach(reto => {
      console.log(`  - ${reto.titulo}`);
    });

  } catch (error) {
    console.error('Error en la prueba:', error);
  } finally {
    pool.end();
  }
}

if (require.main === module) {
  testCategoriasEndpoint();
}