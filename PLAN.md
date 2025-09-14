# Project Plan: Digital Direct E-Commerce Platform

## 1. Project Goal

To build a professional-grade, SEO-friendly, and fully responsive e-commerce application named "Digital Direct." The platform will specialize in selling digital subscriptions and services. The project includes a public-facing storefront and a comprehensive admin panel for managing all aspects of the site.

## 2. Core Features

### Storefront
- **Homepage**: Dynamic sections for featured products, best sellers, categories, and promotional banners.
- **Product Listings**: Grid view of all products with advanced filtering (by category, price) and sorting.
- **Product Details**: Individual product pages with descriptions, images, pricing, and an "Add to Cart" function.
- **Shopping Cart**: A slide-in cart and a dedicated cart page for reviewing items.
- **Checkout**: A multi-step checkout process with manual payment verification (bKash/Nagad).
- **User Accounts**: Profile management, order history, and wishlist.
- **Authentication**: Secure user registration and login using email/password and Google OAuth.
- **Static Pages**: About Us, Contact Us, Careers, Terms & Conditions.

### Admin Panel
- **Dashboard**: Central hub displaying key metrics like sales, revenue, user signups, and recent orders.
- **Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for products.
- **Category Management**: Full CRUD for product categories.
- **Order Management**: View all orders, update their status, and see transaction details.
- **User Management**: View and manage all registered customers and administrators.
- **Analytics**: Visual charts and reports on sales, traffic, and top-selling products.
- **Settings**: Configuration for site details and payment information.

## 3. Technical Architecture

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadCN UI components for a consistent and modern design system.
- **Authentication**: `next-auth` for secure handling of credentials, sessions, and OAuth providers (Google).
- **Database ORM**: Prisma to manage the PostgreSQL database schema, migrations, and queries.
- **Database**: PostgreSQL for robust and scalable data storage.
- **API Layer**: Backend logic is handled via Next.js API Routes.
- **Deployment**: The application is structured to be deployed on any Node.js compatible environment, including localhost for development.

## 4. Development & Deployment Plan

### Phase 1: Foundation & UI (Complete)
- Set up the Next.js project.
- Build the core UI components using ShadCN.
- Create the main pages for the storefront (Homepage, Products, Cart, etc.).
- Implement a responsive layout.

### Phase 2: Backend & Database Integration (Complete)
- Define the database schema using Prisma (`prisma/schema.prisma`).
- Set up API routes for all backend functionality (auth, products, orders).
- Implement a database seeding script (`prisma/seed.ts`) to populate the database with initial data, including a default admin account (`admin@example.com` / `password123`).
- Integrate `next-auth` for a complete and secure authentication flow with Credentials and Google providers.
- Replace all mock data and logic with real database interactions and session management.
- Create simple batch scripts (`setup.bat`, `start.bat`) for a one-click local startup process.

### Phase 3: Admin Panel Functionality (Current)
- Build out the admin panel pages for managing products, orders, and users.
- Connect the admin UI to the backend API routes.
- Implement charts and analytics on the admin dashboard.
- Refine role-based access control.

### Phase 4: Finalization & Deployment
- Conduct thorough testing of all features.
- Perform SEO and performance optimizations.
- Prepare final documentation for deployment.
