import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: "Household",
    color: "cyan",
    icon: "Building",
  },
  {
    name: "Rent",
    color: "rose",
    icon: "Building",
  },
  {
    name: "Income",
    color: "green",
    icon: "Banknote",
  },
];

async function seed() {
  const email = "bertilotti.marcos@gmail.com";

  await prisma.users.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("020993mb", 10);

  const user = await prisma.users.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.currencies.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const currency = await prisma.currencies.create({
    data: {
      userId: user.id,
      code: "ARS",
      name: "Pesos",
    },
  });

  await prisma.categories.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const promises = CATEGORIES.map((category) => {
    return prisma.categories.create({
      data: {
        userId: user.id,
        ...category,
      },
    });
  });

  await Promise.all(promises);

  await prisma.accounts.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.accounts.create({
    data: {
      name: "BBVA",
      main: true,
      balance: 0,
      color: "lime",
      icon: "Banknote",
      currencyId: currency.id,
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
