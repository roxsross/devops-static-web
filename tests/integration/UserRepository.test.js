const sqlite3 = require('sqlite3').verbose();
const UserRepository = require('../../src/repositories/UserRepository');
const User = require('../../src/models/User');

describe('Repositorio Usuario - Tests de Integración', () => {
  let bd;
  let repositorioUsuario;

  beforeEach(async () => {

    bd = new sqlite3.Database(':memory:');
    repositorioUsuario = new UserRepository(bd);


    await new Promise((resolve, reject) => {
      const crearTabla = `
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      bd.run(crearTabla, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  afterEach((done) => {
    if (bd) {
      bd.close((err) => {
        if (err && err.code !== 'SQLITE_MISUSE') {
          console.error('Error cerrando base de datos:', err);
        }
        done();
      });
    } else {
      done();
    }
  });

  describe('Creación de Usuario', () => {
    test('debería crear y recuperar usuario', async () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñahasheada');
      
      const usuarioCreado = await repositorioUsuario.create(usuario);
      
      expect(usuarioCreado.id).toBeTruthy();
      expect(usuarioCreado.username).toBe('usuarioprueba');
      expect(usuarioCreado.email).toBe('test@ejemplo.com');
      expect(usuarioCreado.password).toBe('contraseñahasheada');

      const usuarioRecuperado = await repositorioUsuario.findById(usuarioCreado.id);
      expect(usuarioRecuperado).toBeTruthy();
      expect(usuarioRecuperado.email).toBe('test@ejemplo.com');
      expect(usuarioRecuperado.username).toBe('usuarioprueba');
    });

    test('debería auto-incrementar IDs de usuario', async () => {
      const usuario1 = new User(null, 'usuario1', 'usuario1@ejemplo.com', 'contraseñahasheada1');
      const usuario2 = new User(null, 'usuario2', 'usuario2@ejemplo.com', 'contraseñahasheada2');

      const creado1 = await repositorioUsuario.create(usuario1);
      const creado2 = await repositorioUsuario.create(usuario2);

      expect(creado2.id).toBeGreaterThan(creado1.id);
    });

    test('debería hacer cumplir restricción de email único', async () => {
      const usuario1 = new User(null, 'usuario1', 'test@ejemplo.com', 'contraseñahasheada1');
      const usuario2 = new User(null, 'usuario2', 'test@ejemplo.com', 'contraseñahasheada2');

      await repositorioUsuario.create(usuario1);
      
      await expect(repositorioUsuario.create(usuario2))
        .rejects.toThrow();
    });

    test('debería hacer cumplir restricción de username único', async () => {
      const usuario1 = new User(null, 'usuarioprueba', 'test1@ejemplo.com', 'contraseñahasheada1');
      const usuario2 = new User(null, 'usuarioprueba', 'test2@ejemplo.com', 'contraseñahasheada2');

      await repositorioUsuario.create(usuario1);
      
      await expect(repositorioUsuario.create(usuario2))
        .rejects.toThrow();
    });
  });

  describe('Recuperación de Usuario', () => {
    test('debería encontrar usuario por email', async () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñahasheada');
      await repositorioUsuario.create(usuario);

      const usuarioEncontrado = await repositorioUsuario.findByEmail('test@ejemplo.com');
      expect(usuarioEncontrado).toBeTruthy();
      expect(usuarioEncontrado.username).toBe('usuarioprueba');
      expect(usuarioEncontrado.email).toBe('test@ejemplo.com');
    });

    test('debería encontrar usuario por username', async () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñahasheada');
      await repositorioUsuario.create(usuario);

      const usuarioEncontrado = await repositorioUsuario.findByUsername('usuarioprueba');
      expect(usuarioEncontrado).toBeTruthy();
      expect(usuarioEncontrado.username).toBe('usuarioprueba');
      expect(usuarioEncontrado.email).toBe('test@ejemplo.com');
    });

    test('debería retornar null para usuario inexistente', async () => {
      const usuario = await repositorioUsuario.findById(999);
      expect(usuario).toBeNull();

      const usuarioPorEmail = await repositorioUsuario.findByEmail('inexistente@ejemplo.com');
      expect(usuarioPorEmail).toBeNull();

      const usuarioPorUsername = await repositorioUsuario.findByUsername('inexistente');
      expect(usuarioPorUsername).toBeNull();
    });

    test('debería recuperar todos los usuarios ordenados por fecha de creación', async () => {
      // Crear usuarios secuencialmente
      const usuario1 = new User(null, 'usuario1', 'usuario1@ejemplo.com', 'contraseñahasheada1');
      const usuario2 = new User(null, 'usuario2', 'usuario2@ejemplo.com', 'contraseñahasheada2');
      const usuario3 = new User(null, 'usuario3', 'usuario3@ejemplo.com', 'contraseñahasheada3');

      const creado1 = await repositorioUsuario.create(usuario1);
      const creado2 = await repositorioUsuario.create(usuario2);
      const creado3 = await repositorioUsuario.create(usuario3);

      const todosLosUsuarios = await repositorioUsuario.findAll();
      expect(todosLosUsuarios).toHaveLength(3);
      
      // Verificar que todos los usuarios están presentes
      const usernames = todosLosUsuarios.map(u => u.username);
      expect(usernames).toContain('usuario1');
      expect(usernames).toContain('usuario2');
      expect(usernames).toContain('usuario3');
      
      // Verificar el ordenamiento: ORDER BY created_at DESC significa que 
      // el usuario creado más recientemente debería estar primero
      // Como creamos usuario3 al final, debería estar primero
      // Si el ordenamiento funciona, usuario3 debe venir antes que usuario1
      const posicionUsuario1 = todosLosUsuarios.findIndex(u => u.username === 'usuario1');
      const posicionUsuario3 = todosLosUsuarios.findIndex(u => u.username === 'usuario3');
      
      expect(posicionUsuario3).toBeLessThan(posicionUsuario1);
    });
  });

  describe('Actualizaciones de Usuario', () => {
    test('debería actualizar username de usuario', async () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñahasheada');
      const usuarioCreado = await repositorioUsuario.create(usuario);

      const usuarioActualizado = await repositorioUsuario.update(usuarioCreado.id, { username: 'nuevousuario' });
      
      expect(usuarioActualizado.username).toBe('nuevousuario');
      expect(usuarioActualizado.email).toBe('test@ejemplo.com'); // Email sin cambios
      expect(usuarioActualizado.id).toBe(usuarioCreado.id);
    });

    test('debería actualizar email de usuario', async () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñahasheada');
      const usuarioCreado = await repositorioUsuario.create(usuario);

      const usuarioActualizado = await repositorioUsuario.update(usuarioCreado.id, { email: 'nuevoemail@ejemplo.com' });
      
      expect(usuarioActualizado.email).toBe('nuevoemail@ejemplo.com');
      expect(usuarioActualizado.username).toBe('usuarioprueba'); // Username sin cambios
      expect(usuarioActualizado.id).toBe(usuarioCreado.id);
    });

    test('debería rechazar actualización a usuario inexistente', async () => {
      await expect(repositorioUsuario.update(999, { username: 'nuevousuario' }))
        .rejects.toThrow('User not found or no changes made');
    });

    test('debería rechazar actualización sin campos válidos', async () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñahasheada');
      const usuarioCreado = await repositorioUsuario.create(usuario);

      await expect(repositorioUsuario.update(usuarioCreado.id, { campoInvalido: 'valor' }))
        .rejects.toThrow('No valid fields to update');
    });
  });

  describe('Eliminación de Usuario', () => {
    test('debería eliminar usuario exitosamente', async () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñahasheada');
      const usuarioCreado = await repositorioUsuario.create(usuario);

      const eliminado = await repositorioUsuario.delete(usuarioCreado.id);
      expect(eliminado).toBe(true);

      const usuarioEncontrado = await repositorioUsuario.findById(usuarioCreado.id);
      expect(usuarioEncontrado).toBeNull();
    });

    test('debería retornar false al eliminar usuario inexistente', async () => {
      const eliminado = await repositorioUsuario.delete(999);
      expect(eliminado).toBe(false);
    });
  });

  describe('Conteo de Usuarios', () => {
    test('debería contar usuarios correctamente', async () => {
      expect(await repositorioUsuario.count()).toBe(0);

      const usuario1 = new User(null, 'usuario1', 'usuario1@ejemplo.com', 'contraseñahasheada1');
      const usuario2 = new User(null, 'usuario2', 'usuario2@ejemplo.com', 'contraseñahasheada2');

      await repositorioUsuario.create(usuario1);
      expect(await repositorioUsuario.count()).toBe(1);

      await repositorioUsuario.create(usuario2);
      expect(await repositorioUsuario.count()).toBe(2);

      await repositorioUsuario.delete(usuario1.id);
      expect(await repositorioUsuario.count()).toBe(1);
    });
  });

  describe('Manejo de Errores de Base de Datos', () => {
    test('debería manejar errores de conexión a base de datos elegantemente', async () => {
      // Crear un repositorio con una base de datos que vamos a cerrar
      const bdPrueba = new sqlite3.Database(':memory:');
      const repositorioPrueba = new UserRepository(bdPrueba);
      
      // Crear tabla en la base de datos de prueba
      await new Promise((resolve, reject) => {
        const crearTabla = `
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `;
        bdPrueba.run(crearTabla, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Cerrar la base de datos para simular error de conexión
      await new Promise((resolve) => {
        bdPrueba.close(resolve);
      });

      // Ahora intentar usar el repositorio debería fallar
      await expect(repositorioPrueba.findById(1))
        .rejects.toThrow();
    });
  });
});