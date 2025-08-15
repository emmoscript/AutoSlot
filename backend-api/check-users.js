const https = require('https');

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'autoslot-backend-api.onrender.com',
      port: 443,
      path: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response, rawBody: body });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, rawBody: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function checkUsers() {
  try {
    console.log('🔍 Checking backend health...');
    const health = await makeRequest('/api/health');
    console.log('✅ Backend status:', health.data);

    console.log('🌱 Running database seeding...');
    const seed = await makeRequest('/api/seed-database', 'POST');
    console.log('✅ Seeding result:', seed.data);

    console.log('👥 Checking users in database...');
    // Try to get users (this might fail if no admin token, but let's see)
    try {
      const users = await makeRequest('/api/auth/users', 'GET');
      console.log('📥 Users response:', users.data);
    } catch (error) {
      console.log('❌ Could not fetch users (expected if no admin token)');
    }

    console.log('🔐 Testing admin login again...');
    const loginData = {
      email: 'admin@autoslot.com',
      password: 'admin123'
    };
    
    const login = await makeRequest('/api/auth/login', 'POST', loginData);
    console.log('📥 Login status:', login.status);
    console.log('📥 Login response:', login.data);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsers();
