import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must contain at least 2 characters")
    .max(50),

  lastName: z
    .string()
    .min(2, "Last name must contain at least 2 characters")
    .max(50),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;