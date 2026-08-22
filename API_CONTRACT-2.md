# API Contract — Backend UMKM

> Source of truth: `/docs` (OpenAPI auto-generated). Dokumen ini ringkasan.

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
| PATCH | `/api/v1/users/me` | Bearer JWT | `UserUpdate` | `UserResponse` | Update profil |

---

## Produk

| Method | Path | Auth | Request | Response | Deskripsi |
|--------|------|------|---------|----------|-----------|
| GET | `/api/v1/products` | Public | `?limit=20&offset=0` | `ProdukResponse[]` | List produk (cached 60s). Default hanya `is_active=true`. |
| GET | `/api/v1/products?include_inactive=true` | Admin JWT | - | `ProdukResponse[]` | Termasuk produk non-aktif (dipakai panel admin, PROD-4). |
| GET | `/api/v1/products/{id}` | Public | - | `ProdukResponse` | Detail produk |
| POST | `/api/v1/products` | Admin JWT | `ProdukCreate` | `ProdukResponse` (201) | Buat produk |
| PUT | `/api/v1/products/{id}` | Admin JWT | `ProdukUpdate` | `ProdukResponse` | Update produk |
| DELETE | `/api/v1/products/{id}` | Admin JWT | - | 204 No Content | Hapus produk |

> **Catatan kebutuhan frontend (belum ada di backend):**
> - `GET /api/v1/transactions` (Admin) — list transaksi untuk halaman admin "Cart & Orders" yang akan datang.

---

## Transaksi

| Method | Path | Auth | Request | Response | Deskripsi |
|--------|------|------|---------|----------|-----------|
| POST | `/api/v1/transactions` | Bearer JWT | `TransaksiCreate` | `TransaksiResponse` (201) | Buat transaksi + init QRIS |
| GET | `/api/v1/transactions/{id}` | Bearer JWT | - | `TransaksiResponse` | Status transaksi |

---

## Schemas

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
  "nama": "string",
  "deskripsi": "string | null",
  "harga": "integer",
  "stok": "integer",
  "gambar_url": "string | null",
  "is_active": "boolean"
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
  "status": "PENDING | PAID | EXPIRED | FAILED",
  "payment_type": "string",
  "midtrans_order_id": "string | null",
  "qr_url": "string | null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## Error Responses

| Code | Keterangan |
|------|------------|
| 401 | Unauthorized — JWT missing/invalid |
| 403 | Forbidden — webhook signature invalid |
| 404 | Not Found |
| 422 | Validation Error — Pydantic v2 |

---

## Health Check

```
GET /health → {"status": "ok"}
```
