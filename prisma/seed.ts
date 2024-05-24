import { prisma } from "@/server/db";
import bcrypt from "bcrypt";

async function main() {
  const hashedRootPassword = await bcrypt.hash("root", 10);

  await prisma.user.upsert({
    where: {
      email: "root@root.com",
    },
    update: {},
    create: {
      email: "root@root.com",
      password: hashedRootPassword,
      firstName: "Root",
      lastName: "User",
      isAdmin: true,
      isDeactivated: false,
    },
  });

  const hashedUserPassword = await bcrypt.hash("user", 10);

  await prisma.user.upsert({
    where: {
      email: "user@user.com",
    },
    update: {},
    create: {
      email: "user@user.com",
      password: hashedUserPassword,
      firstName: "Normal",
      lastName: "User",
      isAdmin: false,
      isDeactivated: false,
    },
  });

  if (process.env.NODE_ENV === "test") {
    const hashedDeactivatedPassword = await bcrypt.hash("deactivated", 10);

    await prisma.user.upsert({
      where: {
        email: "deactivated@deactivated.com",
      },
      update: {},
      create: {
        email: "deactivated@deactivated.com",
        password: hashedDeactivatedPassword,
        firstName: "Deactivated",
        lastName: "User",
        isAdmin: false,
        isDeactivated: true,
      },
    });
  }
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
