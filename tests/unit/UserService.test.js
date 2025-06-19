const UserService = require('../../src/services/UserService');
const User = require('../../src/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock de dependencias
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Servicio Usuario - Tests Unitarios (TDD)', () => {
  let servicioUsuario;
  let mockRepositorioUsuario;

  beforeEach(() => {
    mockRepositorioUsuario = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    servicioUsuario = new UserService(mockRepositorioUsuario);
    
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  describe('crearUsuario', () => {
    const datosUsuarioValidos = {
      username: 'usuarioprueba',
      email: 'test@ejemplo.com',
      password: 'contraseña123'
    };

    test('debería crear usuario con datos válidos', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue(null);
      mockRepositorioUsuario.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('contraseñahasheada');
      
      const usuarioEsperado = new User(1, datosUsuarioValidos.username, datosUsuarioValidos.email, 'contraseñahasheada');
      mockRepositorioUsuario.create.mockResolvedValue(usuarioEsperado);

      const resultado = await servicioUsuario.createUser(datosUsuarioValidos);

      expect(mockRepositorioUsuario.findByEmail).toHaveBeenCalledWith(datosUsuarioValidos.email);
      expect(mockRepositorioUsuario.findByUsername).toHaveBeenCalledWith(datosUsuarioValidos.username);
      expect(bcrypt.hash).toHaveBeenCalledWith(datosUsuarioValidos.password, 10);
      expect(mockRepositorioUsuario.create).toHaveBeenCalled();
      expect(resultado).toBe(usuarioEsperado);
    });

    test('debería crear usuario con datos completos', async () => {
      const datosCompletos = {
        username: 'usuariocompletoprueba',
        email: 'completo@ejemplo.com',
        password: 'contraseñasegura123456'
      };

      mockRepositorioUsuario.findByEmail.mockResolvedValue(null);
      mockRepositorioUsuario.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashcompleto');
      
      const usuarioCreado = new User(2, datosCompletos.username, datosCompletos.email, 'hashcompleto');
      mockRepositorioUsuario.create.mockResolvedValue(usuarioCreado);

      const resultado = await servicioUsuario.createUser(datosCompletos);

      expect(resultado.username).toBe(datosCompletos.username);
      expect(resultado.email).toBe(datosCompletos.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(datosCompletos.password, 10);
    });

    test('debería lanzar error por nombre de usuario inválido - muy corto', async () => {
      const datosInvalidos = { ...datosUsuarioValidos, username: 'ab' };

      await expect(servicioUsuario.createUser(datosInvalidos))
        .rejects.toThrow('Username must be between 3 and 50 characters');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error por nombre de usuario inválido - muy largo', async () => {
      const datosInvalidos = { ...datosUsuarioValidos, username: 'a'.repeat(51) };

      await expect(servicioUsuario.createUser(datosInvalidos))
        .rejects.toThrow('Username must be between 3 and 50 characters');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error por nombre de usuario vacío', async () => {
      const datosInvalidos = { ...datosUsuarioValidos, username: '' };

      await expect(servicioUsuario.createUser(datosInvalidos))
        .rejects.toThrow('Username must be between 3 and 50 characters');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error por email inválido', async () => {
      const datosInvalidos = { ...datosUsuarioValidos, email: 'email-invalido' };

      await expect(servicioUsuario.createUser(datosInvalidos))
        .rejects.toThrow('Invalid email format');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error por email sin @', async () => {
      const datosInvalidos = { ...datosUsuarioValidos, email: 'emailsindominio.com' };

      await expect(servicioUsuario.createUser(datosInvalidos))
        .rejects.toThrow('Invalid email format');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error por contraseña débil', async () => {
      const datosInvalidos = { ...datosUsuarioValidos, password: '123' };

      await expect(servicioUsuario.createUser(datosInvalidos))
        .rejects.toThrow('Password must be at least 8 characters');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error por contraseña vacía', async () => {
      const datosInvalidos = { ...datosUsuarioValidos, password: '' };

      await expect(servicioUsuario.createUser(datosInvalidos))
        .rejects.toThrow('Password must be at least 8 characters');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería aceptar contraseña de exactamente 8 caracteres', async () => {
      const datosValidos = { ...datosUsuarioValidos, password: 'exacta8!' };
      
      mockRepositorioUsuario.findByEmail.mockResolvedValue(null);
      mockRepositorioUsuario.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashexacto');
      
      const usuarioCreado = new User(1, datosValidos.username, datosValidos.email, 'hashexacto');
      mockRepositorioUsuario.create.mockResolvedValue(usuarioCreado);

      const resultado = await servicioUsuario.createUser(datosValidos);

      expect(resultado).toBe(usuarioCreado);
      expect(bcrypt.hash).toHaveBeenCalledWith(datosValidos.password, 10);
    });

    test('debería lanzar error si el email ya existe', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue({ id: 1 });

      await expect(servicioUsuario.createUser(datosUsuarioValidos))
        .rejects.toThrow('User already exists with this email');

      expect(mockRepositorioUsuario.findByUsername).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test('debería lanzar error si el nombre de usuario ya existe', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue(null);
      mockRepositorioUsuario.findByUsername.mockResolvedValue({ id: 1 });

      await expect(servicioUsuario.createUser(datosUsuarioValidos))
        .rejects.toThrow('Username already taken');

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test('debería manejar error del hash de contraseña', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue(null);
      mockRepositorioUsuario.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(new Error('Error de hashing'));

      await expect(servicioUsuario.createUser(datosUsuarioValidos))
        .rejects.toThrow('Error de hashing');

      expect(mockRepositorioUsuario.create).not.toHaveBeenCalled();
    });

    test('debería manejar error del repositorio al crear', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue(null);
      mockRepositorioUsuario.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hash');
      mockRepositorioUsuario.create.mockRejectedValue(new Error('Error de base de datos'));

      await expect(servicioUsuario.createUser(datosUsuarioValidos))
        .rejects.toThrow('Error de base de datos');
    });
  });

  describe('autenticarUsuario', () => {
    const email = 'test@ejemplo.com';
    const contraseña = 'contraseña123';
    const mockUsuario = {
      id: 1,
      email,
      username: 'usuarioprueba',
      password: 'contraseñahasheada',
      toJSON: () => ({ id: 1, email, username: 'usuarioprueba' })
    };

    test('debería autenticar usuario con credenciales válidas', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue(mockUsuario);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token-mock');

      const resultado = await servicioUsuario.authenticateUser(email, contraseña);

      expect(mockRepositorioUsuario.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(contraseña, mockUsuario.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUsuario.id, email: mockUsuario.email, username: mockUsuario.username },
        servicioUsuario.jwtSecret,
        { expiresIn: '24h' }
      );
      expect(resultado.user).toEqual({ id: 1, email, username: 'usuarioprueba' });
      expect(resultado.token).toBe('token-mock');
    });

    test('debería autenticar con diferentes tipos de contraseña', async () => {
      const contraseñaCompleja = 'MiContraseña123!@#';
      mockRepositorioUsuario.findByEmail.mockResolvedValue(mockUsuario);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token-complejo');

      const resultado = await servicioUsuario.authenticateUser(email, contraseñaCompleja);

      expect(bcrypt.compare).toHaveBeenCalledWith(contraseñaCompleja, mockUsuario.password);
      expect(resultado.token).toBe('token-complejo');
    });

    test('debería lanzar error por email faltante', async () => {
      await expect(servicioUsuario.authenticateUser('', contraseña))
        .rejects.toThrow('Email and password are required');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error por email null', async () => {
      await expect(servicioUsuario.authenticateUser(null, contraseña))
        .rejects.toThrow('Email and password are required');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error por contraseña faltante', async () => {
      await expect(servicioUsuario.authenticateUser(email, ''))
        .rejects.toThrow('Email and password are required');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error por contraseña null', async () => {
      await expect(servicioUsuario.authenticateUser(email, null))
        .rejects.toThrow('Email and password are required');

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
    });

    test('debería lanzar error para usuario inexistente', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue(null);

      await expect(servicioUsuario.authenticateUser(email, contraseña))
        .rejects.toThrow('Invalid credentials');

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('debería lanzar error por contraseña inválida', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue(mockUsuario);
      bcrypt.compare.mockResolvedValue(false);

      await expect(servicioUsuario.authenticateUser(email, contraseña))
        .rejects.toThrow('Invalid credentials');

      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('debería manejar error del repositorio', async () => {
      mockRepositorioUsuario.findByEmail.mockRejectedValue(new Error('Error de base de datos'));

      await expect(servicioUsuario.authenticateUser(email, contraseña))
        .rejects.toThrow('Error de base de datos');

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('debería manejar error de bcrypt.compare', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue(mockUsuario);
      bcrypt.compare.mockRejectedValue(new Error('Error de comparación'));

      await expect(servicioUsuario.authenticateUser(email, contraseña))
        .rejects.toThrow('Error de comparación');

      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('debería manejar error de generación de JWT', async () => {
      mockRepositorioUsuario.findByEmail.mockResolvedValue(mockUsuario);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation(() => {
        throw new Error('Error de JWT');
      });

      await expect(servicioUsuario.authenticateUser(email, contraseña))
        .rejects.toThrow('Error de JWT');
    });
  });

  describe('obtenerUsuarioPorId', () => {
    test('debería retornar usuario para ID válido', async () => {
      const mockUsuario = { id: 1, username: 'usuarioprueba' };
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);

      const resultado = await servicioUsuario.getUserById(1);

      expect(mockRepositorioUsuario.findById).toHaveBeenCalledWith(1);
      expect(resultado).toBe(mockUsuario);
    });

    test('debería retornar null para usuario inexistente', async () => {
      mockRepositorioUsuario.findById.mockResolvedValue(null);

      const resultado = await servicioUsuario.getUserById(999);

      expect(mockRepositorioUsuario.findById).toHaveBeenCalledWith(999);
      expect(resultado).toBeNull();
    });

    test('debería lanzar error para ID inválido - string', async () => {
      await expect(servicioUsuario.getUserById('invalido'))
        .rejects.toThrow('Valid user ID is required');

      expect(mockRepositorioUsuario.findById).not.toHaveBeenCalled();
    });

    test('debería aceptar ID negativo (limitación actual de validación)', async () => {
      // Nota: El código actual permite IDs negativos
      // En producción deberías considerar agregar validación `id <= 0`
      const mockUsuario = { id: -1, username: 'usuarioprueba' };
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);

      const resultado = await servicioUsuario.getUserById(-1);

      expect(mockRepositorioUsuario.findById).toHaveBeenCalledWith(-1);
      expect(resultado).toBe(mockUsuario);
    });

    test('MEJORA SUGERIDA: debería manejar ID cero correctamente', async () => {
      // En JavaScript, 0 es falsy, por lo que lanza error con la validación actual
      await expect(servicioUsuario.getUserById(0))
        .rejects.toThrow('Valid user ID is required');
      
      expect(mockRepositorioUsuario.findById).not.toHaveBeenCalled();
      
      // Nota: Si quisieras permitir ID 0, cambiarías la validación a:
      // if (id === null || id === undefined || isNaN(id))
    });

    test('debería lanzar error para ID nulo', async () => {
      await expect(servicioUsuario.getUserById(null))
        .rejects.toThrow('Valid user ID is required');

      expect(mockRepositorioUsuario.findById).not.toHaveBeenCalled();
    });

    test('debería lanzar error para ID undefined', async () => {
      await expect(servicioUsuario.getUserById(undefined))
        .rejects.toThrow('Valid user ID is required');

      expect(mockRepositorioUsuario.findById).not.toHaveBeenCalled();
    });

    test('debería aceptar ID como string numérico válido', async () => {
      const mockUsuario = { id: 1, username: 'usuarioprueba' };
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);

      const resultado = await servicioUsuario.getUserById('1');

      expect(mockRepositorioUsuario.findById).toHaveBeenCalledWith(1);
      expect(resultado).toBe(mockUsuario);
    });

    test('debería manejar error del repositorio', async () => {
      mockRepositorioUsuario.findById.mockRejectedValue(new Error('Error de base de datos'));

      await expect(servicioUsuario.getUserById(1))
        .rejects.toThrow('Error de base de datos');
    });
  });

  describe('obtenerTodosLosUsuarios', () => {
    test('debería retornar todos los usuarios', async () => {
      const mockUsuarios = [
        { id: 1, username: 'usuario1' }, 
        { id: 2, username: 'usuario2' }
      ];
      mockRepositorioUsuario.findAll.mockResolvedValue(mockUsuarios);

      const resultado = await servicioUsuario.getAllUsers();

      expect(mockRepositorioUsuario.findAll).toHaveBeenCalled();
      expect(resultado).toBe(mockUsuarios);
      expect(resultado).toHaveLength(2);
    });

    test('debería retornar array vacío cuando no hay usuarios', async () => {
      mockRepositorioUsuario.findAll.mockResolvedValue([]);

      const resultado = await servicioUsuario.getAllUsers();

      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });

    test('debería manejar gran cantidad de usuarios', async () => {
      const mockUsuarios = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        username: `usuario${i + 1}`
      }));
      mockRepositorioUsuario.findAll.mockResolvedValue(mockUsuarios);

      const resultado = await servicioUsuario.getAllUsers();

      expect(resultado).toHaveLength(1000);
      expect(resultado[0].username).toBe('usuario1');
      expect(resultado[999].username).toBe('usuario1000');
    });

    test('debería manejar error del repositorio', async () => {
      mockRepositorioUsuario.findAll.mockRejectedValue(new Error('Error de base de datos'));

      await expect(servicioUsuario.getAllUsers())
        .rejects.toThrow('Error de base de datos');
    });
  });

  describe('actualizarUsuario', () => {
    const mockUsuario = { id: 1, username: 'usuarioprueba', email: 'test@ejemplo.com' };

    test('debería actualizar usuario con datos válidos', async () => {
      const datosActualizacion = { username: 'nuevousuario' };
      const usuarioActualizado = { ...mockUsuario, username: 'nuevousuario' };
      
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.findByUsername.mockResolvedValue(null);
      mockRepositorioUsuario.update.mockResolvedValue(usuarioActualizado);

      const resultado = await servicioUsuario.updateUser(1, datosActualizacion);

      expect(mockRepositorioUsuario.findById).toHaveBeenCalledWith(1);
      expect(mockRepositorioUsuario.findByUsername).toHaveBeenCalledWith('nuevousuario');
      expect(mockRepositorioUsuario.update).toHaveBeenCalledWith(1, datosActualizacion);
      expect(resultado).toBe(usuarioActualizado);
    });

    test('debería actualizar email sin verificar username', async () => {
      const datosActualizacion = { email: 'nuevo@ejemplo.com' };
      const usuarioActualizado = { ...mockUsuario, email: 'nuevo@ejemplo.com' };
      
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.findByEmail.mockResolvedValue(null);
      mockRepositorioUsuario.update.mockResolvedValue(usuarioActualizado);

      const resultado = await servicioUsuario.updateUser(1, datosActualizacion);

      expect(mockRepositorioUsuario.findByEmail).toHaveBeenCalledWith('nuevo@ejemplo.com');
      expect(mockRepositorioUsuario.findByUsername).not.toHaveBeenCalled();
      expect(resultado.email).toBe('nuevo@ejemplo.com');
    });

    test('debería actualizar múltiples campos', async () => {
      const datosActualizacion = { username: 'nuevousuario', email: 'nuevo@ejemplo.com' };
      const usuarioActualizado = { 
        ...mockUsuario, 
        username: 'nuevousuario', 
        email: 'nuevo@ejemplo.com' 
      };
      
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.findByUsername.mockResolvedValue(null);
      mockRepositorioUsuario.findByEmail.mockResolvedValue(null);
      mockRepositorioUsuario.update.mockResolvedValue(usuarioActualizado);

      const resultado = await servicioUsuario.updateUser(1, datosActualizacion);

      expect(mockRepositorioUsuario.findByUsername).toHaveBeenCalledWith('nuevousuario');
      expect(mockRepositorioUsuario.findByEmail).toHaveBeenCalledWith('nuevo@ejemplo.com');
      expect(resultado.username).toBe('nuevousuario');
      expect(resultado.email).toBe('nuevo@ejemplo.com');
    });

    test('debería lanzar error para usuario inexistente', async () => {
      mockRepositorioUsuario.findById.mockResolvedValue(null);

      await expect(servicioUsuario.updateUser(1, { username: 'nuevousuario' }))
        .rejects.toThrow('User not found');

      expect(mockRepositorioUsuario.update).not.toHaveBeenCalled();
    });

    test('debería lanzar error por nombre de usuario inválido', async () => {
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);

      await expect(servicioUsuario.updateUser(1, { username: 'ab' }))
        .rejects.toThrow('Username must be between 3 and 50 characters');

      expect(mockRepositorioUsuario.update).not.toHaveBeenCalled();
    });

    test('debería lanzar error por email inválido', async () => {
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);

      await expect(servicioUsuario.updateUser(1, { email: 'email-invalido' }))
        .rejects.toThrow('Invalid email format');

      expect(mockRepositorioUsuario.update).not.toHaveBeenCalled();
    });

    test('debería lanzar error por email duplicado', async () => {
      const datosActualizacion = { email: 'existente@ejemplo.com' };
      
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.findByEmail.mockResolvedValue({ id: 2 });

      await expect(servicioUsuario.updateUser(1, datosActualizacion))
        .rejects.toThrow('Email already in use');

      expect(mockRepositorioUsuario.update).not.toHaveBeenCalled();
    });

    test('debería lanzar error por nombre de usuario duplicado', async () => {
      const datosActualizacion = { username: 'usuarioexistente' };
      
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.findByUsername.mockResolvedValue({ id: 2 });

      await expect(servicioUsuario.updateUser(1, datosActualizacion))
        .rejects.toThrow('Username already taken');

      expect(mockRepositorioUsuario.update).not.toHaveBeenCalled();
    });

    test('debería permitir actualizar con el mismo email actual', async () => {
      const datosActualizacion = { email: 'test@ejemplo.com' }; // El mismo email
      
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.update.mockResolvedValue(mockUsuario);

      const resultado = await servicioUsuario.updateUser(1, datosActualizacion);

      expect(mockRepositorioUsuario.findByEmail).not.toHaveBeenCalled();
      expect(mockRepositorioUsuario.update).toHaveBeenCalled();
    });

    test('debería permitir actualizar con el mismo username actual', async () => {
      const datosActualizacion = { username: 'usuarioprueba' }; // El mismo username
      
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.update.mockResolvedValue(mockUsuario);

      const resultado = await servicioUsuario.updateUser(1, datosActualizacion);

      expect(mockRepositorioUsuario.findByUsername).not.toHaveBeenCalled();
      expect(mockRepositorioUsuario.update).toHaveBeenCalled();
    });

    test('debería manejar datos de actualización vacíos', async () => {
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.update.mockResolvedValue(mockUsuario);

      const resultado = await servicioUsuario.updateUser(1, {});

      expect(mockRepositorioUsuario.update).toHaveBeenCalledWith(1, {});
      expect(resultado).toBe(mockUsuario);
    });
  });

  describe('eliminarUsuario', () => {
    test('debería eliminar usuario existente', async () => {
      const mockUsuario = { id: 1, username: 'usuarioprueba' };
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.delete.mockResolvedValue(true);

      const resultado = await servicioUsuario.deleteUser(1);

      expect(mockRepositorioUsuario.findById).toHaveBeenCalledWith(1);
      expect(mockRepositorioUsuario.delete).toHaveBeenCalledWith(1);
      expect(resultado).toBe(true);
    });

    test('debería lanzar error para usuario inexistente', async () => {
      mockRepositorioUsuario.findById.mockResolvedValue(null);

      await expect(servicioUsuario.deleteUser(1))
        .rejects.toThrow('User not found');

      expect(mockRepositorioUsuario.delete).not.toHaveBeenCalled();
    });

    test('debería manejar error del repositorio en findById', async () => {
      mockRepositorioUsuario.findById.mockRejectedValue(new Error('Error de búsqueda'));

      await expect(servicioUsuario.deleteUser(1))
        .rejects.toThrow('Error de búsqueda');

      expect(mockRepositorioUsuario.delete).not.toHaveBeenCalled();
    });

    test('debería manejar error del repositorio en delete', async () => {
      const mockUsuario = { id: 1, username: 'usuarioprueba' };
      mockRepositorioUsuario.findById.mockResolvedValue(mockUsuario);
      mockRepositorioUsuario.delete.mockRejectedValue(new Error('Error de eliminación'));

      await expect(servicioUsuario.deleteUser(1))
        .rejects.toThrow('Error de eliminación');
    });

    test('debería lanzar error para ID inválido', async () => {
      await expect(servicioUsuario.deleteUser('invalido'))
        .rejects.toThrow('Valid user ID is required');

      expect(mockRepositorioUsuario.findById).not.toHaveBeenCalled();
    });
  });

  describe('verificarToken', () => {
    test('debería verificar token válido', () => {
      const mockPayload = { userId: 1, email: 'test@ejemplo.com' };
      jwt.verify.mockReturnValue(mockPayload);

      const resultado = servicioUsuario.verifyToken('token-valido');

      expect(jwt.verify).toHaveBeenCalledWith('token-valido', servicioUsuario.jwtSecret);
      expect(resultado).toBe(mockPayload);
    });

    test('debería verificar token con datos completos', () => {
      const mockPayload = { 
        userId: 1, 
        email: 'test@ejemplo.com', 
        username: 'usuarioprueba',
        iat: 1234567890,
        exp: 1234654290
      };
      jwt.verify.mockReturnValue(mockPayload);

      const resultado = servicioUsuario.verifyToken('token-completo');

      expect(resultado.userId).toBe(1);
      expect(resultado.email).toBe('test@ejemplo.com');
      expect(resultado.username).toBe('usuarioprueba');
    });

    test('debería lanzar error para token inválido', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => servicioUsuario.verifyToken('token-invalido'))
        .toThrow('Invalid token');
    });

    test('debería lanzar error para token expirado', () => {
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      expect(() => servicioUsuario.verifyToken('token-expirado'))
        .toThrow('Invalid token');
    });

    test('debería lanzar error para token malformado', () => {
      jwt.verify.mockImplementation(() => {
        const error = new Error('Malformed token');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      expect(() => servicioUsuario.verifyToken('token-malformado'))
        .toThrow('Invalid token');
    });

    test('debería manejar token vacío', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Token required');
      });

      expect(() => servicioUsuario.verifyToken(''))
        .toThrow('Invalid token');
    });

    test('debería manejar token null', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Token required');
      });

      expect(() => servicioUsuario.verifyToken(null))
        .toThrow('Invalid token');
    });
  });

  describe('configuración del servicio', () => {
    test('debería usar JWT secret del entorno', () => {
      const servicioConSecret = new UserService(mockRepositorioUsuario);
      expect(servicioConSecret.jwtSecret).toBeDefined();
    });

    test('debería usar salt rounds configurado', () => {
      expect(servicioUsuario.saltRounds).toBe(10);
    });

    test('debería tener repositorio asignado', () => {
      expect(servicioUsuario.userRepository).toBe(mockRepositorioUsuario);
    });
  });
});