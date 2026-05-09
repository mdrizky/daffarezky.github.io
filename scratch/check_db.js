const { createClient } = require('@supabase/supabase-js');

// Manually pass env vars from the shell
const supabaseUrl = process.argv[2];
const supabaseKey = process.argv[3];

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data, error } = await supabase.from('profile').select('*');
  console.log('Profile Data:', JSON.stringify(data, null, 2));
  if (error) console.error('Error:', error);
}

checkData();
