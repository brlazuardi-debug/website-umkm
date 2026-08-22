# Website UMKM (VARCA BRAND)

Frontend SPA (React 19 + Vite 8 + **JavaScript JSX**) untuk brand luxury & minimalist product UMKM — 100% persis desain Figma (`VuOuH1OTenDwxVZxTKMw9D/Brand-UMKM`) dengan Inter semi-bold typography & visual monokrom modern.

Ini adalah **polyrepo**: frontend dipisah dari backend Python (NeonDB / Redis / Clerk / Duitku QRIS).

> Status: **Frontend MVP 100% matched Figma designs (Landing, Katalog, Detail, Checkout, Cart & Orders, Product Management, Employee Management).** Integrasi backend terhubung ke REST API (`/api/v1`) & Clerk Auth.

## Struktur Repo
- `frontend/` — kode SPA React (JavaScript/JSX).
- `*.md` (root) — dokumen sumber: `PRD-UMKM-Website.md`, `API_CONTRACT-2.md`,
  `ERD.md`, `summary.md`, `agents.md`.

## Tech Stack & Design System
- React 19, React Router 7
- Vite 8 + `@vitejs/plugin-react` + `@tailwindcss/vite` (Tailwind v4)
- Inter Font Family (`font-['Inter']`, semi-bold weight focus)
- Monochromatic Modern Visual Aesthetics
- Clerk (`@clerk/clerk-react`) — auth
- Axios — API client
- Lucide React — Icons set

## Quick Start
```bash
cd frontend
npm install
cp .env.example .env        # isi VITE_CLERK_PUBLISHABLE_KEY
npm run dev                 # dev server di localhost:5173
```

## Halaman Utama (Customer & Admin)
1. **Landing Page (`/`)** — Hero section, bento asymmetrical grid, new arrivals, category sections, brand philosophy.
2. **Katalog Produk (`/products`)** — Dynamic category tabs (Tops, Bottoms, Outerwear), size filters (S, M, L, XL), price sorting.
3. **Detail Produk (`/products/:id`)** — Image gallery grid, color/size selector, accordions (shipping/care), recommended looks.
4. **Checkout (`/checkout`)** — Transactional form with Clerk auto-fill, address entry, QRIS & Bank selector, order summary.
5. **Admin - Product Management (`/admin`)** — Inventory Bento grid, dynamic CRUD table (getProducts, deleteProduct).
6. **Admin - Cart & Orders (`/admin/cart-orders`)** — Active carts, pending orders, abandoned metrics, order status tracking.
7. **Admin - Employee Management (`/admin/employee`)** — Team directory grid, roles (Admin, Warehouse, Manager), status badges.

## Dokumentasi
- `frontend/README.md` — detail setup & arsitektur frontend.
- `summary.md` — ringkasan perkembangan, audit, status konversi Figma 1:1.
- `API_CONTRACT-2.md` — kontrak API (source of truth).
- `agents.md` — panduan untuk AI agent/developer.
