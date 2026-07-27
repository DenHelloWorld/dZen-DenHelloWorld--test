import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
const prisma = new PrismaClient({ adapter });

const PRODUCT_TYPES = ['Monitors', 'Keyboards', 'Mice', 'Laptops', 'Printers'];
const ORDER_COUNT = 25;
const DAY_MS = 24 * 60 * 60 * 1000;

async function main(): Promise<void> {
  await prisma.prices.deleteMany();
  await prisma.products.deleteMany();
  await prisma.orders.deleteMany();

  let productSerial = 1000;

  for (let orderIndex = 1; orderIndex <= ORDER_COUNT; orderIndex += 1) {
    const productCount = (orderIndex % 4) + 1;
    const createdAt = new Date(Date.now() - orderIndex * 7 * DAY_MS);

    await prisma.orders.create({
      data: {
        title: `Order ${orderIndex}`,
        description: `Order ${orderIndex} description`,
        created_at: createdAt,
        products: {
          create: Array.from({ length: productCount }, (_, productOffset) => {
            const type = PRODUCT_TYPES[(orderIndex + productOffset) % PRODUCT_TYPES.length];
            const usdValue = 100 + productOffset * 25;

            return {
              serial_number: String(productSerial++),
              is_new: productOffset % 2 === 0,
              photo: 'pathToFile.jpg',
              title: `Product ${orderIndex}.${productOffset + 1}`,
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
