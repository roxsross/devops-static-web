// Configuración global para todos los tests
const { beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');

// Configuración de timeout global para tests
jest.setTimeout(10000);

// Variables globales para tests
global.testTimeout = 5000;

// Configuración antes de todos los tests
beforeAll(async () => {
  // Configurar variables de entorno para testing
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'clave-secreta-test';
  
  console.log('🧪 Iniciando suite de tests...');
});

// Limpieza después de todos los tests
afterAll(async () => {
  console.log('✅ Suite de tests completada');
});

// Configuración antes de cada test
beforeEach(() => {
  // Limpiar mocks antes de cada test
  jest.clearAllMocks();
});

// Limpieza después de cada test
afterEach(() => {
  // Cualquier limpieza necesaria después de cada test
});

// Utilidades para tests
global.utilidadesTest = {
  /**
   * Crea datos de usuario de prueba
   * @param {object} sobrescribir - Propiedades a sobrescribir
   * @returns {object} - Datos de usuario de prueba
   */
  crearDatosUsuarioPrueba: (sobrescribir = {}) => {
    const timestamp = Date.now();
    return {
      username: `usuarioprueba${timestamp}`,
      email: `prueba${timestamp}@ejemplo.com`,
      password: 'contraseñaprueba123',
      ...sobrescribir
    };
  },

  /**
   * Simula una pausa en la ejecución
   * @param {number} ms - Milisegundos a esperar
   */
  dormir: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Datos de usuario inválidos para tests negativos
   */
  datosUsuarioInvalidos: {
    usernameVacio: { username: '', email: 'test@ejemplo.com', password: 'contraseña123' },
    usernameCorto: { username: 'ab', email: 'test@ejemplo.com', password: 'contraseña123' },
    emailInvalido: { username: 'usuarioprueba', email: 'email-invalido', password: 'contraseña123' },
    contraseñaCorta: { username: 'usuarioprueba', email: 'test@ejemplo.com', password: '123' },
    usernameFaltante: { email: 'test@ejemplo.com', password: 'contraseña123' },
    emailFaltante: { username: 'usuarioprueba', password: 'contraseña123' },
    contraseñaFaltante: { username: 'usuarioprueba', email: 'test@ejemplo.com' }
  }
};

// Manejo de errores no capturados en tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada en:', promise, 'razón:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error);
});