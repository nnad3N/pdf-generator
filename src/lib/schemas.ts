import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const userSchema = z
  .object({
    userId: z.string().optional(),
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email(),
    password: z.string().optional(),
    isAdmin: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.userId && !data.password) return true;
      if (!data.userId && data.password) return true;
      return false;
    },
    {
      message: "Password is required",
      path: ["password"],
    },
  );

export type UserSchema = z.infer<typeof userSchema>;

export const templateSchema = z.object({
  templateId: z.string().uuid().optional(),
  name: z.string().min(1, { message: "Template name is required" }),
  filename: z
    .string()
    .min(1, { message: "Template file is required" })
    .endsWith(".html", { message: "Only HTML files are supported" }),
  file: z.string().optional(),
  variables: z.array(
    z.object({
      id: z.string().optional(),
      label: z.string().min(1, { message: "Variable label is required" }),
      name: z
        .string()
        .min(1, { message: "Variable name is required" })
        .refine((value) => /^{{\S.*\S}}$/.test(value), {
          message: "Variable needs to have {{variable}} shape",
        }),
      type: z.string(),
    }),
  ),
});

export type TemplateSchema = z.infer<typeof templateSchema>;

export const pdfSchema = z.object({
  templateId: z.string().uuid(),
  filename: z.string().min(1, { message: "Please provide the PDF name" }),
  variables: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      name: z.string().min(1),
      value: z.string().min(1, { message: "Variable value is required" }),
      type: z.string().min(1),
    }),
  ),
});

export type PDFSchema = z.infer<typeof pdfSchema>;
