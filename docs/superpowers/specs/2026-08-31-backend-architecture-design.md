# Backend Architecture Design — UMKM VARCA Website

- **Date:** 2026-08-31
- **Status:** Approved
- **Target Base Path:** `/api/v1` and `/` (dual mounting)
- **Framework:** Python 3.12+ / FastAPI / Pydantic v2 / SQLAlchemy 2.0 (Async) / SQLite (demo persistence) / PostgreSQL (production compatible via NeonDB)

---

## 1. Executive Summary

This document specifies the backend architectural design for the Website UMKM (VARCA Brand) backend service. The system implements a Modular Domain-Driven architecture using FastAPI, supporting all 30 endpoints defined in API Contract v3 (`API_CONTRACT-3.md`) and the OpenAPI specification (`https://umkmvarca.renaldi.my.id/openapi.json`).

Key capabilities:
- Public catalog browsing with pagination, search, and filtering.
- Protected customer transactions, cart handling, and profile management.
- Admin dashboard APIs for product inventory CRUD, image upload (max 5MB), stock modification, cart monitoring, order status updates, and staff/employee management.
- 7-Role Role-Based Access Control (RBAC) matrix (`OWNER`, `ADMIN`, `STORE MANAGER`, `WAREHOUSE`, `CUSTOMER SERVICE`, `CASHIER`, `STAFF`).
- Clerk authentication integration & Svix webhook synchronization.
- Midtrans / Mock QRIS payment gateway webhook processing.

---

## 2. Directory & Component Structure

The application adopts a **Modular Domain-Driven Layout** where each business domain is fully self-contained in `app/modules/<module_name>` with its own router, schemas, DB models, and service layer.

```
backend/
├── app/
│   ├── main.py                  # Entry point, CORS, dual router mounting (/ & /api/v1), exception handlers
│   ├── config.py                # Environment configuration using pydantic-settings
│   ├── core/
│   │   ├── database.py          # Async SQLAlchemy engine, session maker, Base class
│   │   ├── security.py          # Clerk JWT verification & auth dependency
│   │   ├── rbac.py              # RBAC role checker dependencies & permission matrix
│   │   └── exceptions.py        # Custom exceptions & OpenAPI standard error formatters
│   ├── db/
│   │   ├── base.py              # Central model registration for Alembic migrations
│   │   └── init_db.py           # Database seeder (creates default admin/employee & sample products)
│   └── modules/
│       ├── auth/                # Webhooks (Clerk Svix sync & Payment callbacks)
│       │   ├── router.py
│       │   └── service.py
│       ├── users/               # Profile management (/users/me)
│       │   ├── router.py
│       │   ├── schemas.py
│       │   ├── models.py
│       │   └── service.py
│       ├── products/            # Public & Admin product catalog, stock management, image upload
│       │   ├── router.py
│       │   ├── schemas.py
│       │   ├── models.py
│       │   └── service.py
│       ├── transactions/        # Customer checkout & QRIS payment initiation
│       │   ├── router.py
│       │   ├── schemas.py
│       │   ├── models.py
│       │   └── service.py
│       ├── orders/              # Admin order monitoring & status tracking
│       │   ├── router.py
│       │   ├── schemas.py
│       │   ├── models.py
│       │   └── service.py
│       ├── carts/               # Admin customer shopping cart management
│       │   ├── router.py
│       │   ├── schemas.py
│       │   ├── models.py
│       │   └── service.py
│       └── employees/           # Staff management & RBAC enforcement
│           ├── router.py
│           ├── schemas.py
│           ├── models.py
│           └── service.py
├── uploads/                     # Storage directory for uploaded product image files
├── alembic/                     # Database migration scripts
│   ├── env.py
│   └── versions/
├── tests/                       # Pytest test suite covering all 30 endpoints
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_products.py
│   ├── test_transactions.py
│   ├── test_users.py
│   ├── test_carts.py
│   ├── test_orders.py
│   └── test_employees.py
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── alembic.ini
├── pyproject.toml
└── requirements.txt
```

---

## 3. Data Models & Entity Relationship

### Entities

1. **`User` (`users` table):**
   - `id`: UUID (Primary Key, default uuid4)
   - `clerk_id`: String (Unique, Indexed)
   - `email`: String (Unique, Indexed)
   - `name`: String
   - `role`: String (Default: `"STAFF"`, Nullable)
   - `created_at`, `updated_at`: DateTime (UTC timezone-aware)

2. **`Product` (`produk` table):**
   - `id`: UUID (Primary Key, default uuid4)
   - `nama`: String (Indexed)
   - `deskripsi`: Text (Nullable)
   - `harga`: Integer (>= 0)
   - `stok`: Integer (Default: 0, >= 0)
   - `gambar_url`: String (Nullable)
   - `is_active`: Boolean (Default: True, Indexed)
   - `created_at`, `updated_at`: DateTime (UTC)

