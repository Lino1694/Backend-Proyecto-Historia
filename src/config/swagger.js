const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuarios',
      version: '1.0.0',
      description: 'API REST para gestión de usuarios con autenticación',
      contact: {
        name: 'merequetengue',
        email: 'micorreodeberiairaqui@email.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          required: ['nombre', 'correo', 'contrasena'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID autogenerado del usuario'
            },
            nombre: {
              type: 'string',
              description: 'Nombre completo del usuario',
              example: 'Juan Pérez'
            },
            correo: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico único',
              example: 'juan@ejemplo.com'
            },
            contrasena: {
              type: 'string',
              format: 'password',
              description: 'Contraseña del usuario (mínimo 6 caracteres)',
              example: 'password123'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            }
          }
        },
        UsuarioRegistro: {
          type: 'object',
          required: ['nombre', 'correo', 'contrasena'],
          properties: {
            nombre: {
              type: 'string',
              example: 'Juan Pérez'
            },
            correo: {
              type: 'string',
              format: 'email',
              example: 'juan@ejemplo.com'
            },
            contrasena: {
              type: 'string',
              format: 'password',
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: ['student', 'teacher', 'moderator'],
              default: 'student',
              example: 'student'
            }
          }
        },
        UsuarioLogin: {
          type: 'object',
          required: ['correo', 'contrasena'],
          properties: {
            correo: {
              type: 'string',
              format: 'email',
              example: 'juan@ejemplo.com'
            },
            contrasena: {
              type: 'string',
              format: 'password',
              example: 'password123'
            },
            loginRole: {
              type: 'string',
              enum: ['student', 'teacher'],
              example: 'student',
              description: 'Rol con el que intenta iniciar sesión'
            }
          }
        },
        RespuestaExitosa: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Operación exitosa'
            },
            user: {
              $ref: '#/components/schemas/Usuario'
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Mensaje de error'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Rutas donde buscar las anotaciones
};

const specs = swaggerJsdoc(options);

module.exports = specs;