const axios = require('axios');

async function comprehensiveTest() {
  console.log('🚀 COMPREHENSIVE E-COMMERCE APPLICATION TEST\n');

  let testResults = {
    productsVisible: false,
    userRegistration: false,
    userLogin: false,
    adminLogin: false,
    adminUserManagement: false,
    adminUserDeletion: false,
    webFrontend: false
  };

  // Test 1: Products Visibility
  console.log('1️⃣ Testing Products Visibility...');
  try {
    const response = await axios.get('http://localhost:8009/api/v1/products');
    if (response.data && response.data.success) {
      const products = response.data.data?.products || response.data.data || [];
      if (products.length > 0) {
        testResults.productsVisible = true;
        console.log(`✅ SUCCESS: ${products.length} products visible`);
        console.log(`   Sample: ${products.slice(0, 2).map(p => p.name).join(', ')}`);
      } else {
        console.log('❌ FAIL: No products found');
      }
    } else {
      console.log('❌ FAIL: Invalid response structure');
    }
  } catch (error) {
    console.log('❌ FAIL: Products endpoint error:', error.message);
  }

  // Test 2: User Registration
  console.log('\n2️⃣ Testing User Registration...');
  const testEmail = `testuser${Date.now()}@example.com`;
  const testPassword = 'testpass123';
  
  try {
    const response = await axios.post('http://localhost:8080/auth/register', {
      email: testEmail,
      password: testPassword,
      confirm_password: testPassword,
      first_name: 'Test',
      last_name: 'User',
      phone: '+1234567890'
    });
    
    if (response.data && response.data.id) {
      testResults.userRegistration = true;
      console.log(`✅ SUCCESS: User registered - ${response.data.email}`);
    } else {
      console.log('❌ FAIL: Registration failed - no user ID returned');
    }
  } catch (error) {
    console.log('❌ FAIL: Registration error:', error.response?.data?.detail || error.message);
  }

  // Test 3: User Login
  console.log('\n3️⃣ Testing User Login...');
  if (testResults.userRegistration) {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email: testEmail,
        password: testPassword
      });
      
      if (response.data && response.data.access_token) {
        testResults.userLogin = true;
        console.log('✅ SUCCESS: User login successful');
        console.log(`   Token: ${response.data.access_token.substring(0, 20)}...`);
      } else {
        console.log('❌ FAIL: Login failed - no token received');
      }
    } catch (error) {
      console.log('❌ FAIL: Login error:', error.response?.data?.detail || error.message);
    }
  } else {
    console.log('⏭️ SKIP: User login (registration failed)');
  }

  // Test 4: Admin Login
  console.log('\n4️⃣ Testing Admin Login...');
  let adminToken = null;
  try {
    const response = await axios.post('http://localhost:8009/api/v1/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    if (response.data && response.data.success && response.data.data.access_token) {
      testResults.adminLogin = true;
      adminToken = response.data.data.access_token;
      console.log('✅ SUCCESS: Admin login successful');
      console.log(`   Admin: ${response.data.data.admin.email}`);
    } else {
      console.log('❌ FAIL: Admin login failed - no token');
    }
  } catch (error) {
    console.log('❌ FAIL: Admin login error:', error.response?.data?.message || error.message);
  }

  // Test 5: Admin User Management
  console.log('\n5️⃣ Testing Admin User Management...');
  if (adminToken) {
    try {
      const response = await axios.get('http://localhost:8009/api/v1/users', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (response.data && response.data.success) {
        const users = response.data.data?.users || response.data.data || [];
        if (users.length > 0) {
          testResults.adminUserManagement = true;
          console.log(`✅ SUCCESS: Admin can access ${users.length} users`);
          console.log(`   Sample users: ${users.slice(0, 2).map(u => u.email).join(', ')}`);
        } else {
          console.log('❌ FAIL: No users returned');
        }
      } else {
        console.log('❌ FAIL: Invalid user response');
      }
    } catch (error) {
      console.log('❌ FAIL: User management error:', error.response?.data?.message || error.message);
    }
  } else {
    console.log('⏭️ SKIP: Admin user management (admin login failed)');
  }

  // Test 6: Admin User Deletion
  console.log('\n6️⃣ Testing Admin User Deletion...');
  if (adminToken && testResults.userRegistration) {
    try {
      // Get the user we just created
      const usersResponse = await axios.get('http://localhost:8009/api/v1/users', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      const users = usersResponse.data.data?.users || usersResponse.data.data || [];
      const testUser = users.find(u => u.email === testEmail);
      
      if (testUser) {
        const deleteResponse = await axios.delete(`http://localhost:8009/api/v1/users/${testUser.id || testUser._id}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        
        if (deleteResponse.data && deleteResponse.data.success) {
          testResults.adminUserDeletion = true;
          console.log('✅ SUCCESS: User deletion successful');
        } else {
          console.log('❌ FAIL: User deletion failed');
        }
      } else {
        console.log('❌ FAIL: Test user not found for deletion');
      }
    } catch (error) {
      console.log('❌ FAIL: User deletion error:', error.response?.data?.message || error.message);
    }
  } else {
    console.log('⏭️ SKIP: User deletion (prerequisites failed)');
  }

  // Test 7: Web Frontend
  console.log('\n7️⃣ Testing Web Frontend...');
  try {
    const response = await axios.get('http://localhost:3000');
    if (response.status === 200) {
      testResults.webFrontend = true;
      console.log('✅ SUCCESS: Web frontend accessible');
    } else {
      console.log('❌ FAIL: Web frontend not accessible');
    }
  } catch (error) {
    console.log('❌ FAIL: Web frontend error:', error.message);
  }

  // Test Summary
  console.log('\n🎯 TEST SUMMARY:');
  console.log('================');
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  Object.entries(testResults).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} - ${testName}`);
  });
  
  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Application is fully functional!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the issues above.');
  }

  // Manual Testing Instructions
  console.log('\n📋 MANUAL TESTING INSTRUCTIONS:');
  console.log('================================');
  console.log('1. Visit http://localhost:3000');
  console.log('   - Should show homepage');
  console.log('   - Click "Products" to see sample products');
  console.log('');
  console.log('2. Test User Registration/Login:');
  console.log('   - Go to http://localhost:3000/register');
  console.log('   - Create account (password 8+ chars)');
  console.log('   - Login with new credentials');
  console.log('');
  console.log('3. Test Admin Panel:');
  console.log('   - Go to http://localhost:3000/admin/login');
  console.log('   - Email: admin@example.com');
  console.log('   - Password: admin123');
  console.log('   - Check dashboard for real counts');
  console.log('   - Try user management (view/delete users)');
  console.log('   - Check Services page');
  
  return testResults;
}

comprehensiveTest().catch(console.error);
