# Website UMKM (VARCA BRAND)

Platform E-Commerce & Admin Management System untuk brand luxury & minimalist apparel UMKM — 100% presisi mengikuti spesifikasi desain Figma (`VuOuH1OTenDwxVZxTKMw9D/Brand-UMKM`) dengan Inter typography, visual monokrom modern, dan arsitektur RESTful API modular berstandar OpenAPI v3.1.

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
│   │   ├── components/       # UI Components, Layout, ProtectedRoute, Modals
│   │   ├── context/          # BrandContext (VARCA Brand profile & Admin Demo Toggle)
│   │   ├── mocks/            # MSW (Mock Service Worker) browser handlers
│   │   ├── pages/
│   │   │   ├── admin/        # ProductManagement, ProductFormPage, CartOrders, EmployeeManagement
│   │   │   └── customers/    # LandingPage, KatalogProduk, DetailProduk, CheckoutPage, OrderStatusPage, ProfilePage, Login, Register
│   │   ├── App.jsx           # App Routing & Clerk Auth Provider
│   │   └── main.jsx
│   └── package.json
│
├── API_CONTRACT-3.md         # Source of Truth kontrak API v3 (30 Endpoints)
├── PRD-UMKM-Website.md       # Product Requirements Document
├── ERD.md                    # Entity Relationship Diagram & Database Schema
├── summary.md                # Laporan perkembangan & status integrasi
└── agents.md                 # Panduan teknis arsitektur untuk AI Agent & Developers
```

---

## ⚡ Tech Stack

### Frontend:
- **Framework:** React 19, React Router 7
- **Build Tool & Styling:** Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`)
- **Typography:** Inter Font Family (`font-['Inter']`, Semi-Bold / Medium focus)
- **Icons:** Lucide React (100% SVG, Zero Emojis)
- **Auth:** Clerk Authentication (`@clerk/clerk-react`)
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
1. **Landing Page (`/`)** — Hero Section dengan luxury background photography, Bento Grid New Arrivals, kategori Tops & Bottoms, serta Brand Manifesto.
2. **Katalog Produk (`/products`)** — Tab kategori dinamis (*ALL, TOPS, BOTTOMS, OUTERWEAR, ACCESSORIES*), filter ukuran (*S, M, L, XL*), pengurutan harga, serta badge *LOW STOCK*.
3. **Detail Produk (`/products/:id`)** — Multi-image gallery grid, color & size selector, expandable accordions (Shipping & Care), rekomendasi *Complete The Look*, dan Instant Checkout.
4. **Checkout & Pembayaran (`/checkout`)** — Form info pembeli, alamat pengiriman, selector pembayaran QRIS / Transfer Bank, dan ringkasan pesanan.
5. **Status Pesanan (`/order-status/:id`)** — Indikator status pesanan real-time dengan polling otomatis (PENDING $\rightarrow$ PAID / SHIPPED).
6. **Profil Akun (`/profile`)** — Manajemen nama dan data profil terautentikasi.

### Admin & Operations Panel:
1. **Product Management (`/admin`)** — Bento Metrics inventaris (*Total Products, Low Stock, Pending POS, Returns*), tabel inventaris produk, edit, dan hapus.
2. **Product Form (`/admin/product/new` & `/admin/product/:id/edit`)** — Form penambahan dan pengeditan informasi produk serta upload gambar.
3. **Cart & Orders Management (`/admin/cart-orders`)** — Metrik keranjang aktif & pesanan pending, tabel pesanan terbaru, serta **Modal Order Details** untuk pembaruan status pesanan (*PENDING $\rightarrow$ PAID $\rightarrow$ SHIPPED*).
4. **Employee Management (`/admin/employee`)** — Direktori tim organisasi, inisial avatar, tag role, nomor kontak, serta **Modal New Employee** untuk pendaftaran staf baru.
