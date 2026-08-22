# agents.md — Panduan untuk AI Agent & Developer

Repo: **website-umkm** (frontend React SPA). Dibaca otomatis oleh agent sebelum kerja.

## 1. Konteks Cepat
- Frontend polyrepo untuk **VARCA BRAND** (Luxe Minimalist UMKM).
- 100% presisi mengikuti desain Figma (`VuOuH1OTenDwxVZxTKMw9D/Brand-UMKM`) & screenshot visual.
- Semua halaman (7 halaman utama: Landing, Katalog, Detail, Checkout, Admin Produk, Admin Pesanan, Admin Karyawan) menggunakan **Inter Font** dengan bobot **Semi-Bold / Medium** (`font-['Inter']`, `font-semibold`, `font-medium`) serta skema warna & fotografi monokrom modern.
- Dokumen sumber (di root repo): `PRD-UMKM-Website.md`, `API_CONTRACT-2.md`, `ERD.md`, `summary.md`.

## 2. Aturan Emas (jangan dilanggar tanpa konfirmasi)
- **Desain 1:1 Figma:** Jaga komponen layout bento, spacing, font Inter semi-bold, uppercase heading, dan border neutral-200.
- **Backend Integrasi Hooks:** Selalu pertahankan binding API React (`getProducts`, `getProductById`, `deleteProduct`, `createTransaction`) dan Clerk Auth (`useAuth`).
- **Tailwind v4 hanya punya shade 50,100,200..900,950.** JANGAN pakai shade kustom yang tidak didukung.

## 3. Rute & Komponen Utama
- `/` -> `LandingPage.jsx`
- `/products` -> `KatalogProduk.jsx`
- `/products/:id` -> `DetailProduk.jsx`
- `/checkout` -> `CheckoutPage.jsx`
- `/admin` -> `ProductManagement.jsx`
- `/admin/cart-orders` -> `CartOrders.jsx`
- `/admin/employee` -> `EmployeeManagement.jsx`

## 4. Auth & Testing
- Clerk authentication aktif pada pembeli (`/checkout`, `/profile`).
- Modus Developer Demo Admin (`isAdminDemo`) tersedia di header bar untuk memudahkan inspeksi panel admin secara langsung tanpa login backend.

## 5. Workflow & Quality Gates
- `cd frontend && npm run dev` untuk pengembangan.
- Pastikan tidak ada konflik utility class pada `input` dan `button` elemen.
