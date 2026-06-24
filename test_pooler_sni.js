import pg from 'pg';

async function testPooler(region, ipAddress) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  console.log(`Testing region ${region} (${host}) via IP ${ipAddress}...`);
  
  const client = new pg.Client({
    host: host,
    port: 6543,
    user: 'postgres.nvbaykuuxjzjeafpoexi',
    password: 'xAV2d6b#cyGcKax',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    // Override DNS lookup to force IPv4 IP routing while preserving the SNI domain name
    lookup: (hostname, options, callback) => {
      callback(null, ipAddress, 4);
    }
  });

  try {
    await client.connect();
    console.log(`🎉 SUCCESS! Connected to region ${region} pooler!`);
    const res = await client.query('SELECT now()');
    console.log('DB time:', res.rows[0].now);
    await client.end();
    return true;
  } catch (err) {
    console.log(`Failed for region ${region}: ${err.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

async function run() {
  // Test both Singapore (ap-southeast-1) and Mumbai (ap-south-1) poolers
  const targets = [
    { region: 'ap-southeast-1', ip: '54.255.219.82' },
    { region: 'ap-south-1', ip: '65.0.195.55' }
  ];
  
  for (const target of targets) {
    const success = await testPooler(target.region, target.ip);
    if (success) {
      console.log(`\nWorking connection config found!`);
      break;
    }
  }
}

run();
