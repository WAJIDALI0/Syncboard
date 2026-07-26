const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    
    console.log("Connected. Altering publication for Notification...");
    await client.query('ALTER PUBLICATION supabase_realtime ADD TABLE public."Notification";');
    console.log("Successfully added Notification to realtime!");

  } catch (err) {
    if (err.message.includes('already part of publication')) {
        console.log("Notification is already part of publication.");
    } else {
        console.error("Error:", err.message);
    }
  } finally {
    await client.end();
  }
}

main();
