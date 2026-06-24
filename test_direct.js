import pg from 'pg';

const client = new pg.Client({
  host: 'db.nvbaykuuxjzjeafpoexi.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'xAV2d6b#cyGcKax',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Successfully connected!');
    const res = await client.query('SELECT now()');
    console.log('Database time:', res.rows[0].now);
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await client.end();
  }
}

run();
