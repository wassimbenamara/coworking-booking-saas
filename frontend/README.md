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

Shared TypeScript types and Zod validation schemas are provided by:

```text
@coworking/shared
```

Current shared frontend schemas include:

- authentication
- coworking spaces
- coworking resources

Example:

```ts
import {
  loginSchema,
  registerSchema,
  createCoworkingSpaceSchema,
  createCoworkingResourceSchema,
} from "@coworking/shared";
```

The backend remains the authoritative validation layer.

---

## Project Structure

```text
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   └── ui/
│
├── contexts/
│   └── AuthContext.tsx
│
├── lib/
│   └── api.ts
│
├── pages/
│   ├── CoworkingSpaceDetailsPage.tsx
│   ├── CoworkingSpacesPage.tsx
│   ├── CreateCoworkingResourcePage.tsx
│   ├── CreateCoworkingSpacePage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
│
├── services/
│   ├── auth.service.ts
│   ├── coworking-resource.service.ts
│   └── coworking-space.service.ts
│
├── types/
│   ├── auth.ts
│   ├── coworking-resource.ts
│   └── coworking-space.ts
│
├── App.tsx
├── index.css
└── main.tsx
```

---

# Routes

## Login

```text
/login
```

Allows users to authenticate.

Successful login redirects to:

```text
/dashboard
```

---

## Registration

```text
/register
```

Allows new users to create an account.

---

## Dashboard

```text
/dashboard
```

Protected route.

---

## Coworking Spaces

```text
/coworking-spaces
```

Protected route.

Displays coworking spaces available to authenticated users.

---

## Coworking Space Details

```text
/coworking-spaces/:id
```

Protected route.

Displays:

- coworking space name
- description
- address
- city
- country
- associated resources

---

## Create Coworking Space

```text
/coworking-spaces/new
```

Protected route.

Allows an authenticated user to create a coworking space.

---

## Create Coworking Resource

```text
/coworking-spaces/:id/resources/new
```

Protected route.

Allows an authenticated user to add a resource to a coworking space.

---

# Authentication

The frontend uses `AuthContext` to centralize authentication state.

It manages:

- authenticated user
- JWT access token
- login
- logout
- authentication loading state
- session restoration

Authentication state is not read directly from browser storage throughout the component tree.

---

## Login Flow

```text
Login form
    ↓
Client-side validation
    ↓
POST /api/auth/login
    ↓
Receive user + JWT
    ↓
AuthContext.login(...)
    ↓
Redirect to /dashboard
```

---

# Session Restoration

On application startup, if an access token exists, the frontend calls:

```http
GET /api/auth/me
```

Flow:

```text
Application starts
    ↓
Stored token?
    ↓
GET /api/auth/me
    ↓
Valid?
    ├── Yes → restore user
    └── No  → clear auth state
```

---

# Protected Routes

Protected routes use:

```text
src/components/auth/ProtectedRoute.tsx
```

Flow:

```text
Protected route requested
    ↓
Auth state loading?
    ↓
Authenticated user?
    ├── Yes → render page
    └── No  → redirect to /login
```

Protected application routes currently include:

```text
/dashboard
/coworking-spaces
/coworking-spaces/:id
/coworking-spaces/new
/coworking-spaces/:id/resources/new
```

---

# Authenticated API Client

Authenticated HTTP requests are centralized in:

```text
src/lib/api.ts
```

Services pass relative API paths such as:

```text
/api/coworking-spaces
/api/coworking-spaces/1
/api/coworking-resources
```

The API helper:

- prepends `VITE_API_URL`
- adds the JWT authorization header when provided
- centralizes common HTTP configuration

Example flow:

```text
React page
    ↓
service
    ↓
apiFetch()
    ↓
backend API
```

This avoids duplicating backend URLs and authorization headers throughout the application.

---

# Coworking Spaces

## Listing

The coworking space listing page loads:

```http
GET /api/coworking-spaces
```

The page handles:

- loading state
- API errors
- empty state
- coworking cards

Selecting a coworking space navigates to:

```text
/coworking-spaces/:id
```

---

## Details

The details page loads:

```http
GET /api/coworking-spaces/:id
```

It also loads the resources belonging to the coworking space:

```http
GET /api/coworking-spaces/:coworkingSpaceId/resources
```

Coworking and resource loading states are kept separate so that a resource loading failure does not prevent the coworking details from being displayed.

---

## Create Coworking Space

The creation form uses:

