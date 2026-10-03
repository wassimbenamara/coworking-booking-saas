import { z } from "zod";

export const coworkingResourceTypeSchema = z.enum(["DESK", "MEETING_ROOM"]);

export const createCoworkingResourceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name is too long"),

  type: coworkingResourceTypeSchema,

  capacity: z
    .number()
    .int("Capacity must be an integer")
    .min(1, "Capacity must be at least 1"),

  coworkingSpaceId: z
    .number()
    .int("Coworking space id must be an integer")
    .positive("Coworking space id must be positive"),
});

export type CoworkingResourceType = z.infer<typeof coworkingResourceTypeSchema>;

export type CreateCoworkingResourceInput = z.infer<
  typeof createCoworkingResourceSchema
>;
