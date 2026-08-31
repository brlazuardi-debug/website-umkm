# agents.md — Panduan untuk AI Agent & Developer

Repository: **website-umkm** (Fullstack Polyrepo: React 19 Frontend + FastAPI Backend).
Dibaca otomatis oleh AI agent dan developer sebelum melakukan modifikasi kode.

---

## 1. Konteks Bisnis & Brand
- **Brand Identity:** **VARCA BRAND** (Luxury Minimalist Fashion & Tailored Apparel UMKM).
- **Desain Acuan:** 100% presisi mengikuti spesifikasi Figma (`VuOuH1OTenDwxVZxTKMw9D/Brand-UMKM`) & screenshot acuan.
- **Tipografi:** Wajib menggunakan font **Inter** dengan bobot **Semi-Bold / Medium** (`font-['Inter']`, `font-semibold`, `font-bold`).
- **Palet Warna:** Estetika monokrom modern (`#09090B`, `#18181B`, `#FAFAF9`) dengan aksen oranye terukur (`#FB923C` / `text-orange-400`). **DILARANG** menggunakan warna cokelat/amber lama (`amber-*`).
- **Ikonografi:** 100% SVG menggunakan **Lucide React**. **DILARANG** menggunakan emoji liar sebagai ikon tombol/status.

---

## 2. Arsitektur Backend (FastAPI Domain-Driven)

Backend berada di subdirektori `backend/` dengan struktur modular domain-driven:
- `app/modules/users/` — Profil pengguna & Clerk user provisioning (`/users/me`).
- `app/modules/products/` — Katalog produk publik, inventaris admin, update stok, & upload file gambar (`/products`, `/admin/products`).
- `app/modules/carts/` — Pemantauan keranjang pelanggan oleh customer service & admin (`/admin/carts`).
- `app/modules/transactions/` — Checkout QRIS, inisiasi transaksi, dan polling status (`/transactions`).
- `app/modules/orders/` — Manajemen pesanan admin & update status pengiriman (`/admin/orders`).
- `app/modules/employees/` — Direktori karyawan & manajemen hak akses RBAC (`/admin/employees`).
- `app/modules/auth/` — Webhook handler Svix (Clerk) dan HMAC (Payment Gateway).

### Dual-Path Mounting:
Seluruh endpoint di-mount secara ganda di root (`/`) dan prefix versi (`/api/v1`) untuk memastikan kompatibilitas penuh dengan frontend dan API Contract v3.

### 7-Level RBAC Matrix (`app/core/rbac.py`):
1. `OWNER`: Hak akses penuh ke seluruh modul, termasuk pengubahan role karyawan (`PATCH /admin/employees/{id}/role`).
2. `ADMIN`: CRUD Produk, Pesanan, Keranjang, dan pendaftaran Karyawan baru.
3. `STORE MANAGER`: CRUD Produk dan pemantauan Pesanan/Keranjang.
4. `WAREHOUSE`: Update stok produk (`PATCH /admin/products/{id}/stock`) dan status pesanan (*SHIPPED*).
5. `CUSTOMER SERVICE`: Read-only pesanan dan keranjang.
6. `CASHIER`: Checkout & kasir.
7. `STAFF`: Akses customer standar.

---

## 3. Integrasi Frontend (React 19 / Axios)

Frontend berada di subdirektori `frontend/` menggunakan Axios client terpusat di `src/api/client.js`:
- `src/api/products.js` — Menangani respons paginasi (`response.data?.data || response.data`).
- `src/api/orders.js` — Fetch list order & update status pesanan.
- `src/api/carts.js` — Fetch data keranjang belanja aktif/abandoned.
- `src/api/employees.js` — Fetch list & create karyawan.
- `src/api/transactions.js` — Inisiasi checkout QRIS & polling status.
- `src/api/users.js` — Sinkronisasi profil pengguna.

---

## 4. Testing & Quality Gates

Setiap perubahan wajib memenuhi standar berikut:
1. **Backend Tests:**
   ```bash
   cd backend
   .venv/bin/pytest -v
   ```
   Harus menghasilkan **13/13 passing tests** (100% test coverage).
2. **Frontend Build:**
   ```bash
   cd frontend
   npm run build
   ```
   Harus berhasil (*0 errors, 0 warnings*).
3. **Kompatibilitas Responsif:**
   Pastikan antarmuka tidak mengalami *layout shift* atau *horizontal overflow* pada viewport mobile (375px), tablet (768px), dan desktop (1280px+).
