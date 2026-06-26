const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { initializeDatabase } = require('./config/database');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const xpRoutes = require('./routes/xpRoutes');
const retosRoutes = require('./routes/retosRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const leccionesRoutes = require('./routes/leccionesRoutes');
const ollamaRoutes = require('./routes/ollamaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Historia Lima - Documentación"
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/xp', xpRoutes);
app.use('/api/retos', retosRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/teacher', teacherRoutes);

// Servir archivos estáticos desde uploads
app.use('/uploads', express.static('uploads'));
app.use('/api/lecciones', leccionesRoutes);
app.use('/api/ollama', ollamaRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Historia Lima funcionando correctamente',
    version: '2.0.0',
    features: ['Usuarios', 'XP', 'Niveles', 'Ranking', 'Insignias', 'Retos', 'Lecciones', 'Ollama AI'],
    documentation: 'http://localhost:' + PORT + '/api-docs'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor con inicialización de base de datos y scripts
const startServer = async () => {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🎮 HISTORIA LIMA - Backend API con Sistema de XP');
    console.log('='.repeat(60));
    
    // Inicializar base de datos (crear tablas si no existen)
    await initializeDatabase();

    // Ejecutar scripts de inicialización de datos
    console.log('\n📝 Ejecutando scripts de inicialización...');
const seedScripts = [
      { path: './scripts/createTestUsers', fn: 'createTestUsers', name: 'createTestUsers' },
      { path: './scripts/createOrganizacionVirreinatoChallenges', fn: 'createOrganizacionVirreinatoChallenges', name: 'createOrganizacionVirreinatoChallenges' },
      { path: './scripts/createReformasBorbonicasChallenges', fn: 'createReformasBorbonicasChallenges', name: 'createReformasBorbonicasChallenges' },
      { path: './scripts/createRebelionesChallenges', fn: 'createRebelionesChallenges', name: 'createRebelionesChallenges' },
      { path: './scripts/createIndependenciaChallenges', fn: 'createIndependenciaChallenges', name: 'createIndependenciaChallenges' },
      { path: './scripts/createConsolidacionChallenges', fn: 'createConsolidacionChallenges', name: 'createConsolidacionChallenges' },
      { path: './scripts/createOrganizacionVirreinatoLecciones', fn: 'createOrganizacionVirreinatoLecciones', name: 'createOrganizacionVirreinatoLecciones' },
      { path: './scripts/createReformasBorbonicasLecciones', fn: 'createReformasBorbonicasLecciones', name: 'createReformasBorbonicasLecciones' },
      { path: './scripts/createRebelionesLecciones', fn: 'createRebelionesLecciones', name: 'createRebelionesLecciones' },
      { path: './scripts/createIndependenciaLecciones', fn: 'createIndependenciaLecciones', name: 'createIndependenciaLecciones' },
      { path: './scripts/createConsolidacionLecciones', fn: 'createConsolidacionLecciones', name: 'createConsolidacionLecciones' }
    ];
    
    for (const script of seedScripts) {
      try {
        const mod = require(script.path);
        if (typeof mod[script.fn] === 'function') {
          await mod[script.fn]();
          console.log(`  ✓ ${script.name}`);
        } else {
          console.log(`  ⚠ ${script.name}: función no encontrada`);
        }
      } catch (err) {
        // Ignorar errores de duplicados (código 23505 de PostgreSQL)
        if (err.code === '23505' || err.message?.includes('duplicate') || err.message?.includes('ya existe')) {
          console.log(`  ✓ ${script.name}: datos ya existentes`);
        } else {
          console.log(`  ⚠ ${script.name}: ${err.message || 'Error'}`);
        }
      }
    }



    console.log('📝 Scripts de inicialización completados\n');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación disponible en http://localhost:${PORT}/api-docs`);
      console.log(`🏆 Sistema de XP activado`);
      console.log('='.repeat(60) + '\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

// Iniciar la aplicación
startServer();