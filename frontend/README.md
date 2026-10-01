# Coworking Booking SaaS — Frontend

Frontend application for the Coworking Booking SaaS.

Built with React, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui, Base UI, and shared Zod validation schemas.

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Base UI
- Zod
- npm workspaces

---

## Monorepo

The frontend is part of the npm workspaces monorepo.

Workspace:

```text
frontend
```

Install dependencies from the repository root:

```bash
npm install
```

Start the frontend:

```bash
npm run dev --workspace=frontend
```

Build the frontend:

```bash
npm run build --workspace=frontend
```

---

## Environment Variables

Create:

```text
frontend/.env
```

from:

```text
frontend/.env.example
```

Example:

```env
VITE_API_URL=http://localhost:3000
```

Vite only exposes environment variables prefixed with:

```text
VITE_
```

---

## Shared Package

Authentication schemas and TypeScript types shared with the backend are provided by:

```text
@coworking/shared
```

Example:

```ts
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@coworking/shared";
```

This avoids duplicating validation rules between the frontend and backend.

---

## Project Structure

```text
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   │
│   └── ui/
│
├── contexts/
│   └── AuthContext.tsx
│
├── pages/
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
│
├── services/
│   └── auth.service.ts
│
├── types/
│   └── auth.ts
│
├── App.tsx
├── index.css
└── main.tsx
```

---

## Routes

### Login

```text
/login
```

Allows existing users to authenticate.

Successful authentication redirects to:

```text
/dashboard
```

---

### Registration

```text
/register
```

Allows new users to create an account.

---

### Dashboard

```text
/dashboard
```

Protected route available only to authenticated users.

Unauthenticated users are redirected to:

```text
/login
```

---

## Authentication

The frontend uses an `AuthContext` to centralize authentication state.

It manages:

- authenticated user
- JWT access token
- login
- logout
- authentication loading state
- session restoration

The authentication logic is centralized instead of accessing browser storage directly from multiple components.

---

## Login Flow

The login flow is:

```text
Login form
   ↓
Client-side validation
   ↓
POST /api/auth/login
   ↓
Receive user + JWT access token
   ↓
AuthContext.login(...)
   ↓
Store authentication state
   ↓
Redirect to /dashboard
```

Invalid credentials remain on the login page and display an error message.

---

## Session Restoration

On application startup, the frontend checks for an existing access token.

If one exists, the frontend calls:

```http
GET /api/auth/me
```

Flow:

```text
Application starts
   ↓
Stored access token?
   ↓
Yes
   ↓
GET /api/auth/me
   ↓
Valid token?
   ├── Yes → restore authenticated user
   └── No  → clear authentication state
```

This means a browser refresh does not automatically log out a user with a valid session.

---

## Protected Routes

Protected routes are handled by:

```text
src/components/auth/ProtectedRoute.tsx
```

`ProtectedRoute` checks the authentication state before rendering private pages.

Flow:

```text
Protected page requested
   ↓
Authentication loading?
   ↓
Authenticated user?
   ├── Yes → render page
   └── No  → redirect to /login
```

Example:

```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```

---

## Logout

The dashboard currently provides a logout action.

Logout:

```text
Remove stored access token
   ↓
Clear authenticated user
   ↓
Protected routes become inaccessible
```

---

## API Integration

Authentication requests are centralized in:

```text
src/services/auth.service.ts
```

Current authentication calls include:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

The backend remains the source of truth for authentication.

---

## UI System

The frontend uses:

- Tailwind CSS
- shadcn/ui
- Base UI

Reusable UI components are located in:

```text
src/components/ui
```

Current components include:

```text
Button
Input
Label
Card
```

---

## Current Features

- User registration page
- Registration API integration
- User login page
- Login API integration
- Shared authentication validation
- React authentication context
- Centralized authentication state
- Session restoration
- Protected React routes
- Authenticated dashboard
- Logout flow
- Tailwind CSS
- shadcn/ui
- Base UI
- React Router

---

## Planned Features

- HTTP-only cookie authentication
- Improved dashboard
- Coworking space pages
- Resource listing
- Desk and meeting room interfaces
- Availability UI
- Booking creation
- Booking history
- Booking cancellation
- Role-based UI
- Admin UI
- Better loading states
- Toast notifications
- Improved form validation UX
- Frontend tests

---

## Security Note

The current MVP stores the JWT access token in browser `localStorage`.

This is suitable for the current development stage, but it is not the final production authentication architecture.

A future improvement will migrate authentication to HTTP-only cookies to reduce direct JavaScript access to authentication tokens.

---

## Development

Start the frontend:

```bash
npm run dev --workspace=frontend
```

Default URL:

```text
http://localhost:5173
```

The backend should also be running:

```bash
npm run dev --workspace=backend
```

---

## Build

Build the frontend only:

```bash
npm run build --workspace=frontend
```

Build the entire monorepo from the repository root:

```bash
npm run build
```

---

## Current Authentication Flow

```text
Register
   ↓
Login
   ↓
JWT access token
   ↓
AuthContext
   ↓
Session restoration
   ↓
ProtectedRoute
   ↓
Dashboard
   ↓
Logout
```