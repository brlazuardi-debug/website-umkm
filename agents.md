# agents.md — Panduan untuk AI Agent & Developer

Repo: **website-umkm** (frontend React SPA). Dibaca otomatis oleh agent sebelum kerja.

## 1. Konteks Cepat
- Frontend polyrepo untuk brand product UMKM. Backend (Python/NeonDB/Redis/Clerk/Duitku) **belum ada**.
- Semua data saat ini dari **MSW mock** (`src/mocks/`). Jangan anggap mock = backend nyata.
- Dokumen sumber (di root repo): `PRD-UMKM-Website.md`, `API_CONTRACT-2.md`, `ERD.md`,
  `PRD-Planner-Prompt-UMKM.md`, `summary.md`. Baca sebelum mengubah cakupan fitur.

## 2. Aturan Emas (jangan dilanggar tanpa konfirmasi)
- **Jangan tambah fitur di luar MVP.** Fase 2 (cart multi-item, dashboard transaksi, search/filter,
  multi-payment, notif, kupon, kategori) dilarang masuk MVP (Scope Freeze, PRD Bab 4.2/11).
- **Jangan ubah tech stack.** React/Vite/TS/Clerk/MSW/Tailwind sudah dikunci (Planner).
- **Type = source of truth.** Tambah/edit field API → update `src/types/index.ts` DAN
  `src/mocks/handlers.ts` (kalau perlu demo) DAN catat di API contract. Jaga konsistensi dengan
  `API_CONTRACT-2.md`.
- **Tailwind v4 hanya punya shade 50,100,200..900,950.** JANGAN pakai shade kustom
  (`amber-850`, `stone-150`, `red-650`, `emerald-705`, dll) — compiler akan **membuangnya diam-diam**.
  Pakai shade valid atau definisikan token via `@theme` di `src/index.css`.

## 3. Konvensi Kode (clean code)
- `src/api/*.ts`: satu fungsi per endpoint, kembalikan `Promise<T>` dari `apiClient`.
- Komponen di `src/components/*`, halaman di `src/pages/*` (admin di `src/pages/admin/*`).
- `import.meta.env.DEV` untuk semua behavior hanya-dev (mis. toggle demo admin). Jangan kirim
  flag dev ke production.
- Gunakan `lucide-react` untuk ikon; Tailwind utility untuk styling.
- Bahasa komentar: Indonesia (konsisten dengan basis kode).

## 4. Auth & Role (penting)
- Interceptor token Clerk **sudah didaftarkan sekali** di `src/api/client.ts` (baca `getToken` via ref).
  JANGAN daftarkan ulang interceptor tiap render — itu menumpuk header & pemanggilan `getToken`.
- `ProtectedRoute` = butuh `isSignedIn`. `AdminRoute` = dev bypass (`isAdminDemo`) atau nanti role asli.
  Otorisasi admin sejati adalah tanggung jawab backend (Clerk JWT metadata + verifikasi server).

## 5. Workflow & Quality Gates
- Sebelum commit: `npm run lint` (oxlint) dan `npm run build` harus hijau.
- Build: `cd frontend && npm run build`. Lint: `cd frontend && npx oxlint`.
- Verifikasi visual Tailwind: cek CSS hasil build untuk memastikan class muncul (bukan dibuang).
- Commit message: bahasa Indonesia/Inggris ringkas, jelaskan "what & why".

## 6. Gotchas yang Sudah Diperbaiki (hindari pengulangan)
- Perbaikan audit (commit `813870f`): shade Tailwind invalid, interceptor menumpuk, admin demo
  DEV-only, error jelas saat `VITE_CLERK_PUBLISHABLE_KEY` kosong + `.env.example`.
  Jangan kembalikan ke pola lama.
- `getMyProfile`/`updateMyProfile` (users.ts) **belum dipakai UI** — kalau buat halaman profil,
  panggil fungsi itu, jangan buat API call baru.

## 7. Ketika Menambah Endpoint/Page Baru
1. Update `src/types/index.ts` (type) → 2. Update mock `src/mocks/handlers.ts` →
3. Tambah fungsi di `src/api/*.ts` → 4. Gunakan di page → 5. Update route di `src/App.tsx` +
   guard yang sesuai → 6. Lint + build.

## 8. Environment
- Wajib: `VITE_CLERK_PUBLISHABLE_KEY`. Lihat `frontend/.env.example`.
- `VITE_API_BASE_URL` default `/api/v1`.
