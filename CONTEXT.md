# Technical Context for Digital Direct

This document provides technical details on the project's architecture to guide developers, including AI assistants, on how the application works.

## 1. Authentication System (`next-auth`)

The application uses `next-auth` (v5) for handling all authentication logic.

- **Configuration File**: `src/app/api/auth/[...nextauth]/route.ts` is the central configuration file. It defines the authentication providers and session strategies.
- **Providers**:
  - **Credentials Provider**: Used for traditional email and password login. It includes custom `authorize` logic to verify user credentials against the database by hashing the provided password with `bcrypt` and comparing it to the stored hash.
  - **Google Provider**: Handles Google OAuth 2.0 sign-in. Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables.
- **Session Strategy**: A `jwt` session strategy is used. User roles are encoded into the JWT token in the `jwt` callback, making the user's role available throughout the application via the session object. This is crucial for implementing role-based access control (e.g., for the admin panel).
- **Protected Routes**: Middleware (`middleware.ts`) will be used to protect routes based on the user's session and role. The `next-auth` `getToken` utility is the standard way to access the session token on the server-side.
- **Frontend Integration**:
  - `signIn` and `signOut` functions from `next-auth/react` are used in UI components (`login/page.tsx`, `header.tsx`) to trigger authentication flows.
  - The `useSession` hook provides access to the current user's session data on the client-side.
  - The entire application is wrapped in a `<SessionProvider>` in `src/app/layout.tsx` to make the session available globally.

## 2. Database (Prisma + PostgreSQL)

Prisma is used as the Object-Relational Mapper (ORM) to interact with the PostgreSQL database.

- **Schema Definition**: The database schema is defined in `prisma/schema.prisma`. This file is the single source of truth for all database models (`User`, `Product`, `Order`, etc.) and their relations.
- **Database Connection**: Prisma connects to the PostgreSQL database using the `DATABASE_URL` environment variable defined in the `.env` file.
- **Prisma Client**: The Prisma Client is the auto-generated query builder used for all database operations. It is instantiated in `src/lib/db.ts` to ensure a single instance is used throughout the app (singleton pattern).
- **Migrations & Seeding**:
  - `prisma db push` is used during development to sync the schema with the database.
  - The `prisma/seed.ts` script is used to populate the database with initial data. It is executed via the `npm run db:seed` command. This script is responsible for creating default categories, products, and the initial admin user.

## 3. Admin Panel

The admin panel is a protected area of the application for site management.

- **Access Control**: Access will be controlled by middleware that checks if the user's session token contains `role: 'admin'`. All API routes under `/api/admin/*` must be protected with this logic.
- **Structure**: The admin panel has its own layout (`src/app/admin/layout.tsx`) which includes a sidebar for navigation. Each feature (Products, Orders, Users) has its own dedicated page and corresponding API routes for data manipulation.
- **Data Fetching**: Admin pages will fetch data from the protected `/api/admin/*` endpoints. These endpoints, in turn, use the Prisma Client to interact with the database.

## 4. Local Development Workflow

A streamlined workflow is established for easy local setup.

- **Environment Variables**: All secret keys and configuration variables are stored in the `.env` file. A `.env.example` file should be maintained to show the required variables.
- **Setup Script (`setup.bat`)**: This script automates the initial setup process:
  1. `npm install`: Installs all project dependencies.
  2. `npm run db:push`: Pushes the Prisma schema to the database, creating tables. This command includes `--accept-data-loss` to avoid interactive prompts in development.
  3. `npm run db:seed`: Runs the seed script to populate the database with categories, products, and the default admin user.
- **Start Script (`start.bat`)**: This script simply runs `npm run dev` to start the Next.js development server.