3. **`Cart` (`carts` table):**
   - `id`: UUID (Primary Key, default uuid4)
   - `user_id`: UUID (Foreign Key -> `users.id`, Indexed)
   - `status`: Enum String (`"active"`, `"abandoned"`, `"checked_out"`, Default: `"active"`)
   - `created_at`, `updated_at`: DateTime (UTC)
   - **Relationship:** `items` -> list of `CartItem`

4. **`CartItem` (`cart_items` table):**
   - `id`: UUID (Primary Key, default uuid4)
   - `cart_id`: UUID (Foreign Key -> `carts.id`, Indexed)
   - `product_id`: UUID (Foreign Key -> `produk.id`)
   - `quantity`: Integer (>= 1)
   - `harga_satuan`: Integer (>= 0)

5. **`Order` (`orders` table):**
   - `id`: UUID (Primary Key, default uuid4)
   - `user_id`: UUID (Foreign Key -> `users.id`, Indexed)
   - `total_harga`: Integer (>= 0)
   - `status`: Enum String (`"PENDING"`, `"PAID"`, `"SHIPPED"`, `"EXPIRED"`, `"FAILED"`, `"CANCELLED"`, Default: `"PENDING"`)
   - `payment_type`: String (Default: `"qris"`)
   - `midtrans_order_id`: String (Unique, Nullable)
   - `qr_url`: String (Nullable)
   - `paid_at`: DateTime (Nullable)
   - `shipped_at`: DateTime (Nullable)
   - `created_at`, `updated_at`: DateTime (UTC)
   - **Relationship:** `items` -> list of `OrderItem`

6. **`OrderItem` (`order_items` table):**
   - `id`: UUID (Primary Key, default uuid4)
   - `order_id`: UUID (Foreign Key -> `orders.id`, Indexed)
   - `product_id`: UUID (Foreign Key -> `produk.id`)
   - `quantity`: Integer (>= 1)
   - `harga_satuan`: Integer (>= 0)

7. **`Employee` (`employees` table):**
   - `id`: UUID (Primary Key, default uuid4)
   - `clerk_id`: String (Unique, Nullable)
   - `name`: String
   - `email`: String (Unique, Indexed)
   - `phone`: String (Nullable)
   - `role`: Enum String (`"OWNER"`, `"ADMIN"`, `"STORE MANAGER"`, `"WAREHOUSE"`, `"CUSTOMER SERVICE"`, `"CASHIER"`, `"STAFF"`, Default: `"STAFF"`)
   - `is_active`: Boolean (Default: True)
   - `status`: Enum String (`"ACTIVE"`, `"INACTIVE"`, Default: `"ACTIVE"`)
   - `joined_at`: DateTime (Nullable)
   - `created_at`, `updated_at`: DateTime (UTC)

---

## 4. API Endpoints & Route Mapping

Dual route mounting is registered in `app/main.py`:
- Base v1 prefix: `/api/v1`
- Root fallback prefix: `/`

### Endpoint Catalog (30 Routes)

