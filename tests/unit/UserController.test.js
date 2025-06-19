const UserController = require('../../src/controllers/UserController');

describe('Controlador Usuario - Tests Unitarios (TDD)', () => {
  let controladorUsuario;
  let mockServicioUsuario;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockServicioUsuario = {
      createUser: jest.fn(),
      authenticateUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn()
    };

    controladorUsuario = new UserController(mockServicioUsuario);

    mockReq = {
      body: {},
      params: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('crearUsuario', () => {
    test('debería crear usuario con datos válidos', async () => {
      const datosUsuario = {
        username: 'usuarioprueba',
        email: 'test@ejemplo.com',
        password: 'contraseña123'
      };
      const mockUsuario = { 
        id: 1, 
        ...datosUsuario, 
        toJSON: () => ({ id: 1, username: datosUsuario.username, email: datosUsuario.email }) 
      };

      mockReq.body = datosUsuario;
      mockServicioUsuario.createUser.mockResolvedValue(mockUsuario);

      await controladorUsuario.createUser(mockReq, mockRes);

      expect(mockServicioUsuario.createUser).toHaveBeenCalledWith(datosUsuario);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: mockUsuario.toJSON()
      });
    });

    test('debería retornar 400 por nombre de usuario faltante', async () => {
      mockReq.body = { email: 'test@ejemplo.com', password: 'contraseña123' };

      await controladorUsuario.createUser(mockReq, mockRes);

      expect(mockServicioUsuario.createUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Username, email and password are required',
        received: { username: false, email: true, password: true }
      });
    });

    test('debería retornar 400 por email faltante', async () => {
      mockReq.body = { username: 'usuarioprueba', password: 'contraseña123' };

      await controladorUsuario.createUser(mockReq, mockRes);

      expect(mockServicioUsuario.createUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Username, email and password are required',
        received: { username: true, email: false, password: true }
      });
    });

    test('debería retornar 400 por contraseña faltante', async () => {
      mockReq.body = { username: 'usuarioprueba', email: 'test@ejemplo.com' };

      await controladorUsuario.createUser(mockReq, mockRes);

      expect(mockServicioUsuario.createUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Username, email and password are required',
        received: { username: true, email: true, password: false }
      });
    });

    test('debería retornar 400 por error de validación', async () => {
      mockReq.body = { username: 'usuarioprueba', email: 'test@ejemplo.com', password: 'contraseña123' };
      mockServicioUsuario.createUser.mockRejectedValue(new Error('Invalid email format'));

      await controladorUsuario.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid email format',
        type: 'VALIDATION_ERROR'
      });
    });

    test('debería manejar errores del servicio correctamente', async () => {
      mockReq.body = { username: 'usuarioprueba', email: 'test@ejemplo.com', password: 'contraseña123' };
      mockServicioUsuario.createUser.mockRejectedValue(new Error('Error de base de datos'));

      await controladorUsuario.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error de base de datos',
        type: 'VALIDATION_ERROR'
      });
    });
  });

  describe('loginUsuario', () => {
    test('debería hacer login de usuario con credenciales válidas', async () => {
      const datosLogin = { email: 'test@ejemplo.com', password: 'contraseña123' };
      const resultadoAuth = { user: { id: 1, email: datosLogin.email }, token: 'jwt-token' };

      mockReq.body = datosLogin;
      mockServicioUsuario.authenticateUser.mockResolvedValue(resultadoAuth);

      await controladorUsuario.loginUser(mockReq, mockRes);

      expect(mockServicioUsuario.authenticateUser).toHaveBeenCalledWith(datosLogin.email, datosLogin.password);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Authentication successful',
        ...resultadoAuth
      });
    });

    test('debería retornar 400 por email faltante', async () => {
      mockReq.body = { password: 'contraseña123' };

      await controladorUsuario.loginUser(mockReq, mockRes);

      expect(mockServicioUsuario.authenticateUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email and password are required',
        received: { email: false, password: true }
      });
    });

    test('debería retornar 400 por contraseña faltante', async () => {
      mockReq.body = { email: 'test@ejemplo.com' };

      await controladorUsuario.loginUser(mockReq, mockRes);

      expect(mockServicioUsuario.authenticateUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email and password are required',
        received: { email: true, password: false }
      });
    });

    test('debería retornar 401 por error de autenticación', async () => {
      mockReq.body = { email: 'test@ejemplo.com', password: 'contraseñaincorrecta' };
      mockServicioUsuario.authenticateUser.mockRejectedValue(new Error('Invalid credentials'));

      await controladorUsuario.loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid credentials',
        type: 'AUTHENTICATION_ERROR'
      });
    });

    test('debería manejar diferentes tipos de errores de autenticación', async () => {
      mockReq.body = { email: 'test@ejemplo.com', password: 'contraseña123' };
      mockServicioUsuario.authenticateUser.mockRejectedValue(new Error('User not found'));

      await controladorUsuario.loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User not found',
        type: 'AUTHENTICATION_ERROR'
      });
    });
  });

  describe('obtenerUsuarios', () => {
    test('debería retornar todos los usuarios', async () => {
      const mockUsuarios = [
        { id: 1, toJSON: () => ({ id: 1, username: 'usuario1' }) },
        { id: 2, toJSON: () => ({ id: 2, username: 'usuario2' }) }
      ];

      mockServicioUsuario.getAllUsers.mockResolvedValue(mockUsuarios);

      await controladorUsuario.getUsers(mockReq, mockRes);

      expect(mockServicioUsuario.getAllUsers).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        users: [{ id: 1, username: 'usuario1' }, { id: 2, username: 'usuario2' }],
        count: 2
      });
    });

    test('debería retornar lista vacía cuando no hay usuarios', async () => {
      mockServicioUsuario.getAllUsers.mockResolvedValue([]);

      await controladorUsuario.getUsers(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        users: [],
        count: 0
      });
    });

    test('debería manejar error del servicio', async () => {
      mockServicioUsuario.getAllUsers.mockRejectedValue(new Error('Error de base de datos'));

      await controladorUsuario.getUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error de base de datos',
        type: 'SERVER_ERROR'
      });
    });
  });

  describe('obtenerUsuarioPorId', () => {
    test('debería retornar usuario por ID válido', async () => {
      const mockUsuario = { id: 1, toJSON: () => ({ id: 1, username: 'usuarioprueba' }) };
      mockReq.params = { id: '1' };
      mockServicioUsuario.getUserById.mockResolvedValue(mockUsuario);

      await controladorUsuario.getUserById(mockReq, mockRes);

      expect(mockServicioUsuario.getUserById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: { id: 1, username: 'usuarioprueba' }
      });
    });

    test('debería retornar 400 por ID inválido', async () => {
      mockReq.params = { id: 'invalido' };

      await controladorUsuario.getUserById(mockReq, mockRes);

      expect(mockServicioUsuario.getUserById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Valid user ID is required',
        received: 'invalido'
      });
    });

    test('debería retornar 400 por ID vacío', async () => {
      mockReq.params = { id: '' };

      await controladorUsuario.getUserById(mockReq, mockRes);

      expect(mockServicioUsuario.getUserById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Valid user ID is required',
        received: ''
      });
    });

    test('debería retornar 404 para usuario inexistente', async () => {
      mockReq.params = { id: '999' };
      mockServicioUsuario.getUserById.mockResolvedValue(null);

      await controladorUsuario.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User not found',
        id: 999
      });
    });

    test('debería manejar error del servicio', async () => {
      mockReq.params = { id: '1' };
      mockServicioUsuario.getUserById.mockRejectedValue(new Error('Error de base de datos'));

      await controladorUsuario.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error de base de datos',
        type: 'SERVER_ERROR'
      });
    });
  });

  describe('actualizarUsuario', () => {
    test('debería actualizar usuario con datos válidos', async () => {
      const datosActualizacion = { username: 'nuevousuario' };
      const mockUsuario = { id: 1, toJSON: () => ({ id: 1, username: 'nuevousuario' }) };

      mockReq.params = { id: '1' };
      mockReq.body = datosActualizacion;
      mockServicioUsuario.updateUser.mockResolvedValue(mockUsuario);

      await controladorUsuario.updateUser(mockReq, mockRes);

      expect(mockServicioUsuario.updateUser).toHaveBeenCalledWith(1, datosActualizacion);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: { id: 1, username: 'nuevousuario' }
      });
    });

    test('debería actualizar múltiples campos', async () => {
      const datosActualizacion = { username: 'nuevousuario', email: 'nuevo@ejemplo.com' };
      const mockUsuario = { 
        id: 1, 
        toJSON: () => ({ id: 1, username: 'nuevousuario', email: 'nuevo@ejemplo.com' }) 
      };

      mockReq.params = { id: '1' };
      mockReq.body = datosActualizacion;
      mockServicioUsuario.updateUser.mockResolvedValue(mockUsuario);

      await controladorUsuario.updateUser(mockReq, mockRes);

      expect(mockServicioUsuario.updateUser).toHaveBeenCalledWith(1, datosActualizacion);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: { id: 1, username: 'nuevousuario', email: 'nuevo@ejemplo.com' }
      });
    });

    test('debería retornar 400 por ID inválido', async () => {
      mockReq.params = { id: 'invalido' };
      mockReq.body = { username: 'nuevousuario' };

      await controladorUsuario.updateUser(mockReq, mockRes);

      expect(mockServicioUsuario.updateUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Valid user ID is required',
        received: 'invalido'
      });
    });

    test('debería retornar 404 por error de no encontrado', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { username: 'nuevousuario' };
      mockServicioUsuario.updateUser.mockRejectedValue(new Error('User not found'));

      await controladorUsuario.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User not found',
        type: 'NOT_FOUND_ERROR'
      });
    });

    test('debería retornar 409 por error de conflicto', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { email: 'existente@ejemplo.com' };
      mockServicioUsuario.updateUser.mockRejectedValue(new Error('Email already in use'));

      await controladorUsuario.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email already in use',
        type: 'CONFLICT_ERROR'
      });
    });

    test('debería retornar 409 por username duplicado', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { username: 'usuarioexistente' };
      mockServicioUsuario.updateUser.mockRejectedValue(new Error('Username already taken'));

      await controladorUsuario.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Username already taken',
        type: 'CONFLICT_ERROR'
      });
    });

    test('debería retornar 400 por error de validación', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { username: 'ab' };
      mockServicioUsuario.updateUser.mockRejectedValue(new Error('Username must be between 3 and 50 characters'));

      await controladorUsuario.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Username must be between 3 and 50 characters',
        type: 'VALIDATION_ERROR'
      });
    });

    test('debería manejar cuerpo de request vacío', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = {};
      const mockUsuario = { id: 1, toJSON: () => ({ id: 1, username: 'usuario' }) };
      mockServicioUsuario.updateUser.mockResolvedValue(mockUsuario);

      await controladorUsuario.updateUser(mockReq, mockRes);

      expect(mockServicioUsuario.updateUser).toHaveBeenCalledWith(1, {});
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: { id: 1, username: 'usuario' }
      });
    });
  });

  describe('eliminarUsuario', () => {
    test('debería eliminar usuario exitosamente', async () => {
      mockReq.params = { id: '1' };
      mockServicioUsuario.deleteUser.mockResolvedValue(true);

      await controladorUsuario.deleteUser(mockReq, mockRes);

      expect(mockServicioUsuario.deleteUser).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User deleted successfully',
        id: 1
      });
    });

    test('debería retornar 400 por ID inválido', async () => {
      mockReq.params = { id: 'invalido' };

      await controladorUsuario.deleteUser(mockReq, mockRes);

      expect(mockServicioUsuario.deleteUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Valid user ID is required',
        received: 'invalido'
      });
    });

    test('debería retornar 400 por ID nulo', async () => {
      mockReq.params = { id: null };

      await controladorUsuario.deleteUser(mockReq, mockRes);

      expect(mockServicioUsuario.deleteUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('debería retornar 404 por error de no encontrado', async () => {
      mockReq.params = { id: '999' };
      mockServicioUsuario.deleteUser.mockRejectedValue(new Error('User not found'));

      await controladorUsuario.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User not found',
        type: 'NOT_FOUND_ERROR'
      });
    });

    test('debería manejar error del servicio', async () => {
      mockReq.params = { id: '1' };
      mockServicioUsuario.deleteUser.mockRejectedValue(new Error('Error de base de datos'));

      await controladorUsuario.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error de base de datos',
        type: 'SERVER_ERROR'
      });
    });

    test('debería manejar errores de conexión', async () => {
      mockReq.params = { id: '1' };
      mockServicioUsuario.deleteUser.mockRejectedValue(new Error('Connection timeout'));

      await controladorUsuario.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Connection timeout',
        type: 'SERVER_ERROR'
      });
    });
  });

  describe('manejo de errores generales', () => {
    test('debería manejar excepciones inesperadas en createUser', async () => {
      mockReq.body = { username: 'test', email: 'test@ejemplo.com', password: 'password123' };
      mockServicioUsuario.createUser.mockImplementation(() => {
        throw new TypeError('Unexpected error');
      });

      await controladorUsuario.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unexpected error',
        type: 'VALIDATION_ERROR'
      });
    });

    test('debería manejar promesas rechazadas en loginUser', async () => {
      mockReq.body = { email: 'test@ejemplo.com', password: 'password123' };
      mockServicioUsuario.authenticateUser.mockRejectedValue(new Error('Async error'));

      await controladorUsuario.loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Async error',
        type: 'AUTHENTICATION_ERROR'
      });
    });
  });
});