# Coworking Booking SaaS — Backend

Backend API for the Coworking Booking SaaS application.

The backend provides authentication, coworking space management, resource management, availability management, and booking functionality.

---

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL adapter
- Zod
- Argon2
- JSON Web Tokens
- npm workspaces

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

Shared schemas:

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

Environment files must not be committed.

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

```bash
npm run build:shared
npm run build:backend
```

Or:

```bash
npm run build
```

---

# Prisma

Run Prisma commands from:

```text
backend/
```

Validate:

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

# Architecture

The backend separates responsibilities by layer.

```text
HTTP Request
    ↓
Route
    ↓
Authentication Middleware
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
→ route definitions

Middleware
→ authentication

Controllers
→ request validation and HTTP responses

Services
→ business logic and persistence operations

Shared schemas
→ API contracts and validation

Prisma
→ database access
```

---

# Health Check

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

Passwords are hashed with Argon2 before storage.

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

Successful login returns:

```text
user
accessToken
```

Invalid credentials return:

```text
401 Unauthorized
```

The API deliberately uses the same credentials error for unknown email addresses and incorrect passwords.

---

## Current Authenticated User

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer <access_token>
```

---

# JWT Authentication Middleware

Protected application endpoints require JWT authentication.

```text
HTTP Request
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

The authenticated user is attached to the Express request.

Conceptually:

```ts
req.user = {
  id,
  email,
};
```

Business controllers should use the authenticated identity instead of trusting user identifiers from the client.

---

# Coworking Spaces

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

Supported resource types:

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

The referenced coworking space must exist.

---

# Resource Availability

Resource availability defines when a resource can be booked.

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

Shared Zod validation requires:

```text
resourceId > 0
startsAt = valid ISO datetime
endsAt = valid ISO datetime
endsAt > startsAt
```

Zod validation errors use the Zod 4 API:

```ts
z.flattenError(validation.error)
```

---

## Availability Overlap Prevention

Availability ranges for the same resource cannot overlap.

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

Conflict response:

```text
409 Conflict
```

---

# Booking

Bookings allow authenticated users to reserve available resources.

The API never accepts:

```text
userId
```

from the booking request body.

The user is obtained from:

```text
req.user.id
```

---

## List My Bookings

```http
GET /api/bookings/me
```

Returns bookings belonging to the authenticated user.

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

Example:

```json
{
  "resourceId": 1,
  "startsAt": "2026-10-10T10:00:00.000Z",
  "endsAt": "2026-10-10T12:00:00.000Z"
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

## Booking Validation

Shared Zod validation requires:

```text
resourceId > 0
startsAt = valid ISO datetime
endsAt = valid ISO datetime
endsAt > startsAt
```

---

## Resource Validation

The resource must exist.

Otherwise:

```text
404 Not Found
```

---

## Booking Availability Validation

A booking must be completely contained in an availability window.

```text
availability.startsAt <= booking.startsAt
AND
availability.endsAt >= booking.endsAt
```

Bookings outside availability return:

```text
409 Conflict
```

---

## Booking Conflict Prevention

Bookings cannot overlap for the same resource.

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

Conflict response:

```text
409 Conflict
```

The MVP performs conflict detection in application logic.

A production-hardening step can later use stronger PostgreSQL concurrency protection such as transactions, locks, or exclusion constraints.

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

Relationships:

```text
CoworkingSpace 1
      ↓
      *
CoworkingResource
```

```text
CoworkingResource 1
        ↓
        *
ResourceAvailability
```

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

Indexes:

```text
resourceId
resourceId + startsAt + endsAt
```

The relation uses cascade deletion from `CoworkingResource`.

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

Indexes:

```text
userId
resourceId
resourceId + startsAt + endsAt
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

---

# Shared Validation

Schemas are imported from:

```text
@coworking/shared
```

Current schemas:

```text
auth.schema.ts
booking.schema.ts
coworking-resource.schema.ts
coworking-space.schema.ts
resource-availability.schema.ts
```

Shared validation prevents frontend/backend contract duplication.

---

# HTTP Status Codes

Common API responses include:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
500 Internal Server Error
```

---

# Current Features

- Express + TypeScript
- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL adapter
- Shared Zod schemas
- User registration
- Argon2 password hashing
- User login
- JWT generation
- JWT middleware
- Authenticated user endpoint
- Coworking space API
- Coworking resource API
- Resource availability API
- Availability validation
- Availability overlap prevention
- Booking API
- Booking availability validation
- Booking overlap prevention
- Authenticated user booking history

---

# Planned Features

- Booking cancellation
- Booking status
- User roles
- Role-based authorization
- Admin endpoints
- Swagger / OpenAPI
- Backend tests with Vitest and Supertest
- Database-level concurrent booking protection
- Centralized error middleware
- Structured logging
- Deployment configuration

---

# Security Notes

Passwords are hashed with Argon2.

JWT configuration comes from environment variables.

Protected routes require:

```http
Authorization: Bearer <access_token>
```

Authenticated identity comes from the verified JWT.

The API does not trust client-provided user IDs for booking ownership.

Authentication and authorization remain separate concerns.

---

# Testing

Backend tests use:

- Vitest
- Supertest

Run the test suite:

```bash
npm test --workspace=backend
```

---

# Status

✅ First backend MVP completed.

Completed:

```text
Authentication
    ↓
Coworking spaces
    ↓
Coworking resources
    ↓
Resource availability
    ↓
Booking
```

Next:

```text
Automated tests
Authorization
Concurrency hardening
API documentation
Production readiness
```