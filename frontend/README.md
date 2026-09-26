# Coworking Booking - Frontend

Frontend application for the Coworking Booking SaaS project.

## Tech Stack

- React
- TypeScript
- Vite
- React Router

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
├── pages/
│   └── RegisterPage.tsx
├── services/
│   └── auth.service.ts
├── types/
│   └── auth.ts
├── App.tsx
└── main.tsx
```

The project structure will evolve as new features are added.

## Current Features

- Backend API communication
- API health status integration
- User registration page
- User registration form
- Registration API integration
- Registration success and error handling
- Basic client-side form validation

## Routes

### User registration

```text
/register
```

Allows users to create a new account.

## Planned Features

- User login
- User authentication
- Coworking spaces listing
- Coworking space details
- Room and desk availability
- Booking interface
- User reservations
- Admin dashboard

## Status

🚧 Work in progress.