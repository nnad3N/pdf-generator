import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const data = {
    email: "admin@admin.com",
    firstName: "Test",
    lastName: "Account",
    password: await hash("admin", 12),
    isAdmin: true,
  };

  await prisma.user.upsert({
    update: data,
    create: data,
    where: { email: "admin@admin.com" },
  });
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
