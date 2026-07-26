const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Create a policy for Project table to allow authenticated users to select
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow authenticated users to read projects" 
      ON "Project" FOR SELECT TO authenticated USING (true);
    `);
    console.log("Project policy created");
  } catch(e) { console.log(e.message) }

  try {
    // 2. Create a policy for Task table to allow authenticated users to insert
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow authenticated users to insert tasks" 
      ON "Task" FOR INSERT TO authenticated WITH CHECK (true);
    `);
    console.log("Task insert policy created");
  } catch(e) { console.log(e.message) }
  
  try {
    // 3. Create a policy for Task table to allow authenticated users to select
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow authenticated users to read tasks" 
      ON "Task" FOR SELECT TO authenticated USING (true);
    `);
    console.log("Task select policy created");
  } catch(e) { console.log(e.message) }
}

main().catch(console.error).finally(() => prisma.$disconnect());
