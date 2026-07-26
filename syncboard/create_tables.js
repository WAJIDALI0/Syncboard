const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Message" (
        "id" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "workspace_id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('Message table created or already exists.');

    // Also add foreign keys if possible, but for now just the table is enough to prevent 500 errors.
    // Let's also make sure Canvas exists correctly since I just updated CanvasActions to use Prisma.
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Canvas" (
        "id" TEXT NOT NULL,
        "workspace_id" TEXT NOT NULL,
        "canvas_json" TEXT NOT NULL,
        "updated_at" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "Canvas_pkey" PRIMARY KEY ("id")
      );
    `);
    
    // Add unique constraint to workspace_id for Canvas
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Canvas_workspace_id_key') THEN
          ALTER TABLE "Canvas" ADD CONSTRAINT "Canvas_workspace_id_key" UNIQUE ("workspace_id");
        END IF;
      END $$;
    `);

    console.log('Canvas table created or already exists.');
  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
