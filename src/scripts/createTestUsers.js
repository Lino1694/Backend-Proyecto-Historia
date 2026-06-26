const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const hashedPassword = await bcrypt.hash('123456', 10);

    // Crear usuario alumno
    const existingStudent = await client.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      ['alumno.prueba@historia.edu']
    );

    if (existingStudent.rows.length === 0) {
      await client.query(
        "INSERT INTO usuarios (nombre, correo, contrasena, role) VALUES ($1, $2, $3, $4)",
        ['Alumno Prueba', 'alumno.prueba@historia.edu', hashedPassword, 'student']
      );
      console.log('✅ Usuario alumno creado: alumno.prueba@historia.edu');
    } else {
      console.log('ℹ️ Usuario alumno ya existe');
    }

    // Crear usuario profesor
    const existingTeacher = await client.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      ['profesor.prueba@historia.edu']
    );

    if (existingTeacher.rows.length === 0) {
      await client.query(
        "INSERT INTO usuarios (nombre, correo, contrasena, role) VALUES ($1, $2, $3, $4)",
        ['Profesor Prueba', 'profesor.prueba@historia.edu', hashedPassword, 'teacher']
      );
      console.log('✅ Usuario profesor creado: profesor.prueba@historia.edu');
    } else {
      console.log('ℹ️ Usuario profesor ya existe');
    }

    await client.query('COMMIT');
    console.log('✅ Usuarios de prueba listos');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear usuarios:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createTestUsers };