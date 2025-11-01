# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **fullstack developer community forum** application with Reddit-style post system. The project has two main components:
- **bun-auth**: Backend Web API built with Bun, Elysia, Better Auth, Drizzle ORM, and TypeScript
- **react-auth**: Frontend React application (pure React with Vite)

### Current State
The application currently implements a complete authentication system with email/password and social OAuth (Google, Discord).

### Project Goal
Build a community forum platform for developers featuring:
- **Reddit-style post system** with voting, comments, and discussions
- User authentication and authorization
- Post creation, editing, and deletion
- Voting system (upvotes/downvotes)
- Nested comment threads
- Community/subreddit-like organization
- User profiles and reputation system
- Rich text editor for posts and comments

## Architecture

### Backend (bun-auth)

**Core Framework**: Elysia.js running on Bun runtime
**Authentication**: Better Auth library with custom Elysia plugin integration
**Database**: PostgreSQL with Drizzle ORM
**API Documentation**: OpenAPI/Swagger via @elysiajs/openapi

#### Key Architecture Patterns:

1. **Better Auth Integration** (`src/http/plugins/better-auth.ts`):
   - Custom Elysia plugin wraps Better Auth handler
   - Mounts auth handler that automatically creates all auth routes at `/auth/*`
   - Implements auth macro for protecting routes with `{ auth: true }` option
   - Exposes OpenAPI schema generation for auth endpoints
   - Session validation via `auth.api.getSession()` with cookie headers
   - When a route uses `{ auth: true }`, the user object is injected into route context

2. **Database Layer** (`src/database/`):
   - Drizzle ORM with PostgreSQL adapter
   - Schema split across domain modules: users, sessions, accounts, verifications
   - Snake_case naming convention enforced via config
   - Migrations stored in `src/database/migrations/`

3. **Environment Configuration** (`src/env.ts`):
   - Centralized environment variable management
   - All configs import from `@/env`

4. **Main Application Entry** (`src/index.ts`):
   - Elysia app instance configured with CORS middleware
   - OpenAPI/Swagger documentation auto-generated from route schemas
   - Better Auth plugin registered (provides `/auth/*` routes and `{ auth: true }` macro)
   - Custom routes defined with Zod validation and OpenAPI details
   - Example protected route at `/users/:id` demonstrates auth macro usage

5. **Path Aliases**:
   - `@/` maps to `src/` directory
   - Used throughout codebase: `@/auth`, `@/env`, `@/database`, etc.

#### Adding New Protected Routes

To add a new protected route in the backend:

```typescript
.get("/your-route", ({ user }) => {
  // user object is automatically injected by auth macro
  return { data: "protected data", userId: user.id };
}, {
  auth: true,  // Enables authentication check
  detail: {
    summary: "Your route description",
    tags: ["your-tag"]
  }
})
```

### Frontend (react-auth)

**Framework**: React 19 with React Router DOM
**Build Tool**: Vite with Rolldown (npm:rolldown-vite@7.1.14)
**Styling**: Tailwind CSS v4 with Radix UI components
**Forms**: React Hook Form with Zod validation
**Authentication Client**: Better Auth React client

#### Key Architecture Patterns:

1. **Authentication Client** (`src/lib/auth.ts`):
   - Better Auth React client configured via `VITE_BETTER_AUTH_URL` environment variable
   - Defaults to `http://localhost:3333/` if not set
   - Exports convenience hooks: `signIn`, `signOut`, `signUp`, `useSession`
   - These hooks can be used directly in components for auth operations

2. **Routing Structure** (`src/main.tsx`):
   - React Router DOM with BrowserRouter
   - Routes:
     - `/` - Home/App page
     - `/signin` - Sign in page
     - `/signup` - Sign up page
     - `/profile` - Protected profile page
   - No built-in route protection - components handle auth checks via `useSession`

3. **Component Organization**:
   - `src/components/ui/` - Reusable UI components (shadcn/ui pattern with Radix UI)
   - `src/components/` - Feature components (sign-in-form, sign-up-form, profile-layout)
   - Top-level route components in `src/` (app.tsx, signin.tsx, signup.tsx, profile.tsx)
   - Forms use React Hook Form with Zod validation via @hookform/resolvers

4. **Path Aliases**:
   - `@/` maps to `src/` directory
   - Configured in vite.config.ts and tsconfig.json

#### Using Authentication in Frontend Components

```typescript
import { useSession, signIn, signOut } from "@/lib/auth";

function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Hello {session.user.name}</div>;
}
```

## Forum System Architecture (Planned)

### Database Schema for Forum Features

The forum system will extend the existing authentication schema with the following tables:

