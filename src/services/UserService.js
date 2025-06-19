const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'dev-secret-key';
    this.saltRounds = 10;
  }

  /**
   * Crea un nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise<User>} - Usuario creado
   */
  async createUser(userData) {
    const { username, email, password } = userData;

    // Validaciones
    if (!User.validateUsername(username)) {
      throw new Error('Username must be between 3 and 50 characters');
    }

    if (!User.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!User.validatePassword(password)) {
      throw new Error('Password must be at least 8 characters');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Verificar si el username ya existe
    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Crear usuario
    const user = new User(
      null,
      username,
      email,
      hashedPassword
    );

    return await this.userRepository.create(user);
  }

  /**
   * Autentica un usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<object>} - Usuario y token
   */
  async authenticateUser(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        username: user.username
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return { 
      user: user.toJSON(), 
      token 
    };
  }

  /**
   * Obtiene un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<User|null>} - Usuario encontrado o null
   */
  async getUserById(id) {
    if (!id || isNaN(id)) {
      throw new Error('Valid user ID is required');
    }

    return await this.userRepository.findById(parseInt(id));
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Promise<User[]>} - Lista de usuarios
   */
  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  /**
   * Actualiza un usuario
   * @param {number} id - ID del usuario
   * @param {object} updateData - Datos a actualizar
   * @returns {Promise<User>} - Usuario actualizado
   */
  async updateUser(id, updateData) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const { username, email } = updateData;

    // Validar datos si se proporcionan
    if (username && !User.validateUsername(username)) {
      throw new Error('Username must be between 3 and 50 characters');
    }

    if (email && !User.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Verificar duplicados
    if (email && email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await this.userRepository.findByUsername(username);
      if (existingUsername) {
        throw new Error('Username already taken');
      }
    }

    return await this.userRepository.update(id, updateData);
  }

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<boolean>} - true si se eliminó correctamente
   */
  async deleteUser(id) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return await this.userRepository.delete(id);
  }

  /**
   * Verifica si un token JWT es válido
   * @param {string} token - Token JWT
   * @returns {object} - Datos del token decodificado
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = UserService;