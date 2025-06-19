@user-management
Feature: User Management
  As a system administrator
  I want to manage user accounts
  So that users can access the system securely

  Background:
    Given el sistema está funcionando
    And la base de datos está limpia

  @smoke @registration
  Scenario: Successful user registration
    When registro un nuevo usuario con nombre "john_doe", email "john@example.com" y contraseña "mypassword123"
    Then el usuario debería crearse exitosamente
    And el usuario debería tener un ID válido
    And la contraseña no debería ser visible en la respuesta

  @negative @validation
  Scenario Outline: Registration validation errors
    When intento registrar un usuario con <field> inválido "<value>"
    Then debería recibir un error de validación
    And el mensaje debería indicar "<expected_message>"

    Examples:
      | field       | value           | expected_message     |
      | email       | invalid-email   | invalid email format |
      | password    | 123             | at least 8 characters|
      | username    | ab              | between 3 and 50     |

  @authentication
  Scenario: Successful user login
    Given existe un usuario con email "user@example.com" y contraseña "mypassword123"
    When hago login con email "user@example.com" y contraseña "mypassword123"
    Then debería recibir un token de autenticación
    And la información del usuario debería ser retornada