# Coworking Booking SaaS — Backend

Backend API for the Coworking Booking SaaS application.

The backend provides authentication, coworking space management, coworking resources, resource availability, and booking functionality.

---

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Zod
- Argon2
- JSON Web Tokens
- Prisma PostgreSQL adapter

---

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── coworking-resource.controller.ts
│   │   ├── coworking-space.controller.ts
│   │   └── resource-availability.controller.ts
│   │
│   ├── generated/
│   ├── lib/
│   │   └── prisma.ts
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── coworking-resource.routes.ts
│   │   ├── coworking-space.routes.ts
│   │   └── resource-availability.routes.ts
│   │
│   ├── services/
│   │   ├── booking.service.ts
│   │   ├── coworking-resource.service.ts
│   │   ├── coworking-space.service.ts
│   │   └── resource-availability.service.ts
│   │
│   └── types/
│       └── express.d.ts
│
├── package.json
└── README.md
```

Shared schemas are located at:

```text
packages/shared/src/schemas/
├── auth.schema.ts
├── booking.schema.ts
├── coworking-resource.schema.ts
├── coworking-space.schema.ts
└── resource-availability.schema.ts
```

---

# Environment Variables

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL="postgresql://coworking_user:change_me@localhost:5432/coworking_db?schema=public"
JWT_SECRET=change_me_with_a_long_random_secret
JWT_EXPIRES_IN=1h
```

Never commit `.env` files.

---

# Development

From the repository root:

```bash
npm run dev --workspace=backend
```

Default API URL:

```text
http://localhost:3000
```

---

# Build

From the repository root:

```bash
npm run build:shared
npm run build:backend
```

Or build the complete monorepo:

```bash
npm run build
```

---

# Prisma

From the `backend` directory:

```bash
npx prisma validate
```

Create a migration:

```bash
npx prisma migrate dev --name <migration-name>
```

Generate Prisma Client:

```bash
npx prisma generate
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# API

## API Root

```http
GET /
```

Response:

```json
{
  "message": "Coworking Booking API"
}
```

---

## Health Check

```http
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "service": "coworking-booking-api"
}
```

---

# Authentication

## Register

```http
POST /api/auth/register
```

Example:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Possible responses:

```text
201 Created
400 Bad Request
409 Conflict
```

Passwords are hashed using Argon2.

---

## Login

```http
POST /api/auth/login
```

Example:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Successful authentication returns the user and a JWT access token.

Invalid credentials return:

```http
401 Unauthorized
```

The API deliberately uses the same response for unknown users and incorrect passwords to reduce account enumeration risks.

---

## Current User

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer <access_token>
```

Missing, expired, or invalid tokens return:

```http
401 Unauthorized
```

---

# JWT Authentication Middleware

Protected routes use the authentication middleware.

```text
Request
    ↓
Authorization: Bearer <token>
    ↓
authenticate middleware
    ↓
jwt.verify(...)
    ↓
req.user
    ↓
Controller
```

The authenticated request contains:

```ts
req.user = {
  id,
  email,
};
```

Controllers should derive the authenticated user's identity from `req.user` instead of request payloads.

---

# Coworking Spaces

All coworking space endpoints are protected.

## List

```http
GET /api/coworking-spaces
```

## Details

```http
GET /api/coworking-spaces/:id
```

## Create

```http
POST /api/coworking-spaces
```

Example:

```json
{
  "name": "WorkHub Paris",
  "description": "Modern coworking space",
  "address": "10 Rue de Rivoli",
  "city": "Paris",
  "country": "France"
}
```

---

# Coworking Resources

A coworking space can contain bookable resources.

Supported types:

```text
DESK
MEETING_ROOM
```

## List Resources

```http
GET /api/coworking-spaces/:coworkingSpaceId/resources
```

## Resource Details

```http
GET /api/coworking-resources/:id
```

## Create Resource

```http
POST /api/coworking-resources
```

Example:

```json
{
  "name": "Meeting Room A",
  "type": "MEETING_ROOM",
  "capacity": 6,
  "coworkingSpaceId": 1
}
```

The backend verifies that the referenced coworking space exists.

---

# Resource Availability

Resource availability defines when a coworking resource can be booked.

All availability routes require JWT authentication.

---

## List Resource Availabilities

```http
GET /api/coworking-resources/:resourceId/availabilities
```

Possible responses:

```text
200 OK
400 Bad Request
401 Unauthorized
404 Not Found
```

`400 Bad Request` is returned for an invalid resource ID.

`404 Not Found` is returned when the resource does not exist.

---

## Create Resource Availability

```http
POST /api/resource-availabilities
```

Example:

```json
{
  "resourceId": 1,
  "startsAt": "2026-10-10T09:00:00.000Z",
  "endsAt": "2026-10-10T18:00:00.000Z"
}
```

Possible responses:

```text
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
```

---

## Availability Validation

The shared Zod schema validates:

```text
resourceId > 0
startsAt = valid ISO datetime
endsAt   = valid ISO datetime
endsAt > startsAt
```

Invalid payloads return:

```http
400 Bad Request
```

Zod validation errors are formatted with the Zod 4 API:

```ts
z.flattenError(validation.error)
```

---

## Resource Existence Validation

The backend verifies that the referenced coworking resource exists before creating an availability.

Unknown resources return:

```http
404 Not Found
```

---

## Availability Overlap Prevention

Availability ranges cannot overlap for the same resource.

Rule:

```text
existing.startsAt < new.endsAt
AND
existing.endsAt > new.startsAt
```

Allowed:

```text
09:00 → 12:00
12:00 → 18:00
```

Rejected:

```text
09:00 → 12:00
11:00 → 14:00
```