```text
createCoworkingSpaceSchema
```

from:

```text
@coworking/shared
```

Flow:

```text
Form
    ↓
Shared Zod validation
    ↓
POST /api/coworking-spaces
    ↓
Created coworking space
    ↓
Redirect to details page
```

Validation errors are displayed per field.

---

# Coworking Resources

Resources represent bookable entities inside a coworking space.

Supported types:

```text
DESK
MEETING_ROOM
```

Each resource currently contains:

```text
id
name
type
capacity
coworkingSpaceId
createdAt
updatedAt
```

---

## Resource Listing

Resources are displayed directly inside:

```text
/coworking-spaces/:id
```

Example:

```text
Coworking Space
    ↓
Resources
    ├── Desk A1
    ├── Desk A2
    └── Meeting Room Alpha
```

Each resource card displays:

- name
- type
- capacity

The page supports:

- resource loading state
- resource error state
- empty resource state

---

## Create Coworking Resource

The creation route is:

```text
/coworking-spaces/:id/resources/new
```

The form contains:

```text
name
type
capacity
```

The `coworkingSpaceId` is automatically derived from the route parameter and is not manually entered.

Supported types:

```text
DESK
MEETING_ROOM
```

The form uses:

```text
createCoworkingResourceSchema
```

from the shared package.

Flow:

```text
Coworking details
    ↓
Add resource
    ↓
Create resource form
    ↓
Shared Zod validation
    ↓
POST /api/coworking-resources
    ↓
Redirect to coworking details
```

Validation errors are displayed next to the relevant field.

---

# Error Handling

Forms distinguish between:

- field validation errors
- authentication errors
- backend API errors

Field validation messages use the shared Zod schemas.

Examples:

```text
Name must contain at least 2 characters
Capacity must be at least 1
```

Errors are displayed in red near the relevant field.

---

# API Integration

Current frontend API calls include:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

GET /api/coworking-spaces
GET /api/coworking-spaces/:id
POST /api/coworking-spaces

GET /api/coworking-spaces/:coworkingSpaceId/resources
GET /api/coworking-resources/:id
POST /api/coworking-resources
```

Authentication-protected requests include the JWT access token.

---

# UI System

The frontend uses:

- Tailwind CSS
- shadcn/ui
- Base UI

Reusable UI components live in:

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

For links that should look like buttons, the frontend reuses:

```ts
buttonVariants(...)
```

instead of duplicating button styles.

---

# Current Features

- User registration page
- Registration API integration
- User login page
- Login API integration
- React authentication context
- Session restoration
- Protected React routes
- Logout flow
- Centralized authenticated API client
- Shared Zod validation
- Coworking space listing page
- Coworking space details page
- Coworking space creation page
- Coworking resource listing inside coworking details
- Coworking resource creation page
- `DESK` resource support
- `MEETING_ROOM` resource support
- Field-level form validation
- Loading states
- API error states
- Empty states
- Tailwind CSS
- shadcn/ui
- Base UI
- React Router

---

# Planned Features

- Coworking resource details page
- Resource availability UI
- Booking creation
- Booking history
- Booking cancellation
- Booking conflict feedback
- Coworking space editing
- Coworking resource editing
- Role-based UI
- Admin UI
- Improved dashboard
- Toast notifications
- Better loading indicators
- HTTP-only cookie authentication
- Frontend tests

---

# Security Note

The current MVP stores the JWT access token in browser `localStorage`.

This is suitable for the current development stage, but it is not intended to be the final production authentication architecture.

A future improvement will migrate authentication toward HTTP-only cookies.

---

# Development

Start the frontend:

```bash
npm run dev --workspace=frontend
```

Default URL:

```text
http://localhost:5173
```

Start the backend separately:

```bash
npm run dev --workspace=backend
```

---

# Build

Build the frontend:

```bash
npm run build --workspace=frontend
```

Build the complete monorepo:

```bash
npm run build
```

---

# Current Application Flow

```text
Register
    ↓
Login
    ↓
JWT
    ↓
AuthContext
    ↓
Protected routes
    ↓
Coworking spaces
    ↓
Coworking details
    ↓
Resources
    ↓
Create resource
```

---

# Status

🚧 Work in progress.

Current frontend milestone:

```text
Coworking resources UI
```

Completed:

```text
Authentication UI
    ↓
Coworking spaces UI
    ↓
Coworking resources UI
```

Next:

```text
Availability and booking UI
```