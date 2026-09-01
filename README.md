# Website UMKM (VARCA BRAND)

Platform E-Commerce & Admin Management System untuk brand luxury & minimalist apparel UMKM — 100% presisi mengikuti spesifikasi desain modern dengan Inter typography, visual monokrom beraksen emas, katalog produk berwarna tajam, dukungan dwibahasa (Indonesia & English), dan arsitektur RESTful API modular berstandar OpenAPI v3.1.

---

## 🏗️ Struktur Repositori

```
website-umkm/
├── backend/                  # FastAPI Modular Domain-Driven Architecture (Python 3.12+)
│   ├── app/
│   │   ├── core/             # Security, Database, 7-Role RBAC, Custom Exceptions
│   │   ├── db/               # Model registration & Seeder
│   │   ├── modules/          # Domain Modules (users, products, carts, transactions, orders, employees, auth)
│   │   ├── config.py         # App Settings & Env parser
│   │   └── main.py           # FastAPI entry point, CORS, static uploads & router mounting
│   ├── tests/                # Async Pytest suite (13 passing test suites)
│   ├── pytest.ini
│   └── requirements.txt
│
├── frontend/                 # React 19 SPA (Vite 8 + Tailwind CSS v4)
│   ├── src/
│   │   ├── api/              # Axios API clients (products, orders, carts, employees, transactions, users)
│   │   ├── assets/           # Foto & aset visual (hero-bg.jpg)
│   │   ├── components/       # UI Components, Layout, ProtectedRoute, Modals
│   │   ├── context/          # BrandContext, LanguageContext (ID & EN), Admin Demo Auth
│   │   ├── mocks/            # MSW (Mock Service Worker) browser handlers
│   │   ├── pages/
│   │   │   ├── admin/        # ProductManagement, ProductFormPage, CartOrders, EmployeeManagement
│   │   │   └── customers/    # LandingPage, KatalogProduk, DetailProduk, CheckoutPage, OrderStatusPage, ProfilePage, Login, Register
│   │   ├── App.jsx           # App Routing & Clerk Auth Provider
│   │   └── main.jsx
│   ├── vercel.json           # Konfigurasi rewrite SPA Vercel deployment
│   └── package.json
│
├── API_CONTRACT-3.md         # Source of Truth kontrak API v3 (30 Endpoints)
├── README.md                 # Dokumentasi utama proyek & panduan penggunaan
├── summary.md                # Laporan perkembangan & status integrasi
└── agents.md                 # Panduan teknis arsitektur untuk AI Agent & Developers
```

---

## ⚡ Tech Stack

### Frontend:
- **Framework:** React 19, React Router 7
- **Build Tool & Styling:** Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`)
- **Typography:** Inter Font Family (`font-['Inter']`, Inter Bold untuk navigasi/judul/kategori, Inter Regular untuk deskripsi)
- **Icons:** Lucide React (100% SVG, Zero Emojis)
- **Internationalization (i18n):** Native LanguageContext (Dukungan dwibahasa: Indonesia & English)
- **Auth:** Clerk Authentication (`@clerk/clerk-react`) + 1-Click Admin Demo Login
- **HTTP Client:** Axios (Global Interceptors & Auth Token Binding)

### Backend:
- **Framework:** Python 3.12+, FastAPI, Pydantic v2
- **ORM & Database:** SQLAlchemy 2.0 (Async), aiosqlite / PostgreSQL (NeonDB ready)
- **Auth & RBAC:** Clerk JWT verification (RS256 & Mock Token format), 7-level Role Matrix (`OWNER`, `ADMIN`, `STORE MANAGER`, `WAREHOUSE`, `CUSTOMER SERVICE`, `CASHIER`, `STAFF`)
- **Testing:** Pytest, pytest-asyncio, HTTPX AsyncClient
- **Documentation:** Auto-generated Swagger UI (`/docs`) & OpenAPI 3.1 (`/openapi.json`)

---

## 🚀 Quick Start

### 1. Menjalankan Backend (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Jalankan server development (Port 8000)
uvicorn app.main:app --reload --port 8000

# Menjalankan test suite
pytest -v
```

### 2. Menjalankan Frontend (React SPA)
```bash
cd frontend
npm install
cp .env.example .env        # Isi VITE_CLERK_PUBLISHABLE_KEY & VITE_API_BASE_URL
npm run dev                 # Dev server di http://localhost:5173
npm run build               # Production build
```

---

## 📱 Halaman & Fitur Utama

### Customer Experience (E-Commerce):
1. **Navigasi Dwibahasa & 3 Menu Inti** — `Beranda / Home`, `Katalog / Catalog`, `Tentang / About`, dilengkapi language switcher `ID | EN` dan animasi transisi active font weight.
2. **Landing Page (`/`)** — Hero Section dengan luxury HD background photography, Bento Grid New Arrivals, kategori Tops & Suits, serta section **Our Philosophy** berlatar hitam *Black & White Noir* beraksen emas.
3. **Katalog Produk (`/products`)** — Tab kategori dinamis:
   - **Tops:** Italian Tailored Black Blazer, Architectural Poplin Dress Shirt, Heavyweight Minimalist Tee.
   - **Bottoms:** Tailored Pleated Trousers, Handcrafted Leather Loafers, Minimalist Calfskin Leather Belt.
   - **Outerwear:** Double-Faced Wool Coat Men, Structured Tailored Blazer Women.
   - **Accessories:** Minimalist Noir Chronograph Watch.
   Filter ukuran (*S, M, L, XL*), pengurutan harga, serta badge *LOW STOCK*.
4. **Detail Produk (`/products/:id`)** — Multi-image gallery grid, color & size selector, expandable accordions (*Shipping & Care*), rekomendasi *Complete The Look*, dan Instant Checkout.
5. **Checkout & Pembayaran (`/checkout`)** — 4 Section lengkap: *1. Customer Information*, *2. Shipping Address*, *3. Payment Method (QRIS / Bank Transfer)*, dan *4. Order Summary* dengan proteksi 256-bit secure checkout.
6. **Status Pesanan (`/order-status/:id`)** — Indikator status pesanan real-time dengan polling otomatis (PENDING $\rightarrow$ PAID / SHIPPED).
7. **Login & Register (`/login`, `/register`)** — Autentikasi terintegrasi Clerk + card akses instan **"AKUN KHUSUS ADMIN / OWNER"** (1-Click Demo) untuk kemudahan presentasi client.

### Admin & Operations Panel:
- **Manajemen Produk (`/admin`)** — Dashboard metrik, pencarian SKU, serta pembuatan produk baru via `/admin/product/new` dan pengeditan via `/admin/product/:id/edit`.
- **Manajemen Keranjang & Pesanan (`/admin/cart-orders`)** — Pemantauan transaksi real-time, keranjang aktif, dan modal pengubahan status pengiriman pesanan.
- **Manajemen Karyawan (`/admin/employee`)** — Direktori tim dengan modal *New Employee* dan kontrol 7-level RBAC.

---

## 🌐 Panduan Deployment ke Vercel (Frontend)

1. Hubungkan repository GitHub ini ke akun [Vercel](https://vercel.com).
2. Tentukan **Root Directory**: `frontend`.
3. Set Environment Variable di Vercel Dashboard:
   - `VITE_CLERK_PUBLISHABLE_KEY`: *(Publishable key dari Clerk dashboard)*
   - `VITE_API_BASE_URL`: `/api/v1` *(atau origin URL backend produksi Anda)*
4. File `frontend/vercel.json` telah siap mengelola seluruh routing SPA (Single Page Application rewrite).
5. Klik **Deploy**.
