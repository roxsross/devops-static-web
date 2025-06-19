const request = require('supertest');
const { App } = require('../../src/app');

describe('Tests de Servicio API', () => {
  let app;
  let servidor;

  beforeEach(async () => {
    app = new App();
    await app.initialize();
    servidor = app.getApp();
  });

  afterEach(() => {
    if (app) {
      app.close();
    }
  });

  describe('Verificación de Salud', () => {
    test('GET /health debería retornar estado del servidor', async () => {
      const respuesta = await request(servidor)
        .get('/health')
        .expect(200);

      expect(respuesta.body.status).toBe('ok');
      expect(respuesta.body.timestamp).toBeTruthy();
      expect(respuesta.body.uptime).toBeGreaterThanOrEqual(0);
      expect(respuesta.body.environment).toBeTruthy();
      expect(respuesta.body.version).toBeTruthy();
    });

    test('Verificación de salud debería responder rápidamente', async () => {
      const inicio = Date.now();
      
      await request(servidor)
        .get('/health')
        .expect(200);
      
      const tiempoRespuesta = Date.now() - inicio;
      expect(tiempoRespuesta).toBeLessThan(100); // Debería responder en menos de 100ms
    });
  });

  describe('Documentación de API', () => {
    test('GET /api debería retornar información de la API', async () => {
      const respuesta = await request(servidor)
        .get('/api')
        .expect(200);

      expect(respuesta.body.name).toBeTruthy();
      expect(respuesta.body.version).toBeTruthy();
      expect(respuesta.body.description).toBeTruthy();
      expect(respuesta.body.endpoints).toBeTruthy();
    });
  });

  describe('Registro de Usuario', () => {
    test('POST /api/users debería crear nuevo usuario con datos válidos', async () => {
      const datosUsuario = utilidadesTest.crearDatosUsuarioPrueba();

      const respuesta = await request(servidor)
        .post('/api/users')
        .send(datosUsuario)
        .expect(201);

      expect(respuesta.body.user.id).toBeTruthy();
      expect(respuesta.body.user.username).toBe(datosUsuario.username);
      expect(respuesta.body.user.email).toBe(datosUsuario.email);
      expect(respuesta.body.user.password).toBeUndefined();
      expect(respuesta.body.user.createdAt).toBeTruthy();
      expect(respuesta.body.message).toBe('User created successfully');
    });

    test('POST /api/users debería rechazar email inválido', async () => {
      const datosInvalidos = utilidadesTest.crearDatosUsuarioPrueba({
        email: 'email-invalido'
      });

      const respuesta = await request(servidor)
        .post('/api/users')
        .send(datosInvalidos)
        .expect(400);

      expect(respuesta.body.error).toContain('Invalid email format');
      expect(respuesta.body.type).toBe('VALIDATION_ERROR');
    });

    test('POST /api/users debería rechazar contraseña débil', async () => {
      const datosInvalidos = utilidadesTest.crearDatosUsuarioPrueba({
        password: '123'
      });

      const respuesta = await request(servidor)
        .post('/api/users')
        .send(datosInvalidos)
        .expect(400);

      expect(respuesta.body.error).toContain('Password must be at least 8 characters');
    });

    test('POST /api/users debería rechazar username inválido', async () => {
      const datosInvalidos = utilidadesTest.crearDatosUsuarioPrueba({
        username: 'ab'
      });

      const respuesta = await request(servidor)
        .post('/api/users')
        .send(datosInvalidos)
        .expect(400);

      expect(respuesta.body.error).toContain('Username must be between 3 and 50 characters');
    });

    test('POST /api/users debería rechazar campos faltantes', async () => {
      const datosIncompletos = {
        username: 'usuarioprueba'
        // email y password faltantes
      };

      const respuesta = await request(servidor)
        .post('/api/users')
        .send(datosIncompletos)
        .expect(400);

      expect(respuesta.body.error).toContain('required');
      expect(respuesta.body.received).toBeTruthy();
    });

    test('POST /api/users debería rechazar email duplicado', async () => {
      const datosUsuario = utilidadesTest.crearDatosUsuarioPrueba();

      // Crear primer usuario
      await request(servidor)
        .post('/api/users')
        .send(datosUsuario)
        .expect(201);

      // Intentar crear usuario con el mismo email
      const datosDuplicados = utilidadesTest.crearDatosUsuarioPrueba({
        email: datosUsuario.email,
        username: 'usuariodiferente'
      });

      const respuesta = await request(servidor)
        .post('/api/users')
        .send(datosDuplicados)
        .expect(400);

      expect(respuesta.body.error).toContain('User already exists with this email');
    });

    test('POST /api/users debería rechazar username duplicado', async () => {
      const datosUsuario = utilidadesTest.crearDatosUsuarioPrueba();

      // Crear primer usuario
      await request(servidor)
        .post('/api/users')
        .send(datosUsuario)
        .expect(201);

      // Intentar crear usuario con el mismo username
      const datosDuplicados = utilidadesTest.crearDatosUsuarioPrueba({
        username: datosUsuario.username,
        email: 'diferente@ejemplo.com'
      });

      const respuesta = await request(servidor)
        .post('/api/users')
        .send(datosDuplicados)
        .expect(400);

      expect(respuesta.body.error).toContain('Username already taken');
    });
  });

  describe('Autenticación de Usuario', () => {
    let usuarioPrueba;

    beforeEach(async () => {
      // Crear usuario de prueba para autenticación
      usuarioPrueba = utilidadesTest.crearDatosUsuarioPrueba();
      await request(servidor)
        .post('/api/users')
        .send(usuarioPrueba)
        .expect(201);
    });

    test('POST /api/auth/login debería autenticar con credenciales válidas', async () => {
      const datosLogin = {
        email: usuarioPrueba.email,
        password: usuarioPrueba.password
      };

      const respuesta = await request(servidor)
        .post('/api/auth/login')
        .send(datosLogin)
        .expect(200);

      expect(respuesta.body.user).toBeTruthy();
      expect(respuesta.body.token).toBeTruthy();
      expect(respuesta.body.user.email).toBe(usuarioPrueba.email);
      expect(respuesta.body.user.password).toBeUndefined();
      expect(respuesta.body.message).toBe('Authentication successful');
    });

    test('POST /api/auth/login debería rechazar email inválido', async () => {
      const datosLogin = {
        email: 'inexistente@ejemplo.com',
        password: usuarioPrueba.password
      };

      const respuesta = await request(servidor)
        .post('/api/auth/login')
        .send(datosLogin)
        .expect(401);

      expect(respuesta.body.error).toBe('Invalid credentials');
      expect(respuesta.body.type).toBe('AUTHENTICATION_ERROR');
    });

    test('POST /api/auth/login debería rechazar contraseña inválida', async () => {
      const datosLogin = {
        email: usuarioPrueba.email,
        password: 'contraseñaincorrecta'
      };

      const respuesta = await request(servidor)
        .post('/api/auth/login')
        .send(datosLogin)
        .expect(401);

      expect(respuesta.body.error).toBe('Invalid credentials');
    });

    test('POST /api/auth/login debería rechazar credenciales faltantes', async () => {
      const respuesta = await request(servidor)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(respuesta.body.error).toContain('required');
    });
  });

  describe('Recuperación de Usuario', () => {
    test('GET /api/users debería retornar lista vacía inicialmente', async () => {
      const respuesta = await request(servidor)
        .get('/api/users')
        .expect(200);

      expect(respuesta.body.users).toEqual([]);
      expect(respuesta.body.count).toBe(0);
    });

    test('GET /api/users debería retornar todos los usuarios', async () => {
      // Crear usuarios de prueba
      const usuarios = [
        utilidadesTest.crearDatosUsuarioPrueba({ username: 'usuario1', email: 'usuario1@ejemplo.com' }),
        utilidadesTest.crearDatosUsuarioPrueba({ username: 'usuario2', email: 'usuario2@ejemplo.com' })
      ];

      for (const usuario of usuarios) {
        await request(servidor)
          .post('/api/users')
          .send(usuario)
          .expect(201);
      }

      const respuesta = await request(servidor)
        .get('/api/users')
        .expect(200);

      expect(respuesta.body.users).toHaveLength(2);
      expect(respuesta.body.count).toBe(2);
      
      // Verificar que no se incluyen las contraseñas
      respuesta.body.users.forEach(usuario => {
        expect(usuario.password).toBeUndefined();
        expect(usuario.id).toBeTruthy();
        expect(usuario.username).toBeTruthy();
        expect(usuario.email).toBeTruthy();
      });
    });

    test('GET /api/users/:id debería retornar usuario específico', async () => {
      const datosUsuario = utilidadesTest.crearDatosUsuarioPrueba();

      const respuestaCreacion = await request(servidor)
        .post('/api/users')
        .send(datosUsuario)
        .expect(201);

      const idUsuario = respuestaCreacion.body.user.id;

      const respuesta = await request(servidor)
        .get(`/api/users/${idUsuario}`)
        .expect(200);

      expect(respuesta.body.user.id).toBe(idUsuario);
      expect(respuesta.body.user.username).toBe(datosUsuario.username);
      expect(respuesta.body.user.email).toBe(datosUsuario.email);
      expect(respuesta.body.user.password).toBeUndefined();
    });

    test('GET /api/users/:id debería retornar 404 para usuario inexistente', async () => {
      const respuesta = await request(servidor)
        .get('/api/users/999')
        .expect(404);

      expect(respuesta.body.error).toBe('User not found');
      expect(respuesta.body.id).toBe(999);
    });

    test('GET /api/users/:id debería rechazar ID inválido', async () => {
      const respuesta = await request(servidor)
        .get('/api/users/invalido')
        .expect(400);

      expect(respuesta.body.error).toContain('Valid user ID is required');
    });
  });

  describe('Actualizaciones de Usuario', () => {
    let usuarioPrueba;
    let idUsuario;

    beforeEach(async () => {
      usuarioPrueba = utilidadesTest.crearDatosUsuarioPrueba();
      const respuesta = await request(servidor)
        .post('/api/users')
        .send(usuarioPrueba)
        .expect(201);
      idUsuario = respuesta.body.user.id;
    });

    test('PUT /api/users/:id debería actualizar username', async () => {
      const datosActualizacion = { username: 'nuevousuario' };

      const respuesta = await request(servidor)
        .put(`/api/users/${idUsuario}`)
        .send(datosActualizacion)
        .expect(200);

      expect(respuesta.body.user.username).toBe('nuevousuario');
      expect(respuesta.body.user.email).toBe(usuarioPrueba.email); // Email sin cambios
      expect(respuesta.body.message).toBe('User updated successfully');
    });

    test('PUT /api/users/:id debería actualizar email', async () => {
      const datosActualizacion = { email: 'nuevoemail@ejemplo.com' };

      const respuesta = await request(servidor)
        .put(`/api/users/${idUsuario}`)
        .send(datosActualizacion)
        .expect(200);

      expect(respuesta.body.user.email).toBe('nuevoemail@ejemplo.com');
      expect(respuesta.body.user.username).toBe(usuarioPrueba.username); // Username sin cambios
    });

    test('PUT /api/users/:id debería retornar 404 para usuario inexistente', async () => {
      const respuesta = await request(servidor)
        .put('/api/users/999')
        .send({ username: 'nuevousuario' })
        .expect(404);

      expect(respuesta.body.error).toContain('not found');
      expect(respuesta.body.type).toBe('NOT_FOUND_ERROR');
    });
  });

  describe('Eliminación de Usuario', () => {
    let usuarioPrueba;
    let idUsuario;

    beforeEach(async () => {
      usuarioPrueba = utilidadesTest.crearDatosUsuarioPrueba();
      const respuesta = await request(servidor)
        .post('/api/users')
        .send(usuarioPrueba)
        .expect(201);
      idUsuario = respuesta.body.user.id;
    });

    test('DELETE /api/users/:id debería eliminar usuario', async () => {
      const respuesta = await request(servidor)
        .delete(`/api/users/${idUsuario}`)
        .expect(200);

      expect(respuesta.body.message).toBe('User deleted successfully');
      expect(respuesta.body.id).toBe(idUsuario);

      // Verificar que el usuario ya no existe
      await request(servidor)
        .get(`/api/users/${idUsuario}`)
        .expect(404);
    });

    test('DELETE /api/users/:id debería retornar 404 para usuario inexistente', async () => {
      const respuesta = await request(servidor)
        .delete('/api/users/999')
        .expect(404);

      expect(respuesta.body.error).toBe('User not found');
    });
  });

  describe('Manejo de Errores', () => {
    test('debería retornar 404 para rutas desconocidas', async () => {
      const respuesta = await request(servidor)
        .get('/api/desconocido')
        .expect(404);

      expect(respuesta.body.error).toBe('Ruta no encontrada');
      expect(respuesta.body.path).toBe('/api/desconocido');
      expect(respuesta.body.method).toBe('GET');
    });

    test('debería manejar JSON malformado', async () => {
      const respuesta = await request(servidor)
        .post('/api/users')
        .type('json')
        .send('{ json invalido }')
        .expect(400);
    });
  });

  describe('Tests de Rendimiento', () => {
    test('debería manejar múltiples requests concurrentes', async () => {
      const promesas = [];
      
      // Crear 10 requests concurrentes
      for (let i = 0; i < 10; i++) {
        promesas.push(
          request(servidor)
            .get('/health')
            .expect(200)
        );
      }

      const respuestas = await Promise.all(promesas);
      
      respuestas.forEach(respuesta => {
        expect(respuesta.body.status).toBe('ok');
      });
    });

    test('debería mantener rendimiento bajo carga', async () => {
      const inicio = Date.now();
      
      // Crear múltiples usuarios concurrentemente
      const promesas = [];
      for (let i = 0; i < 5; i++) {
        const datosUsuario = utilidadesTest.crearDatosUsuarioPrueba({
          username: `pruebacarga${i}`,
          email: `pruebacarga${i}@ejemplo.com`
        });
        
        promesas.push(
          request(servidor)
            .post('/api/users')
            .send(datosUsuario)
            .expect(201)
        );
      }

      await Promise.all(promesas);
      
      const duracion = Date.now() - inicio;
      expect(duracion).toBeLessThan(2000); // Debería completarse en menos de 2 segundos
    });
  });
});