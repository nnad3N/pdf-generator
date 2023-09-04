import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { userSchema } from "@/utils/schemas";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isAdmin: true,
        isDeactivated: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }),
  add: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.create({
      data: {
        email: "test@test.com",
        firstName: "New acc",
        lastName: "Account",
        password: await hash("test", 12),
        isAdmin: false,
      },
    });
    revalidatePath("/");
    return;
  }),
  upsert: publicProcedure.input(userSchema).mutation(async ({ input, ctx }) => {
    const hashedPassword = await hash(input.password, 12);
    return ctx.prisma.user.upsert({
      where: {
        email: input.email,
      },
      create: {
        ...input,
        password: hashedPassword,
      },
      update: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.lastName,
        isAdmin: input.isAdmin,
      },
    });
  }),
});
