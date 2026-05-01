const { pool } = require('../config/database');

// Función auxiliar para calcular el nivel basado en XP
const calcularNivel = async (xpTotal) => {
  const nivelQuery = await pool.query(
    'SELECT nivel, titulo, icono FROM niveles WHERE xp_minimo <= $1 AND xp_maximo >= $1',
    [xpTotal]
  );
  
  if (nivelQuery.rows.length > 0) {
    return nivelQuery.rows[0];
  }
  
  // Si está por encima del nivel máximo, retornar el nivel más alto
  const maxNivel = await pool.query(
    'SELECT nivel, titulo, icono FROM niveles ORDER BY nivel DESC LIMIT 1'
  );
  return maxNivel.rows[0];
};

// Función auxiliar para obtener XP para próximo nivel
const obtenerXPProximoNivel = async (nivelActual) => {
  const siguienteNivel = await pool.query(
    'SELECT xp_minimo FROM niveles WHERE nivel = $1',
    [nivelActual + 1]
  );
  
  if (siguienteNivel.rows.length > 0) {
    return siguienteNivel.rows[0].xp_minimo;
  }
  
  return null; // Ya está en el nivel máximo
};

// Otorgar XP a un usuario
const otorgarXP = async (req, res) => {
  const { usuario_id, cantidad, tipo, descripcion, actividad_id } = req.body;

  try {
    // Validaciones
    if (!usuario_id || !cantidad || !tipo) {
      return res.status(400).json({
        error: 'usuario_id, cantidad y tipo son obligatorios'
      });
    }

    if (cantidad <= 0) {
      return res.status(400).json({
        error: 'La cantidad debe ser mayor a 0'
      });
    }

    const tiposValidos = ['actividad_completada', 'respuesta_correcta', 'racha_diaria', 'insignia', 'bonus_profesor', 'penalizacion'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        error: 'Tipo de XP inválido'
      });
    }

    // Validar actividad_id si se proporciona
    if (actividad_id) {
      const actividadExists = await pool.query(
        'SELECT id FROM actividades WHERE id = $1',
        [actividad_id]
      );
      if (actividadExists.rows.length === 0) {
        return res.status(400).json({
          error: 'Actividad no encontrada'
        });
      }
    }

    // Obtener XP actual del usuario
    const usuarioQuery = await pool.query(
      'SELECT xp_total, nivel FROM usuarios WHERE id = $1',
      [usuario_id]
    );

    if (usuarioQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const xpAnterior = usuarioQuery.rows[0].xp_total;
    const nivelAnterior = usuarioQuery.rows[0].nivel;
    const xpNuevo = xpAnterior + cantidad;

    // Calcular nuevo nivel
    const nuevoNivelInfo = await calcularNivel(xpNuevo);
    const subioNivel = nuevoNivelInfo.nivel > nivelAnterior;

    // Actualizar XP y nivel del usuario
    await pool.query(
      'UPDATE usuarios SET xp_total = $1, nivel = $2, ultima_actividad = CURRENT_DATE WHERE id = $3',
      [xpNuevo, nuevoNivelInfo.nivel, usuario_id]
    );

    // Registrar en historial de XP
    await pool.query(
      'INSERT INTO historial_xp (usuario_id, cantidad, tipo, descripcion, actividad_id) VALUES ($1, $2, $3, $4, $5)',
      [usuario_id, cantidad, tipo, descripcion, actividad_id]
    );

    res.json({
      message: 'XP otorgado exitosamente',
      xp_anterior: xpAnterior,
      xp_ganado: cantidad,
      xp_nuevo: xpNuevo,
      nivel_anterior: nivelAnterior,
      nivel_nuevo: nuevoNivelInfo.nivel,
      subio_nivel: subioNivel,
      titulo_nivel: nuevoNivelInfo.titulo,
      icono_nivel: nuevoNivelInfo.icono
    });

  } catch (error) {
    console.error('Error al otorgar XP:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener perfil de XP de un usuario
const obtenerPerfilXP = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener datos del usuario
    const usuario = await pool.query(
      'SELECT id, nombre, correo, role, xp_total, nivel, racha_dias, avatar_url, created_at FROM usuarios WHERE id = $1',
      [id]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userData = usuario.rows[0];

    // Obtener información del nivel actual
    const nivelInfo = await pool.query(
      'SELECT nivel, xp_minimo, xp_maximo, titulo, icono FROM niveles WHERE nivel = $1',
      [userData.nivel]
    );

    // Calcular XP para próximo nivel
    const xpProximoNivel = await obtenerXPProximoNivel(userData.nivel);
    const xpEnNivelActual = userData.xp_total - nivelInfo.rows[0].xp_minimo;
    const xpNecesarioParaNivel = xpProximoNivel ? xpProximoNivel - userData.xp_total : 0;
    const progresoNivel = xpProximoNivel ? 
      ((userData.xp_total - nivelInfo.rows[0].xp_minimo) / (xpProximoNivel - nivelInfo.rows[0].xp_minimo) * 100).toFixed(1) : 
      100;

    // Obtener insignias del usuario
    const insignias = await pool.query(`
      SELECT i.id, i.nombre, i.descripcion, i.icono, i.color, iu.obtenida_en 
      FROM insignias_usuario iu
      JOIN insignias i ON iu.insignia_id = i.id
      WHERE iu.usuario_id = $1
      ORDER BY iu.obtenida_en DESC
    `, [id]);

    // Obtener historial reciente de XP
    const historialXP = await pool.query(`
      SELECT h.cantidad, h.tipo, h.descripcion, h.created_at,
             a.titulo as actividad_titulo
      FROM historial_xp h
      LEFT JOIN actividades a ON h.actividad_id = a.id
      WHERE h.usuario_id = $1
      ORDER BY h.created_at DESC
      LIMIT 10
    `, [id]);

    // Obtener ranking del usuario en su clase
    const ranking = await pool.query(`
      SELECT COUNT(*) + 1 as posicion
      FROM usuarios
      WHERE xp_total > $1 AND role = $2
    `, [userData.xp_total, userData.role]);

    // Obtener ranking global
    const rankingGlobal = await pool.query(`
      SELECT COUNT(*) + 1 as posicion_global
      FROM usuarios
      WHERE xp_total > $1
    `, [userData.xp_total]);

    res.json({
      usuario: {
        id: userData.id,
        nombre: userData.nombre,
        correo: userData.correo,
        role: userData.role,
        avatar_url: userData.avatar_url,
        created_at: userData.created_at
      },
      xp: {
        total: userData.xp_total,
        en_nivel_actual: xpEnNivelActual,
        necesario_para_siguiente: xpNecesarioParaNivel
      },
      nivel: {
        actual: userData.nivel,
        titulo: nivelInfo.rows[0].titulo,
        icono: nivelInfo.rows[0].icono,
        xp_minimo: nivelInfo.rows[0].xp_minimo,
        xp_maximo: nivelInfo.rows[0].xp_maximo,
        progreso: parseFloat(progresoNivel)
      },
      racha_dias: userData.racha_dias,
      posicion_ranking: parseInt(ranking.rows[0].posicion),
      posicion_global: parseInt(rankingGlobal.rows[0].posicion_global),
      insignias: insignias.rows,
      historial_reciente: historialXP.rows
    });

  } catch (error) {
    console.error('Error al obtener perfil XP:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener ranking de clase
const obtenerRanking = async (req, res) => {
  const { role = 'student', limit = 10 } = req.query;

  try {
    const ranking = await pool.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.avatar_url,
        u.xp_total, 
        u.nivel,
        n.titulo as nivel_titulo,
        n.icono as nivel_icono,
        ROW_NUMBER() OVER (ORDER BY u.xp_total DESC) as posicion
      FROM usuarios u
      LEFT JOIN niveles n ON u.nivel = n.nivel
      WHERE u.role = $1
      ORDER BY u.xp_total DESC
      LIMIT $2
    `, [role, parseInt(limit)]);

    res.json(ranking.rows);

  } catch (error) {
    console.error('Error al obtener ranking:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar racha diaria
const actualizarRacha = async (req, res) => {
  const { usuario_id } = req.body;

  try {
    const usuario = await pool.query(
      'SELECT racha_dias, ultima_actividad FROM usuarios WHERE id = $1',
      [usuario_id]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const hoy = new Date().toISOString().split('T')[0];
    const ultimaActividad = usuario.rows[0].ultima_actividad;
    let nuevaRacha = usuario.rows[0].racha_dias;
    let xpGanado = 0;

    if (!ultimaActividad || ultimaActividad.toISOString().split('T')[0] !== hoy) {
      // Es un nuevo día
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);
      const ayerStr = ayer.toISOString().split('T')[0];

      if (ultimaActividad && ultimaActividad.toISOString().split('T')[0] === ayerStr) {
        // Continúa la racha
        nuevaRacha += 1;
        xpGanado = 5 + Math.floor(nuevaRacha / 5) * 5; // Bonus cada 5 días
      } else {
        // Se rompió la racha
        nuevaRacha = 1;
        xpGanado = 5;
      }

      // Actualizar racha
      await pool.query(
        'UPDATE usuarios SET racha_dias = $1, ultima_actividad = CURRENT_DATE WHERE id = $2',
        [nuevaRacha, usuario_id]
      );

      // Otorgar XP por racha
      if (xpGanado > 0) {
        const usuarioActualizado = await pool.query(
          'SELECT xp_total, nivel FROM usuarios WHERE id = $1',
          [usuario_id]
        );

        const xpNuevo = usuarioActualizado.rows[0].xp_total + xpGanado;
        const nuevoNivelInfo = await calcularNivel(xpNuevo);

        await pool.query(
          'UPDATE usuarios SET xp_total = $1, nivel = $2 WHERE id = $3',
          [xpNuevo, nuevoNivelInfo.nivel, usuario_id]
        );

        await pool.query(
          'INSERT INTO historial_xp (usuario_id, cantidad, tipo, descripcion) VALUES ($1, $2, $3, $4)',
          [usuario_id, xpGanado, 'racha_diaria', `Racha de ${nuevaRacha} días`]
        );
      }

      res.json({
        message: 'Racha actualizada',
        racha_actual: nuevaRacha,
        xp_ganado: xpGanado
      });
    } else {
      res.json({
        message: 'Ya completaste tu actividad diaria',
        racha_actual: nuevaRacha,
        xp_ganado: 0
      });
    }

  } catch (error) {
    console.error('Error al actualizar racha:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todos los niveles
const obtenerNiveles = async (req, res) => {
  try {
    const niveles = await pool.query(
      'SELECT * FROM niveles ORDER BY nivel ASC'
    );
    res.json(niveles.rows);
  } catch (error) {
    console.error('Error al obtener niveles:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  otorgarXP,
  obtenerPerfilXP,
  obtenerRanking,
  actualizarRacha,
  obtenerNiveles
};