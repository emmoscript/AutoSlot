const http = require('http');

// Test the authentication endpoints
async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  // Test 1: Check if server is running
  try {
    const response = await makeRequest('GET', '/');
    console.log('✅ Server is running');
    console.log('Response:', JSON.parse(response));
  } catch (error) {
    console.log('❌ Server is not running:', error.message);
    return;
  }

  // Test 2: Register a new user
  try {
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      vehicle_plate: 'TEST123',
      phone: '+18095551234'
    };

    const response = await makeRequest('POST', '/api/auth/register', registerData);
    console.log('✅ User registration successful');
    console.log('Response:', JSON.parse(response));
  } catch (error) {
    console.log('❌ User registration failed:', error.message);
  }

  // Test 3: Login with the registered user
  try {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await makeRequest('POST', '/api/auth/login', loginData);
    const loginResponse = JSON.parse(response);
    console.log('✅ User login successful');
    console.log('Token:', loginResponse.token ? 'Received' : 'Missing');

    // Test 4: Get current user with token
    if (loginResponse.token) {
      try {
        const userResponse = await makeRequest('GET', '/api/auth/me', null, loginResponse.token);
        console.log('✅ Get current user successful');
        console.log('User:', JSON.parse(userResponse));
      } catch (error) {
        console.log('❌ Get current user failed:', error.message);
      }
    }
  } catch (error) {
    console.log('❌ User login failed:', error.message);
  }

  // Test 5: Try to login with existing user (from seed data)
  try {
    const loginData = {
      email: 'juan@example.com',
      password: 'password123'
    };

    const response = await makeRequest('POST', '/api/auth/login', loginData);
    const loginResponse = JSON.parse(response);
    console.log('✅ Existing user login successful');
    console.log('User:', loginResponse.user);
  } catch (error) {
    console.log('❌ Existing user login failed:', error.message);
  }
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
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

// Run the tests
testAuthEndpoints().catch(console.error); 