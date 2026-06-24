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
    await client.connect();
    console.log('Connected.');
    
    const res = await client.query("SELECT rolname, rolconfig FROM pg_roles WHERE rolname = 'authenticator' OR rolname = 'supabase_admin'");
    for (const row of res.rows) {
      console.log(`Role: ${row.rolname}`);
      console.log('Config:', row.rolconfig);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
