import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any) as any;

async function main() {
  console.log('🔄 Updating product images contextually...');

  const products = await prisma.product.findMany();
  
  for (const product of products) {
    const keyword = encodeURIComponent(product.name.split(' ').pop()?.toLowerCase() || 'product');
    
    const images = faker.helpers.multiple(
      () => `https://loremflickr.com/800/600/${keyword}?lock=${faker.number.int({ min: 1, max: 1000 })}`,
      { count: { min: 1, max: 4 } }
    );

    await prisma.product.update({
      where: { id: product.id },
      data: { images }
    });
  }

  console.log(`✅ Updated images for ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
