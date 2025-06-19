const User = require('../models/User');

class UserRepository {
  constructor(database) {
    this.db = database;
  }

  /**
   * Crea un nuevo usuario en la base de datos
   * @param {User} user - Usuario a crear
   * @returns {Promise<User>} - Usuario creado con ID
   */
  async create(user) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (username, email, password, created_at) 
                   VALUES (?, ?, ?, ?)`;
      
      this.db.run(sql, [user.username, user.email, user.password, user.createdAt], 
        function(err) {
          if (err) {
            reject(err);
          } else {
            user.id = this.lastID;
            resolve(user);
          }
        });
    });
  }

  /**
   * Busca un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<User|null>} - Usuario encontrado o null
   */
  async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row.id, row.username, row.email, row.password, row.created_at));
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Busca un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<User|null>} - Usuario encontrado o null
   */
  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      this.db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row.id, row.username, row.email, row.password, row.created_at));
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Busca un usuario por username
   * @param {string} username - Username del usuario
   * @returns {Promise<User|null>} - Usuario encontrado o null
   */
  async findByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE username = ?`;
      this.db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row.id, row.username, row.email, row.password, row.created_at));
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Promise<User[]>} - Lista de usuarios ordenados por fecha de creación (más recientes primero)
   */
  async findAll() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users ORDER BY created_at DESC, id DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const users = rows.map(row => 
            new User(row.id, row.username, row.email, row.password, row.created_at)
          );
          resolve(users);
        }
      });
    });
  }

  /**
   * Actualiza un usuario
   * @param {number} id - ID del usuario
   * @param {object} updateData - Datos a actualizar
   * @returns {Promise<User>} - Usuario actualizado
   */
  async update(id, updateData) {
    const allowedFields = ['username', 'email'];
    const fields = [];
    const values = [];

    // Construir query dinámicamente solo con campos permitidos
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id); // Para la cláusula WHERE
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

    // Primero hacer el update
    await new Promise((resolve, reject) => {
      this.db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('User not found or no changes made'));
        } else {
          resolve();
        }
      });
    });

    // Luego obtener el usuario actualizado
    return await this.findById(id);
  }

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<boolean>} - true si se eliminó correctamente
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM users WHERE id = ?`;
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  /**
   * Cuenta el número total de usuarios
   * @returns {Promise<number>} - Número de usuarios
   */
  async count() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) as count FROM users`;
      this.db.get(sql, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }
}

module.exports = UserRepository;