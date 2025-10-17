# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (use pnpm, not npm)
pnpm install

# Development server with Turbopack
pnpm dev

# Production build
pnpm build

# Serve production build locally
pnpm start

# ESLint with Next.js Core Web Vitals rules
pnpm lint

# Database setup and management
pnpm db:setup          # Initialize Auth.js tables
pnpm db:verify         # Verify table structure
pnpm db:check-users    # Check users and linked accounts
pnpm db:migrate-names  # Migrate table names (if needed)
```

## Architecture Overview

ToolCategory is a Next.js 15 application that serves as a curated directory of software tools and products. It's built with:

- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js v5 (beta) with Google/GitHub OAuth
- **UI**: Tailwind CSS with shadcn/ui components
- **Payments**: PayPal integration for premium listings
- **File Storage**: AWS S3 with R2 integration

### Key Database Entities

The application revolves around these core entities:

- **Sites**: Tools/products submitted by users or administrators
- **Categories**: Organizational taxonomy for sites (e.g., "productivity", "design")
- **Tags**: Flexible labeling system for discovery
- **Users**: Authentication via NextAuth.js with OAuth providers
- **Orders**: PayPal payment records for premium features

### Data Flow

1. **Site Submission**: Users submit tools via `/submit` → API validates → Database transaction creates site + associates categories/tags
2. **Discovery**: Home page loads featured/latest tools + category sections via `getHomePageSections()`
3. **Authentication**: OAuth flow manages user sessions with automatic account linking enabled
4. **Payment Flow**: PayPal integration handles premium submissions and verification badges

## Key Files and Structure

### Core Application Files
- `app/page.tsx` - Homepage with tool discovery sections
- `app/layout.tsx` - Root layout with providers and metadata
- `lib/data-loaders.ts` - All database queries with caching via React `cache()`
- `lib/db/schema.ts` - Drizzle schema definitions for all tables
- `lib/auth.ts` - NextAuth.js configuration with OAuth providers

### API Routes
- `app/api/submissions/route.ts` - Tool submission endpoint with validation
- `app/api/payments/paypal/` - PayPal order creation and capture
- `app/api/uploads/route.ts` - File upload handling (S3/R2)
- `app/api/auth/[...nextauth]/route.ts` - NextAuth.js handlers

### Database Management
- `scripts/setup-auth-tables.ts` - Creates NextAuth.js required tables
- `scripts/verify-tables.ts` - Validates database schema
- `drizzle.config.ts` - Drizzle kit configuration

## Development Patterns

### Component Organization
- UI primitives in `components/ui/` follow shadcn patterns
- Page-specific components use descriptive names (e.g., `category-page-content.tsx`)
- Shared utilities in `lib/` with `@/*` path aliases

### State Management
- Server components for data fetching with React `cache()`
- Client components only where interactivity is needed
- Form state managed locally with validation in API routes

### Database Patterns
- All queries in `lib/data-loaders.ts` with proper error handling
- Drizzle transactions for multi-table operations
- Slug generation with uniqueness validation
- Soft relationships between sites, categories, and tags

### Authentication Flow
- NextAuth.js v5 beta with OAuth providers
- `allowDangerousEmailAccountLinking: true` for development (see AUTH_TROUBLESHOOTING.md)
- User sessions include user ID for database relationships
- Protected routes use `auth()` function

### Payment Integration
- PayPal sandbox/live mode based on environment
- Order creation → user payment → capture flow
- Order tracking in database with status updates

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# PayPal
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."
PAYPAL_MODE="sandbox" # or "live"

# AWS S3/R2
AWS_REGION="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
S3_BUCKET_NAME="..."
```

## Coding Standards

Following the patterns established in AGENTS.md:

- TypeScript-first with functional React components
- PascalCase for components, camelCase for utilities
- Two-space indentation with ESLint autofix
- Tailwind utility classes over custom CSS
- Use `cn()` helper for className composition
- Avoid anonymous default exports

## Common Development Tasks

### Adding a New Site Field
1. Update `lib/db/schema.ts` sites table
2. Run database migration via Drizzle
3. Update submission form in `app/submit/page.tsx`
4. Modify validation in `app/api/submissions/route.ts`
5. Update display components as needed

### Adding New OAuth Provider
1. Install provider package for NextAuth.js
2. Add to `lib/auth.ts` providers array
3. Set up OAuth app and add environment variables
4. Update sign-in UI components

### Database Schema Changes
1. Modify `lib/db/schema.ts`
2. Generate migration: `pnpm drizzle-kit generate`
3. Apply migration: `pnpm drizzle-kit push`
4. Verify with `pnpm db:verify`

## Troubleshooting

- OAuth issues: See AUTH_TROUBLESHOOTING.md for common problems
- Database connectivity: Use `pnpm db:verify` to check connection
- Missing environment variables: Check console for specific errors
- PayPal issues: Verify sandbox vs live mode configuration