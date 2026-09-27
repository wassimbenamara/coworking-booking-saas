import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must contain at least 2 characters")
    .max(50, "First name is too long"),

  lastName: z
    .string()
    .min(2, "Last name must contain at least 2 characters")
    .max(50, "Last name is too long"),

  email: z.email("Invalid email address"),

  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
