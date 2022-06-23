import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

import logger from "@/lib/logger";
import prisma from "@/lib/prisma";

const userData: Prisma.UserUpdateInput[] = [
  {
    email: "daniel.kuroski@gmail.com",
    role: {
      set: "ADMIN",
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const foundUser = await prisma.user.findUnique({
      where: {
        email: u.email?.toString(),
      },
    });

    if (!foundUser) return;

    const user = await prisma.user.update({
      where: { email: u.email?.toString() },
      data: u,
    });
    logger.info(`Udated user with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
