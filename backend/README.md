# Coworking Booking - Backend

REST API for the Coworking Booking SaaS project.

## Tech Stack

- Node.js
- TypeScript
- Express

## Planned Technologies

- PostgreSQL
- Prisma
- Swagger / OpenAPI
- JWT Authentication
- Argon2 or bcrypt
- Vitest
- Supertest
- Docker

## Installation

Install the dependencies:

```bash
npm install
```

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

## Current Endpoint

```http
GET /
```

Example response:

```json
{
  "message": "Coworking Booking API"
}
```

## Project Structure

```text
src/
├── controllers/
├── routes/
├── services/
├── middlewares/
├── repositories/
├── types/
└── server.ts
```

The project structure will evolve as new features are added.

## Planned Features

- Health check endpoint
- User registration
- User authentication
- Role management
- Coworking space management
- Room and desk management
- Booking system
- Booking conflict prevention
- API documentation with Swagger
- Automated tests

## Status

🚧 Work in progress.