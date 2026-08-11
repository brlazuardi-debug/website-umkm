# Summary — Website UMKM (Frontend)

> Status: **Frontend MVP architecture complete (mock-driven). Backend not started.** Last audit: 2026-08-11.

## 1. Overview
React 19 + Vite 8 + TypeScript SPA untuk brand product UMKM (Sanggar Nusantara).
Polyrepo: frontend ini dipisah dari backend Python (NeonDB / Redis / Clerk / Duitku QRIS).
Saat ini semua data dari MSW mock — belum ada integrasi backend nyata.

## 2. Status vs Dokumen (PRD / Planner / API Contract / ERD)
Arsitektur & cakupan frontend **sesuai** dengan keempat dokumen sumber.

| Fitur MVP | Status | Catatan |
|-----------|--------|---------|
| Landing page brand | ✅ | Hero, Filosofi, Katalog, Tentang Kami |
| Katalog + detail + pagination | ✅ | `getProducts(limit,offset)` + "Muat Lebih Banyak" |
| Registrasi & login (Clerk) | ✅ | `<SignIn>`/`<SignUp>` |
| Checkout + QRIS + qr_url | ✅ | Checkout → createTransaction → OrderStatus → QRISPayment |
| Status transaksi + polling | ✅ | Polling 4 detik, berhenti saat ≠ PENDING |
| Panel admin CRUD produk | ✅ | AdminDashboard + ProductFormPage |
| Webhook user + payment callback | ⏳ | Backend (belum ada) |
| Caching Redis TTL 60s | ⏳ | Backend |
| Health check | ✅ (mock) | `GET */health` di handlers |
| Deployment production | 🟡 | `vite build` lolos; belum ada setup deploy/env |

API Contract (path, method, schema JSON) diimplementasikan 1:1 di `src/api/*` dan `src/types/index.ts`.
Tipe TS cocok dengan ERD (UUID sebagai string, enum status, `midtrans_order_id`).

**Belum ter-wire ke UI:** `getMyProfile` & `updateMyProfile` (users.ts) sudah ada tapi belum
dipanggil halaman mana pun → AUTH-3/AUTH-4 baru lapisan API.

## 3. Audit & Perbaikan (commit 813870f)
Temuan diaudit lalu diperbaiki semua:

1. **Tailwind v4 invalid shades** (HIGH). Shade `amber-850/55/250/905`, `stone-850/550/605/150/250`,
   `red-650/150`, `emerald-705/250` tidak ada di v4 → **diam-diam dibuang oleh compiler**.
   Diverifikasi di dist CSS: sebelum fix 0 rule, sesudah hadir. Dampak: hover mati, border hilang,
   teks error salah warna. → Diganti shade valid di 8 file.
2. **Auth interceptor menumpuk** (MEDIUM). `setAuthTokenInterceptor` mendaftarkan interceptor baru
   tiap sign-in/out. → Daftarkan sekali di module load, baca `getToken` via ref.
3. **Admin guard = flag client-side** (HIGH/security). `isAdminDemo` (state React dari tombol
   "Demo Admin") mengizinkan akses `/admin`. → Toggle & bypass sekarang **hanya di `import.meta.env.DEV`**;
   produksi wajib role asli (Clerk JWT metadata, diverifikasi backend).
4. **Fake Clerk key fallback + no .env** (MEDIUM). Fallback key palsu dihapus → app melempar error
   jelas kalau `VITE_CLERK_PUBLISHABLE_KEY` kosong. Tambah `.env.example`.
5. **Process** — repo di-`git init` + commit awal (sebelumnya tidak ada VCS).

## 4. Build & Quality Gates (terverifikasi)
- `npm run build` (tsc -b && vite build): PASS (1931 modules).
- `npx oxlint`: 0 error (1 warning kosmetik `only-export-components` di BrandContext).
- Fixed shades terbukti ada di compiled CSS.

## 5. Known Limitations / Next Steps
- Item-level cart, validasi harga server, pengurangan stok → PRD TBD / Fase 2.
- Mock auto-PAID 15 detik vs countdown 300 detik → selaraskan dengan expiry Duitku asli.
- Nama "Duitku" vs `midtrans_order_id` di mock → seragamkan saat wiring gateway.
- Backend: Python + NeonDB + Redis + Clerk webhook (Svix) + Duitku callback (HMAC).
- Halaman profil customer (panggil `getMyProfile`/`updateMyProfile`).

## 6. Struktur Direktori (frontend/src)
```
api/        client.ts, products.ts, transactions.ts, users.ts
components/ Layout, common/{Header,Footer,ProtectedRoute}, products/*, transaction/*
context/    BrandContext.tsx
mocks/      browser.ts, handlers.ts (MSW)
pages/      Landing, ProductDetail, Checkout, OrderStatus, Login, Register,
            admin/{AdminDashboard,ProductFormPage}
types/      index.ts (satu source of truth untuk API contract)
```