| Domain | Method | Path | Auth Required | Min Role | Description |
|--------|--------|------|---------------|----------|-------------|
| System | GET | `/health` | No | None | System health check |
| Auth | POST | `/auth/webhook` | No (Svix Sig) | None | Clerk webhook sync |
| Payments | POST | `/payments/webhook` | No (HMAC) | None | Payment callback |
| Users | GET | `/users/me` | Bearer JWT | User | Current user profile |
| Users | PATCH | `/users/me` | Bearer JWT | User | Update user profile |
| Products | GET | `/products` | No | None | List active public products |
| Products | GET | `/products/{id}` | No | None | Get single product detail |
| Products | POST | `/products` | Bearer JWT | STORE MANAGER | Create product |
| Products | PUT | `/products/{id}` | Bearer JWT | STORE MANAGER | Update product |
| Products | DELETE | `/products/{id}` | Bearer JWT | STORE MANAGER | Delete product |
| Admin Products | GET | `/admin/products` | Bearer JWT | STORE MANAGER | Admin product search & list |
| Admin Products | PATCH | `/admin/products/{id}/stock` | Bearer JWT | WAREHOUSE | Update product stock |
| Admin Products | POST | `/admin/products/{id}/image` | Bearer JWT | STORE MANAGER | Upload product image file |
| Admin Products | DELETE | `/admin/products/{id}/image` | Bearer JWT | STORE MANAGER | Remove product image file |
| Transactions | POST | `/transactions` | Bearer JWT | User | Create transaction & init QRIS |
| Transactions | GET | `/transactions/{id}` | Bearer JWT | User | Check transaction status |
| Admin Carts | GET | `/admin/carts` | Bearer JWT | CUSTOMER SERVICE | List customer carts |
| Admin Carts | GET | `/admin/carts/{id}` | Bearer JWT | CUSTOMER SERVICE | Get cart detail with items |
| Admin Carts | PATCH | `/admin/carts/{id}` | Bearer JWT | CUSTOMER SERVICE | Update cart status |
| Admin Carts | DELETE | `/admin/carts/{id}` | Bearer JWT | ADMIN | Delete cart |
| Admin Orders | GET | `/admin/orders` | Bearer JWT | CUSTOMER SERVICE | List customer orders |
| Admin Orders | GET | `/admin/orders/{id}` | Bearer JWT | CUSTOMER SERVICE | Get order detail with items |
| Admin Orders | PATCH | `/admin/orders/{id}/status` | Bearer JWT | WAREHOUSE | Update order status |
| Admin Staff | GET | `/admin/employees` | Bearer JWT | ADMIN | List employees |
| Admin Staff | POST | `/admin/employees` | Bearer JWT | ADMIN | Create new employee |
| Admin Staff | GET | `/admin/employees/{id}` | Bearer JWT | ADMIN | Get employee detail |
| Admin Staff | PUT | `/admin/employees/{id}` | Bearer JWT | ADMIN | Update employee info |
| Admin Staff | DELETE | `/admin/employees/{id}` | Bearer JWT | ADMIN | Delete employee |
| Admin Staff | PATCH | `/admin/employees/{id}/role` | Bearer JWT | OWNER ONLY | Change employee role |
| Admin Staff | PATCH | `/admin/employees/{id}/status` | Bearer JWT | ADMIN | Change employee status |

---

## 5. Security & RBAC Implementation

### 1. Clerk Auth Verification (`app/core/security.py`)
- Standard authentication reads `Authorization: Bearer <token>` header.
- Decodes JWT using Clerk public key or SDK verification.
- Extracts `sub` (clerk_id), `email`, and `role`.
- Supports a configurable Mock Auth Mode (`DEBUG_MOCK_AUTH=True`) for easy local development without live Clerk keys.

### 2. RBAC Enforcement Matrix (`app/core/rbac.py`)

| Feature Area | Minimum Permitted Roles |
|--------------|-------------------------|
| Admin Dashboard Access | `OWNER`, `ADMIN`, `STORE MANAGER`, `WAREHOUSE`, `CUSTOMER SERVICE`, `CASHIER`, `STAFF` |
| Product CRUD | `OWNER`, `ADMIN`, `STORE MANAGER` |
| Stock Update | `OWNER`, `ADMIN`, `STORE MANAGER`, `WAREHOUSE` |
| View Carts & Orders | `OWNER`, `ADMIN`, `STORE MANAGER`, `WAREHOUSE`, `CUSTOMER SERVICE` |
| Order Status Update | `OWNER`, `ADMIN`, `STORE MANAGER`, `WAREHOUSE` |
| Employee CRUD | `OWNER`, `ADMIN` |
| Employee Role Update | **`OWNER` ONLY** (strictly returns `403 Forbidden` if executed by `ADMIN` or others) |

---

## 6. Response Validation & Error Formatting

To adhere 100% to FastAPI and OpenAPI v3 specifications:
- Error responses on payload validation failure return `422 Unprocessable Entity` with `HTTPValidationError` structure:
  ```json
  {
    "detail": [
      {
        "loc": ["body", "harga"],
        "msg": "Input should be greater than or equal to 0",
        "type": "greater_than_equal",
        "input": -100
      }
    ]
  }
  ```
- Business logic exceptions return structured JSON errors:
  ```json
  {
    "detail": "Product not found",
    "error_code": "NOT_FOUND",
    "field_errors": null
  }
  ```

---

## 7. Quality Assurance & Testing Strategy

- `pytest` with `httpx` async test client.
- Test coverage requirement: 100% of all 30 endpoints.
- Fixtures for:
  - Database session isolation per test.
  - Mock Bearer Tokens representing `OWNER`, `ADMIN`, `WAREHOUSE`, and regular `CUSTOMER`.
  - Sample database seed data (products, users, carts, orders, employees).

---

## 8. Verification Checklist

- [x] All 30 routes defined in API Contract v3 covered.
- [x] Dual route mounting (`/api/v1` and `/`) configured.
- [x] 7-level RBAC role matrix verified.
- [x] Image file upload endpoint (max 5MB limit check) specified.
- [x] Database migration support with Alembic configured.
