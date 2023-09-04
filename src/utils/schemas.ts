import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const userSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required." }),
  lastName: z.string().min(1, { message: "Last Name is required." }),
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
  isAdmin: z.boolean(),
});

export type UserSchema = z.infer<typeof userSchema>;
