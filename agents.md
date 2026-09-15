# agents.md — Panduan Teknis untuk AI Agent & Developer

Repository: **website-umkm** (Frontend-Only SPA: React 19 + Vite, data via axios ke API produksi eksternal `https://umkmvarca.renaldi.my.id/api/v1`).
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
- **Modul:** `src/context/LanguageContext.jsx` menyediakan state bahasa (`id` dan `en`) dengan persistensi `localStorage`.
- **Menu Navigasi Utama:**
  - Indonesia: `Beranda`, `Katalog`, `Tentang`
  - English: `Home`, `Catalog`, `About`
- **Animasi Aktif Navbar:**
  - Halaman aktif: `font-bold text-black scale-105` + garis indikator bawah (`h-0.5 bg-black`).
  - Halaman tidak aktif: `font-normal text-stone-500 hover:text-black hover:font-bold transition-all duration-300`.

---

## 3. Arsitektur API (Eksternal via Axios)

Backend tidak ada di repo ini. Seluruh data via `src/api/client.js` (axios, `baseURL=https://umkmvarca.renaldi.my.id/api/v1`, interceptor Clerk Bearer + handler 401/403/422):
- `src/api/products.js` — Katalog publik & CRUD admin (`/products`).
- `src/api/transactions.js` — Checkout QRIS & polling status (`/transactions`).
- `src/api/users.js` — Profil (`/users/me`).
- `src/api/orders.js` — Admin pesanan (`/admin/orders`).
- `src/api/carts.js` — Admin keranjang (`/admin/carts`).
- `src/api/employees.js` — Admin karyawan (`/admin/employees`).
- `src/api/health.js` — Health check (`/health`).

Kontrak: `API_CONTRACT-3.md`, source of truth `https://umkmvarca.renaldi.my.id/docs`.
Tanpa MSW/mock dan tanpa fallback dummy — error API diteruskan ke UI.

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
1. **Frontend Build & Lint:**
   ```bash
   npm run lint
   npm run build
   ```
   Harus berhasil (*0 errors, 0 warnings*).
2. **Deployment Vercel:**
   File `vercel.json` bertindak sebagai rewrite engine untuk mencegah 404 pada rute langsung SPA. Root Directory = `.` (repo frontend-only).
