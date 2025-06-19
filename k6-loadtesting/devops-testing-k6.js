import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';


export const options = {
  vus: 50,        // 50 usuarios virtuales concurrentes
  duration: '1m', // Durante 1 minuto

  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% requests < 1000ms (más estricto para menos carga)
    http_req_failed: ['rate<0.05'],   // Menos del 5% de fallos
    http_reqs: ['rate>5'],            // Al menos 5 requests por segundo
  },
};


const BASE_URL = 'http://localhost:3000';


export default function () {
  const userId = __VU;
  const iteration = __ITER;
  
  
  let response = http.get(`${BASE_URL}/health`);
  check(response, {
    'Health check OK': (r) => r.status === 200,
  });
  
  
  const userData = {
    username: `user${userId}_${iteration}`,
    email: `user${userId}_${iteration}@test.com`,
    password: 'password123'
  };
  
  response = http.post(`${BASE_URL}/api/users`, JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const userCreated = check(response, {
    'User registration OK': (r) => r.status === 201,
  });
  
  if (userCreated) {
    const user = JSON.parse(response.body).user;
    
    
    response = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: userData.email,
      password: userData.password
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(response, {
      'Login OK': (r) => r.status === 200,
    });
    
    
    response = http.get(`${BASE_URL}/api/users/${user.id}`);
    check(response, {
      'Get user OK': (r) => r.status === 200,
    });
    
   
    response = http.put(`${BASE_URL}/api/users/${user.id}`, JSON.stringify({
      username: `updated_${userData.username}`
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(response, {
      'Update user OK': (r) => r.status === 200,
    });
    
   
    response = http.del(`${BASE_URL}/api/users/${user.id}`);
    check(response, {
      'Delete user OK': (r) => r.status === 200,
    });
  }
  
  sleep(1); 
}


export function handleSummary(data) {
  return {
    'reports/k6-report.html': htmlReport(data, {
      title: 'Prueba de 50 Usuarios Concurrentes',
      description: 'Test de carga simple con 50 usuarios durante 1 minuto'
    }),
  };
}