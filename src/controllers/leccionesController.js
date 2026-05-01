const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

// Función para procesar data URLs y convertirlas a archivos
const processDataUrls = async (multimediaArray, userId) => {
  if (!multimediaArray || !Array.isArray(multimediaArray)) {
    return multimediaArray;
  }

  const processedMultimedia = [];

  for (const item of multimediaArray) {
    try {
      // Si es una data URL, procesarla
      if (item.url && item.url.startsWith('data:')) {
        const dataUrl = item.url;
        const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches) {
          console.warn('Data URL inválida:', dataUrl);
          processedMultimedia.push(item);
          continue;
        }

        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        // Determinar tipo y extensión
        let tipo = 'imagen';
        let extension = 'png';

        if (mimeType.startsWith('video/')) {
          tipo = 'video';
          extension = mimeType.split('/')[1] || 'mp4';
        } else if (mimeType.startsWith('audio/')) {
          tipo = 'audio';
          extension = mimeType.split('/')[1] || 'mp3';
        } else if (mimeType.startsWith('image/')) {
          tipo = 'imagen';
          extension = mimeType.split('/')[1] || 'png';
        }

        // Crear directorio si no existe
        const uploadDir = path.join('uploads', 'multimedia', tipo === 'imagen' ? 'images' : tipo === 'video' ? 'videos' : 'audio');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generar nombre único
        const fileName = `lesson_media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
        const filePath = path.join(uploadDir, fileName);

        // Guardar archivo
        fs.writeFileSync(filePath, buffer);

        // Generar URL pública
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const relativePath = path.relative('uploads', filePath).replace(/\\/g, '/');
        const publicUrl = `${baseUrl}/uploads/${relativePath}`;

        // Guardar metadatos en BD
        const result = await pool.query(
          `INSERT INTO multimedia
           (nombre_original, nombre_archivo, tipo, mime_type, tamano, ruta, url_publica, uploaded_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id`,
          [
            item.nombre_original || `media_${Date.now()}`,
            fileName,
            tipo,
            mimeType,
            buffer.length,
            filePath,
            publicUrl,
            userId
          ]
        );

        // Agregar item procesado
        processedMultimedia.push({
          ...item,
          id: `file_${result.rows[0].id}`,
          tipo,
          url: publicUrl,
          tamano: buffer.length,
          nombre_original: item.nombre_original || `media_${Date.now()}`
        });

      } else {
        // Si no es data URL, mantener como está
        processedMultimedia.push(item);
      }
    } catch (error) {
      console.error('Error procesando multimedia:', error);
      // En caso de error, mantener el item original
      processedMultimedia.push(item);
    }
  }

  return processedMultimedia;
};

// Crear una nueva lección
const crearLeccion = async (req, res) => {
  const { titulo, descripcion, contenido, imagen_url, preguntas, multimedia } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea profesor
    if (userRole !== 'teacher') {
      return res.status(403).json({
        error: 'Solo los profesores pueden crear lecciones'
      });
    }

    // Validar campos obligatorios
    if (!titulo) {
      return res.status(400).json({
        error: 'El título es obligatorio'
      });
    }

    // Procesar multimedia (convertir data URLs a archivos)
    let processedMultimedia = multimedia;
    if (multimedia && multimedia.length > 0) {
      processedMultimedia = await processDataUrls(multimedia, userId);
    }

    // Insertar lección
    const result = await pool.query(
      `INSERT INTO lecciones (titulo, descripcion, contenido, imagen_url, preguntas, multimedia, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, titulo, descripcion, contenido, imagen_url, preguntas, multimedia, created_by, created_at`,
      [titulo, descripcion || null, contenido || null, imagen_url || null, preguntas ? JSON.stringify(preguntas) : null, processedMultimedia ? JSON.stringify(processedMultimedia) : null, userId]
    );

    res.status(201).json({
      id: result.rows[0].id,
      message: 'Lección creada exitosamente'
    });

  } catch (error) {
    console.error('Error al crear lección:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todas las lecciones disponibles
const getLecciones = async (req, res) => {
  try {
    const lecciones = await pool.query(
      `SELECT id, titulo, descripcion, contenido, imagen_url, preguntas, multimedia
       FROM lecciones
       ORDER BY created_at DESC`
    );

    // Las preguntas y multimedia ya vienen parseadas como objetos desde PostgreSQL
    const leccionesFormateadas = lecciones.rows.map(l => ({
      ...l,
      preguntas: l.preguntas || [],
      multimedia: l.multimedia || []
    }));

    res.json(leccionesFormateadas);

  } catch (error) {
    console.error('Error al obtener lecciones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar una lección
const updateLeccion = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, contenido, imagen_url, preguntas, multimedia } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que la lección existe y pertenece al usuario (o es moderador)
    const leccionExistente = await pool.query(
      'SELECT created_by FROM lecciones WHERE id = $1',
      [id]
    );

    if (leccionExistente.rows.length === 0) {
      return res.status(404).json({ error: 'Lección no encontrada' });
    }

    if (leccionExistente.rows[0].created_by !== userId && userRole !== 'moderator') {
      return res.status(403).json({
        error: 'No tienes permisos para actualizar esta lección'
      });
    }

    // Verificar que al menos un campo esté presente
    if (titulo === undefined && descripcion === undefined && contenido === undefined && imagen_url === undefined && preguntas === undefined && multimedia === undefined) {
      return res.status(400).json({
        error: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    // Procesar multimedia (convertir data URLs a archivos)
    let processedMultimedia = multimedia;
    if (multimedia !== undefined && multimedia.length > 0) {
      processedMultimedia = await processDataUrls(multimedia, userId);
    }

    // Construir la consulta de actualización
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (titulo !== undefined) {
      updates.push(`titulo = $${paramCount}`);
      values.push(titulo);
      paramCount++;
    }

    if (descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount}`);
      values.push(descripcion);
      paramCount++;
    }

    if (contenido !== undefined) {
      updates.push(`contenido = $${paramCount}`);
      values.push(contenido);
      paramCount++;
    }

    if (imagen_url !== undefined) {
      updates.push(`imagen_url = $${paramCount}`);
      values.push(imagen_url);
      paramCount++;
    }

    if (preguntas !== undefined) {
      updates.push(`preguntas = $${paramCount}`);
      values.push(preguntas ? JSON.stringify(preguntas) : null);
      paramCount++;
    }

    if (multimedia !== undefined) {
      updates.push(`multimedia = $${paramCount}`);
      values.push(processedMultimedia ? JSON.stringify(processedMultimedia) : null);
      paramCount++;
    }

    // Actualizar updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id); // Para WHERE id = $paramCount

    const updateQuery = `
      UPDATE lecciones
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
    `;

    await pool.query(updateQuery, values);

    res.json({
      message: 'Lección actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar lección:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Completar una lección
const completarLeccion = async (req, res) => {
  const { leccion_id, puntuacion, total_preguntas } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que sea estudiante
    if (userRole !== 'student') {
      return res.status(403).json({
        error: 'Solo los estudiantes pueden completar lecciones'
      });
    }

    // Verificar que la lección existe
    const leccion = await pool.query(
      'SELECT id, titulo, tema FROM lecciones WHERE id = $1',
      [leccion_id]
    );

    if (leccion.rows.length === 0) {
      return res.status(404).json({ error: 'Lección no encontrada' });
    }

    const leccionData = leccion.rows[0];

    // Verificar que no esté ya completada
    const yaCompletada = await pool.query(
      'SELECT id FROM lecciones_completadas WHERE estudiante_id = $1 AND leccion_id = $2',
      [userId, leccion_id]
    );

    if (yaCompletada.rows.length > 0) {
      return res.status(400).json({
        error: 'Ya has completado esta lección'
      });
    }

    // Calcular XP ganado (basado en puntuacion)
    const porcentajeCorrecto = (puntuacion / total_preguntas) * 100;
    let xpGanado = 0;

    if (porcentajeCorrecto >= 80) {
      xpGanado = 50; // XP completo
    } else if (porcentajeCorrecto >= 60) {
      xpGanado = 30; // XP parcial
    } else if (porcentajeCorrecto >= 40) {
      xpGanado = 10; // XP mínimo
    }
    // Menos del 40% = 0 XP

    // Iniciar transacción
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Registrar completación
      await client.query(
        `INSERT INTO lecciones_completadas
         (estudiante_id, leccion_id, puntuacion, total_preguntas, xp_ganado)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, leccion_id, puntuacion, total_preguntas, xpGanado]
      );

      // Actualizar XP del usuario si hay XP ganado
      if (xpGanado > 0) {
        await client.query(
          'UPDATE usuarios SET xp_total = xp_total + $1 WHERE id = $2',
          [xpGanado, userId]
        );

        // Registrar en historial de XP
        await client.query(
          'INSERT INTO historial_xp (usuario_id, cantidad, tipo, descripcion) VALUES ($1, $2, $3, $4)',
          [userId, xpGanado, 'leccion_completada', `Completada lección: ${leccionData.titulo}`]
        );
      }

      // Nota: La actualización de progreso por tema está deshabilitada temporalmente
      // debido a problemas con la columna 'tema' en la base de datos
      // TODO: Rehabilitar cuando se corrija el esquema de la base de datos
      /*
      // Actualizar progreso por tema
      if (leccionData.tema && leccionData.tema.trim() !== '') {
        // Obtener total de lecciones para este tema
        const totalLecciones = await client.query(
          'SELECT COUNT(*) as total FROM lecciones WHERE tema = $1',
          [leccionData.tema]
        );

        // Obtener lecciones completadas por el estudiante para este tema
        const completadas = await client.query(
          `SELECT COUNT(*) as completadas FROM lecciones_completadas lc
            JOIN lecciones l ON lc.leccion_id = l.id
            WHERE lc.estudiante_id = $1 AND l.tema = $2`,
          [userId, leccionData.tema]
        );

        const total = parseInt(totalLecciones.rows[0].total);
        const completadasCount = parseInt(completadas.rows[0].completadas);
        const progreso = total > 0 ? (completadasCount / total) * 100 : 0;

        // Insertar o actualizar progreso
        await client.query(
          `INSERT INTO progreso_estudiante_tema
            (estudiante_id, tema, progreso, lecciones_completadas, total_lecciones)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (estudiante_id, tema)
            DO UPDATE SET
              progreso = EXCLUDED.progreso,
              lecciones_completadas = EXCLUDED.lecciones_completadas,
              total_lecciones = EXCLUDED.total_lecciones,
              updated_at = CURRENT_TIMESTAMP`,
          [userId, leccionData.tema, progreso, completadasCount, total]
        );
      }
      */

      await client.query('COMMIT');

      res.json({
        message: 'Lección completada exitosamente',
        xp_ganado: xpGanado
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al completar lección:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  crearLeccion,
  getLecciones,
  updateLeccion,
  completarLeccion
};