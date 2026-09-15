# API Contract v3 — Backend UMKM (Eksternal Prod)

> Source of truth: `https://umkmvarca.renaldi.my.id/docs` (OpenAPI auto-generated). Dokumen ini ringkasan.
> Base URL produksi: `https://umkmvarca.renaldi.my.id/api/v1` (dipakai axios `VITE_API_BASE_URL`).
> 
> **Changelog v3:** Penambahan Admin Panel — Manajemen Keranjang & Pesanan, Manajemen Produk/Barang, dan Manajemen Karyawan. Seluruh endpoint diselaraskan 100% dengan implementasi Frontend.

---

## Base URL

```
/api/v1
```

---

## Auth & Webhook

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| POST | `/api/v1/auth/webhook` | Svix Signature | Clerk webhook, sync user ke DB |
| POST | `/api/v1/payments/webhook` | HMAC Signature | Midtrans/Xendit payment callback |

---

## Pengguna

| Method | Path | Auth | Request | Response | Deskripsi |
|--------|------|------|---------|----------|-----------|
| GET | `/api/v1/users/me` | Bearer JWT | - | `UserResponse` | Profil user login |
| PATCH | `/api/v1/users/me` | Bearer JWT | `UserUpdate` | `UserResponse` | Update profil (misal: nama) |

---

## Produk (Public & Basic Admin)

> Dipakai oleh etalase pelanggan dan `AdminDashboard.jsx` / `ProductFormPage.jsx`.

| Method | Path | Auth | Request | Response | Deskripsi |
|--------|------|------|---------|----------|-----------|
| GET | `/api/v1/products` | Public | `?limit=20&offset=0` | `ProdukResponse[]` | List produk publik (`is_active=true`). Cached 60s. |
| GET | `/api/v1/products?include_inactive=true` | Admin JWT | `?limit=100&offset=0` | `ProdukResponse[]` | List semua produk termasuk non-aktif (dipakai `AdminDashboard.jsx`). |
| GET | `/api/v1/products/{id}` | Public | - | `ProdukResponse` | Detail produk |
| POST | `/api/v1/products` | Admin JWT | `ProdukCreate` | `ProdukResponse` (201) | Buat produk baru (support `gambar_url` string) |
| PUT | `/api/v1/products/{id}` | Admin JWT | `ProdukUpdate` | `ProdukResponse` | Update produk |
| DELETE | `/api/v1/products/{id}` | Admin JWT | - | 204 No Content | Hapus produk |

---

## Transaksi (Pelanggan)

| Method | Path | Auth | Request | Response | Deskripsi |
|--------|------|------|---------|----------|-----------|
| POST | `/api/v1/transactions` | Bearer JWT | `TransaksiCreate` | `TransaksiResponse` (201) | Buat transaksi baru + init QRIS payment |
| GET | `/api/v1/transactions/{id}` | Bearer JWT | - | `TransaksiResponse` | Status transaksi (polling status) |

---

# 🆕 Admin Panel Endpoints

> Dipakai oleh Halaman Admin: `CartOrders.jsx`, `EmployeeManagement.jsx`, dan fitur Admin Lanjutan.
> Auth: **Admin JWT** (`ADMIN`, `OWNER`, `STORE MANAGER`).

---

## Admin — Manajemen Keranjang & Pesanan (Cart & Orders)

Dipakai oleh `CartOrders.jsx`.

| Method | Path | Auth | Request | Response | Deskripsi |
|--------|------|------|---------|----------|-----------|
| GET | `/api/v1/admin/carts` | Admin JWT | `?status=active&limit=20&offset=0` | `PaginatedResponse<CartResponse>` | List keranjang pelanggan. Status: `active`, `abandoned`, `checked_out`. |
| GET | `/api/v1/admin/carts/{id}` | Admin JWT | - | `CartDetailResponse` | Detail keranjang + items + info user |
| PATCH | `/api/v1/admin/carts/{id}` | Admin JWT | `CartAdminUpdate` | `CartDetailResponse` | Update status keranjang (misal: mark abandoned) |
| DELETE | `/api/v1/admin/carts/{id}` | Admin JWT | - | 204 No Content | Hapus keranjang |
| GET | `/api/v1/admin/orders` | Admin JWT | `?status=PENDING&limit=20&offset=0&sort=created_at:desc` | `PaginatedResponse<OrderResponse>` | List pesanan. Status: `PENDING`, `PAID`, `SHIPPED`, `EXPIRED`, `FAILED`, `CANCELLED`. |
| GET | `/api/v1/admin/orders/{id}` | Admin JWT | - | `OrderDetailResponse` | Detail pesanan + item list |
| PATCH | `/api/v1/admin/orders/{id}/status` | Admin JWT | `OrderStatusUpdate` | `OrderDetailResponse` | Update status pesanan (PAID, SHIPPED, CANCELLED) |

