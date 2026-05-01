const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener información completa del usuario
    const user = await pool.query(
      'SELECT id, nombre, correo, role, xp_total, nivel FROM usuarios WHERE id = $1',
      [decoded.id]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(403).json({ error: 'Token inválido' });
  }
};

const authorizeTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      error: 'Acceso denegado. Solo profesores pueden acceder a esta funcionalidad.'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeTeacher
};