import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const password = 'xAV2d6b#cyGcKax';
  
  // Use Singapore ap-southeast-1 pooler
  const connectionConfigs = [
    {
      host: 'aws-0-ap-southeast-1.pooler.supabase.com',
      port: 6543,
      user: 'postgres.nvbaykuuxjzjeafpoexi',
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    },
    {
      host: 'aws-0-ap-southeast-1.pooler.supabase.com',
      port: 5432,
      user: 'postgres.nvbaykuuxjzjeafpoexi',
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    }
  ];

  let client = null;
  let connected = false;

  for (const config of connectionConfigs) {
    console.log(`Attempting connection to ${config.host}:${config.port} as ${config.user}...`);
    client = new pg.Client(config);
    try {
      await client.connect();
      connected = true;
      console.log('Connected successfully!');
      break;
    } catch (e) {
      console.log(`Failed to connect: ${e.message}`);
      client = null;
    }
  }

  if (!connected) {
    console.error('All connection attempts to the IPv4 pooler failed.');
    process.exit(1);
  }

  try {
    console.log('Dropping existing tables to apply updated schema...');
    await client.query('DROP TABLE IF EXISTS public.test_questions, public.results, public.progress, public.payments, public.subscriptions, public.notifications, public.videos, public.notes, public.tests, public.questions, public.concepts, public.chapters, public.units, public.users, public.community_posts CASCADE;');

    const sqlPath = path.resolve(__dirname, 'supabase_schema.sql');
    console.log(`Reading schema from ${sqlPath}...`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing schema migration...');
    await client.query(sql);
    console.log('Schema migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
