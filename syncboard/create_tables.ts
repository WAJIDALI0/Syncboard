import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

async function main() {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    console.log('Running manual migrations...');

    // 1. Add is_active to User if not exists
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='is_active') THEN 
          ALTER TABLE "User" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true; 
        END IF; 
      END $$;
    `);
    console.log('User is_active ensured.');

    // 2. Add is_personal to Organization if not exists
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Organization' AND column_name='is_personal') THEN 
          ALTER TABLE "Organization" ADD COLUMN "is_personal" BOOLEAN NOT NULL DEFAULT false; 
        END IF; 
      END $$;
    `);
    console.log('Organization is_personal ensured.');

    // 3. Create InviteStatus enum if not exists
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InviteStatus') THEN
          CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');
        END IF;
      END $$;
    `);
    console.log('InviteStatus enum ensured.');

    // 4. Create Invitation table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Invitation" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "role" "Role" NOT NULL DEFAULT 'MEMBER',
        "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
        "org_id" TEXT NOT NULL,
        "workspace_id" TEXT NOT NULL,
        "inviter_id" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expires_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('Invitation table ensured.');

    // 5. Create Attachment table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Attachment" (
        "id" TEXT NOT NULL,
        "file_url" TEXT NOT NULL,
        "file_name" TEXT NOT NULL,
        "file_type" TEXT NOT NULL,
        "size_bytes" INTEGER NOT NULL,
        "task_id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('Attachment table ensured.');

    // 6. Create WorkspaceSettings table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WorkspaceSettings" (
        "id" TEXT NOT NULL,
        "workspace_id" TEXT NOT NULL,
        "allow_guests" BOOLEAN NOT NULL DEFAULT true,
        "default_role" "Role" NOT NULL DEFAULT 'MEMBER',
        "require_2fa" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "WorkspaceSettings_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('WorkspaceSettings table ensured.');

    // 7. Create NotificationPreferences table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "NotificationPreferences" (
        "id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "email_invites" BOOLEAN NOT NULL DEFAULT true,
        "email_mentions" BOOLEAN NOT NULL DEFAULT true,
        "email_assignments" BOOLEAN NOT NULL DEFAULT true,
        "push_enabled" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "NotificationPreferences_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('NotificationPreferences table ensured.');

    console.log('All migrations completed successfully.');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect()
  }
}

main()
