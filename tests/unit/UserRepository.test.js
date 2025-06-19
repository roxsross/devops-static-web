const UserRepository = require('../../src/repositories/UserRepository');
const User = require('../../src/models/User');

describe('Repositorio Usuario - Tests Unitarios (TDD)', () => {
  let repositorioUsuario;
  let mockBaseDatos;

  beforeEach(() => {
    mockBaseDatos = {
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn()
    };
    repositorioUsuario = new UserRepository(mockBaseDatos);
    jest.clearAllMocks();
  });

  describe('crear', () => {
    test('debería crear usuario exitosamente', async () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñahasheada');
      
      // Mock de inserción exitosa en base de datos
      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback.call({ lastID: 1 }, null);
      });

      const resultado = await repositorioUsuario.create(usuario);

      expect(mockBaseDatos.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [usuario.username, usuario.email, usuario.password, usuario.createdAt],
        expect.any(Function)
      );
      expect(resultado.id).toBe(1);
      expect(resultado.username).toBe('usuarioprueba');
    });

    test('debería rechazar cuando ocurre error de base de datos', async () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñahasheada');
      const errorBD = new Error('Fallo de conexión a base de datos');
      
      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback(errorBD);
      });

      await expect(repositorioUsuario.create(usuario)).rejects.toThrow('Fallo de conexión a base de datos');
    });
  });

  describe('buscarPorId', () => {
    test('debería encontrar usuario por ID exitosamente', async () => {
      const mockFila = {
        id: 1,
        username: 'usuarioprueba',
        email: 'test@ejemplo.com',
        password: 'contraseñahasheada',
        created_at: new Date()
      };

      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(null, mockFila);
      });

      const resultado = await repositorioUsuario.findById(1);

      expect(mockBaseDatos.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = ?'),
        [1],
        expect.any(Function)
      );
      expect(resultado).toBeInstanceOf(User);
      expect(resultado.id).toBe(1);
      expect(resultado.username).toBe('usuarioprueba');
    });

    test('debería retornar null cuando el usuario no se encuentra', async () => {
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(null, null);
      });

      const resultado = await repositorioUsuario.findById(999);

      expect(resultado).toBeNull();
    });

    test('debería rechazar cuando ocurre error de base de datos', async () => {
      const errorBD = new Error('Error de base de datos');
      
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(errorBD);
      });

      await expect(repositorioUsuario.findById(1)).rejects.toThrow('Error de base de datos');
    });
  });

  describe('buscarPorEmail', () => {
    test('debería encontrar usuario por email exitosamente', async () => {
      const mockFila = {
        id: 1,
        username: 'usuarioprueba',
        email: 'test@ejemplo.com',
        password: 'contraseñahasheada',
        created_at: new Date()
      };

      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(null, mockFila);
      });

      const resultado = await repositorioUsuario.findByEmail('test@ejemplo.com');

      expect(mockBaseDatos.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE email = ?'),
        ['test@ejemplo.com'],
        expect.any(Function)
      );
      expect(resultado).toBeInstanceOf(User);
      expect(resultado.email).toBe('test@ejemplo.com');
    });

    test('debería retornar null cuando el usuario no se encuentra', async () => {
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(null, null);
      });

      const resultado = await repositorioUsuario.findByEmail('inexistente@ejemplo.com');

      expect(resultado).toBeNull();
    });

    test('debería rechazar cuando ocurre error de base de datos', async () => {
      const errorBD = new Error('Error de base de datos');
      
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(errorBD);
      });

      await expect(repositorioUsuario.findByEmail('test@ejemplo.com')).rejects.toThrow('Error de base de datos');
    });
  });

  describe('buscarPorUsername', () => {
    test('debería encontrar usuario por username exitosamente', async () => {
      const mockFila = {
        id: 1,
        username: 'usuarioprueba',
        email: 'test@ejemplo.com',
        password: 'contraseñahasheada',
        created_at: new Date()
      };

      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(null, mockFila);
      });

      const resultado = await repositorioUsuario.findByUsername('usuarioprueba');

      expect(mockBaseDatos.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE username = ?'),
        ['usuarioprueba'],
        expect.any(Function)
      );
      expect(resultado).toBeInstanceOf(User);
      expect(resultado.username).toBe('usuarioprueba');
    });

    test('debería retornar null cuando el usuario no se encuentra', async () => {
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(null, null);
      });

      const resultado = await repositorioUsuario.findByUsername('inexistente');

      expect(resultado).toBeNull();
    });

    test('debería rechazar cuando ocurre error de base de datos', async () => {
      const errorBD = new Error('Error de base de datos');
      
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(errorBD);
      });

      await expect(repositorioUsuario.findByUsername('usuarioprueba')).rejects.toThrow('Error de base de datos');
    });
  });

  describe('buscarTodos', () => {
    test('debería encontrar todos los usuarios exitosamente', async () => {
      const mockFilas = [
        {
          id: 1,
          username: 'usuario1',
          email: 'usuario1@ejemplo.com',
          password: 'contraseñahasheada1',
          created_at: new Date()
        },
        {
          id: 2,
          username: 'usuario2',
          email: 'usuario2@ejemplo.com',
          password: 'contraseñahasheada2',
          created_at: new Date()
        }
      ];

      mockBaseDatos.all.mockImplementation((sql, params, callback) => {
        callback(null, mockFilas);
      });

      const resultado = await repositorioUsuario.findAll();

      expect(mockBaseDatos.all).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users ORDER BY created_at DESC'),
        [],
        expect.any(Function)
      );
      expect(resultado).toHaveLength(2);
      expect(resultado[0]).toBeInstanceOf(User);
      expect(resultado[1]).toBeInstanceOf(User);
    });

    test('debería retornar array vacío cuando no se encuentran usuarios', async () => {
      mockBaseDatos.all.mockImplementation((sql, params, callback) => {
        callback(null, []);
      });

      const resultado = await repositorioUsuario.findAll();

      expect(resultado).toEqual([]);
    });

    test('debería rechazar cuando ocurre error de base de datos', async () => {
      const errorBD = new Error('Error de base de datos');
      
      mockBaseDatos.all.mockImplementation((sql, params, callback) => {
        callback(errorBD);
      });

      await expect(repositorioUsuario.findAll()).rejects.toThrow('Error de base de datos');
    });
  });

  describe('actualizar', () => {
    test('debería actualizar usuario exitosamente', async () => {
      const datosActualizacion = { username: 'nuevousuario' };
      const mockFila = {
        id: 1,
        username: 'nuevousuario',
        email: 'test@ejemplo.com',
        password: 'contraseñahasheada',
        created_at: new Date()
      };

      // Mock de actualización exitosa
      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback.call({ changes: 1 }, null);
      });

      // Mock de la llamada findById que ocurre después de actualizar
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(null, mockFila);
      });

      const resultado = await repositorioUsuario.update(1, datosActualizacion);

      expect(mockBaseDatos.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET username = ? WHERE id = ?'),
        ['nuevousuario', 1],
        expect.any(Function)
      );
      expect(resultado).toBeInstanceOf(User);
      expect(resultado.username).toBe('nuevousuario');
    });

    test('debería rechazar cuando no hay campos válidos para actualizar', async () => {
      await expect(repositorioUsuario.update(1, { campoInvalido: 'valor' }))
        .rejects.toThrow('No valid fields to update');

      expect(mockBaseDatos.run).not.toHaveBeenCalled();
    });

    test('debería rechazar cuando no se realizan cambios', async () => {
      const datosActualizacion = { username: 'nuevousuario' };

      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback.call({ changes: 0 }, null);
      });

      await expect(repositorioUsuario.update(1, datosActualizacion))
        .rejects.toThrow('User not found or no changes made');
    });

    test('debería rechazar cuando ocurre error de base de datos en actualización', async () => {
      const datosActualizacion = { username: 'nuevousuario' };
      const errorBD = new Error('Error de base de datos');

      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback(errorBD);
      });

      await expect(repositorioUsuario.update(1, datosActualizacion)).rejects.toThrow('Error de base de datos');
    });

    test('debería rechazar cuando ocurre error de base de datos en selección', async () => {
      const datosActualizacion = { username: 'nuevousuario' };
      const errorSeleccion = new Error('Error de selección');

      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback.call({ changes: 1 }, null);
      });

      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(errorSeleccion);
      });

      await expect(repositorioUsuario.update(1, datosActualizacion)).rejects.toThrow('Error de selección');
    });

    test('debería manejar caso cuando el usuario no se encuentra después de actualizar', async () => {
      const datosActualizacion = { username: 'nuevousuario' };

      // Mock de actualización exitosa
      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback.call({ changes: 1 }, null);
      });

      // Mock que findById retorna null (usuario no encontrado después de actualizar)
      // Como findById usa database.get, hacemos mock de la llamada get
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(null, null);
      });

      // El comportamiento real debería retornar null o lanzar un error
      // Probemos qué sucede realmente
      const resultado = await repositorioUsuario.update(1, datosActualizacion);
      expect(resultado).toBeNull();
    });
  });

  describe('eliminar', () => {
    test('debería eliminar usuario exitosamente', async () => {
      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback.call({ changes: 1 }, null);
      });

      const resultado = await repositorioUsuario.delete(1);

      expect(mockBaseDatos.run).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM users WHERE id = ?'),
        [1],
        expect.any(Function)
      );
      expect(resultado).toBe(true);
    });

    test('debería retornar false cuando no se elimina ningún usuario', async () => {
      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback.call({ changes: 0 }, null);
      });

      const resultado = await repositorioUsuario.delete(999);

      expect(resultado).toBe(false);
    });

    test('debería rechazar cuando ocurre error de base de datos', async () => {
      const errorBD = new Error('Error de base de datos');
      
      mockBaseDatos.run.mockImplementation((sql, params, callback) => {
        callback(errorBD);
      });

      await expect(repositorioUsuario.delete(1)).rejects.toThrow('Error de base de datos');
    });
  });

  describe('contar', () => {
    test('debería contar usuarios exitosamente', async () => {
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(null, { count: 5 });
      });

      const resultado = await repositorioUsuario.count();

      expect(mockBaseDatos.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) as count FROM users'),
        [],
        expect.any(Function)
      );
      expect(resultado).toBe(5);
    });

    test('debería rechazar cuando ocurre error de base de datos', async () => {
      const errorBD = new Error('Error de base de datos');
      
      mockBaseDatos.get.mockImplementation((sql, params, callback) => {
        callback(errorBD);
      });

      await expect(repositorioUsuario.count()).rejects.toThrow('Error de base de datos');
    });
  });
});