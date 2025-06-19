const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const request = require('supertest');
const { App } = require('../../src/app');

let app;
let servidor;
let ultimaRespuesta;
let usuariosPrueba = [];
let tokenActual;

Before(async function () {
  app = new App();
  await app.initialize();
  servidor = app.getApp();
  usuariosPrueba = [];
  ultimaRespuesta = null;
  tokenActual = null;
});

After(function () {
  if (app) {
    app.close();
  }
});

// ===== GIVEN STEPS =====

Given('que el sistema está funcionando', async function () {
  const respuesta = await request(servidor).get('/health');
  if (respuesta.status !== 200) {
    throw new Error('El sistema no está funcionando correctamente');
  }
});

Given('el sistema está funcionando', async function () {
  const respuesta = await request(servidor).get('/health');
  if (respuesta.status !== 200) {
    throw new Error('El sistema no está funcionando correctamente');
  }
});

Given('la base de datos está limpia', function () {
  usuariosPrueba = [];
});

Given('que tengo datos válidos de usuario', function () {
  this.datosUsuarioValidos = {
    username: 'usuario_prueba',
    email: 'usuario@ejemplo.com',
    password: 'contraseña123'
  };
});

Given('que existe un usuario con email {string} y contraseña {string}', async function (email, contraseña) {
  const datosUsuario = {
    username: 'usuario_existente',
    email: email,
    password: contraseña
  };

  const respuesta = await request(servidor)
    .post('/api/users')
    .send(datosUsuario);

  if (respuesta.status !== 201) {
    throw new Error(`No se pudo crear el usuario: ${respuesta.body.error}`);
  }

  usuariosPrueba.push({
    ...datosUsuario,
    id: respuesta.body.user.id
  });
});

Given('existe un usuario con email {string} y contraseña {string}', async function (email, contraseña) {
  const datosUsuario = {
    username: 'usuario_existente',
    email: email,
    password: contraseña
  };

  const respuesta = await request(servidor)
    .post('/api/users')
    .send(datosUsuario);

  if (respuesta.status !== 201) {
    throw new Error(`No se pudo crear el usuario: ${respuesta.body.error}`);
  }

  usuariosPrueba.push({
    ...datosUsuario,
    id: respuesta.body.user.id
  });
});

Given('que no existe un usuario con email {string}', function (email) {
  // No necesitamos hacer nada, simplemente documentamos que no existe
});

Given('que existen múltiples usuarios en el sistema', async function () {
  const usuarios = [
    { username: 'usuario1', email: 'usuario1@ejemplo.com', password: 'contraseña123' },
    { username: 'usuario2', email: 'usuario2@ejemplo.com', password: 'contraseña123' },
    { username: 'usuario3', email: 'usuario3@ejemplo.com', password: 'contraseña123' }
  ];

  for (const usuario of usuarios) {
    const respuesta = await request(servidor)
      .post('/api/users')
      .send(usuario);

    if (respuesta.status === 201) {
      usuariosPrueba.push({
        ...usuario,
        id: respuesta.body.user.id
      });
    }
  }
});

Given('que existe un usuario con ID {int}', async function (id) {
  const datosUsuario = {
    username: 'usuario_existente',
    email: 'existente@ejemplo.com',
    password: 'contraseña123'
  };

  const respuesta = await request(servidor)
    .post('/api/users')
    .send(datosUsuario);

  if (respuesta.status !== 201) {
    throw new Error(`No se pudo crear el usuario: ${respuesta.body.error}`);
  }

  usuariosPrueba.push({
    ...datosUsuario,
    id: respuesta.body.user.id,
    idEsperado: id
  });
});

// ===== WHEN STEPS =====

When('registro un nuevo usuario con nombre {string}, email {string} y contraseña {string}', async function (nombre, email, contraseña) {
  const datosUsuario = {
    username: nombre,
    email: email,
    password: contraseña
  };

  ultimaRespuesta = await request(servidor)
    .post('/api/users')
    .send(datosUsuario);
});

When('intento registrar un usuario con email inválido {string}', async function (emailInvalido) {
  const datosUsuario = {
    username: 'usuario_prueba',
    email: emailInvalido,
    password: 'contraseña123'
  };

  ultimaRespuesta = await request(servidor)
    .post('/api/users')
    .send(datosUsuario);
});

When('intento registrar un usuario con password inválido {string}', async function (passwordInvalido) {
  const datosUsuario = {
    username: 'usuario_prueba',
    email: 'usuario@ejemplo.com',
    password: passwordInvalido
  };

  ultimaRespuesta = await request(servidor)
    .post('/api/users')
    .send(datosUsuario);
});

When('intento registrar un usuario con username inválido {string}', async function (usernameInvalido) {
  const datosUsuario = {
    username: usernameInvalido,
    email: 'usuario@ejemplo.com',
    password: 'contraseña123'
  };

  ultimaRespuesta = await request(servidor)
    .post('/api/users')
    .send(datosUsuario);
});

