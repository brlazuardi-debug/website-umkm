# ERD — Backend UMKM

## Entity Relationship Diagram

```mermaid
erDiagram
    users {
        UUID id PK
        VARCHAR clerk_id UK
        VARCHAR email UK
        VARCHAR name
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    produk {
        UUID id PK
        VARCHAR nama
        TEXT deskripsi
        INTEGER harga
        INTEGER stok
        VARCHAR gambar_url
        BOOLEAN is_active
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    transaksi {
        UUID id PK
        UUID user_id FK
        INTEGER total_harga
        VARCHAR status
        VARCHAR payment_type
        VARCHAR midtrans_order_id UK
        VARCHAR qr_url
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    users ||--o{ transaksi : "membuat"
```

## Keterangan

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Profil pengguna, sync dari Clerk webhook |
| `produk` | Katalog produk UMKM |
| `transaksi` | Order + payment QRIS, FK ke `users` |

## Status Transaksi

```
PENDING → PAID
PENDING → EXPIRED
PENDING → FAILED
```

## Catatan

- `users.clerk_id` unique index — satu Clerk account = satu user
- `transaksi.midtrans_order_id` unique — idempotency key untuk payment
- `transaksi.status` enum di level aplikasi: `PENDING`, `PAID`, `EXPIRED`, `FAILED`
- Relasi `produk` ke `transaksi` sengaja belum ada (item-level detail = minggu 3 jika perlu)
