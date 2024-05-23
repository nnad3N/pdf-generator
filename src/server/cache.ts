import { auth } from "@/server/auth";
import { cookies } from "next/headers";
import { cache } from "react";

export const getCachedUser = cache(async () => {
  const sessionId = cookies().get(auth.sessionCookieName)?.value;

  if (!sessionId) {
    return null;
  }

  const { user } = await auth.validateSession(sessionId);

  if (user?.isDeactivated) {
    return null;
  }

  return user;
});
