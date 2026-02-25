import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding Users database...');

  // Clear existing data (optional - commented out for safety)
  // await prisma.user.deleteMany({});

  const users = [];

  // Create Admin Users (10)
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    users.push({
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      username: faker.internet.username({ firstName, lastName }).toLowerCase(),
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', // "Password123!"
      role: UserRole.ADMIN,
      firstName,
      lastName,
      phone: faker.phone.number(),
      avatar: faker.image.avatar(),
      shippingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      billingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      paymentMethods: [
        {
          type: faker.helpers.arrayElement(['Visa', 'Mastercard', 'Amex']),
          last4: faker.finance.creditCardNumber().slice(-4),
          expiryMonth: faker.number.int({ min: 1, max: 12 }),
          expiryYear: faker.number.int({ min: 2025, max: 2030 }),
          isDefault: true,
        },
      ],
    });
  }

  // Create Customer Users (40)
  for (let i = 0; i < 40; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const useBillingAsSampling = faker.datatype.boolean();
    
    const shippingAddress = {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    };

    users.push({
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      username: faker.internet.username({ firstName, lastName }).toLowerCase(),
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', // "Password123!"
      role: UserRole.CUSTOMER,
      firstName,
      lastName,
      phone: faker.phone.number(),
      avatar: faker.datatype.boolean() ? faker.image.avatar() : null,
      shippingAddress,
      billingAddress: useBillingAsSampling ? shippingAddress : {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      paymentMethods: faker.helpers.multiple(
        () => ({
          type: faker.helpers.arrayElement(['Visa', 'Mastercard', 'Amex', 'Discover', 'PayPal']),
          last4: faker.finance.creditCardNumber().slice(-4),
          expiryMonth: faker.number.int({ min: 1, max: 12 }),
          expiryYear: faker.number.int({ min: 2025, max: 2030 }),
          isDefault: false,
        }),
        { count: { min: 1, max: 3 } }
      ).map((pm, idx) => ({ ...pm, isDefault: idx === 0 })),
    });
  }

  // Insert users
  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log(`✅ Created ${users.length} users`);
  console.log('   - 10 Admins');
  console.log('   - 40 Customers');
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