1. **Communities/Subreddits** (`communities`):
   - Basic info: name, slug, description, icon, banner
   - Timestamps: created_at, updated_at
   - Relationships: creator (user_id)

2. **Posts** (`posts`):
   - Content: title, body (markdown/rich text), slug
   - Metadata: vote_count, comment_count, views
   - Relationships: author (user_id), community (community_id)
   - Status: published, draft, archived
   - Timestamps: created_at, updated_at, published_at

3. **Comments** (`comments`):
   - Content: body (markdown/rich text)
   - Metadata: vote_count, depth (for nested comments)
   - Relationships: author (user_id), post (post_id), parent_comment (comment_id)
   - Timestamps: created_at, updated_at

4. **Votes** (`votes`):
   - Type: upvote (+1) or downvote (-1)
   - Target: votable_type (post/comment), votable_id
   - Relationships: user (user_id)
   - Constraints: unique constraint on (user_id, votable_type, votable_id)

5. **User Reputation** (stored in users table or separate `user_stats`):
   - Karma/reputation points
   - Post count, comment count
   - Join date, last active

### API Routes Structure (Planned)

**Community Routes** (`/api/communities/*`):
- `GET /api/communities` - List all communities
- `POST /api/communities` - Create community (auth required)
- `GET /api/communities/:slug` - Get community details
- `PATCH /api/communities/:slug` - Update community (auth + owner)

**Post Routes** (`/api/posts/*`):
- `GET /api/posts` - List posts (with filters: community, user, sort)
- `POST /api/posts` - Create post (auth required)
- `GET /api/posts/:slug` - Get post with comments
- `PATCH /api/posts/:slug` - Update post (auth + author)
- `DELETE /api/posts/:slug` - Delete post (auth + author)

**Comment Routes** (`/api/comments/*`):
- `GET /api/posts/:postId/comments` - Get post comments (nested)
- `POST /api/posts/:postId/comments` - Create comment (auth required)
- `PATCH /api/comments/:id` - Update comment (auth + author)
- `DELETE /api/comments/:id` - Delete comment (auth + author)

**Vote Routes** (`/api/votes/*`):
- `POST /api/votes` - Cast vote (auth required, upsert logic)
- `DELETE /api/votes/:id` - Remove vote (auth required)

### Frontend Pages (Planned)

- `/` - Home feed with posts from all communities
- `/c/:slug` - Community page with community posts
- `/c/:slug/post/:slug` - Individual post view with comments
- `/submit` - Create new post (auth required)
- `/u/:username` - User profile with posts and comments

### Technical Considerations

- **Voting System**: Use optimistic updates on frontend, background jobs for vote count aggregation
- **Comment Threading**: Implement using adjacency list or nested set pattern (max depth limit)
- **Content Sanitization**: Sanitize HTML/markdown input to prevent XSS
- **Rate Limiting**: Implement rate limits for post/comment creation
- **Search**: Consider adding full-text search with PostgreSQL or external service
- **Moderation**: Plan for community moderators and content reporting system

## Development Commands

### Starting Development Environment

```bash
# Start all services (PostgreSQL, backend, frontend) with Docker
./deploy.sh dev

# OR start services individually:

# 1. Start PostgreSQL database only
docker compose up -d postgres

# 2. Start backend (from bun-auth directory)
cd bun-auth && bun run dev

# 3. Start frontend (from react-auth directory)
cd react-auth && bun run dev
```

The backend runs on **http://localhost:3333**
The frontend runs on **http://localhost:5173**

### Backend (bun-auth)

```bash
# Development
bun run dev                  # Start dev server with hot reload

# Database operations
bun run db:generate          # Generate Drizzle migrations from schema changes
bun run db:migrate           # Apply migrations to database
```

### Frontend (react-auth)

```bash
# Development
bun run dev                  # Start dev server

# Production builds
bun run build                # Build for production
bun run build:staging        # Build for staging
bun run build:prod           # Build for production (explicit)
bun run vercel-build         # Build for Vercel deployment

# Other commands
bun run preview              # Preview production build locally
bun run lint                 # Lint code with ESLint
```

### Docker Deployment

```bash
# Use the deploy script for all deployment operations
./deploy.sh dev              # Deploy development environment
./deploy.sh prod             # Deploy production environment
./deploy.sh status           # Check container status
./deploy.sh logs [service]   # View logs (optional: specify service)
./deploy.sh backup           # Backup database
./deploy.sh restore <file>   # Restore from backup
./deploy.sh clean            # Clean all containers and volumes
```

### Production Deployment with Supabase + Vercel

For production deployment using Supabase (PostgreSQL) and Vercel, see the comprehensive guide:

