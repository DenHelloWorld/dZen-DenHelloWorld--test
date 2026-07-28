import 'dotenv/config';
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

const DEMO_WAREHOUSES = [
  {
    name_ru: 'Склад Киев',
    name_en: 'Kyiv Warehouse',
    address_ru: 'Киев, ул. Хрещатик, 1',
    address_en: '1 Khreshchatyk St, Kyiv',
    lat: 50.4501,
    lng: 30.5234,
  },
  {
    name_ru: 'Склад Львов',
    name_en: 'Lviv Warehouse',
    address_ru: 'Львов, пр. Свободы, 10',
    address_en: '10 Svobody Ave, Lviv',
    lat: 49.8397,
    lng: 24.0297,
  },
  {
    name_ru: 'Склад Одесса',
    name_en: 'Odesa Warehouse',
    address_ru: 'Одесса, ул. Дерибасовская, 5',
    address_en: '5 Deribasivska St, Odesa',
    lat: 46.4825,
    lng: 30.7233,
  },
  {
    name_ru: 'Склад Харьков',
    name_en: 'Kharkiv Warehouse',
    address_ru: 'Харьков, пл. Свободы, 6',
    address_en: '6 Svobody Sq, Kharkiv',
    lat: 49.9935,
    lng: 36.2304,
  },
  {
    name_ru: 'Склад Днепр',
    name_en: 'Dnipro Warehouse',
    address_ru: 'Днепр, пр. Дмитрия Яворницкого, 8',
    address_en: '8 Yavornytskoho Ave, Dnipro',
    lat: 48.4647,
    lng: 35.0462,
  },
  {
    name_ru: 'Склад Запорожье',
    name_en: 'Zaporizhzhia Warehouse',
    address_ru: 'Запорожье, пр. Соборный, 15',
    address_en: '15 Sobornyi Ave, Zaporizhzhia',
    lat: 47.8388,
    lng: 35.1396,
  },
  {
    name_ru: 'Склад Винница',
    name_en: 'Vinnytsia Warehouse',
    address_ru: 'Винница, ул. Соборная, 20',
    address_en: '20 Soborna St, Vinnytsia',
    lat: 49.2331,
    lng: 28.4682,
  },
  {
    name_ru: 'Склад Полтава',
    name_en: 'Poltava Warehouse',
    address_ru: 'Полтава, ул. Соборности, 4',
    address_en: '4 Sobornosti St, Poltava',
    lat: 49.5883,
    lng: 34.5514,
  },
  {
    name_ru: 'Склад Чернигов',
    name_en: 'Chernihiv Warehouse',
    address_ru: 'Чернигов, пр. Мира, 33',
    address_en: '33 Myru Ave, Chernihiv',
    lat: 51.4982,
    lng: 31.2893,
  },
  {
    name_ru: 'Склад Ивано-Франковск',
    name_en: 'Ivano-Frankivsk Warehouse',
    address_ru: 'Ивано-Франковск, ул. Независимости, 7',
    address_en: '7 Nezalezhnosti St, Ivano-Frankivsk',
    lat: 48.9226,
    lng: 24.7111,
  },
  {
    name_ru: 'Склад Тернополь',
    name_en: 'Ternopil Warehouse',
    address_ru: 'Тернополь, ул. Танцорова, 2',
    address_en: '2 Tantsorova St, Ternopil',
    lat: 49.5535,
    lng: 25.5948,
  },
  {
    name_ru: 'Склад Ужгород',
    name_en: 'Uzhhorod Warehouse',
    address_ru: 'Ужгород, пл. Театральная, 1',
    address_en: '1 Teatralna Sq, Uzhhorod',
    lat: 48.6208,
    lng: 22.2879,
  },
  {
    name_ru: 'Склад Ровно',
    name_en: 'Rivne Warehouse',
    address_ru: 'Ровно, ул. Соборная, 11',
    address_en: '11 Soborna St, Rivne',
    lat: 50.6199,
    lng: 26.2516,
  },
  {
    name_ru: 'Склад Сумы',
    name_en: 'Sumy Warehouse',
    address_ru: 'Сумы, ул. Соборная, 9',
    address_en: '9 Soborna St, Sumy',
    lat: 50.9077,
    lng: 34.7981,
  },
  {
    name_ru: 'Склад Черновцы',
    name_en: 'Chernivtsi Warehouse',
    address_ru: 'Черновцы, ул. Кобылянской, 3',
    address_en: '3 Kobylianska St, Chernivtsi',
    lat: 48.2921,
    lng: 25.9358,
  },
  {
    name_ru: 'Склад Бухарест',
    name_en: 'Bucharest Warehouse',
    address_ru: 'Бухарест, ул. Каля Викторией, 12',
    address_en: '12 Calea Victoriei, Bucharest',
    lat: 44.4268,
    lng: 26.1025,
  },
  {
    name_ru: 'Склад Клуж-Напока',
    name_en: 'Cluj-Napoca Warehouse',
    address_ru: 'Клуж-Напока, ул. Мемориандулуй, 6',
    address_en: '6 Memorandumului St, Cluj-Napoca',
    lat: 46.7712,
    lng: 23.6236,
  },
  {
    name_ru: 'Склад Кишинёв',
    name_en: 'Chișinău Warehouse',
    address_ru: 'Кишинёв, бул. Штефан чел Маре, 3',
    address_en: '3 Ștefan cel Mare Blvd, Chișinău',
    lat: 47.0105,
    lng: 28.8638,
  },
  {
    name_ru: 'Склад Бельцы',
    name_en: 'Bălți Warehouse',
    address_ru: 'Бельцы, ул. Independenței, 1',
    address_en: '1 Independenței St, Bălți',
    lat: 47.7621,
    lng: 27.9297,
  },
  {
    name_ru: 'Склад Варшава',
    name_en: 'Warsaw Warehouse',
    address_ru: 'Варшава, ул. Маршалковская, 100',
    address_en: '100 Marszałkowska St, Warsaw',
    lat: 52.2297,
    lng: 21.0122,
  },
];

