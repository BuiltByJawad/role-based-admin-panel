# Role-Based Admin & Project Management System

Mid-level Full Stack assessment project with invite-based onboarding, RBAC, and project management.

## Features
- Invite-only registration (admin generates token)
- JWT authentication + role-based access control
- Admin user management (role/status updates)
- Project management with soft delete (admin-only edit/delete)
- Pagination + search for users/projects
- Optimistic UI updates and cached queries
- Persisted table cache (localStorage) for fast reloads

## Tech Stack
**Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL

**Frontend:** React, TypeScript, React Query, Tailwind CSS

## Project Structure
```
backend/   # API, Prisma, auth, services, routes
frontend/  # React app (pages, components, hooks)
```

## Environment Variables
Create `.env` files using the examples below.

**Backend** (`backend/.env`)
```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rbac_admin
JWT_SECRET=replace-with-strong-secret
INVITE_EXPIRY_HOURS=48
```

**Frontend** (`frontend/.env`)
```
VITE_API_URL=http://localhost:4000
```

## Local Setup

### 1) Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and calls the API at `http://localhost:4000`.

## Core API Endpoints
```
POST   /auth/login
POST   /auth/invite          (ADMIN)
POST   /auth/register-via-invite
GET    /users                (ADMIN, paginated)
PATCH  /users/:id/role        (ADMIN)
PATCH  /users/:id/status      (ADMIN)
POST   /projects              (AUTH)
GET    /projects              (AUTH, paginated)
PATCH  /projects/:id          (ADMIN)
DELETE /projects/:id          (ADMIN, soft delete)
```

## Architecture Notes
- **Auth:** JWT in Authorization header
- **RBAC:** middleware for ADMIN-only endpoints
- **Invites:** token-based, expiring invites
- **Soft Delete:** projects marked deleted, not removed
- **Validation:** Zod schemas + centralized error handler
- **State:** React Query caching + optimistic updates (persisted in localStorage)

## Tradeoffs & Assumptions
- Email sending is simulated (token is returned in response).
- Refresh tokens are included but only basic flow is used.
- UI focuses on admin usability over deep customization.

## Deployment
Free deployment setup:
- **Backend:** Render (Node web service + Postgres)
- **Frontend:** Netlify
- Set `VITE_API_URL` to the Render backend URL.

## Tests
```bash
cd backend
npm run test
```

## License
MIT