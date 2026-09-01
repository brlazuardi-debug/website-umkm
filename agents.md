# agents.md — Panduan Teknis untuk AI Agent & Developer

Repository: **website-umkm** (Fullstack Polyrepo: React 19 Frontend + FastAPI Backend).
Wajib dibaca dan dipahami sebelum melakukan modifikasi kode pada repositori ini.

---

## 1. Konteks Bisnis & Standar Desain
- **Brand Identity:** **VARCA BRAND** (Luxury Minimalist Fashion & Tailored Apparel UMKM).
- **Tipografi Global:** 
  - **Inter Bold (`font-bold` / 700):** Wajib untuk navbar links, judul halaman (h1, h2, h3), nama produk, kategori, badge status, dan tombol aksi (CTA).
  - **Inter Regular (`font-normal` / 400):** Wajib untuk body text, deskripsi produk, paragraf filosofi, form input/placeholder, dan instruksi care/shipping.
- **Palet Warna:** Estetika monokrom modern (`#09090B`, `#18181B`, `#FAFAF9`) dengan aksen emas/amber mewah (`text-amber-400` / `#D4AF37`).
- **Visual Produk:** Seluruh foto produk katalog dan galeri wajib **berwarna tajam & elegan** (tanpa filter grayscale yang membuat produk terlihat mati).
- **Section Our Philosophy:** Desain berlatar hitam pekat (`bg-black`), foto latar artistik *Black & White Noir*, aksen headline emas, dan teks narasi reguler.
- **Ikonografi:** 100% SVG menggunakan **Lucide React** (Zero emojis sebagai icon antarmuka).

---

## 2. Navigasi & Sistem Dwibahasa (i18n)
- **Modul:** `frontend/src/context/LanguageContext.jsx` menyediakan state bahasa (`id` dan `en`) dengan persistensi `localStorage`.
- **Menu Navigasi Utama:**
  - Indonesia: `Beranda`, `Katalog`, `Tentang`
  - English: `Home`, `Catalog`, `About`
- **Animasi Aktif Navbar:**
  - Halaman aktif: `font-bold text-black scale-105` + garis indikator bawah (`h-0.5 bg-black`).
  - Halaman tidak aktif: `font-normal text-stone-500 hover:text-black hover:font-bold transition-all duration-300`.

---

## 3. Arsitektur Backend (FastAPI Domain-Driven)

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

## 4. Frontend Routing & CRUD Standards (React 19)

- `App.jsx` mengelola rute pembeli dan rute admin terproteksi (`AdminRoute`):
  - `/` $\rightarrow$ `LandingPage`
  - `/products` $\rightarrow$ `KatalogProduk` (Filter Tops, Bottoms, Outerwear, Accessories)
  - `/products/:id` $\rightarrow$ `DetailProduk`
  - `/checkout` $\rightarrow$ `CheckoutPage` (4-Section: Customer Info, Shipping Address, Payment Method, Order Summary)
  - `/order-status/:id` $\rightarrow$ `OrderStatusPage` (Polling real-time QRIS/Bank)
  - `/login` $\rightarrow$ `LoginPage` (Clerk Auth + 1-Click Admin Demo Access)
  - `/admin` $\rightarrow$ `ProductManagement`
  - `/admin/product/new` $\rightarrow$ `ProductFormPage`
  - `/admin/product/:id/edit` $\rightarrow$ `ProductFormPage`
  - `/admin/cart-orders` $\rightarrow$ `CartOrders`
  - `/admin/employee` $\rightarrow$ `EmployeeManagement`

---

## 5. Testing & Quality Gates

Setiap perubahan wajib memenuhi standar berikut:
1. **Backend Tests:**
   ```bash
   cd backend
   source .venv/bin/activate
   pytest -v
   ```
   Harus menghasilkan **13/13 passing tests** (100% test coverage).
2. **Frontend Build & Lint:**
   ```bash
   cd frontend
   npm run lint
   npm run build
   ```
   Harus berhasil (*0 errors, 0 warnings*).
3. **Deployment Vercel:**
   File `frontend/vercel.json` bertindak sebagai rewrite engine untuk mencegah 404 pada rute langsung SPA.
