# Coworking Booking - Backend

REST API for the Coworking Booking SaaS project.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Zod
- Argon2

## Planned Technologies

- Swagger / OpenAPI
- JWT Authentication
- Argon2 or bcrypt
- Vitest
- Supertest

## Installation

Install the dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` directory.

```env
DATABASE_URL="postgresql://coworking_user:change_me@localhost:5432/coworking_db?schema=public"
```

The `.env` file is ignored by Git and should not be committed.

## Development

Start the development server:

```bash
npm run dev
```

The API is available by default at:

```text
http://localhost:3000
```

## Build

Create a production build:

```bash
npm run build
```

## Start

Start the production server:

```bash
npm start
```

## Current Endpoints

### API root

```http
GET /
```

Example response:

```json
{
  "message": "Coworking Booking API"
}
```

### Health check

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "coworking-booking-api"
}
```

### User registration

```http
POST /api/auth/register
```

Request body:

```json
{
  "firstName": "Wassim",
  "lastName": "Ben Amara",
  "email": "wassim@example.com",
  "password": "StrongPassword123!"
}
```

Successful response:

```http
201 Created
```

```json
{
  "id": 1,
  "firstName": "Wassim",
  "lastName": "Ben Amara",
  "email": "wassim@example.com",
  "createdAt": "2026-09-26T00:00:00.000Z"
}
```

Invalid request data:

```http
400 Bad Request
```

```json
{
  "message": "Invalid request data"
}
```

Email already registered:

```http
409 Conflict
```

```json
{
  "message": "Email already exists"
}
```

## Database

The backend uses PostgreSQL with Prisma ORM.

### Validate Prisma schema

```bash
npx prisma validate
```

### Apply migrations

```bash
npx prisma migrate dev
```

### Create a new migration

```bash
npx prisma migrate dev --name migration_name
```

Example:

```bash
npx prisma migrate dev --name init
```

### Open Prisma Studio

```bash
npx prisma studio
```

Prisma Studio allows you to inspect and manage database records through a local web interface.

## Current Database Models

### User

The initial database schema contains a `User` model with:

```text
id
email
firstName
lastName
password
createdAt
updatedAt
```

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── generated/
│   │   └── prisma/
│   ├── lib/
│   │   └── prisma.ts
│   ├── routes/
│   │   └── auth.routes.ts
│   ├── schemas/
│   │   └── auth.schema.ts
│   ├── services/
│   │   └── auth.service.ts
│   └── server.ts
├── .env.example
├── prisma7.config.ts
├── package.json
└── tsconfig.json
```

The project structure will evolve as new features are added.

## Current Features

- Express REST API
- TypeScript configuration
- Health check endpoint
- PostgreSQL database connection
- Prisma ORM configuration
- Initial database migration
- User database model
- User registration
- Request validation with Zod
- Password hashing with Argon2
- Duplicate email prevention

## Planned Features

- User authentication
- Role management
- Coworking space management
- Room and desk management
- Booking system
- Booking conflict prevention
- Swagger API documentation
- Automated tests

## Status

🚧 Work in progress.