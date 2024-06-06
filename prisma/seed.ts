import { testUsers } from "@/lib/constants";
import { prisma } from "@/server/db";
import bcrypt from "bcrypt";

async function main() {
  const rootUser = testUsers["admin"];
  const hashedRootPassword = await bcrypt.hash(rootUser.password, 10);

  await prisma.user.upsert({
    where: {
      email: rootUser.email,
    },
    update: {},
    create: {
      email: rootUser.email,
      password: hashedRootPassword,
      firstName: "Root",
      lastName: "User",
      isAdmin: true,
      isDeactivated: false,
    },
  });

  const normalUser = testUsers["user"];
  const hashedUserPassword = await bcrypt.hash(normalUser.password, 10);

  await prisma.user.upsert({
    where: {
      email: normalUser.email,
    },
    update: {},
    create: {
      email: normalUser.email,
      password: hashedUserPassword,
      firstName: "Normal",
      lastName: "User",
      isAdmin: false,
      isDeactivated: false,
    },
  });

  const deactivatedUser = testUsers["deactivated"];
  const hashedDeactivatedPassword = await bcrypt.hash(
    deactivatedUser.password,
    10,
  );

  await prisma.user.upsert({
    where: {
      email: deactivatedUser.email,
    },
    update: {},
    create: {
      email: deactivatedUser.email,
      password: hashedDeactivatedPassword,
      firstName: "Deactivated",
      lastName: "User",
      isAdmin: false,
      isDeactivated: true,
    },
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
