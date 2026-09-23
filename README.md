# Coworking Booking SaaS

A full-stack SaaS application for booking coworking spaces.

The project is built incrementally, with one feature added at a time.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- TypeScript
- Express

### Database

- PostgreSQL
- Prisma

### Planned Tools

- Swagger / OpenAPI
- JWT Authentication
- Argon2 or bcrypt
- Vitest
- Supertest
- Docker
- GitHub Actions

## Project Structure

```text
coworking-booking-saas/
├── frontend/
├── backend/
├── README.md
└── .gitignore
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd coworking-booking-saas
```

## Environment Variables

The frontend requires an environment variable to communicate with the backend API.

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

You can use the provided example file:

```text
frontend/.env.example
```

The `.env` file is ignored by Git and should not be committed.

### Frontend

Create the environment file:

```bash
cd frontend
```
Copy `.env.example` to `.env` and update the values if necessary.


Then install the dependencies and start the development server:

```bash
npm install
npm run dev
```

The frontend is available by default at:

```text
http://localhost:5173
```

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend API is available by default at:

```text
http://localhost:3000
```

## Development Approach

The project is developed step by step.

Each development cycle follows this approach:

```text
Feature
   ↓
Implementation
   ↓
Testing
   ↓
Commit
   ↓
Push
```

This makes it easier to keep the project organized and track its evolution.

## Planned Features

- Health check API
- User registration
- User authentication
- Role management
- Coworking space management
- Room and desk management
- Availability management
- Booking system
- Booking conflict prevention
- User reservations
- Admin dashboard
- API documentation with Swagger
- Automated tests
- Docker setup
- CI/CD with GitHub Actions

## Documentation

More information about each part of the application is available in:

```text
frontend/README.md
backend/README.md
```

## Project Status

🚧 Work in progress.