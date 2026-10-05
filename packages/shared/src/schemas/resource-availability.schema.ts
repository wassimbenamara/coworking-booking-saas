import { z } from "zod";

export const createResourceAvailabilitySchema = z
  .object({
    resourceId: z
      .number()
      .int("Resource id must be an integer")
      .positive("Resource id must be positive"),

    startsAt: z.iso.datetime(),

    endsAt: z.iso.datetime(),
  })
  .refine((data) => new Date(data.endsAt) > new Date(data.startsAt), {
    message: "End date must be after start date",
    path: ["endsAt"],
  });

export type CreateResourceAvailabilityInput = z.infer<
  typeof createResourceAvailabilitySchema
>;
