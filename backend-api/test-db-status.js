const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = 'https://autoslot-backend-api.onrender.com/api';

async function testDatabaseStatus() {
  console.log('🔍 Verificando estado de la base de datos...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Verificando health check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);
    
    // Test 2: Database status
    console.log('\n2️⃣ Verificando estado de la base de datos...');
    const dbStatusResponse = await fetch(`${API_BASE_URL}/db-status`);
    const dbStatusData = await dbStatusResponse.json();
    
    if (dbStatusData.success) {
      console.log('✅ Base de datos accesible');
      console.log('📊 Estado de la base de datos:');
      console.log(`   - Usuario admin: ${dbStatusData.database_status.admin_user.exists ? '✅ Existe' : '❌ No existe'}`);
      console.log(`   - Rol: ${dbStatusData.database_status.admin_user.exists ? dbStatusData.database_status.admin_user.role : 'N/A'}`);
      console.log(`   - Activo: ${dbStatusData.database_status.admin_user.exists ? (dbStatusData.database_status.admin_user.is_active ? '✅ Sí' : '❌ No') : 'N/A'}`);
      console.log(`   - Estacionamientos: ${dbStatusData.database_status.parking_lots}`);
      console.log(`   - Espacios de estacionamiento: ${dbStatusData.database_status.parking_spaces}`);
      console.log(`   - Datos sembrados: ${dbStatusData.database_status.seeded ? '✅ Sí' : '❌ No'}`);
      
      console.log('\n🔐 Credenciales del admin:');
      console.log(`   - Email: ${dbStatusData.admin_credentials.email}`);
      console.log(`   - Contraseña: ${dbStatusData.admin_credentials.password}`);
    } else {
      console.log('❌ Error al verificar estado de la base de datos');
    }
    
    // Test 3: Try to seed if needed
    if (!dbStatusData.database_status.seeded) {
      console.log('\n3️⃣ Sembrando base de datos...');
      const seedResponse = await fetch(`${API_BASE_URL}/seed-database`, {
        method: 'POST'
      });
      const seedData = await seedResponse.json();
      
      if (seedData.success) {
        console.log('✅ Base de datos sembrada exitosamente');
      } else {
        console.log('❌ Error al sembrar base de datos');
      }
    } else {
      console.log('\n3️⃣ Base de datos ya está sembrada, saltando seeding...');
    }
    
    // Test 4: Test admin login
    console.log('\n4️⃣ Probando login del admin...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@autoslot.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Login del admin exitoso');
      console.log(`   - Usuario: ${loginData.user.name}`);
      console.log(`   - Rol: ${loginData.user.role}`);
      console.log(`   - Token recibido: ${loginData.token ? '✅ Sí' : '❌ No'}`);
    } else {
      console.log('❌ Error en login del admin');
      console.log(`   - Error: ${loginData.message || loginData.error}`);
    }
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
  
  console.log('\n🎯 Pruebas completadas');
}

// Run the test
testDatabaseStatus();
