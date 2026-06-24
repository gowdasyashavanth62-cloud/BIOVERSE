import pg from 'pg';

async function run() {
  const password = 'xAV2d6b#cyGcKax';
  
  const client = new pg.Client({
    host: 'aws-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.nvbaykuuxjzjeafpoexi',
    password: password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to pooler...');
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT now()');
    console.log('Time from DB:', res.rows[0].now);
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await client.end();
  }
}

run();
