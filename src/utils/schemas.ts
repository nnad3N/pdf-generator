import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required." }),
  lastName: z.string().min(1, { message: "Last Name is required." }),
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
  isAdmin: z.boolean(),
});

export type UserSchema = z.infer<typeof userSchema>;

export const templateSchema = z.object({
  name: z.string().min(1, { message: "Template name is required." }),
  filename: z
    .string()
    .min(1, { message: "Template file is required." })
    .endsWith(".html", { message: "Only HTML files are supported." }),
  file: z.string().optional(),
  variables: z.array(
    z.object({
      id: z.string().optional(),
      label: z.string().min(1, { message: "Variable label is required." }),
      name: z.string().min(1, { message: "Variable name is required." }),
      type: z.string(),
    }),
  ),
});

export type TemplateSchema = z.infer<typeof templateSchema>;
