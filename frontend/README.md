# Coworking Booking - Frontend

Frontend application for the Coworking Booking SaaS project.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Base UI

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

The application is available by default at:

```text
http://localhost:5173
```

## Build

Create a production build:

```bash
npm run build
```

## Preview

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

The `.env` file is ignored by Git and should not be committed.

## Project Structure

```text
src/
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

The project structure will evolve as new features are added.

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
- Registration API integration
- Registration success and error handling
- Basic client-side form validation
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