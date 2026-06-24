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
    console.log('Connected to DB.');

    // 1. Query pg_settings
    console.log('--- JWT/SECRET SETTINGS ---');
    try {
      const res = await client.query("SELECT name, setting, category, short_desc FROM pg_settings WHERE name LIKE '%jwt%' OR name LIKE '%secret%' OR name LIKE '%auth%'");
      for (const row of res.rows) {
        console.log(`${row.name}: ${row.setting} (${row.category} - ${row.short_desc})`);
      }
    } catch (e) {
      console.log('Error querying pg_settings:', e.message);
    }

    // 2. Query custom app settings
    console.log('--- SHOW APP SETTINGS ---');
    const settingsToTry = [
      'app.settings.jwt_secret',
      'app.settings.jwt_exp',
      'app.settings.anon_key',
      'app.settings.service_key'
    ];
    for (const setting of settingsToTry) {
      try {
        const res = await client.query(`SHOW "${setting}"`);
        console.log(`${setting}:`, res.rows[0]);
      } catch (e) {
        console.log(`${setting}: not found (${e.message})`);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
