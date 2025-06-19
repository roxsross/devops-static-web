// tests/features/support/world.js
const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { App } = require('../../src/app');
class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.app = null;
    this.server = null;
    this.lastResponse = null;
    this.userData = {};
    this.users = [];
    this.authToken = null;
    this.testData = new Map();
  }

  async initializeApp() {
    if (!this.app) {
      this.app = new App();
      await this.app.initialize();
      this.server = this.app.getApp();
    }
    return this.server;
  }

  cleanup() {
    if (this.app) {
      this.app.close();
      this.app = null;
      this.server = null;
    }
    this.clearTestData();
  }

  clearTestData() {
    this.lastResponse = null;
    this.userData = {};
    this.users = [];
    this.authToken = null;
    this.testData.clear();
  }

  storeUser(user) {
    this.users.push(user);
    return user;
  }

  getLastUser() {
    return this.users[this.users.length - 1];
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  getAuthHeaders() {
    return this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {};
  }

  generateTestUser(overrides = {}) {
    const timestamp = Date.now();
    return {
      username: `testuser_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: 'testpassword123',
      ...overrides
    };
  }
}

setWorldConstructor(CustomWorld);