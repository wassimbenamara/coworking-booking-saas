# Coworking Booking SaaS — Frontend

React frontend for the Coworking Booking SaaS application.

The frontend provides authentication, coworking space browsing and creation, resource management, resource availability management, booking creation, and authenticated booking history.

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

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── navigation/
│   │   │   └── PageNavigation.tsx
│   │   └── ui/
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   ├── pages/
│   │   ├── BookingsPage.tsx
│   │   ├── CoworkingSpaceDetailsPage.tsx
│   │   ├── CoworkingSpacesPage.tsx
│   │   ├── CreateBookingPage.tsx
│   │   ├── CreateCoworkingResourcePage.tsx
│   │   ├── CreateCoworkingSpacePage.tsx
│   │   ├── CreateResourceAvailabilityPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── services/
│   │   ├── booking.service.ts
│   │   ├── coworking-resource.service.ts
│   │   ├── coworking-space.service.ts
│   │   └── resource-availability.service.ts
│   │
│   ├── types/
│   │   ├── booking.ts
│   │   ├── coworking-resource.ts
│   │   ├── coworking-space.ts
│   │   └── resource-availability.ts
│   │
│   └── App.tsx
│
└── README.md
```

---

## Environment Variables

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:3000
```

Only environment variables prefixed with `VITE_` are exposed to the browser.

---

## Development

From the repository root:

```bash
npm run dev --workspace=frontend
```

Default URL:

```text
http://localhost:5173
```

---

## Build

```bash
npm run build:frontend
```

Or build the complete monorepo:

```bash
npm run build
```

---

# API Client

Authenticated HTTP requests are centralized in:

```text
src/lib/api.ts
```

The API helper automatically prefixes requests with:

```text
VITE_API_URL
```

Service functions therefore use relative paths:

```ts
apiFetch("/api/bookings")
```

instead of:

```ts
apiFetch(`${API_URL}/api/bookings`)
```

This avoids duplicated API URLs and keeps HTTP configuration centralized.

---

# Authentication

Authentication state is centralized in:

```text
AuthContext
```

The context manages:

```text
user
accessToken
isLoading
login
logout
session restoration
```

The frontend restores the user session through:

```http
GET /api/auth/me
```

---

# Protected Routes

Protected routes use:

```text
ProtectedRoute
```

The application uses a protected parent route:

```tsx
<Route element={<ProtectedRoute />}>
  ...
</Route>
```

This avoids wrapping every protected page individually.

Unauthenticated users are redirected to:

```text
/login
```

---

# Routes

## Public

```text
/login
/register
```

## Protected

```text
/dashboard
/coworking-spaces
/coworking-spaces/new
/coworking-spaces/:id
/coworking-spaces/:id/resources/new
/coworking-resources/:id/availabilities/new
/coworking-resources/:id/book
/bookings
```

---

# Dashboard

The dashboard provides access to the main application flows.

Users can navigate to:

```text
Coworking spaces
My bookings
```

---

# Page Navigation

Reusable navigation is provided through:

```text
PageNavigation
```

It allows application pages to provide:

```text
Dashboard
Back
```

navigation without duplicating the same React Router links and button styles across pages.

Example:

```tsx
<PageNavigation
  backTo="/coworking-spaces"
  backLabel="Back to coworking spaces"
/>
```

---

# Coworking Spaces

## List

Route:

```text
/coworking-spaces
```

Displays available coworking spaces.

---

## Details

Route:

```text
/coworking-spaces/:id
```

Displays:

- coworking name
- location
- description
- address
- resources
- resource capacities
- resource availability windows
- resource booking actions

---

## Create Coworking Space

Route:

```text
/coworking-spaces/new
```

The form uses the shared Zod schema from:

```text
@coworking/shared
```

Field validation errors are displayed next to the corresponding form fields.

---

# Coworking Resources

Resources are displayed inside the coworking space details page.

Supported types:

```text
DESK
MEETING_ROOM
```

---

## Create Resource

Route:

```text
/coworking-spaces/:id/resources/new
```

The coworking space ID comes from the URL.

It is not entered manually by the user.

The form supports:

