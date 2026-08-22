# Summary — Website UMKM (VARCA BRAND Frontend)

> Status: **Frontend MVP 100% Figma Matched & Refined (Inter Semi-Bold Typography, Monochromatic Aesthetics, React 19 / JSX).**
> Last update: 2026-08-22.

## 1. Overview & Conversion Status
- **Tipografi:** 100% menggunakan font Inter dengan bobot **Semi-Bold / Medium** (`font-['Inter']`, `font-semibold`, `font-medium`) di seluruh 7 halaman utama.
- **Visual & Layout:** Disesuaikan 1:1 dengan spesifikasi Figma (`VuOuH1OTenDwxVZxTKMw9D/Brand-UMKM`) & screenshot acuan:
  1. `LandingPage.jsx` — Hero section, Bento grid, New Arrivals, Category sections (Tops, Bottoms, Outerwear), Philosophy story block.
  2. `KatalogProduk.jsx` — Filter kategori, filter ukuran (S, M, L, XL), dropdown pengurutan harga, product cards grid.
  3. `DetailProduk.jsx` — Breadcrumbs, multi-image gallery grid, color & size selector, expandable accordions (shipping/care), Complete The Look recommendations.
  4. `CheckoutPage.jsx` — Top navigation bar transactional intent, customer info form dengan Clerk user auto-fill, shipping address, QRIS / Bank selector, Order Summary card.
  5. `ProductManagement.jsx` — Inventory Bento metrics grid (Total Products, Low Stock, Pending POS, Returns), Products list table dengan action buttons.
  6. `CartOrders.jsx` — Active Carts, Pending Orders, Abandoned Carts bento cards, Recent Orders table dengan status badges.
  7. `EmployeeManagement.jsx` — Sidebar navigation, Team Directory grid (Initial avatars, role tags, contact information, active/inactive badges).

## 2. Dynamic Integration & Auth
- **API Endpoints:** Tetap terhubung secara dinamis dengan REST API client (`getProducts`, `getProductById`, `deleteProduct`, `createTransaction`).
- **Authentication:** Menggunakan Clerk Authentication (`@clerk/clerk-react`) untuk halaman pembeli & fitur checkout.
- **Admin Demo Toggle:** Modus pengujian cepat admin `isAdminDemo` disediakan di Header bar untuk akses panel admin tanpa hambatan auth backend.

## 3. Tech Stack
- React 19, React Router 7
- Vite 8 + Tailwind CSS v4
- `@clerk/clerk-react`
- `lucide-react` icons set
