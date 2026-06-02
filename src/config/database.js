const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en la conexión a PostgreSQL:', err);
});

// Función para crear las tablas automáticamente
const createTables = async () => {
  try {
    console.log('🔄 Verificando tablas de la base de datos...');

    // 1. TABLA DE USUARIOS (actualizada con XP)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        correo VARCHAR(255) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'moderator')),
        xp_total INTEGER DEFAULT 0,
        nivel INTEGER DEFAULT 1,
        racha_dias INTEGER DEFAULT 0,
        ultima_actividad DATE,
        avatar_url TEXT,
        titulo VARCHAR(50) DEFAULT 'explorador' CHECK (titulo IN ('explorador', 'maestro', 'inca', 'inti', 'almirante', 'capitan', 'soldado', 'historiador')),
        clase_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Asegurar que las columnas de XP existan (por si la tabla ya existe sin ellas)
    await pool.query(`
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS xp_total INTEGER DEFAULT 0;
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nivel INTEGER DEFAULT 1;
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS racha_dias INTEGER DEFAULT 0;
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultima_actividad DATE;
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS titulo VARCHAR(50) DEFAULT 'explorador' CHECK (titulo IN ('explorador', 'maestro', 'inca', 'inti', 'almirante', 'capitan', 'soldado', 'historiador'));
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS clase_id INTEGER;
    `);
    console.log('✅ Tabla "usuarios" verificada/creada correctamente');

    // 2. TABLA DE ACTIVIDADES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS actividades (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        tipo VARCHAR(50) CHECK (tipo IN ('Cuestionario', 'Competencia en tiempo real', 'Mapa Interactivo', 'Línea de Tiempo')),
        dificultad VARCHAR(20) CHECK (dificultad IN ('Fácil', 'Intermedio', 'Difícil')),
        xp_recompensa INTEGER DEFAULT 0,
        fecha_vencimiento TIMESTAMP,
        tema VARCHAR(100),
        activa BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES usuarios(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ Tabla "actividades" verificada/creada correctamente');

    // 3. TABLA DE PROGRESO DE ESTUDIANTES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progreso_estudiante (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        actividad_id INTEGER REFERENCES actividades(id) ON DELETE CASCADE,
        progreso INTEGER DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
        xp_ganado INTEGER DEFAULT 0,
        respuestas_correctas INTEGER DEFAULT 0,
        respuestas_incorrectas INTEGER DEFAULT 0,
        intentos INTEGER DEFAULT 0,
        completado BOOLEAN DEFAULT FALSE,
        fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_completado TIMESTAMP,
        UNIQUE(estudiante_id, actividad_id)
      );
    `);
    console.log('✅ Tabla "progreso_estudiante" verificada/creada correctamente');

    // 4. TABLA DE HISTORIAL DE XP
    await pool.query(`
      CREATE TABLE IF NOT EXISTS historial_xp (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        cantidad INTEGER NOT NULL,
        tipo VARCHAR(50) CHECK (tipo IN ('actividad_completada', 'respuesta_correcta', 'racha_diaria', 'insignia', 'bonus_profesor', 'penalizacion', 'reto_completado', 'leccion_completada')),
        descripcion TEXT,
        actividad_id INTEGER REFERENCES actividades(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla "historial_xp" verificada/creada correctamente');

    // 5. TABLA DE INSIGNIAS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS insignias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        icono VARCHAR(50),
        xp_requerido INTEGER DEFAULT 0,
        criterio TEXT,
        color VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla "insignias" verificada/creada correctamente');

    // 6. TABLA DE INSIGNIAS POR USUARIO
    await pool.query(`
      CREATE TABLE IF NOT EXISTS insignias_usuario (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        insignia_id INTEGER REFERENCES insignias(id) ON DELETE CASCADE,
        obtenida_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(usuario_id, insignia_id)
      );
    `);
    console.log('✅ Tabla "insignias_usuario" verificada/creada correctamente');

    // 7. TABLA DE NIVELES (configuración de niveles)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS niveles (
        nivel INTEGER PRIMARY KEY,
        xp_minimo INTEGER NOT NULL,
        xp_maximo INTEGER NOT NULL,
        titulo VARCHAR(100),
        icono VARCHAR(50)
      );
    `);
    console.log('✅ Tabla "niveles" verificada/creada correctamente');

    // Insertar niveles predefinidos si no existen
    await pool.query(`
      INSERT INTO niveles (nivel, xp_minimo, xp_maximo, titulo, icono) VALUES
        (1, 0, 199, 'Explorador Novato', '🌱'),
        (2, 200, 399, 'Aprendiz', '📚'),
        (3, 400, 699, 'Estudiante', '🎓'),
        (4, 700, 999, 'Conocedor', '📖'),
        (5, 1000, 1499, 'Historiador Junior', '🏛️'),
        (6, 1500, 1999, 'Investigador', '🔍'),
        (7, 2000, 2999, 'Experto', '⭐'),
        (8, 3000, 4499, 'Maestro', '👑'),
        (9, 4500, 6999, 'Sabio', '🧙'),
        (10, 7000, 999999, 'Leyenda de la Historia', '🏆')
      ON CONFLICT (nivel) DO NOTHING;
    `);
    console.log('✅ Niveles predefinidos insertados correctamente');

    // Insertar insignias predefinidas si no existen
    await pool.query(`
      INSERT INTO insignias (nombre, descripcion, icono, xp_requerido, criterio, color) VALUES
        ('Primera Victoria', 'Completaste tu primera actividad', '🎉', 0, 'Completar 1 actividad', 'green'),
        ('Racha de Fuego', 'Mantén una racha de 5 días consecutivos', '🔥', 50, 'Racha de 5 días', 'orange'),
        ('Perfeccionista', 'Obtén 100% en una actividad', '💯', 100, 'Puntaje perfecto', 'gold'),
        ('Explorador', 'Completa 10 actividades', '🗺️', 200, 'Completar 10 actividades', 'blue'),
        ('Colaborador', 'Otorgada por el profesor', '🤝', 0, 'Profesor lo otorga', 'purple'),
        ('Líder', 'Alcanza el top 3 de tu clase', '⭐', 500, 'Top 3 en ranking', 'yellow'),
        ('Persistente', 'Completa una actividad difícil', '💪', 150, 'Actividad difícil completada', 'red'),
        ('Curioso', 'Completa actividades de 3 temas diferentes', '🔍', 100, '3 temas diferentes', 'cyan')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Insignias predefinidas insertadas correctamente');

    // 8. TABLA DE RETOS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS retos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        tipo VARCHAR(20) CHECK (tipo IN ('individual', 'competition')),
        categoria VARCHAR(100),
        xp_recompensa INTEGER NOT NULL,
        fecha_fin DATE NOT NULL,
        max_intentos INTEGER,
        clase_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES usuarios(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ Tabla "retos" verificada/creada correctamente');

    // Asegurar que la columna max_intentos exista
    await pool.query(`
      ALTER TABLE retos ADD COLUMN IF NOT EXISTS max_intentos INTEGER;
    `).catch(err => {
      // Ignorar error si ya existe
      if (!err.message.includes('already')) console.log('Nota: max_intentos ya existe');
    });

    // Asegurar que la columna categoria exista
    await pool.query(`
      ALTER TABLE retos ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
    `).catch(err => {
      // Ignorar error si ya existe
      if (!err.message.includes('already')) console.log('Nota: categoria ya existe');
    });

    // Asegurar que la columna clase_id exista
    await pool.query(`
      ALTER TABLE retos ADD COLUMN IF NOT EXISTS clase_id INTEGER;
    `).catch(err => {
      if (!err.message.includes('already')) console.log('Nota: clase_id ya existe');
    });

    // 9. TABLA DE PREGUNTAS DE RETOS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS preguntas_reto (
        id SERIAL PRIMARY KEY,
        reto_id INTEGER REFERENCES retos(id) ON DELETE CASCADE,
        pregunta TEXT NOT NULL,
        opciones JSONB,
        respuesta_correcta TEXT NOT NULL,
        tipo_pregunta VARCHAR(20) DEFAULT 'multiple_choice' CHECK (tipo_pregunta IN ('multiple_choice', 'fill_blank'))
      );
    `);
    console.log('✅ Tabla "preguntas_reto" verificada/creada correctamente');

    // Alterar columna respuesta_correcta a TEXT si es INTEGER
    await pool.query(`
      ALTER TABLE preguntas_reto ALTER COLUMN respuesta_correcta TYPE TEXT;
    `).catch(err => {
      // Ignorar error si ya es TEXT
      if (!err.message.includes('already')) console.log('Nota: respuesta_correcta ya es TEXT');
    });

    // Actualizar la restricción CHECK para incluir drag_drop
    await pool.query(`
      ALTER TABLE preguntas_reto DROP CONSTRAINT IF EXISTS preguntas_reto_tipo_pregunta_check;
      ALTER TABLE preguntas_reto ADD CONSTRAINT preguntas_reto_tipo_pregunta_check
      CHECK (tipo_pregunta IN ('multiple_choice', 'fill_blank', 'drag_drop'));
    `).catch(err => {
      // Ignorar si ya está actualizado
      if (!err.message.includes('already')) console.log('Nota: Restricción de tipo_pregunta actualizada');
    });

    // 10. TABLA DE PARTICIPANTES DE RETOS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reto_participantes (
        id SERIAL PRIMARY KEY,
        reto_id INTEGER REFERENCES retos(id) ON DELETE CASCADE,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        xp_ganado INTEGER DEFAULT 0,
        intentos_usados INTEGER DEFAULT 0,
        UNIQUE(reto_id, usuario_id)
      );
    `);
    console.log('✅ Tabla "reto_participantes" verificada/creada correctamente');

    // Asegurar que la columna intentos_usados exista
    await pool.query(`
      ALTER TABLE reto_participantes ADD COLUMN IF NOT EXISTS intentos_usados INTEGER DEFAULT 0;
    `).catch(err => {
      // Ignorar error si ya existe
      if (!err.message.includes('already')) console.log('Nota: intentos_usados ya existe');
    });

    // 11. TABLA DE LECCIONES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lecciones (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        contenido TEXT,
        imagen_url TEXT,
        preguntas JSONB,
        created_by INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla "lecciones" verificada/creada correctamente');

    // Asegurar que la columna imagen_url exista
    await pool.query(`
      ALTER TABLE lecciones ADD COLUMN IF NOT EXISTS imagen_url TEXT;
    `).catch(err => {
      // Ignorar error si ya existe
      if (!err.message.includes('already')) console.log('Nota: imagen_url ya existe');
    });

    // Asegurar que la columna multimedia exista
    await pool.query(`
      ALTER TABLE lecciones ADD COLUMN IF NOT EXISTS multimedia JSONB DEFAULT '[]';
    `).catch(err => {
      // Ignorar error si ya existe
      if (!err.message.includes('already')) console.log('Nota: multimedia ya existe');
    });

    // Asegurar que la columna tema exista para categorizar lecciones
    await pool.query(`
      ALTER TABLE lecciones ADD COLUMN IF NOT EXISTS tema VARCHAR(255);
    `).catch(err => {
      // Ignorar error si ya existe
      if (!err.message.includes('already')) console.log('Nota: tema ya existe');
    });

    // 12. TABLA DE ARCHIVOS MULTIMEDIA
    await pool.query(`
      CREATE TABLE IF NOT EXISTS multimedia (
        id SERIAL PRIMARY KEY,
        nombre_original VARCHAR(255) NOT NULL,
        nombre_archivo VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) CHECK (tipo IN ('video', 'audio', 'imagen')),
        mime_type VARCHAR(100),
        tamano INTEGER,
        ruta VARCHAR(500) NOT NULL,
        url_publica VARCHAR(500),
        uploaded_by INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla "multimedia" verificada/creada correctamente');

    // 13. TABLA DE LECCIONES COMPLETADAS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lecciones_completadas (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        leccion_id INTEGER REFERENCES lecciones(id) ON DELETE CASCADE,
        puntuacion INTEGER NOT NULL,  -- respuestas correctas
        total_preguntas INTEGER NOT NULL,
        xp_ganado INTEGER DEFAULT 0,
        completado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(estudiante_id, leccion_id)
      );
    `);
    console.log('✅ Tabla "lecciones_completadas" verificada/creada correctamente');

    // 14. TABLA DE PROGRESO POR ESTUDIANTE Y TEMA
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progreso_estudiante_tema (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        tema VARCHAR(255) NOT NULL,
        progreso DECIMAL(5,2) DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
        lecciones_completadas INTEGER DEFAULT 0,
        total_lecciones INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(estudiante_id, tema)
      );
    `);
    console.log('✅ Tabla "progreso_estudiante_tema" verificada/creada correctamente');

    // Asegurar que la columna 'tema' existe (por compatibilidad con versiones anteriores)
    await pool.query(`
      ALTER TABLE progreso_estudiante_tema ADD COLUMN IF NOT EXISTS tema VARCHAR(255);
      ALTER TABLE progreso_estudiante_tema ALTER COLUMN tema SET NOT NULL;
    `).catch(err => {
      // Si ya existe, continuar
      if (!err.message.includes('already')) console.log('Nota: columna tema ya existe');
    });

    // Eliminar trigger problemático si existe
    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_actualizar_progreso ON lecciones_completadas;
      DROP FUNCTION IF EXISTS actualizar_progreso_estudiante();
    `).catch(err => {
      console.log('Nota: trigger ya eliminado o no existía');
    });

    console.log('✅ Triggers problemáticos eliminados');

    // Crear índices para mejorar el rendimiento
    await pool.query(`
      -- Eliminar índices antiguos que puedan causar conflictos
      DROP INDEX IF EXISTS idx_lecciones_asignatura;
      DROP INDEX IF EXISTS idx_progreso_estudiante_tema_asignatura;

      CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
      CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);
      CREATE INDEX IF NOT EXISTS idx_usuarios_xp ON usuarios(xp_total);
      CREATE INDEX IF NOT EXISTS idx_progreso_estudiante ON progreso_estudiante(estudiante_id);
      CREATE INDEX IF NOT EXISTS idx_progreso_actividad ON progreso_estudiante(actividad_id);
      CREATE INDEX IF NOT EXISTS idx_historial_xp_usuario ON historial_xp(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_actividades_tipo ON actividades(tipo);
      CREATE INDEX IF NOT EXISTS idx_actividades_activa ON actividades(activa);
      CREATE INDEX IF NOT EXISTS idx_retos_tipo ON retos(tipo);
      CREATE INDEX IF NOT EXISTS idx_retos_fecha_fin ON retos(fecha_fin);
      CREATE INDEX IF NOT EXISTS idx_preguntas_reto_id ON preguntas_reto(reto_id);
      CREATE INDEX IF NOT EXISTS idx_reto_participantes_reto ON reto_participantes(reto_id);
      CREATE INDEX IF NOT EXISTS idx_reto_participantes_usuario ON reto_participantes(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_lecciones_created_by ON lecciones(created_by);
      CREATE INDEX IF NOT EXISTS idx_lecciones_tema ON lecciones(tema);
      CREATE INDEX IF NOT EXISTS idx_lecciones_completadas_estudiante ON lecciones_completadas(estudiante_id);
      CREATE INDEX IF NOT EXISTS idx_lecciones_completadas_leccion ON lecciones_completadas(leccion_id);
      CREATE INDEX IF NOT EXISTS idx_progreso_estudiante_tema_estudiante ON progreso_estudiante_tema(estudiante_id);
      CREATE INDEX IF NOT EXISTS idx_progreso_estudiante_tema_tema ON progreso_estudiante_tema(tema);
    `);
    console.log('✅ Índices creados correctamente');

  } catch (error) {
    console.error('❌ Error al crear las tablas:', error);
    throw error;
  }
};

// Función para verificar la conexión
const checkConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión a la base de datos verificada');
    return true;
  } catch (error) {
    console.error('❌ Error al verificar la conexión:', error);
    return false;
  }
};

// Inicializar la base de datos
const initializeDatabase = async () => {
  try {
    const isConnected = await checkConnection();
    if (isConnected) {
      await createTables();
      console.log('✅ Base de datos inicializada correctamente');
    }
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

module.exports = {
  pool,
  initializeDatabase
};