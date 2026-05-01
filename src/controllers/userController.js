const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar usuario
const registerUser = async (req, res) => {
  const { nombre, correo, contrasena, role = 'student' } = req.body;

  try {
    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios' 
      });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ 
        error: 'Formato de correo inválido' 
      });
    }

    // Validar longitud de contraseña
    if (contrasena.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Validar rol
    const validRoles = ['student', 'teacher', 'moderator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Rol inválido. Debe ser: student, teacher o moderator' 
      });
    }

    // Verificar si el correo ya existe
    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        error: 'El correo ya está registrado' 
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Insertar usuario en la base de datos
    const newUser = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, role) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, role, created_at',
      [nombre, correo, hashedPassword, role]
    );

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: newUser.rows[0].id, 
        correo: newUser.rows[0].correo,
        role: newUser.rows[0].role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser.rows[0],
      token
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  const { correo, contrasena, loginRole } = req.body;

  try {
    if (!correo || !contrasena) {
      return res.status(400).json({ 
        error: 'Correo y contraseña son obligatorios' 
      });
    }

    // Buscar usuario
    const user = await pool.query(
      'SELECT id, nombre, correo, contrasena, role, xp_total, nivel, avatar_url FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    const userData = user.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(
      contrasena, 
      userData.contrasena
    );

    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar rol (solo si no es moderador)
    if (loginRole && userData.role !== 'moderator') {
      if (userData.role !== loginRole) {
        const roleNames = {
          student: 'estudiante',
          teacher: 'profesor'
        };
        return res.status(403).json({ 
          error: `Esta cuenta es de ${roleNames[userData.role]}. Por favor selecciona el rol correcto.`
        });
      }
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: userData.id, 
        correo: userData.correo,
        role: userData.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Obtener información del nivel
    const nivelInfo = await pool.query(
      'SELECT titulo, icono FROM niveles WHERE nivel = $1',
      [userData.nivel]
    );

    res.json({
      message: 'Login exitoso',
      user: {
        id: userData.id,
        nombre: userData.nombre,
        correo: userData.correo,
        role: userData.role,
        avatar_url: userData.avatar_url,
        xp_total: userData.xp_total,
        nivel: userData.nivel,
        nivel_titulo: nivelInfo.rows[0]?.titulo || 'Principiante',
        nivel_icono: nivelInfo.rows[0]?.icono || '🌟'
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, nombre, correo, role, created_at FROM usuarios ORDER BY created_at DESC'
    );
    res.json(users.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await pool.query(
      'SELECT id, nombre, correo, role, avatar_url, titulo, created_at FROM usuarios WHERE id = $1',
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar perfil de usuario
const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { nombre, avatar_url, titulo } = req.body;
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  try {
    // Verificar permisos: usuarios pueden editar su propio perfil, profesores pueden editar perfiles de estudiantes
    if (currentUserId !== parseInt(id) && currentUserRole !== 'teacher') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este perfil'
      });
    }

    // Si es profesor editando estudiante, verificar que el usuario objetivo sea estudiante
    if (currentUserRole === 'teacher' && currentUserId !== parseInt(id)) {
      const targetUser = await pool.query(
        'SELECT role FROM usuarios WHERE id = $1',
        [id]
      );

      if (targetUser.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (targetUser.rows[0].role !== 'student') {
        return res.status(403).json({
          error: 'Los profesores solo pueden editar perfiles de estudiantes'
        });
      }
    }

    // Validar título si se proporciona
    const validTitulos = ['explorador', 'maestro', 'inca', 'inti', 'almirante', 'capitan', 'soldado', 'historiador'];
    if (titulo && !validTitulos.includes(titulo)) {
      return res.status(400).json({
        error: 'Título inválido. Los títulos válidos son: ' + validTitulos.join(', ')
      });
    }

    // Construir query de actualización dinámica
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (nombre !== undefined) {
      updateFields.push(`nombre = $${paramCount}`);
      updateValues.push(nombre);
      paramCount++;
    }

    if (avatar_url !== undefined) {
      updateFields.push(`avatar_url = $${paramCount}`);
      updateValues.push(avatar_url);
      paramCount++;
    }

    if (titulo !== undefined) {
      updateFields.push(`titulo = $${paramCount}`);
      updateValues.push(titulo);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    updateValues.push(id); // ID del usuario a actualizar

    const updateQuery = `
      UPDATE usuarios
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, nombre, correo, role, avatar_url, titulo
    `;

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar perfil de usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, avatar_url } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que el usuario puede actualizar este perfil
    // Usuarios pueden actualizar su propio perfil, o moderadores pueden actualizar cualquier perfil
    if (userId != id && userRole !== 'moderator') {
      return res.status(403).json({
        error: 'No tienes permisos para actualizar este perfil'
      });
    }

    // Verificar que al menos un campo esté presente
    if (!nombre && !correo && avatar_url === undefined) {
      return res.status(400).json({
        error: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    // Validar formato de correo si se proporciona
    if (correo) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        return res.status(400).json({
          error: 'Formato de correo inválido'
        });
      }

      // Verificar que el correo no esté en uso por otro usuario
      const emailExists = await pool.query(
        'SELECT id FROM usuarios WHERE correo = $1 AND id != $2',
        [correo, id]
      );

      if (emailExists.rows.length > 0) {
        return res.status(400).json({
          error: 'El correo ya está en uso por otro usuario'
        });
      }
    }

    // Construir la consulta de actualización
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (nombre) {
      updates.push(`nombre = $${paramCount}`);
      values.push(nombre);
      paramCount++;
    }

    if (correo) {
      updates.push(`correo = $${paramCount}`);
      values.push(correo);
      paramCount++;
    }

    if (avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramCount}`);
      values.push(avatar_url);
      paramCount++;
    }

    values.push(id); // Para WHERE id = $paramCount

    const updateQuery = `
      UPDATE usuarios
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, nombre, correo, role, avatar_url, created_at
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Cambiar contraseña de usuario
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { current_password, new_password } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verificar que el usuario puede cambiar esta contraseña
    // Usuarios pueden cambiar su propia contraseña, o moderadores pueden cambiar cualquier contraseña
    if (userId != id && userRole !== 'moderator') {
      return res.status(403).json({
        error: 'No tienes permisos para cambiar esta contraseña'
      });
    }

    // Validar campos requeridos
    if (!current_password || !new_password) {
      return res.status(400).json({
        error: 'Se requieren current_password y new_password'
      });
    }

    // Validar longitud de nueva contraseña
    if (new_password.length < 6) {
      return res.status(400).json({
        error: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtener la contraseña actual del usuario
    const user = await pool.query(
      'SELECT contrasena FROM usuarios WHERE id = $1',
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar la contraseña actual
    const validCurrentPassword = await bcrypt.compare(
      current_password,
      user.rows[0].contrasena
    );

    if (!validCurrentPassword) {
      return res.status(400).json({
        error: 'La contraseña actual es incorrecta'
      });
    }

    // Encriptar la nueva contraseña
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

    // Actualizar la contraseña
    await pool.query(
      'UPDATE usuarios SET contrasena = $1 WHERE id = $2',
      [hashedNewPassword, id]
    );

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUserProfile,
  changePassword
};