When('intento registrar un usuario con contraseña débil {string}', async function (contraseñaDebil) {
  const datosUsuario = {
    username: 'usuario_prueba',
    email: 'usuario@ejemplo.com',
    password: contraseñaDebil
  };

  ultimaRespuesta = await request(servidor)
    .post('/api/users')
    .send(datosUsuario);
});

When('hago login con email {string} y contraseña {string}', async function (email, contraseña) {
  const datosLogin = {
    email: email,
    password: contraseña
  };

  ultimaRespuesta = await request(servidor)
    .post('/api/auth/login')
    .send(datosLogin);

  if (ultimaRespuesta.status === 200) {
    tokenActual = ultimaRespuesta.body.token;
  }
});

When('intento hacer login con email {string} y contraseña {string}', async function (email, contraseña) {
  const datosLogin = {
    email: email,
    password: contraseña
  };

  ultimaRespuesta = await request(servidor)
    .post('/api/auth/login')
    .send(datosLogin);
});

When('solicito la lista de todos los usuarios', async function () {
  ultimaRespuesta = await request(servidor).get('/api/users');
});

When('solicito el usuario con ID {int}', async function (id) {
  const usuarioReal = usuariosPrueba.find(u => u.idEsperado === id);
  const idReal = usuarioReal ? usuarioReal.id : id;

  ultimaRespuesta = await request(servidor).get(`/api/users/${idReal}`);
});

When('solicito un usuario con ID {int} que no existe', async function (id) {
  ultimaRespuesta = await request(servidor).get(`/api/users/${id}`);
});

When('actualizo el nombre de usuario a {string}', async function (nuevoNombre) {
  const usuario = usuariosPrueba[0];
  
  ultimaRespuesta = await request(servidor)
    .put(`/api/users/${usuario.id}`)
    .send({ username: nuevoNombre });
});

When('elimino el usuario con ID {int}', async function (id) {
  const usuarioReal = usuariosPrueba.find(u => u.idEsperado === id);
  const idReal = usuarioReal ? usuarioReal.id : id;

  ultimaRespuesta = await request(servidor).delete(`/api/users/${idReal}`);
});

// Flujo completo
When('registro un usuario con datos válidos', async function () {
  const datosUsuario = {
    username: 'usuario_flujo',
    email: 'flujo@ejemplo.com',
    password: 'contraseña123'
  };

  ultimaRespuesta = await request(servidor)
    .post('/api/users')
    .send(datosUsuario);

  if (ultimaRespuesta.status === 201) {
    usuariosPrueba.push({
      ...datosUsuario,
      id: ultimaRespuesta.body.user.id
    });
  }
});

When('hago login con las credenciales del usuario', async function () {
  const usuario = usuariosPrueba[usuariosPrueba.length - 1];

  ultimaRespuesta = await request(servidor)
    .post('/api/auth/login')
    .send({
      email: usuario.email,
      password: usuario.password
    });

  if (ultimaRespuesta.status === 200) {
    tokenActual = ultimaRespuesta.body.token;
  }
});

When('obtengo la información del usuario', async function () {
  const usuario = usuariosPrueba[usuariosPrueba.length - 1];
  ultimaRespuesta = await request(servidor).get(`/api/users/${usuario.id}`);
});

When('actualizo el nombre del usuario', async function () {
  const usuario = usuariosPrueba[usuariosPrueba.length - 1];
  ultimaRespuesta = await request(servidor)
    .put(`/api/users/${usuario.id}`)
    .send({ username: 'nombre_actualizado' });
});

When('elimino el usuario', async function () {
  const usuario = usuariosPrueba[usuariosPrueba.length - 1];
  ultimaRespuesta = await request(servidor).delete(`/api/users/${usuario.id}`);
});

// ===== THEN STEPS =====

Then('el usuario debería crearse exitosamente', function () {
  if (ultimaRespuesta.status !== 201) {
    throw new Error(`Se esperaba status 201, pero se recibió ${ultimaRespuesta.status}: ${ultimaRespuesta.body.error}`);
  }
});

Then('el usuario debería tener un ID válido', function () {
  if (!ultimaRespuesta.body.user || !ultimaRespuesta.body.user.id) {
    throw new Error('El usuario creado no tiene un ID válido');
  }
});

Then('la contraseña no debería ser visible en la respuesta', function () {
  if (ultimaRespuesta.body.user && ultimaRespuesta.body.user.password) {
    throw new Error('La contraseña está visible en la respuesta, lo cual es un problema de seguridad');
  }
});

Then('la contraseña no debería estar incluida en la respuesta', function () {
  if (ultimaRespuesta.body.user && ultimaRespuesta.body.user.password) {
    throw new Error('La contraseña está incluida en la respuesta');
  }
});

