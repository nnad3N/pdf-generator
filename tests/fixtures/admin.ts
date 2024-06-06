import { test as base } from "@playwright/test";
import { testUsers } from "@/lib/constants";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

export const test = base.extend({
  page: async ({ page, context }, use) => {
    const { id } = await prisma.user.findUniqueOrThrow({
      where: {
        email: testUsers.admin.email,
      },
      select: {
        id: true,
      },
    });
    const session = await auth.createSession(id, {});
    const { name, value, attributes } = auth.createSessionCookie(session.id);

    const sameSiteMap = {
      lax: "Lax",
      strict: "Strict",
      none: "None",
    } as const;

    const sameSite = attributes.sameSite
      ? sameSiteMap?.[attributes.sameSite]
      : undefined;

    await context.addCookies([
      {
        name,
        value,
        ...attributes,
        expires: attributes.expires?.getTime(),
        sameSite,
        domain: "127.0.0.1:3000",
      },
    ]);

    await page.goto("/admin");

    await use(page);
  },
});

export { expect } from "@playwright/test";
