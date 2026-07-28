import bcrypt from 'bcryptjs';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';
import { getMysqlPoolConfig } from '@/lib/mysql-config';

const adapter = new PrismaMariaDb(getMysqlPoolConfig());
const prisma = new PrismaClient({ adapter });

const PRODUCT_TYPES = ['Monitors', 'Keyboards', 'Mice', 'Laptops', 'Printers'];
const ORDER_COUNT = 25;
const DAY_MS = 24 * 60 * 60 * 1000;

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

async function main(): Promise<void> {
  await prisma.prices.deleteMany();
  await prisma.products.deleteMany();
  await prisma.orders.deleteMany();

  await prisma.users.upsert({
    where: { username: DEMO_USERNAME },
    update: {},
    create: {
      username: DEMO_USERNAME,
      password_hash: await bcrypt.hash(DEMO_PASSWORD, 10),
    },
  });

  let productSerial = 1000;

  for (let orderIndex = 1; orderIndex <= ORDER_COUNT; orderIndex += 1) {
    const productCount = (orderIndex % 4) + 1;
    const createdAt = new Date(Date.now() - orderIndex * 7 * DAY_MS);

    const title =
      orderIndex === 1
        ? 'Bulk delivery of office equipment for the new headquarters building renovation'
        : orderIndex === 2
          ? 'Replacement hardware shipment for the regional branch office relocation'
          : `Order ${orderIndex}`;

    await prisma.orders.create({
      data: {
        title,
        description: `Order ${orderIndex} description`,
        created_at: createdAt,
        products: {
          create: Array.from({ length: productCount }, (_, productOffset) => {
            const type = PRODUCT_TYPES[(orderIndex + productOffset) % PRODUCT_TYPES.length];
            const usdValue = 100 + productOffset * 25;
            const productTitle =
              orderIndex === 1
                ? `Gigabyte Technology X58-USB3 Motherboard with Extended Warranty Package ${productOffset + 1}`
                : `Product ${orderIndex}.${productOffset + 1}`;

            return {
              serial_number: String(productSerial++),
              is_new: productOffset % 2 === 0,
              photo: 'pathToFile.jpg',
              title: productTitle,
              type,
              specification: `Specification ${orderIndex}.${productOffset + 1}`,
              guarantee_start: createdAt,
              guarantee_end: new Date(createdAt.getTime() + 2 * 365 * DAY_MS),
              prices: {
                create: [
                  { value: usdValue, symbol: 'USD', is_default: false },
                  { value: usdValue * 26, symbol: 'UAH', is_default: true },
                ],
              },
            };
          }),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
