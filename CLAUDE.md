# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fullstack authentication application with two main components:
- **bun-auth**: Backend API built with Bun, Elysia, and Better Auth
- **react-auth**: Frontend React application with Vite

The application implements a complete authentication system with email/password and social OAuth (Google, Discord).

## Architecture

### Backend (bun-auth)

**Core Framework**: Elysia.js running on Bun runtime
**Authentication**: Better Auth library with custom Elysia plugin integration
**Database**: PostgreSQL with Drizzle ORM
**API Documentation**: OpenAPI/Swagger via @elysiajs/openapi

#### Key Architecture Patterns:

1. **Better Auth Integration** (`src/http/plugins/better-auth.ts`):
   - Custom Elysia plugin wraps Better Auth handler
   - Implements auth macro for protecting routes with `{ auth: true }`
   - Exposes OpenAPI schema generation for auth endpoints
   - Session validation via `auth.api.getSession()`

2. **Database Layer** (`src/database/`):
   - Drizzle ORM with PostgreSQL adapter
   - Schema split across domain modules: users, sessions, accounts, verifications
   - Snake_case naming convention enforced via config
   - Migrations stored in `src/database/migrations/`

3. **Environment Configuration** (`src/env.ts`):
   - Centralized environment variable management
   - All configs import from `@/env`

4. **Path Aliases**:
   - `@/` maps to `src/` directory

### Frontend (react-auth)

**Framework**: React 19 with React Router DOM
**Build Tool**: Vite with Rolldown (npm:rolldown-vite@7.1.14)
**Styling**: Tailwind CSS v4 with Radix UI components
**Forms**: React Hook Form with Zod validation
**Authentication Client**: Better Auth React client

#### Key Architecture Patterns:

1. **Authentication Client** (`src/lib/auth.ts`):
   - Better Auth React client configured to connect to backend at `http://localhost:3333/`
   - Exports convenience hooks: `signIn`, `signOut`, `signUp`, `useSession`

2. **Routing Structure** (`src/main.tsx`):
   - `/` - Home/App page
   - `/signin` - Sign in page
   - `/signup` - Sign up page
   - `/profile` - Protected profile page

3. **Component Organization**:
   - `src/components/ui/` - Reusable UI components (shadcn/ui pattern)
   - `src/components/` - Feature components (sign-in, sign-up, profile-layout)
   - Top-level route components in `src/`

4. **Path Aliases**:
   - `@/` maps to `src/` directory

## Development Commands

### Backend (bun-auth)

```bash
# Start development server with hot reload
bun run dev

# Database operations
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run migrations

# Start PostgreSQL database
docker compose up -d
```

The backend runs on **http://localhost:3333**

### Frontend (react-auth)

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint
```

The frontend runs on **http://localhost:5173**

## Database

- PostgreSQL 17 running in Docker
- Connection: `postgresql://docker:docker@localhost:5432/auth`
- Managed via Drizzle ORM with migrations
- Schema uses snake_case convention

When modifying database schema:
1. Update schema files in `bun-auth/src/database/schema/`
2. Run `bun run db:generate` to create migration
3. Run `bun run db:migrate` to apply migration

## Authentication Flow

1. **Better Auth** handles authentication logic on backend
2. Custom Elysia plugin (`betterAuthPlugin`) integrates Better Auth with Elysia:
   - Mounts auth handler at `/auth/*`
   - Provides macro for route protection
   - Generates OpenAPI documentation
3. Protected routes use `{ auth: true }` option
4. Frontend uses Better Auth React client to communicate with backend
5. Sessions validated via cookies with 7-day expiration

## Important Configuration Notes

- Backend CORS enabled for frontend origin (localhost:5173)
- Frontend uses Rolldown (Vite fork) instead of standard Vite
- Both projects use Zod v4 for validation
- TypeScript path aliases (`@/`) configured in both tsconfig.json files
- Environment variables managed via .env files (not committed to git)
