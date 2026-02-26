import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any) as any;

const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports & Outdoors',
  'Toys & Games',
  'Beauty & Personal Care',
  'Automotive',
  'Food & Beverages',
  'Health & Wellness',
];

const brands = [
  'TechPro', 'StyleMax', 'HomeComfort', 'ReadWell', 'ActiveLife',
  'PlayZone', 'BeautyEssence', 'AutoCare', 'GourmetChoice', 'WellnessPlus',
  'SmartTech', 'FashionHub', 'CozyHome', 'BookWorld', 'FitGear',
];

async function main() {
  console.log('🌱 Seeding Products database...');

  // Clear existing data (optional - commented out for safety)
  // await prisma.product.deleteMany({});

  const products = [];

  // Generate 100 products
  for (let i = 0; i < 100; i++) {
    const category = faker.helpers.arrayElement(categories);
    const brand = faker.helpers.arrayElement(brands);
    const productName = faker.commerce.productName();
    const price = parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 }));
    const stock = faker.number.int({ min: 0, max: 500 });
    const rating = parseFloat(faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }).toFixed(1));
    const reviewCount = faker.number.int({ min: 0, max: 500 });
    
    // Generate 1-4 product images
    const keyword = encodeURIComponent(productName.split(' ').pop()?.toLowerCase() || 'product');
    const images = faker.helpers.multiple(
      () => `https://loremflickr.com/800/600/${keyword}?lock=${faker.number.int({ min: 1, max: 1000 })}`,
      { count: { min: 1, max: 4 } }
    );

    // Generate relevant tags
    const tags = faker.helpers.multiple(
      () => faker.commerce.productAdjective(),
      { count: { min: 2, max: 5 } }
    );

    products.push({
      name: productName,
      description: faker.commerce.productDescription(),
      sku: `${category.substring(0, 3).toUpperCase()}-${faker.string.alphanumeric(8).toUpperCase()}`,
      brand,
      price,
      stock,
      category,
      images,
      rating,
      reviewCount,
      tags,
      featured: faker.datatype.boolean({ probability: 0.2 }), // 20% chance of being featured
    });
  }

  // Insert products
  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ Created ${products.length} products`);
  console.log(`   - Categories: ${categories.join(', ')}`);
  console.log(`   - Price range: $10 - $1000`);
  console.log(`   - Stock range: 0 - 500 units`);
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