Overlapping availability returns:

```http
409 Conflict
```

---

# Booking

The booking API allows authenticated users to reserve coworking resources.

Every booking belongs to:

```text
User
CoworkingResource
```

The authenticated user is obtained from the JWT middleware.

The API never accepts `userId` from the booking request body.

---

## List My Bookings

```http
GET /api/bookings/me
```

Returns bookings belonging to:

```ts
req.user.id
```

Possible responses:

```text
200 OK
401 Unauthorized
```

---

## Create Booking

```http
POST /api/bookings
```

Example request:

```json
{
  "resourceId": 1,
  "startsAt": "2026-10-10T10:00:00.000Z",
  "endsAt": "2026-10-10T12:00:00.000Z"
}
```

Successful response:

```http
201 Created
```

Possible responses:

```text
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
```

---

## Booking Validation

The shared Zod schema validates:

```text
resourceId > 0
startsAt = valid ISO datetime
endsAt   = valid ISO datetime
endsAt > startsAt
```

Invalid input returns:

```http
400 Bad Request
```

---

## Resource Validation

The referenced resource must exist.

Otherwise:

```http
404 Not Found
```

---

## Availability Validation

A booking must fit entirely inside an existing availability window.

Rule:

```text
availability.startsAt <= booking.startsAt
AND
availability.endsAt >= booking.endsAt
```

A booking outside the resource availability returns:

```http
409 Conflict
```

---

## Booking Conflict Prevention

Bookings for the same resource cannot overlap.

Rule:

```text
existing.startsAt < new.endsAt
AND
existing.endsAt > new.startsAt
```

Allowed:

```text
Booking A: 09:00 → 10:00
Booking B: 10:00 → 11:00
```

Rejected:

```text
Booking A: 09:00 → 11:00
Booking B: 10:00 → 12:00
```

Conflicting bookings return:

```http
409 Conflict
```

> The MVP performs conflict detection at application level. Stronger concurrency guarantees can later be implemented using PostgreSQL transactions, locking, or database-level exclusion constraints.

---

# Database Models

## User

```text
id
firstName
lastName
email
passwordHash
createdAt
updatedAt
```

Relationship:

```text
User 1
  ↓
  *
Booking
```

---

## CoworkingSpace

```text
id
name
description
address
city
country
createdAt
updatedAt
```

Relationship:

```text
CoworkingSpace 1
      ↓
      *
CoworkingResource
```

---

## CoworkingResource

```text
id
name
type
capacity
coworkingSpaceId
createdAt
updatedAt
```

Supported types:

```text
DESK
MEETING_ROOM
```

Relationships:

```text
CoworkingSpace
      1
      ↓
      *
CoworkingResource
      1
      ↓
      *
ResourceAvailability
```

and:

```text
CoworkingResource 1
        ↓
        *
Booking
```

---

## ResourceAvailability

```text
id
startsAt
endsAt
resourceId
createdAt
updatedAt
```

Relation:

```text
CoworkingResource 1
        ↓
        *
ResourceAvailability
```

Deleting a coworking resource also deletes its availability ranges.

Indexes:

```text
resourceId
resourceId + startsAt + endsAt
```

---

## Booking

```text
id
userId
resourceId
startsAt
endsAt
createdAt
updatedAt
```

Relationships:

```text
User 1
  ↓
  *
Booking
```

```text
CoworkingResource 1
        ↓
        *
Booking
```

Indexes:

```text
userId
resourceId
resourceId + startsAt + endsAt
```

---

# Validation

Validation schemas are shared between workspaces through:

```text
@coworking/shared
```

Current schemas:

```text
packages/shared/src/schemas/
├── auth.schema.ts
├── booking.schema.ts
├── coworking-resource.schema.ts
├── coworking-space.schema.ts
└── resource-availability.schema.ts
```

This keeps request validation consistent and avoids duplicated business contracts.

---

# Architecture

The backend separates responsibilities between layers.

```text
Route
  ↓
Authentication middleware
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

Responsibilities:

```text
Routes
→ HTTP routing

Middleware
→ authentication

Controllers
→ request validation and HTTP responses

Services
→ business logic and database access

Shared schemas
→ API contracts and input validation

Prisma
→ persistence
```

---

# Current Features

- Express + TypeScript API
- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL adapter
- Shared Zod schemas
- User registration
- Argon2 password hashing
- User login
- JWT authentication
- Authentication middleware
- Authenticated user endpoint
- Coworking space API
- Coworking resource API
- Resource availability model
- Protected availability routes
- Availability creation
- Resource existence validation
- Availability date validation
- Availability overlap prevention
- Booking model
- Shared booking schema
- Authenticated booking creation
- Authenticated user booking history
- Booking availability validation
- Booking overlap prevention

---

# Planned Features

- Booking cancellation
- Booking status
- Role management
- Role-based authorization
- Admin endpoints
- Swagger / OpenAPI documentation
- Automated backend tests with Vitest and Supertest
- Stronger concurrent booking conflict protection
- Improved error handling
- Deployment configuration

---

# Security Notes

Passwords are stored as Argon2 hashes.

JWT secrets are stored through environment variables.

Protected endpoints require Bearer authentication:

```http
Authorization: Bearer <access_token>
```

The authenticated user identity comes from the verified JWT.

Sensitive identifiers such as a booking `userId` are not trusted from client input.

Authentication and authorization are kept as separate concerns.

---

# Status

🚧 Work in progress.

Current backend milestone:

```text
Booking API
```

Completed:

```text
Authentication API
    ↓
Coworking spaces API
    ↓
Coworking resources API
    ↓
Resource availability API
    ↓
Booking API
```

Next:

```text
Booking frontend
```