---

## Admin — Manajemen Produk/Barang Lanjutan

Endpoint tambahan untuk pencarian lanjutan & upload file fisik gambar produk.

| Method | Path | Auth | Request | Response | Deskripsi |
|--------|------|------|---------|----------|-----------|
| GET | `/api/v1/admin/products` | Admin JWT | `?search=&is_active=&limit=20&offset=0` | `PaginatedResponse<ProdukResponse>` | List produk admin dengan filter & pagination |
| PATCH | `/api/v1/admin/products/{id}/stock` | Admin JWT | `StokUpdate` | `ProdukResponse` | Update stok (tambah/kurang/set) |
| POST | `/api/v1/admin/products/{id}/image` | Admin JWT | `multipart/form-data` (`image`) | `{ "gambar_url": "string" }` | Upload file fisik gambar produk |
| DELETE | `/api/v1/admin/products/{id}/image` | Admin JWT | - | 204 No Content | Hapus gambar produk |

---

## Admin — Manajemen Karyawan (Employees)

Dipakai oleh `EmployeeManagement.jsx`.

| Method | Path | Auth | Request | Response | Deskripsi |
|--------|------|------|---------|----------|-----------|
| GET | `/api/v1/admin/employees` | Admin JWT | `?search=&role=&is_active=true&limit=20&offset=0` | `PaginatedResponse<EmployeeResponse>` | List karyawan. Role: `OWNER`, `ADMIN`, `STORE MANAGER`, `WAREHOUSE`, `CUSTOMER SERVICE`, `CASHIER`, `STAFF`. |
| GET | `/api/v1/admin/employees/{id}` | Admin JWT | - | `EmployeeResponse` | Detail karyawan |
| POST | `/api/v1/admin/employees` | Admin JWT | `EmployeeCreate` | `EmployeeResponse` (201) | Tambah karyawan baru |
| PUT | `/api/v1/admin/employees/{id}` | Admin JWT | `EmployeeUpdate` | `EmployeeResponse` | Update data karyawan |
| DELETE | `/api/v1/admin/employees/{id}` | Admin JWT | - | 204 No Content | Hapus/nonaktifkan karyawan |
| PATCH | `/api/v1/admin/employees/{id}/role` | Admin JWT (Owner only) | `RoleUpdate` | `EmployeeResponse` | Ubah role karyawan |
| PATCH | `/api/v1/admin/employees/{id}/status` | Admin JWT | `StatusUpdate` | `EmployeeResponse` | Ubah status (`ACTIVE` / `INACTIVE`) |

---

# Schemas

## Standard Schemas (Match Frontend Code)

