// @ts-nocheck
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding Users database...');

  // Clear existing data (optional - commented out for safety)
  // await prisma.user.deleteMany({});

  const dataPath = path.join(__dirname, 'data', 'users.json');
  const usersData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Insert users
  for (const user of usersData) {
    await prisma.user.create({ data: user });
  }

  console.log(`✅ Created ${usersData.length} users`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
