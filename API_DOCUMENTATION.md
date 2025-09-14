# API Documentation

This document outlines the available API endpoints for the Digital Direct application.

## Authentication

### POST /api/auth/signup

- **Description:** Creates a new user account.
- **Method:** `POST`
- **Body:** `{ "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "password": "password123" }`
- **Success Response:**
  - **Code:** 201 `Created`
  - **Content:** `{ "message": "User created successfully", "user": { ... } }`
- **Error Responses:**
  - **Code:** 400 `Bad Request` (Missing fields)
  - **Code:** 409 `Conflict` (User already exists)

### POST /api/auth/login

- **Description:** Logs in a user and returns a JWT.
- **Method:** `POST`
- **Body:** `{ "email": "john.doe@example.com", "password": "password123" }`
- **Success Response:**
  - **Code:** 200 `OK`
  - **Content:** `{ "message": "Login successful", "token": "...", "user": { ... } }`
- **Error Responses:**
  - **Code:** 400 `Bad Request` (Missing fields)
  - **Code:** 401 `Unauthorized` (Invalid credentials)

## Products

### GET /api/products

- **Description:** Retrieves a list of all available products for public view.
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 `OK`
  - **Content:** `[{ "id": "prod_001", "name": "YouTube Premium", ... }]`

## Admin

These routes require admin authentication.

### GET /api/admin/products

- **Description:** Retrieves a list of all products for the admin panel.
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 `OK`
  - **Content:** `[{ "id": "prod_001", "name": "YouTube Premium", ... }]`

### POST /api/admin/products

- **Description:** Creates a new product.
- **Method:** `POST`
- **Body:** `{ "name": "New Product", "price": 99.99, ... }`
- **Success Response:**
  - **Code:** 201 `Created`
  - **Content:** `{ "id": "prod_new", "name": "New Product", ... }`

### GET /api/admin/orders

- **Description:** Retrieves a list of all orders.
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 `OK`
  - **Content:** `[{ "id": "ORD-001", "customer": "John Doe", ... }]`
