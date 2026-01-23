import "dotenv/config";
import { prisma } from "../src/db/prisma.js";
import { hashPassword } from "../src/utils/password.js";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin123!";

const seed = async () => {
  const hashedPassword = await hashPassword(ADMIN_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: "Admin User",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const sampleUsers = [
    { name: "Aisha Rahman", email: "aisha.rahman@example.com", role: "MANAGER" as const },
    { name: "Omar Khan", email: "omar.khan@example.com", role: "STAFF" as const },
    { name: "Sara Malik", email: "sara.malik@example.com", role: "STAFF" as const },
    { name: "Zayan Ali", email: "zayan.ali@example.com", role: "MANAGER" as const },
    { name: "Laila Noor", email: "laila.noor@example.com", role: "STAFF" as const },
    { name: "Imran Ahmed", email: "imran.ahmed@example.com", role: "STAFF" as const },
  ];

  for (const user of sampleUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        status: "ACTIVE",
      },
    });
  }

  const existingProjects = await prisma.project.findMany({
    where: { isDeleted: false },
    select: { name: true },
  });
  const existingProjectNames = new Set(existingProjects.map((project) => project.name));

  const sampleProjects = [
    "Growth Dashboard",
    "Customer Success Hub",
    "Marketing Automation",
    "Mobile App Refresh",
    "Internal Knowledge Base",
    "Quarterly Analytics",
    "Payments Revamp",
    "Support Playbooks",
    "Onboarding Redesign",
    "Infrastructure Review",
  ];

  for (const name of sampleProjects) {
    if (existingProjectNames.has(name)) {
      continue;
    }

    await prisma.project.create({
      data: {
        name,
        description: `${name} initiative for the team.`,
        createdBy: admin.id,
        status: "ACTIVE",
      },
    });
  }
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
