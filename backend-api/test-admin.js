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

async function testAdmin() {
  try {
    console.log('🔍 Testing admin login...');
    
    const loginData = {
      email: 'admin@autoslot.com',
      password: 'admin123'
    };
    
    console.log('📤 Sending login data:', loginData);
    const login = await makeRequest('/api/auth/login', 'POST', loginData);
    console.log('📥 Login status:', login.status);
    console.log('📥 Login response:', login.data);
    
    if (login.status === 200 && login.data.success) {
      console.log('🎉 Admin login successful!');
      console.log('👤 Admin user:', login.data.user);
      console.log('🔑 Token:', login.data.token ? 'Present' : 'Missing');
    } else {
      console.log('❌ Admin login failed. Status:', login.status);
      console.log('❌ Response:', login.data);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAdmin();
