const { pool } = require('../config/database');

// Crear un nuevo reto
const crearReto = async (req, res) => {
  const { titulo, descripcion, tipo, categoria, xp_recompensa, dificultad, fecha_fin, preguntas, max_intentos, clase_id } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  console.log('=== CREANDO RETO ===');
  console.log('Datos recibidos:', { titulo, tipo, xp_recompensa, fecha_fin, userId, userRole });
  console.log('Número de preguntas:', preguntas?.length);

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden crear retos'
      });
    }
    // Validar campos obligatorios
    if (!titulo || !tipo || !xp_recompensa || !fecha_fin || !preguntas || !Array.isArray(preguntas)) {
      return res.status(400).json({
        error: 'Campos obligatorios faltantes: titulo, tipo, xp_recompensa, fecha_fin, preguntas (array)'
      });
    }

    // Validar tipo
    if (!['individual', 'competition'].includes(tipo)) {
      return res.status(400).json({
        error: 'Tipo inválido. Debe ser "individual" o "competition"'
      });
    }

    // Validar xp_recompensa
    if (typeof xp_recompensa !== 'number' || xp_recompensa <= 0) {
      return res.status(400).json({
        error: 'xp_recompensa debe ser un número positivo'
      });
    }

    // Validar fecha_fin (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_fin)) {
      return res.status(400).json({
        error: 'fecha_fin debe tener formato YYYY-MM-DD'
      });
    }

    const fechaObj = new Date(fecha_fin + 'T00:00:00');
    if (isNaN(fechaObj.getTime())) {
      return res.status(400).json({
        error: 'fecha_fin no es una fecha válida'
      });
    }

    console.log('Fecha validada:', fecha_fin, 'Objeto Date:', fechaObj);

    // Validar preguntas
    if (preguntas.length === 0) {
      return res.status(400).json({
        error: 'Debe incluir al menos una pregunta'
      });
    }

    for (let i = 0; i < preguntas.length; i++) {
      const p = preguntas[i];
      const tipo = p.tipo || 'multiple_choice';

      if (!p.pregunta) {
        return res.status(400).json({
          error: `Pregunta ${i + 1}: falta el campo pregunta`
        });
      }

      if (tipo === 'multiple_choice') {
        if (!Array.isArray(p.opciones) || typeof p.respuesta_correcta !== 'number') {
          return res.status(400).json({
            error: `Pregunta ${i + 1}: para multiple_choice, opciones debe ser array y respuesta_correcta number`
          });
        }
        if (p.opciones.length === 0) {
          return res.status(400).json({
            error: `Pregunta ${i + 1}: opciones no puede estar vacío`
          });
        }
        if (p.respuesta_correcta < 0 || p.respuesta_correcta >= p.opciones.length) {
          return res.status(400).json({
            error: `Pregunta ${i + 1}: respuesta_correcta debe ser un índice válido en opciones`
          });
        }
      } else if (tipo === 'fill_blank') {
        if (!Array.isArray(p.opciones) || p.opciones.length !== 1 || typeof p.respuesta_correcta !== 'string') {
          return res.status(400).json({
            error: `Pregunta ${i + 1}: para fill_blank, opciones debe tener 1 elemento y respuesta_correcta string`
          });
        }
      } else if (tipo === 'drag_drop') {
        if (!p.elementos_arrastrables || !Array.isArray(p.elementos_arrastrables) || !p.zonas_destino || !Array.isArray(p.zonas_destino)) {
          return res.status(400).json({
            error: `Pregunta ${i + 1}: para drag_drop, se requieren elementos_arrastrables y zonas_destino como arrays`
          });
        }
        if (p.elementos_arrastrables.length === 0 || p.zonas_destino.length === 0) {
          return res.status(400).json({
            error: `Pregunta ${i + 1}: elementos_arrastrables y zonas_destino no pueden estar vacíos`
          });
        }
        // Validar que cada zona tenga elemento_correcto_id
        for (const zona of p.zonas_destino) {
          if (!zona.elemento_correcto_id) {
            return res.status(400).json({
              error: `Pregunta ${i + 1}: cada zona_destino debe tener elemento_correcto_id`
            });
          }
        }
      } else {
        return res.status(400).json({
          error: `Pregunta ${i + 1}: tipo '${tipo}' no soportado`
        });
      }
    }

    // Iniciar transacción
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insertar reto
      console.log('Insertando reto en BD:', { titulo, categoria, fecha_fin, xp_recompensa, clase_id });
      const retoResult = await client.query(
        'INSERT INTO retos (titulo, descripcion, tipo, categoria, xp_recompensa, dificultad, fecha_fin, max_intentos, created_by, clase_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
        [titulo, descripcion || null, tipo, categoria || null, xp_recompensa, dificultad || 'Intermedio', fecha_fin, max_intentos || null, userId, clase_id || null]
      );
      const retoId = retoResult.rows[0].id;
      console.log('Reto creado con ID:', retoId);

      // Insertar preguntas
      for (const p of preguntas) {
        const tipo = p.tipo || 'multiple_choice';
        let tipoPregunta = tipo;
        let opciones = null;
        let respuestaCorrecta = null;

        if (tipo === 'multiple_choice') {
          opciones = p.opciones;
          respuestaCorrecta = p.respuesta_correcta.toString();
        } else if (tipo === 'fill_blank') {
          opciones = p.opciones;
          respuestaCorrecta = p.respuesta_correcta;
        } else if (tipo === 'drag_drop') {
          // Para drag_drop, guardar toda la estructura en opciones
          opciones = {
            elementos_arrastrables: p.elementos_arrastrables,
            zonas_destino: p.zonas_destino
          };
          // El mapping correcto se puede reconstruir de zonas_destino
          respuestaCorrecta = '';
        }

        await client.query(
          'INSERT INTO preguntas_reto (reto_id, pregunta, opciones, respuesta_correcta, tipo_pregunta) VALUES ($1, $2, $3, $4, $5)',
          [retoId, p.pregunta, JSON.stringify(opciones), respuestaCorrecta, tipoPregunta]
        );
      }

      await client.query('COMMIT');



      res.status(201).json({
        id: retoId,
        message: 'Reto creado exitosamente'
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al crear reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener retos organizados por categorías
const getRetosPorCategoria = async (req, res) => {
  try {
    console.log('=== OBTENIENDO RETOS POR CATEGORÍA ===');

    const userId = req.user?.id;

    // Obtener todos los retos (sin filtrado por clase para ahora)
    const retosQuery = `
        SELECT
          r.id,
          r.titulo,
          r.descripcion,
          r.tipo,
          r.categoria,
          r.xp_recompensa,
          r.dificultad,
          COUNT(rp.usuario_id) as participantes,
          CASE WHEN r.fecha_fin >= CURRENT_DATE THEN 'active' ELSE 'completed' END as estado,
          r.fecha_fin,
          r.created_by as creador_id,
          r.created_at
        FROM retos r
        LEFT JOIN reto_participantes rp ON r.id = rp.reto_id
        GROUP BY r.id
        ORDER BY r.categoria, r.created_at DESC
      `;

    const retos = await pool.query(retosQuery);

    // Organizar por categorías (5 etapas cronológicas)
    const categorias = {
      "Avanzando en la Historia": {
        "Organización del Virreinato": [],
        "Reformas Borbónicas": [],
        "Rebeliones": [],
        "Independencia": [],
        "Consolidación": []
      },
      "Otros": []
    };

retos.rows.forEach(reto => {
       const categoria = reto.categoria;
       const retoConDificultad = {
         ...reto,
         dificultad: reto.dificultad || 'Intermedio'
       };
       if (categoria && categoria.startsWith("Avanzando en la Historia")) {
         const subcategoria = categoria.replace("Avanzando en la Historia - ", "");
         if (categorias["Avanzando en la Historia"][subcategoria]) {
           categorias["Avanzando en la Historia"][subcategoria].push(retoConDificultad);
         } else {
           categorias["Avanzando en la Historia"][subcategoria] = [retoConDificultad];
         }
       } else {
         categorias["Otros"].push(retoConDificultad);
       }
     });

    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener retos por categoría:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener retos activos (para compatibilidad)
const getRetosActivos = async (req, res) => {
  try {
    console.log('=== OBTENIENDO RETOS ACTIVOS ===');
    console.log('Usuario ID:', req.user?.id, 'Role:', req.user?.role);
    console.log('Headers Authorization:', req.headers.authorization ? 'Presente' : 'Ausente');

    const currentDateResult = await pool.query("SELECT CURRENT_DATE as current_date, NOW() as now_timestamp");
    console.log('CURRENT_DATE en BD:', currentDateResult.rows[0].current_date);
    console.log('NOW() timestamp:', currentDateResult.rows[0].now_timestamp);

    // Verificar que la tabla existe y tiene datos
    const countResult = await pool.query('SELECT COUNT(*) as total FROM retos');
    console.log('Total de retos en BD:', countResult.rows[0].total);

    // Simplificar la consulta para debugging
    const retos = await pool.query(`
      SELECT
        r.id,
        r.titulo,
        r.descripcion,
        r.tipo,
        r.xp_recompensa,
        r.dificultad,
        COUNT(rp.usuario_id) as participantes,
        CASE WHEN r.fecha_fin >= CURRENT_DATE THEN 'active' ELSE 'completed' END as estado,
        r.fecha_fin,
        r.created_by as creador_id,
        r.created_at
      FROM retos r
      LEFT JOIN reto_participantes rp ON r.id = rp.reto_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);

    console.log('Retos encontrados:', retos.rows.length);
    retos.rows.forEach(r => {
      const fechaFin = new Date(r.fecha_fin);
      const hoy = new Date();
      const esActivo = fechaFin >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      console.log(`- ID: ${r.id}, Titulo: ${r.titulo}, Fecha fin: ${r.fecha_fin}, Estado calculado: ${r.estado}, Es activo: ${esActivo}`);
    });

    res.json(retos.rows);
  } catch (error) {
    console.error('Error al obtener retos activos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Unirse a un reto
const unirseReto = async (req, res) => {
  const { reto_id } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea estudiante
    if (userRole !== 'student') {
      return res.status(403).json({
        error: 'Solo los estudiantes pueden unirse a retos'
      });
    }

    // Verificar que el reto existe y está activo
    const reto = await pool.query(
      'SELECT r.id, r.fecha_fin, r.clase_id FROM retos r WHERE r.id = $1 AND r.fecha_fin >= CURRENT_DATE',
      [Number(reto_id)]
    );

    if (reto.rows.length === 0) {
      return res.status(404).json({
        error: 'Reto no encontrado o ya expirado'
      });
    }

    // Verificar que el estudiante pertenece a la clase del reto (si tiene clase asignada)
    const userResult = await pool.query('SELECT clase_id FROM usuarios WHERE id = $1', [userId]);
    const userClaseId = userResult.rows[0]?.clase_id;
    const retoClaseId = reto.rows[0].clase_id;
    if (retoClaseId && userClaseId && retoClaseId !== userClaseId) {
      return res.status(403).json({
        error: 'Este reto no está disponible para tu clase'
      });
    }

    // Verificar si ya está unido
    const yaUnido = await pool.query(
      'SELECT rp.id, rp.intentos_usados, r.max_intentos FROM reto_participantes rp JOIN retos r ON rp.reto_id = r.id WHERE rp.reto_id = $1 AND rp.usuario_id = $2',
      [Number(reto_id), userId]
    );

    if (yaUnido.rows.length > 0) {
      const participacion = yaUnido.rows[0];
      // Verificar si ha excedido los intentos
      if (participacion.max_intentos && participacion.intentos_usados >= participacion.max_intentos) {
        return res.status(400).json({
          error: 'Has excedido el número máximo de intentos permitidos para este reto'
        });
      }
    } else {
      // Unirse al reto si no está unido
      await pool.query(
        'INSERT INTO reto_participantes (reto_id, usuario_id) VALUES ($1, $2)',
        [Number(reto_id), userId]
      );
    }

    res.json({ message: 'Te has unido al reto exitosamente' });

  } catch (error) {
    console.error('Error al unirse al reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Completar un reto
const completarReto = async (req, res) => {
  const { reto_id } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea estudiante
    if (userRole !== 'student') {
      return res.status(403).json({
        error: 'Solo los estudiantes pueden completar retos'
      });
    }

    // Verificar que esté unido y no completado
    const participacion = await pool.query(
      'SELECT rp.id, r.xp_recompensa FROM reto_participantes rp JOIN retos r ON rp.reto_id = r.id WHERE rp.reto_id = $1 AND rp.usuario_id = $2 AND rp.completed_at IS NULL',
      [Number(reto_id), userId]
    );

    if (participacion.rows.length === 0) {
      return res.status(400).json({
        error: 'No estás unido a este reto o ya lo completaste'
      });
    }

    const xpGanado = participacion.rows[0].xp_recompensa;

    // Iniciar transacción
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Marcar como completado
      await client.query(
        'UPDATE reto_participantes SET completed_at = CURRENT_TIMESTAMP, xp_ganado = $1 WHERE id = $2',
        [xpGanado, Number(participacion.rows[0].id)]
      );

      // Actualizar XP del usuario
      await client.query(
        'UPDATE usuarios SET xp_total = xp_total + $1 WHERE id = $2',
        [xpGanado, userId]
      );

      // Registrar en historial de XP
      await client.query(
        'INSERT INTO historial_xp (usuario_id, cantidad, tipo, descripcion, actividad_id) VALUES ($1, $2, $3, $4, $5)',
        [userId, xpGanado, 'reto_completado', `Completado reto: ${reto_id}`, null]
      );

      await client.query('COMMIT');
      console.log('Transacción commited exitosamente para reto ID:', reto_id);

      res.json({
        message: 'Reto completado exitosamente',
        xp_ganado: xpGanado
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al completar reto:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al completar reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener preguntas de un reto
const getPreguntasReto = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Verificar que el reto existe
    const reto = await pool.query(
      'SELECT id, fecha_fin FROM retos WHERE id = $1',
      [id]
    );

    if (reto.rows.length === 0) {
      return res.status(404).json({
        error: 'Reto no encontrado'
      });
    }

    // Verificar que el usuario esté unido al reto
    const participacion = await pool.query(
      'SELECT rp.id, rp.intentos_usados, r.max_intentos FROM reto_participantes rp JOIN retos r ON rp.reto_id = r.id WHERE rp.reto_id = $1 AND rp.usuario_id = $2',
      [Number(id), userId]
    );

    if (participacion.rows.length === 0) {
      return res.status(403).json({
        error: 'Debes unirte al reto primero'
      });
    }

    const part = participacion.rows[0];
    // Verificar si ha excedido los intentos
    if (part.max_intentos && part.intentos_usados >= part.max_intentos) {
      return res.status(400).json({
        error: 'Has excedido el número máximo de intentos permitidos para este reto'
      });
    }

    // Obtener preguntas
    const preguntas = await pool.query(
      'SELECT id, pregunta, opciones, tipo_pregunta FROM preguntas_reto WHERE reto_id = $1 ORDER BY id',
      [Number(id)]
    );

    // Formatear respuesta según el tipo de pregunta
    const preguntasFormateadas = preguntas.rows.map(p => {
      const base = {
        id: p.id,
        pregunta: p.pregunta,
        tipo: p.tipo_pregunta
      };

      if (p.tipo_pregunta === 'multiple_choice') {
        return {
          ...base,
          opciones: p.opciones
        };
      } else if (p.tipo_pregunta === 'fill_blank') {
        return {
          ...base,
          opciones: []
        };
      } else if (p.tipo_pregunta === 'drag_drop') {
        // Para drag_drop, la estructura completa está en opciones
        return {
          ...base,
          ...p.opciones
        };
      }

      return base;
    });

    res.json(preguntasFormateadas);

  } catch (error) {
    console.error('Error al obtener preguntas del reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Enviar respuestas de un reto
const responderReto = async (req, res) => {
  const { id } = req.params;
  const { respuestas } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea estudiante
    if (userRole !== 'student') {
      return res.status(403).json({
        error: 'Solo los estudiantes pueden responder retos'
      });
    }

    // Verificar que esté unido y no completado
    const participacion = await pool.query(
      'SELECT rp.id, rp.intentos_usados, r.xp_recompensa, r.max_intentos FROM reto_participantes rp JOIN retos r ON rp.reto_id = r.id WHERE rp.reto_id = $1 AND rp.usuario_id = $2 AND rp.completed_at IS NULL',
      [Number(id), userId]
    );

    if (participacion.rows.length === 0) {
      return res.status(400).json({
        error: 'No estás unido a este reto o ya lo completaste'
      });
    }

    const part = participacion.rows[0];
    // Verificar si ha excedido los intentos
    if (part.max_intentos && part.intentos_usados >= part.max_intentos) {
      return res.status(400).json({
        error: 'Has excedido el número máximo de intentos permitidos para este reto'
      });
    }

    // Obtener preguntas con respuestas correctas
    const preguntas = await pool.query(
      'SELECT id, respuesta_correcta, opciones, tipo_pregunta FROM preguntas_reto WHERE reto_id = $1 ORDER BY id',
      [Number(id)]
    );

    if (preguntas.rows.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron preguntas para este reto'
      });
    }

    // Validar que se enviaron respuestas para todas las preguntas
    if (!respuestas || respuestas.length !== preguntas.rows.length) {
      return res.status(400).json({
        error: 'Debes enviar respuestas para todas las preguntas'
      });
    }

    // Usar transacción para todas las operaciones
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Incrementar intentos usados
      await client.query(
        'UPDATE reto_participantes SET intentos_usados = intentos_usados + 1 WHERE id = $1',
        [part.id]
      );

      let correctas = 0;
      const total = preguntas.rows.length;
      let xpGanadoIndividual = 0;

      // Verificar cada respuesta
      for (let i = 0; i < respuestas.length; i++) {
        const respuesta = respuestas[i];
        const pregunta = preguntas.rows.find(p => p.id == respuesta.pregunta_id);

        if (!pregunta) {
          await client.query('ROLLBACK');
          return res.status(400).json({
            error: `Pregunta ${respuesta.pregunta_id} no pertenece a este reto`
          });
        }

        let esCorrecta = false;

        if (pregunta.tipo_pregunta === 'multiple_choice') {
          const indice = parseInt(respuesta.respuesta);
          const indiceCorrecto = parseInt(pregunta.respuesta_correcta);
          esCorrecta = !isNaN(indice) && indice === indiceCorrecto;
        } else if (pregunta.tipo_pregunta === 'fill_blank') {
          esCorrecta = respuesta.respuesta.trim().toLowerCase() === pregunta.respuesta_correcta.trim().toLowerCase();
        } else if (pregunta.tipo_pregunta === 'drag_drop') {
          try {
            const respuestaMapping = typeof respuesta.respuesta === 'string' ? JSON.parse(respuesta.respuesta) : respuesta.respuesta;
            const correctMapping = {};
            pregunta.opciones.zonas_destino.forEach(zona => {
              correctMapping[zona.id] = zona.elemento_correcto_id;
            });
            esCorrecta = Object.keys(correctMapping).every(zonaId => respuestaMapping[zonaId] === correctMapping[zonaId]);
          } catch (error) {
            esCorrecta = false;
          }
        }

        if (esCorrecta) {
          correctas++;
          xpGanadoIndividual += 4;

          // Registrar XP por respuesta correcta individual
          await client.query(
            'INSERT INTO historial_xp (usuario_id, cantidad, tipo, descripcion, actividad_id) VALUES ($1, $2, $3, $4, $5)',
            [userId, 4, 'respuesta_correcta', `Respuesta correcta en reto ${id}, pregunta ${pregunta.id}`, null]
          );
        }
      }

      // Actualizar XP total por respuestas individuales
      if (xpGanadoIndividual > 0) {
        await client.query(
          'UPDATE usuarios SET xp_total = xp_total + $1 WHERE id = $2',
          [xpGanadoIndividual, userId]
        );
      }

      // Si todas son correctas, completar el reto y dar bonus
      let xpGanado = xpGanadoIndividual;
      if (correctas === total) {
        const xpBonus = 20;
        const xpTotalGanado = xpGanadoIndividual + xpBonus;

        // Marcar como completado
        await client.query(
          'UPDATE reto_participantes SET completed_at = CURRENT_TIMESTAMP, xp_ganado = $1 WHERE id = $2',
          [xpTotalGanado, Number(participacion.rows[0].id)]
        );

        // Actualizar XP del usuario con el bonus (+20)
        await client.query(
          'UPDATE usuarios SET xp_total = xp_total + $1 WHERE id = $2',
          [xpBonus, userId]
        );

        // Registrar en historial de XP el bonus por completar
        await client.query(
          'INSERT INTO historial_xp (usuario_id, cantidad, tipo, descripcion, actividad_id) VALUES ($1, $2, $3, $4, $5)',
          [userId, xpBonus, 'reto_completado', `Completado reto: ${id}`, null]
        );

        xpGanado = xpTotalGanado;
      }

      await client.query('COMMIT');

      res.json({
        message: correctas === total ? 'Reto completado exitosamente' : 'Respuestas enviadas',
        correctas,
        total,
        xp_ganado: xpGanado
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al responder reto:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al responder reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Verificar respuesta individual
const verificarRespuesta = async (req, res) => {
  const { id } = req.params;
  const { pregunta_id, respuesta } = req.body;
  const userId = req.user.id;

  try {
    // Verificar que el reto existe
    const reto = await pool.query(
      'SELECT id FROM retos WHERE id = $1',
      [Number(id)]
    );

    if (reto.rows.length === 0) {
      return res.status(404).json({
        error: 'Reto no encontrado'
      });
    }

    // Verificar que el usuario esté unido al reto
    const participacion = await pool.query(
      'SELECT id FROM reto_participantes WHERE reto_id = $1 AND usuario_id = $2',
      [Number(id), userId]
    );

    if (participacion.rows.length === 0) {
      return res.status(403).json({
        error: 'Debes unirte al reto primero'
      });
    }

    // Obtener la pregunta
    const pregunta = await pool.query(
      'SELECT tipo_pregunta, respuesta_correcta, opciones FROM preguntas_reto WHERE id = $1 AND reto_id = $2',
      [Number(pregunta_id), Number(id)]
    );

    if (pregunta.rows.length === 0) {
      return res.status(404).json({
        error: 'Pregunta no encontrada en este reto'
      });
    }

    const p = pregunta.rows[0];
    let correcta = false;
    let respuesta_correcta = undefined;

    // Nota: Las verificaciones individuales no cuentan como intentos
    // Solo el envío final de todas las respuestas cuenta como intento

    if (p.tipo_pregunta === 'multiple_choice') {
      // Para opción múltiple, comparar el índice
      const indice = parseInt(respuesta);
      const indiceCorrecto = parseInt(p.respuesta_correcta);
      correcta = !isNaN(indice) && indice === indiceCorrecto;
      if (!correcta) {
        // Devolver el texto de la opción correcta, no el índice
        const opciones = Array.isArray(p.opciones) ? p.opciones : JSON.parse(p.opciones || '[]');
        respuesta_correcta = opciones[indiceCorrecto] || p.respuesta_correcta;
      }
    } else if (p.tipo_pregunta === 'fill_blank') {
      // Para completar espacios, comparar el texto
      correcta = respuesta.trim().toLowerCase() === p.respuesta_correcta.trim().toLowerCase();
      if (!correcta) {
        respuesta_correcta = p.respuesta_correcta;
      }
    } else if (p.tipo_pregunta === 'drag_drop') {
      // Para drag_drop, no se permite verificación individual
      return res.status(400).json({
        error: 'Las preguntas de arrastrar y soltar se verifican al final'
      });
    }

    res.json({
      correcta,
      respuesta_correcta
    });

  } catch (error) {
    console.error('Error al verificar respuesta:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener intentos restantes para un reto
const getIntentosRestantes = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Verificar que el reto existe y tiene max_intentos
    const reto = await pool.query(
      'SELECT max_intentos FROM retos WHERE id = $1',
      [id]
    );

    if (reto.rows.length === 0) {
      return res.status(404).json({ error: 'Reto no encontrado' });
    }

    const maxIntentos = reto.rows[0].max_intentos;

    if (!maxIntentos) {
      return res.json({ intentos_restantes: -1 }); // -1 indica ilimitado
    }

    // Obtener intentos usados por el usuario
    const participacion = await pool.query(
      'SELECT intentos_usados FROM reto_participantes WHERE reto_id = $1 AND usuario_id = $2',
      [id, userId]
    );

    const intentosUsados = participacion.rows.length > 0 
      ? participacion.rows[0].intentos_usados 
      : 0;

    const intentosRestantes = maxIntentos - intentosUsados;

    res.json({ intentos_restantes: Math.max(0, intentosRestantes) });

  } catch (error) {
    console.error('Error al obtener intentos restantes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar un reto (solo profesores)
const eliminarReto = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden eliminar retos'
      });
    }

    // Verificar que el reto existe
    const reto = await pool.query(
      'SELECT created_by FROM retos WHERE id = $1',
      [id]
    );

    if (reto.rows.length === 0) {
      return res.status(404).json({ error: 'Reto no encontrado' });
    }

    // Verificar que el profesor es el creador o admin
    const esCreador = reto.rows[0].created_by === userId;
    if (!esCreador) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este reto' });
    }

    // Eliminar en transacción
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Eliminar preguntas del reto
      await client.query('DELETE FROM preguntas_reto WHERE reto_id = $1', [id]);

      // Eliminar participaciones
      await client.query('DELETE FROM reto_participantes WHERE reto_id = $1', [id]);

      // Eliminar el reto
      await client.query('DELETE FROM retos WHERE id = $1', [id]);

      await client.query('COMMIT');

      res.json({ message: 'Reto eliminado exitosamente' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al eliminar reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar un reto (solo profesores)
const actualizarReto = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, tipo, categoria, xp_recompensa, fecha_fin, max_intentos, preguntas } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden editar retos'
      });
    }

    // Verificar que el reto existe
    const reto = await pool.query(
      'SELECT created_by FROM retos WHERE id = $1',
      [id]
    );

    if (reto.rows.length === 0) {
      return res.status(404).json({ error: 'Reto no encontrado' });
    }

    // Verificar que el profesor es el creador
    if (reto.rows[0].created_by !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para editar este reto' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Actualizar el reto
      const updateResult = await client.query(
        'UPDATE retos SET titulo = $1, descripcion = $2, tipo = $3, categoria = $4, xp_recompensa = $5, fecha_fin = $6, max_intentos = $7 WHERE id = $8',
        [titulo, descripcion || null, tipo, categoria || null, xp_recompensa, fecha_fin, max_intentos || null, id]
      );

      // Si hay preguntas nuevas, reemplazar las existentes
      if (preguntas && Array.isArray(preguntas)) {
        // Eliminar preguntas existentes
        await client.query('DELETE FROM preguntas_reto WHERE reto_id = $1', [id]);

        // Insertar nuevas preguntas
        for (const p of preguntas) {
          await client.query(
            'INSERT INTO preguntas_reto (reto_id, pregunta, opciones, respuesta_correcta, tipo_pregunta) VALUES ($1, $2, $3, $4, $5)',
            [id, p.pregunta, JSON.stringify(p.opciones), p.respuesta_correcta.toString(), 'multiple_choice']
          );
        }
      }

      await client.query('COMMIT');

      res.json({ message: 'Reto actualizado exitosamente' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al actualizar reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener un reto específico con preguntas (para edición)
const obtenerReto = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({ error: 'Solo los profesores pueden ver detalles de retos' });
    }

    // Verificar que el reto existe
    const reto = await pool.query(
      'SELECT id, titulo, descripcion, tipo, categoria, xp_recompensa, fecha_fin, max_intentos FROM retos WHERE id = $1',
      [id]
    );

    if (reto.rows.length === 0) {
      return res.status(404).json({ error: 'Reto no encontrado' });
    }

    // Obtener preguntas
    const preguntas = await pool.query(
      'SELECT id, pregunta, opciones, respuesta_correcta FROM preguntas_reto WHERE reto_id = $1 ORDER BY id',
      [id]
    );

    const preguntasFormateadas = preguntas.rows.map(p => ({
      id: p.id,
      pregunta: p.pregunta,
      opciones: Array.isArray(p.opciones) ? p.opciones : JSON.parse(p.opciones || '[]'),
      respuesta_correcta: parseInt(p.respuesta_correcta)
    }));

    res.json({
      ...reto.rows[0],
      preguntas: preguntasFormateadas
    });
  } catch (error) {
    console.error('Error al obtener reto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  crearReto,
  getRetosActivos,
  getRetosPorCategoria,
  unirseReto,
  completarReto,
  getPreguntasReto,
  responderReto,
  verificarRespuesta,
  getIntentosRestantes,
  eliminarReto,
  actualizarReto,
  obtenerReto
};