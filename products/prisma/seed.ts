// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any) as any;

async function main() {
  console.log('🌱 Seeding Products database...');

  // Clear existing data (optional - commented out for safety)
  // await prisma.product.deleteMany({});

  const dataPath = path.join(__dirname, 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Insert products
  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ Created ${products.length} products`);
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