📖 **[DEPLOY-SUPABASE.md](./DEPLOY-SUPABASE.md)** - Complete deployment guide with:
- Supabase configuration and setup
- Database migrations for production
- Vercel environment variables setup
- Security best practices
- Troubleshooting common issues

Quick reference for database migrations in production:

```bash
cd bun-auth

# Generate migrations from schema changes
bun run db:generate:prod

# Apply migrations to Supabase database
bun run db:migrate:prod

# Or use push for quick schema sync (no migration files)
bun run db:push:prod
```

## Database

- PostgreSQL 15-alpine running in Docker
- Connection (dev): `postgresql://docker:docker@localhost:5432/auth`
- Managed via Drizzle ORM with migrations
- Schema uses snake_case convention (enforced in Drizzle config)

### Database Schema Organization

**Current Schema** (Authentication system) in `bun-auth/src/database/schema/`:
- `users` - User accounts
- `sessions` - Active user sessions
- `accounts` - OAuth provider accounts
- `verifications` - Email verification tokens

**Planned Schema** (Forum system) to be added:
- `communities` - Community/subreddit-like spaces
- `posts` - Forum posts with title, body, metadata
- `comments` - Nested comments on posts
- `votes` - Upvotes/downvotes for posts and comments
- `user_stats` (optional) - User reputation, karma, and statistics
- `community_members` (optional) - Community membership and roles

### Modifying Database Schema

1. Update schema files in `bun-auth/src/database/schema/`
2. Run `bun run db:generate` to create migration (from bun-auth directory)
3. Run `bun run db:migrate` to apply migration
4. Migrations are stored in `bun-auth/src/database/migrations/`

## Docker Services

The application uses Docker Compose with different configurations:

### Development (docker-compose.yml)

- **postgres** - PostgreSQL 15-alpine database (port 5432)
- **backend** - Bun/Elysia API server (port 3333)
- **frontend** - React app with Nginx (port 80)
- **pgadmin** - Database management UI (port 8080, dev profile only)

### Production (docker-compose.prod.yml)

- **nginx** - Reverse proxy with SSL support (ports 80, 443)
- **postgres** - PostgreSQL with persistent volumes and backups
- **backend** - Optimized multi-stage build with non-root user
- **frontend** - Static build served by Nginx with SPA routing

All services communicate via a shared `app-network` bridge network.

## Authentication Flow

1. **Better Auth** handles authentication logic on backend
2. Custom Elysia plugin (`betterAuthPlugin`) integrates Better Auth with Elysia:
   - Mounts auth handler at `/auth/*`
   - Provides macro for route protection
   - Generates OpenAPI documentation
3. Protected routes use `{ auth: true }` option
4. Frontend uses Better Auth React client to communicate with backend
5. Sessions validated via cookies with 7-day expiration

## Environment Configuration

### Development Environment Variables

Create `.env` files based on `.env.example` in the project root:

**Required for Backend (bun-auth)**:
- `BETTER_AUTH_SECRET` - Secret for Better Auth session signing
- `BETTER_AUTH_URL` - Backend URL (default: http://localhost:3333)
- `DATABASE_URL` - Constructed from DB_NAME, DB_USER, DB_PASSWORD
- OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.)

**Required for Frontend (react-auth)**:
- `VITE_BETTER_AUTH_URL` - Backend API URL (configured in .env.development, .env.staging, .env.production)

### Production Deployment

The project supports multiple deployment targets:

1. **Docker Deployment**:
   - Use `./deploy.sh prod` to deploy with docker-compose.prod.yml
   - Requires `.env.prod` with production credentials
   - Includes Nginx reverse proxy for HTTPS
   - Automated database backups available

2. **Vercel Deployment**:
   - Configured via `vercel.json` in project root
   - Frontend deployed as static build
   - Backend deployed as serverless function with @vercel/bun
   - Routes configured to proxy `/auth/*` and `/api/*` to backend

## Important Configuration Notes

### Technology Stack
- **Backend**: Elysia.js + Bun runtime + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with custom Elysia plugin
- **Frontend**: Pure React 19 (no Next.js) + React Router DOM
- **Build Tool**: Vite with Rolldown fork (npm:rolldown-vite@7.1.14)
- **Styling**: Tailwind CSS v4 + Radix UI components
- **Validation**: Zod v4 for both backend and frontend

### Configuration Details
- Backend CORS enabled for frontend origin (localhost:5173 in dev)
- Frontend uses Rolldown (Vite fork via npm:rolldown-vite@7.1.14) instead of standard Vite
- Both projects use Zod v4 for validation
- TypeScript path aliases (`@/`) configured in both tsconfig.json files
- Environment variables managed via .env files (not committed to git)
- React 19 with React Router DOM for routing (no Next.js)
- Database uses snake_case naming convention (enforced in Drizzle config)