async function main(): Promise<void> {
  await prisma.prices.deleteMany();
  await prisma.products.deleteMany();
  await prisma.orders.deleteMany();
  await prisma.warehouses.deleteMany();

  await prisma.users.upsert({
    where: { username: DEMO_USERNAME },
    update: {},
    create: {
      username: DEMO_USERNAME,
      password_hash: await bcrypt.hash(DEMO_PASSWORD, 10),
    },
  });

  await prisma.warehouses.createMany({ data: DEMO_WAREHOUSES });

  let productSerial = 1000;

  for (let orderIndex = 1; orderIndex <= ORDER_COUNT; orderIndex += 1) {
    const productCount = (orderIndex % 4) + 1;
    const createdAt = new Date(Date.now() - orderIndex * 7 * DAY_MS);

    const title =
      orderIndex === 1
        ? 'Bulk delivery of office equipment for the new headquarters building renovation'
        : orderIndex === 2
          ? 'Replacement hardware shipment for the regional branch office relocation'
          : `ORD-${20250000 + orderIndex}`;

    await prisma.orders.create({
      data: {
        title,
        description: `ORD-${20250000 + orderIndex}`,
        created_at: createdAt,
        products: {
          create: Array.from({ length: productCount }, (_, productOffset) => {
            const type = PRODUCT_TYPES[(orderIndex + productOffset) % PRODUCT_TYPES.length];
            const usdValue = 100 + productOffset * 25;
            const productTitle =
              orderIndex === 1
                ? `Gigabyte Technology X58-USB3 Motherboard with Extended Warranty Package ${productOffset + 1}`
                : orderIndex === 10
                  ? `Dell UltraSharp Professional Monitor with Adjustable Stand and Extra Cables ${productOffset + 1}`
                  : orderIndex === 15
                    ? `Logitech Wireless Keyboard and Mouse Combo Set for Office Use ${productOffset + 1}`
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
