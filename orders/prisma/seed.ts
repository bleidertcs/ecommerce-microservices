// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any) as any;

async function main() {
  console.log('🌱 Seeding Orders database...');

  // Clear existing data (optional - commented out for safety)
  // await prisma.orderItem.deleteMany({});
  // await prisma.order.deleteMany({});

  const dataPath = path.join(__dirname, 'data', 'orders.json');
  const orders = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Insert orders with items
  for (const order of orders) {
    const { items, ...orderData } = order;
    await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items,
        },
      },
    });
  }

  console.log(`✅ Created ${orders.length} orders`);
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
