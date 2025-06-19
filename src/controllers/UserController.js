const { userLogins } = require('../middleware/metrics');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(req, res) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ 
          error: 'Username, email and password are required',
          received: { username: !!username, email: !!email, password: !!password }
        });
      }

      const user = await this.userService.createUser({ username, email, password });
      res.status(201).json({ 
        message: 'User created successfully',
        user: user.toJSON() 
      });
    } catch (error) {
      res.status(400).json({ 
        error: error.message,
        type: 'VALIDATION_ERROR'
      });
    }
  }

  /**
   * Autentica un usuario (login) - ACTUALIZADO con métricas
   */
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required',
          received: { email: !!email, password: !!password }
        });
      }

      const result = await this.userService.authenticateUser(email, password);
      
      // Incrementar métrica de login exitoso
      userLogins.inc({ status: 'success' });
      
      res.json({
        message: 'Authentication successful',
        ...result
      });
    } catch (error) {
      // Incrementar métrica de login fallido
      userLogins.inc({ status: 'failed' });
      
      res.status(401).json({ 
        error: error.message,
        type: 'AUTHENTICATION_ERROR'
      });
    }
  }

  /**
   * Obtiene todos los usuarios
   */
  async getUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      res.json({ 
        users: users.map(user => user.toJSON()),
        count: users.length
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        type: 'SERVER_ERROR'
      });
    }
  }

  /**
   * Obtiene un usuario por ID
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'Valid user ID is required',
          received: id
        });
      }

      const user = await this.userService.getUserById(parseInt(id));
      
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          id: parseInt(id)
        });
      }

      res.json({ 
        user: user.toJSON() 
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        type: 'SERVER_ERROR'
      });
    }
  }

  /**
   * Actualiza un usuario
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'Valid user ID is required',
          received: id
        });
      }

      const user = await this.userService.updateUser(parseInt(id), updateData);
      res.json({ 
        message: 'User updated successfully',
        user: user.toJSON() 
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ 
          error: error.message,
          type: 'NOT_FOUND_ERROR'
        });
      } else if (error.message.includes('already')) {
        res.status(409).json({ 
          error: error.message,
          type: 'CONFLICT_ERROR'
        });
      } else {
        res.status(400).json({ 
          error: error.message,
          type: 'VALIDATION_ERROR'
        });
      }
    }
  }

  /**
   * Elimina un usuario
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'Valid user ID is required',
          received: id
        });
      }

      const deleted = await this.userService.deleteUser(parseInt(id));
      
      res.json({ 
        message: 'User deleted successfully',
        id: parseInt(id)
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ 
          error: 'User not found',
          type: 'NOT_FOUND_ERROR'
        });
      } else {
        res.status(500).json({ 
          error: error.message,
          type: 'SERVER_ERROR'
        });
      }
    }
  }
}

module.exports = UserController;