import { z } from "zod";

export const createCoworkingSpaceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name is too long"),

  description: z
    .string()
    .max(1000, "Description is too long")
    .optional(),

  address: z
    .string()
    .min(5, "Address must contain at least 5 characters")
    .max(255, "Address is too long"),

  city: z
    .string()
    .min(2, "City must contain at least 2 characters")
    .max(100, "City is too long"),

  country: z
    .string()
    .min(2, "Country must contain at least 2 characters")
    .max(100, "Country is too long"),
});

export type CreateCoworkingSpaceInput = z.infer<
  typeof createCoworkingSpaceSchema
>;