const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query("SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user'");
    console.log(res.rows[0].prosrc);
  } finally {
    await client.end();
  }
}

main();
