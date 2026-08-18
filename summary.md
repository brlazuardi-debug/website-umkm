# Summary — Website UMKM (Frontend)

> Status: **Frontend MVP complete (mock-driven, 100% JavaScript/JSX). Backend not started.**
> Last update: 2026-08-18.

## 1. Overview
React 19 + Vite 8 + **JavaScript (JSX)** SPA untuk brand product UMKM (Sanggar Nusantara).
Polyrepo: frontend ini dipisah dari backend Python (NeonDB / Redis / Clerk / Duitku QRIS).
Saat ini semua data dari MSW mock — belum ada integrasi backend nyata.

> **Penting (2026-08-18):** Proyek telah dikonversi penuh dari TypeScript ke JavaScript murni.
> Tidak ada lagi file `.ts`/`.tsx`. Build memakai `vite build` langsung (tanpa `tsc -b`).

## 2. Status vs Dokumen (PRD / Planner / API Contract / ERD)
Arsitektur & cakupan frontend **sesuai** dengan keempat dokumen sumber.

| Fitur MVP | Status | Catatan |
|-----------|--------|---------|
| Landing page brand | ✅ | Hero, Filosofi, Katalog, Tentang Kami |
| Katalog + detail + pagination | ✅ | `getProducts(limit,offset)` + "Muat Lebih Banyak" |
| Registrasi & login (Clerk) | ✅ | `<SignIn>`/`<SignUp>` |
| Checkout + QRIS + qr_url | ✅ | Checkout → createTransaction → OrderStatus → QRISPayment |
| Status transaksi + polling | ✅ | Polling 3 detik, berhenti saat ≠ PENDING |
| Panel admin CRUD produk | ✅ | AdminDashboard + ProductFormPage |
| Webhook user + payment callback | ⏳ | Backend (belum ada) |
| Caching Redis TTL 60s | ⏳ | Backend |
| Health check | ✅ (mock) | `GET */health` di handlers |
| Deployment production | 🟡 | `vite build` lolos; belum ada setup deploy/env |

API Contract (path, method, schema JSON) diimplementasikan 1:1 di `src/api/*` dan mock
`src/mocks/handlers.js` (field `midtrans_order_id`, `qr_url`, status `PENDING|PAID|EXPIRED|FAILED`
sesuai kontrak).

## 3. Konversi TypeScript → JavaScript (2026-08-18)
Seluruh kode diubah dari `.ts`/`.tsx` ke `.js`/`.jsx`:
- `types/index.ts` → `types/index.js` (JSDoc untuk bentuk data).
- `api/*` (client/products/users/transactions) → `.js`.
- `mocks/*` (handlers/browser) → `.js`.
- `components/*`, `context/*`, `pages/*` → `.jsx`.
- Halaman customer yang sebelumnya berupa **export desain Figma/Visily statis** (div + base64,
  tanpa export React) diganti dengan komponen React fungsional yang terhubung ke MSW.
- `App.jsx` diperbaiki: sebelumnya mereferensikan `ProductDetailPage`/`LoginPage`/`RegisterPage`/
  `OrderStatusPage` yang tidak diimpor (pasti crash) — keempat halaman kini ada & ter-routing.
- Build reconfig: `vite.config.ts` → `vite.config.js`; `package.json` build = `vite build`
  (tanpa `tsc -b`); `.oxlintrc.json` tanpa plugin `typescript`; tambah `jsconfig.json`.
- Perbaikan Tailwind v4: `border-red-250` (shade invalid, dibuang compiler) → `border-red-200`.

## 4. Audit & Perbaikan (commit 813870f, tetap berlaku)
1. **Tailwind v4 invalid shades** (HIGH). Shade `amber-850/55/250/905`, `stone-850/550/605/150/250`,
   `red-650/150`, `emerald-705/250` tidak ada di v4 → dibuang compiler diam-diam.
   → Diganti shade valid.
2. **Auth interceptor menumpuk** (MEDIUM). → Daftarkan sekali di module load, baca `getToken` via ref.
3. **Admin guard = flag client-side** (HIGH/security). → Bypass demo **hanya di `import.meta.env.DEV`**;
   produksi wajib role asli (Clerk JWT metadata, diverifikasi backend).
4. **Fake Clerk key fallback + no .env** (MEDIUM). → App error jelas kalau key kosong; tambah `.env.example`.

## 5. Build & Quality Gates (terverifikasi)
- `npm run build` (`vite build`): PASS (1932 modules transformed).
- `npx oxlint`: 0 error (1 warning kosmetik `only-export-components` di BrandContext — pola hook ekspor).
- Mock data terverifikasi 1:1 dengan API contract via integration test MSW (14/14 assertions PASS):
  shape `ProdukResponse`/`TransaksiResponse`/`UserResponse`, status 201/204/404, dan
  `GET /products?include_inactive=true` untuk admin.

## 6. Known Limitations / Next Steps
- Item-level cart, validasi harga server, pengurangan stok → PRD TBD / Fase 2.
- Mock auto-PAID 15 detik vs countdown 300 detik → selaraskan dengan expiry gateway asli.
- Nama "Duitku" vs `midtrans_order_id` di mock → seragamkan saat wiring gateway.
- Backend: Python + NeonDB + Redis + Clerk webhook (Svix) + Duitku callback (HMAC).
- Halaman profil customer (panggil `getMyProfile`/`updateMyProfile`).

## 7. Struktur Direktori (frontend/src)
```
api/        client.js, products.js, transactions.js, users.js
components/ Layout, common/{Header,Footer,ProtectedRoute}, products/*, transaction/*
context/    BrandContext.jsx
mocks/      browser.js, handlers.js (MSW)
pages/      Landing, KatalogProduk, DetailProduk, CheckoutPage, OrderStatusPage,
            LoginPage, RegisterPage, admin/{AdminDashboard,ProductFormPage}
```
