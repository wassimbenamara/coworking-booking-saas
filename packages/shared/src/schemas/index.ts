export {
  registerSchema,
  loginSchema,
  type RegisterInput,
  type LoginInput,
} from "./auth.schema.js";

export {
  createCoworkingSpaceSchema,
  type CreateCoworkingSpaceInput,
} from "./coworking-space.schema.js";

export {
  coworkingResourceTypeSchema,
  createCoworkingResourceSchema,
  type CoworkingResourceType,
  type CreateCoworkingResourceInput,
} from "./coworking-resource.schema.js";

export {
  createResourceAvailabilitySchema,
  type CreateResourceAvailabilityInput,
} from "./resource-availability.schema.js";
