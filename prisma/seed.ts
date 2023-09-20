import { prisma } from "@/server/db";
import { lucia } from "lucia";
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";

const auth = lucia({
  env: "DEV",
  adapter: prismaAdapter(prisma),
});

async function main() {
  const attributes: Lucia.DatabaseUserAttributes = {
    email: "root@root.com",
    firstName: "Root",
    lastName: "User",
    isAdmin: true,
    isDeactivated: false,
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

  if (process.env.NODE_ENV === "test") {
    await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: "deactivated@deactivated.com",
        password: "deactivated",
      },
      attributes: {
        email: "deactivated@deactivated.com",
        firstName: "Deactivated",
        lastName: "User",
        isAdmin: false,
        isDeactivated: true,
      },
    });
  }
}

main().catch((e) => console.error(e));
