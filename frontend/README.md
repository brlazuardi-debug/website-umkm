# Website UMKM — Frontend

React 19 + Vite 8 + **JavaScript (JSX) SPA** untuk brand product UMKM (etalase + checkout QRIS).
Bagian dari polyrepo: frontend ini terpisah dari backend Python (NeonDB / Redis / Clerk / Duitku).

> Status: **MVP frontend selesai (mock-driven).** Integrasi backend belum dikerjakan.

## Tech Stack
- React 19, React Router 7
- Vite 8 + `@vitejs/plugin-react`
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Clerk (`@clerk/clerk-react`) — auth
- Axios — API client
- MSW 2 — mock API (hanya mode development)
- Oxlint — linter

## Prerequisites
- Node 22+
- Akun Clerk (untuk publishable key)

## Setup
```bash
# 1. install
npm install

# 2. env
cp .env.example .env
# isi VITE_CLERK_PUBLISHABLE_KEY dari Clerk Dashboard > API Keys

# 3. jalankan dev (MSW aktif otomatis di DEV)
npm run dev
```

## Scripts
| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Dev server (Vite). MSW meng-intercept `/api/v1/*` secara lokal. |
| `npm run build` | `vite build` → `dist/`. |
| `npm run preview` | Preview build production. |
| `npm run lint` | Oxlint. |

## Environment Variables
| Var | Wajib | Keterangan |
|-----|-------|-----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Ya | Clerk Publishable Key. Kosong → auth tidak jalan (error di console). |
| `VITE_API_BASE_URL` | Tidak | Base URL API. Default `/api/v1` (relatif). |

## Architecture
```
src/
  api/          client.js (axios + interceptor token Clerk, sekali terdaftar)
                products.js | transactions.js | users.js
  components/   Layout, common/{Header,Footer,ProtectedRoute}, products/*, transaction/*
  context/      BrandContext.jsx (info brand + flag demo admin DEV-only)
  mocks/        browser.js, handlers.js (MSW — sumber data mock)
  pages/        Landing, KatalogProduk, DetailProduk, CheckoutPage, OrderStatus,
                LoginPage, RegisterPage, admin/{AdminDashboard,ProductFormPage}
  App.jsx       ClerkProvider + BrowserRouter + route guards
  main.jsx      enableMocking() (DEV only) → render App
```

> Catatan: Proyek ini **murni JavaScript (JSX)** — tidak ada TypeScript (`.ts`/`.tsx`).
> Build menggunakan `vite build` langsung (tanpa `tsc`). `jsconfig.json` disediakan untuk
> editor IntelliSense.

### Auth & Role
- Customer: login via Clerk (`ProtectedRoute` → redirect `/login` bila belum sign-in).
- Admin: `AdminRoute`. Di **development**, tombol "Demo Admin" di Header mengaktifkan bypass
  (`isAdminDemo`). Di **production** bypass non-aktif — akses admin butuh role asli
  (Clerk JWT metadata, diverifikasi di backend).

### Data / Mock
MSW (`src/mocks/handlers.js`) mengimplementasikan seluruh API contract:
`/health`, `/products`, `/users/me`, `/transactions`. Transaksi baru otomatis `PAID` setelah
15 detik untuk simulasi polling.

Endpoint katalog publik mengembalikan produk aktif saja; admin memakai
`GET /products?include_inactive=true` untuk mengelola produk non-aktif (sesuai kontrak:
publik aktif-only, admin melihat semua).

## API Contract
Base `/api/v1`. Lihat `../API_CONTRACT-2.md` (source of truth: `/docs` OpenAPI di backend nanti).
Skema request/response dijelaskan di kontrak; mock `handlers.js` mengikuti 1:1
(field `midtrans_order_id`, `qr_url`, status `PENDING|PAID|EXPIRED|FAILED`, dsb).

## Status vs PRD
Lihat `../summary.md` untuk mapping fitur MVP, hasil audit, dan known limitations.

## Catatan Deployment
- Build statis di `dist/` (SPA). Butuh backend terpisah untuk API nyata + webhook.
- Pastikan `VITE_CLERK_PUBLISHABLE_KEY` dan `VITE_API_BASE_URL` diset di environment production.
