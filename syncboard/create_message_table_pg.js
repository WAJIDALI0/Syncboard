require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    
    // Create Message table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public."Message" (
        "id" text NOT NULL,
        "content" text NOT NULL,
        "workspace_id" text NOT NULL,
        "user_id" text NOT NULL,
        "created_at" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Message_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Message_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES public."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES public."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log('Message table created successfully using pg.');
    
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await client.end();
  }
}

main();
