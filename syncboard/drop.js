const { Client } = require('pg');
require('dotenv').config();

async function dropTables() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to database.');
    
    await client.query('DROP TABLE IF EXISTS canvas CASCADE;');
    console.log('Dropped canvas table.');
    
    await client.query('DROP TABLE IF EXISTS tasks CASCADE;');
    console.log('Dropped tasks table.');

  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    await client.end();
  }
}

dropTables();
