const axios = require('axios');

async function testApplication() {
  console.log('🚀 Testing E-commerce Application...\n');

  // Test 1: Check if products are visible (public endpoint)
  console.log('1️⃣ Testing Products Visibility...');
  try {
    const response = await axios.get('http://localhost:8009/api/v1/products');
    if (response.data && response.data.success) {
      const products = response.data.data?.products || response.data.data || [];
      console.log(`✅ Products visible: ${products.length} products found`);
      console.log(`   Sample products: ${products.slice(0, 3).map(p => p.name).join(', ')}`);
    } else {
      console.log('❌ Products not accessible');
    }
  } catch (error) {
    console.log('❌ Products endpoint failed:', error.message);
  }

  // Test 2: Test user registration
  console.log('\n2️⃣ Testing User Registration...');
  try {
    const newUser = {
      email: `testuser${Date.now()}@example.com`,
      password: 'testpass123',
      confirm_password: 'testpass123',
      first_name: 'Test',
      last_name: 'User',
      phone: '+1234567890'
    };

    const response = await axios.post('http://localhost:8080/auth/register', newUser);
    if (response.data && response.data.id) {
      console.log(`✅ User registration successful: ${response.data.email}`);
      
      // Test 3: Test user login
      console.log('\n3️⃣ Testing User Login...');
      try {
        const loginResponse = await axios.post('http://localhost:8080/auth/login', {
          email: newUser.email,
          password: newUser.password
        });
        
        if (loginResponse.data && loginResponse.data.access_token) {
          console.log('✅ User login successful');
          console.log(`   Token received: ${loginResponse.data.access_token.substring(0, 20)}...`);
        } else {
          console.log('❌ User login failed - no token received');
        }
      } catch (loginError) {
        console.log('❌ User login failed:', loginError.response?.data?.detail || loginError.message);
      }
    } else {
      console.log('❌ User registration failed');
    }
  } catch (regError) {
    console.log('❌ User registration failed:', regError.response?.data?.detail || regError.message);
  }

  // Test 4: Test admin login
  console.log('\n4️⃣ Testing Admin Login...');
  try {
    const adminResponse = await axios.post('http://localhost:8009/api/v1/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    if (adminResponse.data && adminResponse.data.success && adminResponse.data.data.token) {
      console.log('✅ Admin login successful');
      const adminToken = adminResponse.data.data.token;
      
      // Test 5: Test admin user count
      console.log('\n5️⃣ Testing Admin User Management...');
      try {
        const usersResponse = await axios.get('http://localhost:8009/api/v1/users', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        
        if (usersResponse.data && usersResponse.data.success) {
          const users = usersResponse.data.data || [];
          console.log(`✅ Admin can access users: ${users.length} users found`);
          console.log(`   Sample users: ${users.slice(0, 3).map(u => u.email).join(', ')}`);
        } else {
          console.log('❌ Admin cannot access users');
        }
      } catch (userError) {
        console.log('❌ Admin user access failed:', userError.response?.data?.message || userError.message);
      }

      // Test 6: Test admin product management
      console.log('\n6️⃣ Testing Admin Product Management...');
      try {
        const adminProductsResponse = await axios.get('http://localhost:8009/api/v1/products/admin', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        
        if (adminProductsResponse.data && adminProductsResponse.data.success) {
          const products = adminProductsResponse.data.data?.products || adminProductsResponse.data.data || [];
          console.log(`✅ Admin can manage products: ${products.length} products found`);
        } else {
          console.log('❌ Admin cannot access products for management');
        }
      } catch (productError) {
        console.log('❌ Admin product access failed:', productError.response?.data?.message || productError.message);
      }
    } else {
      console.log('❌ Admin login failed - no token received');
    }
  } catch (adminError) {
    console.log('❌ Admin login failed:', adminError.response?.data?.message || adminError.message);
  }

  // Test 7: Check database counts
  console.log('\n7️⃣ Checking Database Counts...');
  try {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    const userCountResult = await execPromise(`cd /home/vagrant/ecommerce-microservices && docker-compose exec -T mongodb mongo -u admin -p password123 --authenticationDatabase admin --eval "db.getSiblingDB('ecommerce').users.count()" --quiet`);
    const productCountResult = await execPromise(`cd /home/vagrant/ecommerce-microservices && docker-compose exec -T mongodb mongo -u admin -p password123 --authenticationDatabase admin --eval "db.getSiblingDB('ecommerce').products.count()" --quiet`);

    const userCount = parseInt(userCountResult.stdout.trim());
    const productCount = parseInt(productCountResult.stdout.trim());

    console.log(`✅ Database Status:`);
    console.log(`   Users in database: ${userCount}`);
    console.log(`   Products in database: ${productCount}`);
  } catch (dbError) {
    console.log('❌ Database check failed:', dbError.message);
  }

  // Test 8: Check web frontend accessibility
  console.log('\n8️⃣ Testing Web Frontend...');
  try {
    const frontendResponse = await axios.get('http://localhost:3000');
    if (frontendResponse.status === 200) {
      console.log('✅ Web frontend is accessible');
    } else {
      console.log('❌ Web frontend not accessible');
    }
  } catch (frontendError) {
    console.log('❌ Web frontend failed:', frontendError.message);
  }

  console.log('\n🎯 Test Summary Complete!');
  console.log('\n📋 Manual Testing Instructions:');
  console.log('1. Visit http://localhost:3000 - Should show homepage with products');
  console.log('2. Click "Products" - Should show 32 sample products');
  console.log('3. Register a new user - Should work with 8+ character password');
  console.log('4. Login with new user - Should redirect to homepage');
  console.log('5. Visit http://localhost:3000/admin/login');
  console.log('   - Email: admin@example.com');
  console.log('   - Password: admin123');
  console.log('6. Check admin dashboard - Should show real user/product counts');
  console.log('7. Try deleting a user - Should work and update counts');
  console.log('8. Check Services page - Should show system health');
}

testApplication().catch(console.error);
