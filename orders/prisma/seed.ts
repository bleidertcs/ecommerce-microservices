import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any) as any;

// Mock data - In production, these would come from gRPC calls to other services
const MOCK_USER_IDS = [
  // These will be replaced with actual user IDs from the users service
  'user-1', 'user-2', 'user-3', 'user-4', 'user-5',
  'user-6', 'user-7', 'user-8', 'user-9', 'user-10',
];

const MOCK_PRODUCT_DATA = [
  // These will be replaced with actual product data from the products service
  { id: 'prod-1', name: 'Product 1', price: 29.99 },
  { id: 'prod-2', name: 'Product 2', price: 49.99 },
  { id: 'prod-3', name: 'Product 3', price: 19.99 },
  { id: 'prod-4', name: 'Product 4', price: 99.99 },
  { id: 'prod-5', name: 'Product 5', price: 39.99 },
];

const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Debit Card'];

async function main() {
  console.log('🌱 Seeding Orders database...');

  // Clear existing data (optional - commented out for safety)
  // await prisma.orderItem.deleteMany({});
  // await prisma.order.deleteMany({});

  const orders = [];

  // Generate 200 orders
  for (let i = 0; i < 200; i++) {
    const userId = faker.helpers.arrayElement(MOCK_USER_IDS);
    const itemCount = faker.number.int({ min: 1, max: 5 });
    
    // Generate order items
    const orderItems = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const product = faker.helpers.arrayElement(MOCK_PRODUCT_DATA);
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = product.price;
      
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price,
      });

      subtotal += price * quantity;
    }

    // Calculate costs
    const shippingCost = subtotal > 100 ? 0 : parseFloat(faker.commerce.price({ min: 5, max: 15, dec: 2 }));
    const tax = parseFloat((subtotal * 0.1).toFixed(2)); // 10% tax
    const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

    // Shipping address
    const shippingAddress = {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      recipientName: faker.person.fullName(),
      recipientPhone: faker.phone.number(),
    };

    // Determine order status with realistic distribution
    const statusRoll = faker.number.float({ min: 0, max: 1 });
    let status: 'PENDING' | 'PROCESSING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
    let paymentStatus: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';

    if (statusRoll < 0.10) {
      status = 'PENDING';
      paymentStatus = 'PENDING';
    } else if (statusRoll < 0.20) {
      status = 'PROCESSING';
      paymentStatus = 'AUTHORIZED';
    } else if (statusRoll < 0.50) {
      status = 'PAID';
      paymentStatus = 'PAID';
    } else if (statusRoll < 0.75) {
      status = 'SHIPPED';
      paymentStatus = 'PAID';
    } else if (statusRoll < 0.90) {
      status = 'DELIVERED';
      paymentStatus = 'PAID';
    } else if (statusRoll < 0.95) {
      status = 'CANCELLED';
      paymentStatus = 'FAILED';
    } else {
      status = 'REFUNDED';
      paymentStatus = 'REFUNDED';
    }

    const trackingNumber = ['SHIPPED', 'DELIVERED'].includes(status)
      ? `TRACK-${faker.string.alphanumeric(12).toUpperCase()}`
      : null;

    orders.push({
      userId,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress,
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
      paymentStatus,
      status,
      trackingNumber,
      items: {
        create: orderItems,
      },
    });
  }

  // Insert orders with items
  for (const order of orders) {
    await prisma.order.create({
      data: order,
    });
  }

  console.log(`✅ Created ${orders.length} orders`);
  console.log(`   - Status distribution:`);
  console.log(`     • PENDING: ~10%`);
  console.log(`     • PROCESSING: ~10%`);
  console.log(`     • PAID: ~30%`);
  console.log(`     • SHIPPED: ~25%`);
  console.log(`     • DELIVERED: ~15%`);
  console.log(`     • CANCELLED: ~5%`);
  console.log(`     • REFUNDED: ~5%`);
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