```text
name
type
capacity
```

---

# Resource Availability

Each resource displays its configured availability ranges.

Example:

```text
09:00 → 12:00
14:00 → 18:00
```

When no availability exists:

```text
No availability configured.
```

The booking action remains unavailable until an availability range exists.

---

## Create Availability

Route:

```text
/coworking-resources/:id/availabilities/new
```

Form fields:

```text
startsAt
endsAt
```

The resource ID comes from the route.

The browser uses `datetime-local` values.

The frontend converts them to ISO datetimes only when submitting:

```text
datetime-local
    ↓
local string state
    ↓
Date.toISOString()
    ↓
shared Zod validation
    ↓
API
```

The backend remains responsible for overlap validation.

---

# Booking

## Create Booking

Route:

```text
/coworking-resources/:id/book
```

The page displays the resource's availability ranges before booking.

The booking form accepts:

```text
startsAt
endsAt
```

The resource ID comes from the URL.

The user ID is never sent by the frontend.

The authenticated backend determines the user from the JWT.

---

## Booking Errors

The UI handles important API errors including:

```text
INVALID_DATA
UNAUTHORIZED
RESOURCE_NOT_FOUND
BOOKING_CONFLICT
```

Booking conflicts can mean:

```text
booking outside resource availability
or
booking overlapping another booking
```

---

# My Bookings

Route:

```text
/bookings
```

Displays bookings belonging to the authenticated user.

Each booking can show:

```text
resource
resource type
coworking space
city
start datetime
end datetime
```

After successful booking creation, the user is redirected to:

```text
/bookings
```

---

# Booking Flow

```text
Dashboard
    ↓
Coworking spaces
    ↓
Coworking space details
    ↓
Resource
    ↓
Add availability
    ↓
Availability displayed
    ↓
Book
    ↓
Create booking
    ↓
My bookings
```

---

# Shared Validation

The frontend imports shared Zod schemas from:

```text
@coworking/shared
```

Current frontend-used schemas include:

```text
registerSchema
loginSchema
createCoworkingSpaceSchema
createCoworkingResourceSchema
createResourceAvailabilitySchema
createBookingSchema
```

This keeps client-side validation aligned with backend API contracts.

---

# TypeScript

The project uses strict TypeScript.

Nullable authentication values are narrowed before being passed to services.

Preferred pattern:

```ts
if (!accessToken) {
  return;
}

const token: string = accessToken;
```

Avoid relying on:

```ts
accessToken!
```

or unnecessary assertions such as:

```ts
accessToken as string
```

---

# UI Components

The frontend uses shadcn/ui with Base UI.

Links styled as buttons use:

```ts
buttonVariants()
```

Example:

```tsx
<Link
  to="/dashboard"
  className={buttonVariants({
    variant: "outline",
  })}
>
  Dashboard
</Link>
```

The project does not rely on `asChild` for Base UI buttons.

---

# Current Features

- React + TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Base UI
- Shared Zod validation
- Registration UI
- Login UI
- AuthContext
- Session restoration
- Protected routes
- Logout
- Centralized API helper
- Dashboard
- Coworking space list
- Coworking space details
- Coworking space creation
- Coworking resource creation
- Resource availability display
- Resource availability creation
- Booking creation
- My bookings page
- Booking conflict error handling
- Reusable page navigation
- Dashboard navigation

---

# Planned Features

- Booking cancellation UI
- Booking status display
- Role-based UI
- Admin dashboard
- Better loading states
- Toast notifications
- Frontend tests
- Accessibility improvements
- Production authentication using HTTP-only cookies

---

# Security Note

The MVP currently stores the access token in:

```text
localStorage
```

Authentication state is still centralized through `AuthContext`.

A future production improvement can migrate access token handling to HTTP-only cookies.

---

# Status

✅ First frontend MVP completed.

Completed flow:

```text
Register
    ↓
Login
    ↓
Dashboard
    ↓
Coworking spaces
    ↓
Resources
    ↓
Availability
    ↓
Booking
    ↓
My bookings
```

Next:

```text
Testing
Authorization
UX improvements
Production hardening
```