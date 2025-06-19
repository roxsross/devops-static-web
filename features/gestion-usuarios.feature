# language: es
Característica: Gestión de Usuarios
  Como administrador del sistema
  Quiero gestionar cuentas de usuario
  Para que los usuarios puedan acceder al sistema de forma segura

  Antecedentes:
    Dado que el sistema está funcionando
    Y la base de datos está limpia

  Escenario: Registro exitoso de usuario
    Dado que tengo datos válidos de usuario
    Cuando registro un nuevo usuario con nombre "juan_perez", email "juan@ejemplo.com" y contraseña "micontraseña123"
    Entonces el usuario debería crearse exitosamente
    Y el usuario debería tener un ID válido
    Y la contraseña no debería ser visible en la respuesta

  Escenario: Fallo en registro por email inválido
    Cuando intento registrar un usuario con email inválido "email-sin-formato"
    Entonces debería recibir un error de validación
    Y el mensaje debería indicar "formato de email inválido"

  Escenario: Fallo en registro por contraseña débil
    Cuando intento registrar un usuario con contraseña débil "123"
    Entonces debería recibir un error de validación
    Y el mensaje debería indicar que la contraseña debe tener al menos 8 caracteres

  Escenario: Login exitoso de usuario
    Dado que existe un usuario con email "usuario@ejemplo.com" y contraseña "micontraseña123"
    Cuando hago login con email "usuario@ejemplo.com" y contraseña "micontraseña123"
    Entonces debería recibir un token de autenticación
    Y la información del usuario debería ser retornada
    Y la contraseña no debería estar incluida en la respuesta

  Escenario: Fallo en login por credenciales incorrectas
    Dado que no existe un usuario con email "inexistente@ejemplo.com"
    Cuando intento hacer login con email "inexistente@ejemplo.com" y contraseña "cualquiera"
    Entonces debería recibir un error de autenticación

  Escenario: Obtener lista de usuarios
    Dado que existen múltiples usuarios en el sistema
    Cuando solicito la lista de todos los usuarios
    Entonces debería recibir todos los usuarios sin sus contraseñas
    Y la respuesta debería incluir el conteo total

  Escenario: Obtener usuario específico
    Dado que existe un usuario con ID 1
    Cuando solicito el usuario con ID 1
    Entonces debería recibir la información del usuario
    Y la contraseña no debería estar incluida

  Escenario: Error al obtener usuario inexistente
    Cuando solicito un usuario con ID 999 que no existe
    Entonces debería recibir un error 404
    Y el mensaje debería indicar "usuario no encontrado"

  Escenario: Actualizar información de usuario
    Dado que existe un usuario con ID 1
    Cuando actualizo el nombre de usuario a "nuevo_nombre"
    Entonces el usuario debería actualizarse exitosamente
    Y el nuevo nombre debería ser "nuevo_nombre"

  Escenario: Eliminar usuario
    Dado que existe un usuario con ID 1
    Cuando elimino el usuario con ID 1
    Entonces el usuario debería eliminarse exitosamente
    Y ya no debería existir en el sistema

  Escenario: Flujo completo de usuario
    Cuando registro un usuario con datos válidos
    Y hago login con las credenciales del usuario
    Y obtengo la información del usuario
    Y actualizo el nombre del usuario
    Y elimino el usuario
    Entonces todas las operaciones deberían completarse exitosamente