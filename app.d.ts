import { type Auth as TAuth } from "@/server/auth";
import type { User, Prisma } from "@prisma/client";

declare global {
  /// <reference types="lucia" />
  declare namespace Lucia {
    type Auth = TAuth;
    type DatabaseUserAttributes = Pick<
      Prisma.UserCreateInput,
      keyof Omit<User, "id">
    >;
    type DatabaseSessionAttributes = Record<string, never> | undefined;
  }
}
