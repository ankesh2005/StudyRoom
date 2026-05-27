// Simple test script to verify API is working
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  try {
    console.log('Testing Study Room API...\n');
    
    // 1. Register user
    console.log('1. Registering user...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: '123456'
    });
    console.log('✅ Registration successful');
    const token = registerRes.data.data.token;
    
    // 2. Login
    console.log('\n2. Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: registerRes.data.data.user.email,
      password: '123456'
    });
    console.log('✅ Login successful');
    
    // 3. Create room
    console.log('\n3. Creating room...');
    const roomRes = await axios.post(`${API_URL}/rooms`, {
      name: 'Math Study Group',
      description: 'Preparing for final exam'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Room created:', roomRes.data.data.room.name);
    
    // 4. Get rooms
    console.log('\n4. Fetching rooms...');
    const roomsRes = await axios.get(`${API_URL}/rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Found ${roomsRes.data.data.rooms.length} rooms`);
    
    // 5. Get dashboard
    console.log('\n5. Fetching dashboard...');
    const dashboardRes = await axios.get(`${API_URL}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dashboard stats:', dashboardRes.data.data.stats);
    
    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();