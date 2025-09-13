import 'dotenv/config';
import { supabase } from './supabaseClient.js';

async function testConnection() {
  const { data, error } = await supabase
    .from('Users')
    .select('id,name,surname,email');

  if (error) {
    console.error('❌ Connection failed:', error.message);
  } else {
    console.log('✅ Connection successful! Sample data:', data);
  }
}

testConnection();
