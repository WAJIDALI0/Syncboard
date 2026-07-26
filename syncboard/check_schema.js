const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const res1 = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Canvas'`;
  console.log('Canvas columns (Prisma casing):', res1);
  const res2 = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'canvas'`;
  console.log('canvas columns (lowercase):', res2);
}
main().catch(console.error).finally(() => prisma.$disconnect());
