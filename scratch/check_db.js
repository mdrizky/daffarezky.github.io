const { createClient } = require('@supabase/supabase-js');

// Manually pass env vars from the shell
const supabaseUrl = process.argv[2];
const supabaseKey = process.argv[3];

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: profile } = await supabase.from('profile').select('*');
  const { data: projects } = await supabase.from('projects').select('*');
  const { data: skills } = await supabase.from('skills').select('*');
  
  console.log('--- Profile ---');
  console.log(JSON.stringify(profile, null, 2));
  console.log('\n--- Projects ---');
  console.log(JSON.stringify(projects, null, 2));
  console.log('\n--- Skills ---');
  console.log(JSON.stringify(skills, null, 2));
}

checkData();