### UserResponse
```json
{
  "id": "uuid",
  "clerk_id": "string",
  "email": "string",
  "name": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### UserUpdate
```json
{
  "name": "string | null"
}
```

### ProdukCreate / ProdukResponse
```json
{
  "id": "uuid",
  "nama": "string",
  "deskripsi": "string | null",
  "harga": "integer",
  "stok": "integer",
  "gambar_url": "string | null",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### ProdukUpdate
```json
{
  "nama": "string | null",
  "deskripsi": "string | null",
  "harga": "integer | null",
  "stok": "integer | null",
  "gambar_url": "string | null",
  "is_active": "boolean | null"
}
```

### TransaksiCreate
```json
{
  "total_harga": "integer",
  "payment_type": "string (default: qris)"
}
```

### TransaksiResponse
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "total_harga": "integer",
  "status": "PENDING | PAID | EXPIRED | FAILED | CANCELLED",
  "payment_type": "string",
  "midtrans_order_id": "string | null",
  "qr_url": "string | null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## Admin Schemas

### PaginatedResponse\<T\>
```json
{
  "data": "T[]",
  "meta": {
    "total": "integer",
    "limit": "integer",
    "offset": "integer",
    "has_next": "boolean"
  }
}
```

### Cart & Order Schemas

#### CartResponse
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "user_name": "string",
  "user_email": "string",
  "status": "active | abandoned | checked_out",
  "total_items": "integer",
  "total_harga": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### CartDetailResponse
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "user_name": "string",
  "user_email": "string",
  "status": "active | abandoned | checked_out",
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "product_nama": "string",
      "product_gambar_url": "string | null",
      "quantity": "integer",
      "harga_satuan": "integer",
      "subtotal": "integer"
    }
  ],
  "total_items": "integer",
  "total_harga": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### OrderResponse
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "user_name": "string",
  "user_email": "string",
  "total_harga": "integer",
  "total_items": "integer",
  "status": "PENDING | PAID | SHIPPED | EXPIRED | FAILED | CANCELLED",
  "payment_type": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### OrderDetailResponse
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "user_name": "string",
  "user_email": "string",
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "product_nama": "string",
      "quantity": "integer",
      "harga_satuan": "integer",
      "subtotal": "integer"
    }
  ],
  "total_harga": "integer",
  "total_items": "integer",
  "status": "PENDING | PAID | SHIPPED | EXPIRED | FAILED | CANCELLED",
  "payment_type": "string",
  "midtrans_order_id": "string | null",
  "qr_url": "string | null",
  "paid_at": "datetime | null",
  "shipped_at": "datetime | null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### OrderStatusUpdate
```json
{
  "status": "PAID | SHIPPED | CANCELLED",
  "reason": "string | null"
}
```

---

### Employee Schemas

#### EmployeeResponse
```json
{
  "id": "uuid",
  "clerk_id": "string | null",
  "name": "string",
  "email": "string",
  "phone": "string | null",
  "role": "OWNER | ADMIN | STORE MANAGER | WAREHOUSE | CUSTOMER SERVICE | CASHIER | STAFF",
  "is_active": "boolean",
  "status": "ACTIVE | INACTIVE",
  "joined_at": "datetime",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### EmployeeCreate
```json
{
  "name": "string",
  "email": "string",
  "phone": "string | null",
  "role": "ADMIN | STORE MANAGER | WAREHOUSE | CUSTOMER SERVICE | CASHIER | STAFF"
}
```

#### EmployeeUpdate
```json
{
  "name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "role": "string | null"
}
```

#### RoleUpdate
```json
{
  "role": "ADMIN | STORE MANAGER | WAREHOUSE | CUSTOMER SERVICE | CASHIER | STAFF"
}
```

#### StatusUpdate
```json
{
  "is_active": "boolean",
  "status": "ACTIVE | INACTIVE"
}
```

---

## Role & Permission Matrix

| Permission | OWNER | ADMIN | STORE MANAGER | WAREHOUSE | CUSTOMER SERVICE | CASHIER / STAFF |
|------------|:-----:|:-----:|:-------------:|:---------:|:----------------:|:---------------:|
| Lihat Dashboard Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manajemen Produk (CRUD) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update Stok Produk | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Lihat Keranjang & Pesanan | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Update Status Pesanan (PAID/SHIPPED) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manajemen Karyawan (CRUD) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ubah Role Karyawan | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Error Responses

| Code | Keterangan |
|------|------------|
| 400 | Bad Request — request body tidak valid |
| 401 | Unauthorized — JWT missing/invalid |
| 403 | Forbidden — akses ditolak |
| 404 | Not Found |
| 409 | Conflict — email sudah terdaftar |
| 413 | Payload Too Large — file upload > 5MB |
| 422 | Validation Error — Pydantic v2 |

### Error Format
```json
{
  "detail": "string",
  "error_code": "string | null",
  "field_errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

---

## Health Check

```
GET /health → {"status": "ok"}
```
