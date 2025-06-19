const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const User = require('./models/User');
const UserRepository = require('./repositories/UserRepository');
const UserService = require('./services/UserService');
const UserController = require('./controllers/UserController');
const { register, metricsMiddleware, userRegistrations, userLogins, databaseOperations } = require('./middleware/metrics');

class App {
  constructor() {
    this.app = express();
    this.bd = null;
    this.repositorioUsuario = null;
    this.servicioUsuario = null;
    this.controladorUsuario = null;
  }

  async initialize() {
    // Configurar base de datos
    this.bd = new sqlite3.Database(':memory:');
    await this.crearTablas();

    // Configurar dependencias
    this.repositorioUsuario = new UserRepository(this.bd);
    this.servicioUsuario = new UserService(this.repositorioUsuario);
    this.controladorUsuario = new UserController(this.servicioUsuario);

    // Configurar middleware
    this.configurarMiddleware();

    // Configurar rutas
    this.configurarRutas();

    // Configurar manejo de errores
    this.configurarManejoErrores();
  }

  configurarMiddleware() {
    // Middleware de seguridad
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors());
    
    // Métricas middleware - AGREGAR ANTES de Morgan para capturar todas las requests
    this.app.use(metricsMiddleware);
    
    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined'));
    }
    
    // Análisis de cuerpo de request
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  crearTablas() {
    return new Promise((resolve, reject) => {
      const crearTablaUsuarios = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.bd.run(crearTablaUsuarios, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  configurarRutas() {
    // Endpoint de verificación de salud
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // Endpoint de métricas para Prometheus - ACTUALIZADO
    this.app.get('/metrics', async (req, res) => {
      try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
      } catch (error) {
        console.error('Error generating metrics:', error);
        res.status(500).end(error.toString());
      }
    });

    // Información de la API
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'API de Testing DevOps',
        version: '1.0.0',
        description: 'API para demostrar todos los tipos de testing en DevOps',
        endpoints: {
          health: 'GET /health',
          metrics: 'GET /metrics',
          users: {
            create: 'POST /api/users',
            getAll: 'GET /api/users',
            getById: 'GET /api/users/:id',
            update: 'PUT /api/users/:id',
            delete: 'DELETE /api/users/:id'
          },
          auth: {
            login: 'POST /api/auth/login'
          }
        }
      });
    });

    // Rutas de usuario - ACTUALIZADAS con métricas
    this.app.post('/api/users', (req, res) => {
      // Incrementar métrica de registro de usuario
      userRegistrations.inc();
      // Incrementar métrica de operación de base de datos
      databaseOperations.inc({ operation: 'create', table: 'users' });
      
      this.controladorUsuario.createUser(req, res);
    });

    this.app.get('/api/users', (req, res) => {
      databaseOperations.inc({ operation: 'select', table: 'users' });
      this.controladorUsuario.getUsers(req, res);
    });

    this.app.get('/api/users/:id', (req, res) => {
      databaseOperations.inc({ operation: 'select', table: 'users' });
      this.controladorUsuario.getUserById(req, res);
    });

    this.app.put('/api/users/:id', (req, res) => {
      databaseOperations.inc({ operation: 'update', table: 'users' });
      this.controladorUsuario.updateUser(req, res);
    });

    this.app.delete('/api/users/:id', (req, res) => {
      databaseOperations.inc({ operation: 'delete', table: 'users' });
      this.controladorUsuario.deleteUser(req, res);
    });

    // Rutas de autenticación - ACTUALIZADAS con métricas
    this.app.post('/api/auth/login', (req, res) => {
      // La métrica de login se manejará en el controlador basado en el resultado
      this.controladorUsuario.loginUser(req, res);
    });
  }

  configurarManejoErrores() {
    // Manejador 404
    this.app.use('*', (req, res) => {
      res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method
      });
    });

    // Manejador global de errores
    this.app.use((err, req, res, next) => {
      // Manejar errores de análisis JSON
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
          error: 'Formato JSON inválido',
          type: 'JSON_PARSE_ERROR'
        });
      }

      // Registrar error en desarrollo
      if (process.env.NODE_ENV !== 'test') {
        console.error('Manejador global de errores:', err);
      }
      
      res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
      });
    });
  }

  getApp() {
    return this.app;
  }

  getDatabase() {
    return this.bd;
  }

  close() {
    if (this.bd) {
      this.bd.close();
    }
  }
}

module.exports = { App, User, UserRepository, UserService, UserController };