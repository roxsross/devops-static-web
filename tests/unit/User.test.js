const User = require('../../src/models/User');

describe('Modelo Usuario - Tests Unitarios (TDD)', () => {
  describe('Validación de Email', () => {
    test('debería validar formatos de email correctos', () => {
      const emailsValidos = [
        'usuario@ejemplo.com',
        'test.email+etiqueta@dominio.co.uk',
        'nombre.apellido@empresa.org',
        'usuario123@dominio-test.com'
      ];

      emailsValidos.forEach(email => {
        expect(User.validateEmail(email)).toBe(true);
      });
    });

    test('debería rechazar formatos de email inválidos', () => {
      const emailsInvalidos = [
        'email-invalido',     // Sin @
        'usuario@',          // Sin dominio
        '@dominio.com',      // Sin parte local
        'usuario@dominio',   // Sin TLD
        'usuario.dominio.com', // Sin @
        '',                  // Vacío
        null,               // Null
        undefined,          // Undefined
        123,                // Número
        'usuario@dominio..com', // Puntos consecutivos
        '.usuario@dominio.com', // Empieza con punto
        'usuario.@dominio.com', // Termina con punto
        'usuario@@dominio.com', // Doble @
        'usuario@',            // Sin dominio después de @
        'usuario@dominio.',    // Termina con punto después del dominio
        'nombre usuario@dominio.com', // Espacio en parte local
        'usuario@dominio .com' // Espacio en dominio
      ];

      emailsInvalidos.forEach((email, index) => {
        const resultado = User.validateEmail(email);
        if (resultado !== false) {
          console.log(`❌ Email que debería fallar pero pasó: "${email}" (índice: ${index})`);
        }
        expect(resultado).toBe(false);
      });
    });

    test('debería manejar casos límite para validación de email', () => {
      expect(User.validateEmail('a@b.co')).toBe(true); // Email mínimo válido
      expect(User.validateEmail('usuario@sub.dominio.com')).toBe(true); // Subdominio
      expect(User.validateEmail('usuario+etiqueta@dominio.com')).toBe(true); // Signo más
      expect(User.validateEmail('usuario.nombre@dominio.com')).toBe(true); // Punto en nombre de usuario
    });
  });

  describe('Validación de Contraseña', () => {
    test('debería validar contraseñas con 8+ caracteres', () => {
      const contraseñasValidas = [
        '12345678',
        'contraseñaSegura123',
        'C@ntr4s3ñ4!',
        'contraseña-muy-larga-con-caracteres-especiales'
      ];

      contraseñasValidas.forEach(contraseña => {
        expect(User.validatePassword(contraseña)).toBe(true);
      });
    });

    test('debería rechazar contraseñas con menos de 8 caracteres', () => {
      const contraseñasInvalidas = [
        '1234567',
        'corta',
        '123',
        '',
        null,
        undefined,
        123
      ];

      contraseñasInvalidas.forEach(contraseña => {
        expect(User.validatePassword(contraseña)).toBe(false);
      });
    });

    test('debería validar contraseña de exactamente 8 caracteres', () => {
      expect(User.validatePassword('12345678')).toBe(true);
    });
  });

  describe('Validación de Nombre de Usuario', () => {
    test('debería validar nombres de usuario entre 3 y 50 caracteres', () => {
      const usernamesValidos = [
        'abc',           // Longitud mínima
        'usuarioprueba',
        'usuario123',
        'a'.repeat(50)   // Longitud máxima
      ];

      usernamesValidos.forEach(username => {
        expect(User.validateUsername(username)).toBe(true);
      });
    });

    test('debería rechazar nombres de usuario inválidos', () => {
      const usernamesInvalidos = [
        'ab',            // Muy corto
        'a'.repeat(51),  // Muy largo
        '',
        null,
        undefined,
        123
      ];

      usernamesInvalidos.forEach(username => {
        expect(User.validateUsername(username)).toBe(false);
      });
    });
  });

  describe('Creación de Usuario', () => {
    test('debería crear usuario con todas las propiedades', () => {
      const fechaCreacion = new Date();
      const usuario = new User(1, 'usuarioprueba', 'test@ejemplo.com', 'contraseñaHasheada', fechaCreacion);

      expect(usuario.id).toBe(1);
      expect(usuario.username).toBe('usuarioprueba');
      expect(usuario.email).toBe('test@ejemplo.com');
      expect(usuario.password).toBe('contraseñaHasheada');
      expect(usuario.createdAt).toBe(fechaCreacion);
    });

    test('debería crear usuario con fechaCreacion por defecto', () => {
      const antesCreacion = new Date();
      const usuario = new User(1, 'usuarioprueba', 'test@ejemplo.com', 'contraseñaHasheada');
      const despuesCreacion = new Date();

      expect(usuario.createdAt).toBeInstanceOf(Date);
      expect(usuario.createdAt.getTime()).toBeGreaterThanOrEqual(antesCreacion.getTime());
      expect(usuario.createdAt.getTime()).toBeLessThanOrEqual(despuesCreacion.getTime());
    });

    test('debería manejar id null correctamente', () => {
      const usuario = new User(null, 'usuarioprueba', 'test@ejemplo.com', 'contraseñaHasheada');
      expect(usuario.id).toBeNull();
    });
  });

  describe('Serialización JSON', () => {
    test('debería excluir la contraseña de la salida JSON', () => {
      const usuario = new User(1, 'usuarioprueba', 'test@ejemplo.com', 'contraseñaHasheada');
      const json = usuario.toJSON();

      expect(json.password).toBeUndefined();
      expect(json.id).toBe(1);
      expect(json.username).toBe('usuarioprueba');
      expect(json.email).toBe('test@ejemplo.com');
      expect(json.createdAt).toBeInstanceOf(Date);
    });

    test('debería incluir la contraseña en la salida JSON completa', () => {
      const usuario = new User(1, 'usuarioprueba', 'test@ejemplo.com', 'contraseñaHasheada');
      const json = usuario.toFullJSON();

      expect(json.password).toBe('contraseñaHasheada');
      expect(json.id).toBe(1);
      expect(json.username).toBe('usuarioprueba');
      expect(json.email).toBe('test@ejemplo.com');
      expect(json.createdAt).toBeInstanceOf(Date);
    });

    test('debería mantener tipos de datos en la salida JSON', () => {
      const fechaCreacion = new Date();
      const usuario = new User(1, 'usuarioprueba', 'test@ejemplo.com', 'contraseñaHasheada', fechaCreacion);
      const json = usuario.toJSON();

      expect(typeof json.id).toBe('number');
      expect(typeof json.username).toBe('string');
      expect(typeof json.email).toBe('string');
      expect(json.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Casos Límite', () => {
    test('debería manejar caracteres especiales en nombre de usuario', () => {
      // Nota: En una implementación real, podrías querer validar caracteres especiales
      const usuario = new User(1, 'usuario_123', 'test@ejemplo.com', 'contraseñaHasheada');
      expect(usuario.username).toBe('usuario_123');
    });

    test('debería manejar diferentes formatos de fecha', () => {
      const fechaISO = '2023-01-01T00:00:00.000Z';
      const usuario = new User(1, 'usuarioprueba', 'test@ejemplo.com', 'contraseñaHasheada', new Date(fechaISO));
      
      expect(usuario.createdAt).toBeInstanceOf(Date);
      expect(usuario.createdAt.toISOString()).toBe(fechaISO);
    });

    test('debería manejar strings numéricos como propiedades de usuario', () => {
      const usuario = new User('1', 'usuarioprueba', 'test@ejemplo.com', 'contraseñaHasheada');
      expect(usuario.id).toBe('1'); // Mantiene el tipo original
    });
  });
});