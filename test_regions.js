import pg from 'pg';
import dns from 'dns/promises';

const regions = [
  'ap-south-1',      // Mumbai
  'ap-southeast-1',  // Singapore
  'ap-southeast-2',  // Sydney
  'ap-northeast-1',  // Tokyo
  'ap-northeast-2',  // Seoul
  'us-east-1',       // N. Virginia
  'us-east-2',       // Ohio
  'us-west-1',       // N. California
  'us-west-2',       // Oregon
  'eu-central-1',    // Frankfurt
  'eu-west-1',       // Ireland
  'eu-west-2',       // London
  'eu-west-3',       // Paris
  'eu-north-1',      // Stockholm
  'sa-east-1',       // Sao Paulo
  'ca-central-1',    // Canada Central
  'me-central-1',    // Middle East
  'af-south-1'       // Africa
];

async function testRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  
  try {
    const lookupRes = await dns.lookup(host, { family: 4 });
    const ipAddress = lookupRes.address;
    if (!ipAddress) return { region, status: 'no_ipv4_address' };
    
    const client = new pg.Client({
      host: host, // Keep domain name for SNI
      port: 6543,
      user: 'postgres.nvbaykuuxjzjeafpoexi',
      password: 'xAV2d6b#cyGcKax',
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      lookup: (hostname, options, callback) => {
        callback(null, ipAddress, 4); // Route to resolved IPv4
      }
    });
    
    try {
      await client.connect();
      await client.end();
      return { region, host, ip: ipAddress, status: 'success' };
    } catch (err) {
      await client.end().catch(() => {});
      if (err.message.includes('tenant/user') && err.message.includes('not found')) {
        return { region, status: 'tenant_not_found' };
      }
      if (err.message.includes('authentication failed')) {
        return { region, host, ip: ipAddress, status: 'auth_failed_correct_tenant' };
      }
      return { region, status: `error: ${err.message}` };
    }
  } catch (err) {
    return { region, status: `lookup_failed: ${err.message}` };
  }
}

async function run() {
  console.log('Testing regions with SNI preservation...');
  for (const region of regions) {
    const res = await testRegion(region);
    console.log(`Region ${region}: ${res.status}`);
    if (res.status === 'success' || res.status === 'auth_failed_correct_tenant') {
      console.log(`\n🎉 FOUND IT! Region is: ${res.region}`);
      console.log(`Host: ${res.host}`);
      console.log(`IP: ${res.ip}`);
      console.log(`Status: ${res.status}`);
      break;
    }
  }
}

run();
