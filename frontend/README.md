# Coworking Booking - Frontend

Frontend application for the Coworking Booking SaaS project.

The frontend is part of an npm workspaces monorepo.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Base UI
- Zod

## Shared Package

The frontend uses the internal workspace package:

```text
@coworking/shared
```

It provides shared validation schemas and TypeScript types used by both the frontend and backend.

Example:

```ts
import {
  registerSchema,
  type RegisterInput,
} from "@coworking/shared";
```

This keeps frontend and backend validation rules synchronized.

## Installation

Dependencies are installed from the monorepo root:

```bash
npm install
```

Avoid creating a separate frontend `package-lock.json`.

## Development

From the project root:

```bash
npm run dev --workspace=frontend
```

Or from the frontend directory:

```bash
npm run dev
```

The application is available by default at:

```text
http://localhost:5173
```

## Build

From the project root:

```bash
npm run build:frontend
```

Or from the frontend directory:

```bash
npm run build
```

The shared package must be built before the frontend when necessary:

```bash
npm run build:shared
npm run build:frontend
```

## Preview

```bash
npm run preview --workspace=frontend
```

## Environment Variables

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

The `.env` file is ignored by Git and should not be committed.

## Project Structure

```text
frontend/
└── src/
    ├── assets/
    ├── components/
    │   └── ui/
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       └── label.tsx
    ├── pages/
    │   └── RegisterPage.tsx
    ├── services/
    │   └── auth.service.ts
    ├── types/
    │   └── auth.ts
    ├── App.tsx
    ├── index.css
    └── main.tsx
```

Shared schemas and shared request types are located outside the frontend workspace:

```text
packages/shared/
```

## UI System

The frontend uses Tailwind CSS and shadcn/ui with Base UI primitives.

Current reusable UI components include:

- Button
- Input
- Label
- Card

Additional components will be added progressively as new features are developed.

## Current Features

- Backend API communication
- API health status integration
- User registration page
- User registration form
- Shared Zod validation
- Registration API integration
- Registration success and error handling
- Reusable UI components with shadcn/ui

## Routes

### User registration

```text
/register
```

Allows users to create a new account.

## Planned Features

- User login
- JWT authentication
- Role management
- Coworking spaces listing
- Coworking space details
- Room and desk availability
- Booking interface
- User reservations
- Admin dashboard

## Status

🚧 Work in progress.