Then('la contraseña no debería estar incluida', function () {
  if (ultimaRespuesta.body.user && ultimaRespuesta.body.user.password) {
    throw new Error('La contraseña está incluida en la respuesta');
  }
});

Then('debería recibir un error de validación', function () {
  if (ultimaRespuesta.status !== 400) {
    throw new Error(`Se esperaba error de validación (400), pero se recibió ${ultimaRespuesta.status}`);
  }
});

Then('el mensaje debería indicar {string}', function (mensajeEsperado) {
  const error = ultimaRespuesta.body.error || '';
  
  // Mapeo de mensajes español -> inglés (lo que realmente devuelve la API)
  const mapeoMensajes = {
    'formato de email inválido': 'invalid email format',
    'usuario no encontrado': 'user not found',
    'invalid email format': 'invalid email format',
    'user not found': 'user not found',
    'at least 8 characters': 'at least 8 characters',
    'between 3 and 50': 'between 3 and 50'
  };
  
  // Convertir el mensaje esperado al equivalente en inglés si existe
  const mensajeBuscar = mapeoMensajes[mensajeEsperado.toLowerCase()] || mensajeEsperado;
  
  if (!error.toLowerCase().includes(mensajeBuscar.toLowerCase())) {
    throw new Error(`Se esperaba que el mensaje contenga "${mensajeBuscar}", pero se recibió: "${error}"`);
  }
});

Then('el mensaje debería indicar que la contraseña debe tener al menos {int} caracteres', function (numeroCaracteres) {
  const error = ultimaRespuesta.body.error || '';
  // La API devuelve mensajes en inglés
  const mensajeEsperado = `at least ${numeroCaracteres} characters`;
  
  if (!error.toLowerCase().includes(mensajeEsperado.toLowerCase())) {
    throw new Error(`Se esperaba que el mensaje contenga "${mensajeEsperado}", pero se recibió: "${error}"`);
  }
});

Then('debería recibir un token de autenticación', function () {
  if (ultimaRespuesta.status !== 200 || !ultimaRespuesta.body.token) {
    throw new Error('No se recibió un token de autenticación válido');
  }
});

Then('la información del usuario debería ser retornada', function () {
  if (!ultimaRespuesta.body.user) {
    throw new Error('No se retornó información del usuario');
  }
});

Then('debería recibir un error de autenticación', function () {
  if (ultimaRespuesta.status !== 401) {
    throw new Error(`Se esperaba error de autenticación (401), pero se recibió ${ultimaRespuesta.status}`);
  }
});

Then('debería recibir todos los usuarios sin sus contraseñas', function () {
  if (ultimaRespuesta.status !== 200 || !Array.isArray(ultimaRespuesta.body.users)) {
    throw new Error('No se recibió una lista válida de usuarios');
  }

  ultimaRespuesta.body.users.forEach(usuario => {
    if (usuario.password) {
      throw new Error('Se encontró una contraseña en la lista de usuarios');
    }
  });
});

Then('la respuesta debería incluir el conteo total', function () {
  if (typeof ultimaRespuesta.body.count !== 'number') {
    throw new Error('La respuesta no incluye un conteo total válido');
  }
});

Then('debería recibir la información del usuario', function () {
  if (ultimaRespuesta.status !== 200 || !ultimaRespuesta.body.user) {
    throw new Error('No se recibió información válida del usuario');
  }
});

Then('debería recibir un error {int}', function (codigoEsperado) {
  if (ultimaRespuesta.status !== codigoEsperado) {
    throw new Error(`Se esperaba código ${codigoEsperado}, pero se recibió ${ultimaRespuesta.status}`);
  }
});

Then('el usuario debería actualizarse exitosamente', function () {
  if (ultimaRespuesta.status !== 200) {
    throw new Error(`Error al actualizar usuario: ${ultimaRespuesta.body.error}`);
  }
});

Then('el nuevo nombre debería ser {string}', function (nombreEsperado) {
  if (ultimaRespuesta.body.user.username !== nombreEsperado) {
    throw new Error(`Se esperaba nombre "${nombreEsperado}", pero se recibió "${ultimaRespuesta.body.user.username}"`);
  }
});

Then('el usuario debería eliminarse exitosamente', function () {
  if (ultimaRespuesta.status !== 200) {
    throw new Error(`Error al eliminar usuario: ${ultimaRespuesta.body.error}`);
  }
});

Then('ya no debería existir en el sistema', async function () {
  const usuario = usuariosPrueba[usuariosPrueba.length - 1];
  
  const respuestaVerificacion = await request(servidor).get(`/api/users/${usuario.id}`);

  if (respuestaVerificacion.status !== 404) {
    throw new Error('El usuario aún existe en el sistema después de ser eliminado');
  }
});

Then('todas las operaciones deberían completarse exitosamente', function () {
  if (!tokenActual) {
    throw new Error('El flujo completo no se completó correctamente');
  }
});