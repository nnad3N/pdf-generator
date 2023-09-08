import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

async function main() {
  const attributes: Lucia.DatabaseUserAttributes = {
    email: "root@root.com",
    firstName: "Root",
    lastName: "User",
    isAdmin: true,
    isDeactivated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const rootPassword = "root";

  const user = await prisma.user.findUnique({
    where: {
      email: attributes.email,
    },
  });

  if (!user) {
    await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: attributes.email,
        password: rootPassword,
      },
      attributes,
    });
  } else {
    const { userId } = await auth.updateKeyPassword(
      "email",
      attributes.email,
      rootPassword,
    );
    await auth.updateUserAttributes(userId, attributes);
  }
}

main().catch((e) => console.error(e));
