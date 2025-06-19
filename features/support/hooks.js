const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');

BeforeAll(async function() {
  console.log('🧪 Iniciando suite de pruebas BDD...');
  // Configuración global
  process.env.NODE_ENV = 'test';
});

AfterAll(async function() {
  console.log('✅ Suite de pruebas BDD completada');
});

Before(async function(scenario) {
  this.clearTestData();
  await this.initializeApp();
  
  // Log del escenario actual
  console.log(`\n🎯 Ejecutando: ${scenario.pickle.name}`);
});

After(async function(scenario) {
  // Cleanup después de cada escenario
  this.cleanup();
  
  if (scenario.result.status === 'FAILED') {
    console.log(`❌ Escenario fallido: ${scenario.pickle.name}`);
    if (this.lastResponse) {
      console.log('Última respuesta:', JSON.stringify(this.lastResponse.body, null, 2));
    }
  }
});

// Hook específico para escenarios con tag @database
Before('@database', async function() {
  // Preparación específica para tests de base de datos
  await this.initializeApp();
});

// Hook para tests que requieren autenticación
Before('@authenticated', async function() {
  await this.initializeApp();
  const testUser = this.generateTestUser();
  // Crear y autenticar usuario automáticamente
  const registerResponse = await request(this.server)
    .post('/api/users')
    .send(testUser);
    
  const loginResponse = await request(this.server)
    .post('/api/auth/login')
    .send({ email: testUser.email, password: testUser.password });
    
  this.setAuthToken(loginResponse.body.token);
  this.storeUser({ ...testUser, id: registerResponse.body.user.id });
});