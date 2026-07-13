const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'zenal@pmii.or.id' } });
  if (!user) {
    console.log("User not found!");
    return;
  }
  console.log("User found:", user.email);
  console.log("Hashed password:", user.password);
  
  const match = await bcrypt.compare('PMII2026', user.password);
  console.log("Matches PMII2026?", match);
}

main().catch(console.error).finally(() => prisma.$disconnect());
