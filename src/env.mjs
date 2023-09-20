import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    SESSION_COOKIE_NAME: z.string().min(1),
    SITE_URL: z
      .string()
      .optional()
      .transform((v) => (v ? `https://${v}` : undefined)),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV ?? "development",
    SITE_URL: process.env.SITE_URL,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
