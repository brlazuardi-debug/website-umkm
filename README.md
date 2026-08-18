# Website UMKM

Frontend SPA (React 19 + Vite 8 + **JavaScript JSX**) untuk brand product UMKM
(Sanggar Nusantara) — etalase produk lokal + checkout QRIS.

Ini adalah **polyrepo**: frontend dipisah dari backend Python
(NeonDB / Redis / Clerk / Duitku QRIS) yang belum dibuat.

> Status: **MVP frontend selesai, mock-driven (MSW).** Belum ada integrasi backend nyata.

## Struktur Repo
- `frontend/` — kode SPA React (JavaScript/JSX, bukan TypeScript).
- `*.md` (root) — dokumen sumber: `PRD-UMKM-Website.md`, `API_CONTRACT-2.md`,
  `ERD.md`, `summary.md`, `agents.md`.

## Tech Stack
- React 19, React Router 7
- Vite 8 + `@vitejs/plugin-react` + `@tailwindcss/vite` (Tailwind v4)
- Clerk (`@clerk/clerk-react`) — auth
- Axios — API client
- MSW 2 — mock API (hanya mode development)
- Oxlint — linter

## Quick Start
```bash
cd frontend
npm install
cp .env.example .env        # isi VITE_CLERK_PUBLISHABLE_KEY
npm run dev                 # MSW aktif otomatis di DEV, intercept /api/v1/*
```

## Scripts
| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Dev server (Vite) + MSW mock lokal. |
| `npm run build` | `vite build` → `dist/`. |
| `npm run preview` | Preview build production. |
| `npm run lint` | Oxlint. |

## Dokumentasi
- `frontend/README.md` — detail setup & arsitektur frontend.
- `summary.md` — ringkasan perkembangan, audit, status fitur MVP.
- `API_CONTRACT-2.md` — kontrak API (source of truth).
- `agents.md` — panduan untuk AI agent/developer.

## Catatan
Build statis SPA di `frontend/dist/`. Butuh backend terpisah untuk API nyata +
webhook (Clerk Svix, Duitku/Duitku HMAC callback) sebelum produksi.
