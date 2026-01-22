import "dotenv/config";
import { prisma } from "../src/db/prisma.js";
import { hashPassword } from "../src/utils/password.js";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin123!";

const seed = async () => {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    return;
  }

  const hashedPassword = await hashPassword(ADMIN_PASSWORD);

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
};

seed()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
