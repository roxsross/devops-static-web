class User {
  constructor(id, username, email, password, createdAt = new Date()) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }

  /**
   * Valida el formato del email
   * @param {string} email - Email a validar
   * @returns {boolean} - true si el email es válido
   */
  static validateEmail(email) {
    // Verificar tipo y valores básicos
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return false;
    }

    // Normalizar espacios
    email = email.trim();
    
    // Verificaciones básicas
    if (email.length > 254) return false; // RFC 5321
    if (email.includes(' ')) return false; // No espacios permitidos
    if (email.startsWith('.') || email.endsWith('.')) return false;
    if (email.includes('..')) return false; // Puntos consecutivos
    
    // Verificar que hay exactamente un @
    const atParts = email.split('@');
    if (atParts.length !== 2) return false;
    
    const [localPart, domain] = atParts;
    
    // Verificar parte local
    if (!localPart || localPart.length === 0 || localPart.length > 64) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    
    // Verificar dominio
    if (!domain || domain.length === 0 || domain.length > 253) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    if (domain.includes('..')) return false;
    
    // Verificar que el dominio tiene al menos un punto (TLD)
    if (!domain.includes('.')) return false;
    
    // Regex más específico
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    return emailRegex.test(email);
  }

  /**
   * Valida la fortaleza de la contraseña
   * @param {string} password - Contraseña a validar
   * @returns {boolean} - true si la contraseña es válida
   */
  static validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return false;
    }
    return password.length >= 8;
  }

  /**
   * Valida el nombre de usuario
   * @param {string} username - Nombre de usuario a validar
   * @returns {boolean} - true si el username es válido
   */
  static validateUsername(username) {
    if (!username || typeof username !== 'string') {
      return false;
    }
    return username.length >= 3 && username.length <= 50;
  }

  /**
   * Convierte el usuario a formato JSON excluyendo la contraseña
   * @returns {object} - Objeto usuario sin contraseña
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      createdAt: this.createdAt
    };
  }

  /**
   * Convierte el usuario a formato JSON incluyendo todos los campos
   * @returns {object} - Objeto usuario completo
   */
  toFullJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;