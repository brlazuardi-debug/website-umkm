# Website UMKM — VARCA BRAND (Frontend Only)

React 19 + Vite 8 + **JavaScript (JSX) SPA** untuk brand product UMKM (etalase + checkout QRIS).
Backend sudah dihapus dari repo ini — seluruh data memakai API produksi eksternal via axios.

> API produksi: `https://umkmvarca.renaldi.my.id` — Kontrak: `API_CONTRACT-3.md`, source of truth: `/docs` (OpenAPI).

## Tech Stack
- React 19, React Router 7
- Vite 8 + `@vitejs/plugin-react`
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Clerk (`@clerk/clerk-react`) — auth (Bearer JWT via axios interceptor)
- Axios — API client (`src/api/client.js`)
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
# VITE_API_BASE_URL default sudah ke prod, ubah hanya bila perlu

# 3. jalankan dev (langsung ke API produksi)
npm run dev
```

## Scripts
| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Dev server (Vite), request axios ke `VITE_API_BASE_URL`. |
| `npm run build` | `vite build` → `dist/`. |
| `npm run preview` | Preview build production. |
| `npm run lint` | Oxlint. |

## Environment Variables
| Var | Wajib | Keterangan |
|-----|-------|-----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Ya | Clerk Publishable Key. Kosong → auth tidak jalan (error di console). |
| `VITE_API_BASE_URL` | Tidak | Default `https://umkmvarca.renaldi.my.id/api/v1`. |

## Architecture
```
src/
  api/          client.js (axios + interceptor token Clerk, sekali terdaftar)
                products.js | transactions.js | users.js
                orders.js | carts.js | employees.js | health.js
  components/   Layout, common/{Header,Footer,ProtectedRoute}, products/*, transaction/*
  context/      BrandContext.jsx, LanguageContext.jsx (ID & EN)
  pages/        Landing, KatalogProduk, DetailProduk, CheckoutPage, OrderStatus,
                LoginPage, RegisterPage, ProfilePage,
                admin/{ProductManagement,ProductFormPage,CartOrders,EmployeeManagement}
  App.jsx       ClerkProvider + BrowserRouter + route guards
  main.jsx      render App (tanpa MSW/mock — murni API prod)
```

> Catatan: Proyek ini **murni JavaScript (JSX)** — tidak ada TypeScript (`.ts`/`.tsx`).
> Build menggunakan `vite build` langsung (tanpa `tsc`). `jsconfig.json` disediakan untuk
> editor IntelliSense.

### Auth & Role
- Customer: login via Clerk (`ProtectedRoute` → redirect `/login` bila belum sign-in).
- Admin: `AdminRoute`. Di **development**, tombol "Demo Admin" di Header mengaktifkan bypass
  (`isAdminDemo`). Di **production** bypass non-aktif — akses admin butuh role asli
  (Clerk JWT, diverifikasi di API produksi).

### Data / API
Tanpa mock dan tanpa fallback dummy — gagal API = error dilempar ke UI (halaman menampilkan
empty/error state). Katalog publik memakai `GET /products`; admin memakai
`GET /products?include_inactive=true`.

## API Contract
Base `https://umkmvarca.renaldi.my.id/api/v1`. Lihat `API_CONTRACT-3.md`
(source of truth: `https://umkmvarca.renaldi.my.id/docs`).

## Status vs PRD
Lihat `summary.md` untuk mapping fitur MVP dan known limitations.

## Catatan Deployment (Vercel)
- **Root Directory: `.` (root)** — repo ini sudah frontend-only, jangan set ke `frontend/` lagi.
- Set Environment Variable di Vercel Dashboard:
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_API_BASE_URL=https://umkmvarca.renaldi.my.id/api/v1`
- `vercel.json` menangani SPA rewrite (cegah 404 pada direct routing).
- Pastikan origin Vercel di-allow CORS oleh API produksi.
