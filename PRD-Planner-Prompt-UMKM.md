# PRD Planner — Prompt untuk Agent AI (VS Code)

> Salin seluruh isi blok kode di bawah ini sebagai satu prompt tunggal ke agent AI coding di VS Code. Agent akan mengubah PRD ini menjadi rencana implementasi teknis (task breakdown, struktur file, langkah eksekusi) sesuai stack yang disepakati.

---

```text
Kamu adalah senior software engineer. Tugasmu: baca PRD berikut dengan teliti, lalu buatkan
RENCANA IMPLEMENTASI (implementation plan) yang siap dieksekusi untuk membangun website UMKM
ini dari nol. Jangan menulis kode lengkap — buat rencana eksekusi terstruktur.

============================================================
KONTEKS TIM & ATURAN PROYEK
============================================================
Tim: 4 orang.
- Renaldi (Founder) – Tech Lead / Backend / DB / Integrasi API / E2E / Deployment Production.
- Bagus (Frontend Developer) – Project Lead / Design to Code / Integrasi API / PRD & Requirement Lock.
- Virmanza (UI/UX Designer) – UI/UX Design (Wireframe → Hi-Fi) / Figma to Code.
- Fadli (Admin Marketing) – Komunikasi Klien / QA & Bug Fixing.

Aturan:
- Target: website live, stabil, sesuai ekspektasi dalam 4 minggu.
- Freeze Scope: tidak ada fitur baru setelah Minggu 2. Permintaan baru → Fase 2.
- API Contract First: struktur JSON disepakati maksimal Minggu 2, frontend & backend paralel pakai mock data.
- Mitigasi Aset: pakai data dummy jika klien terlambat kirim aset di Hari 1-2.

============================================================
TECH STACK (WAJIB, TIDAK BOLEH DIGANTI)
============================================================
- Frontend: React SPA (polyrepo terpisah dari backend)
- Backend: Python
- Database: PostgreSQL via NeonDB
- Cache: Redis
- Auth: Clerk
- Payment: QRIS via Duitku

============================================================
ARSITEKTUR & API CONTRACT (SINGLE SOURCE OF TRUTH)
============================================================
Base URL: /api/v1

AUTH & WEBHOOK:
- POST /api/v1/auth/webhook        (Svix Signature)   Clerk webhook, sync user ke DB
- POST /api/v1/payments/webhook    (HMAC Signature)   Duitku payment callback

PENGGUNA (auth: Bearer JWT):
- GET   /api/v1/users/me           → UserResponse
- PATCH /api/v1/users/me           body UserUpdate → UserResponse

PRODUK (GET publik, mutasi Admin JWT):
- GET    /api/v1/products?limit=20&offset=0   → ProdukResponse[]  (cached 60s Redis)
- GET    /api/v1/products/{id}                → ProdukResponse
- POST   /api/v1/products                     body ProdukCreate → ProdukResponse (201)
- PUT    /api/v1/products/{id}                body ProdukUpdate → ProdukResponse
- DELETE /api/v1/products/{id}                → 204 No Content

TRANSAKSI (auth: Bearer JWT):
- POST /api/v1/transactions          body TransaksiCreate → TransaksiResponse (201)
- GET  /api/v1/transactions/{id}     → TransaksiResponse

HEALTH: GET /health → {"status":"ok"}
DOCS: OpenAPI auto-generated di /docs

SCHEMAS JSON:
UserResponse:        { id, clerk_id, email, name, created_at, updated_at }
UserUpdate:          { name: string|null }
ProdukCreate/Response:{ nama, deskripsi|null, harga:int, stok:int, gambar_url|null, is_active:bool }
ProdukUpdate:        { nama|null, deskripsi|null, harga|null, stok|null, gambar_url|null, is_active|null }
TransaksiCreate:     { total_harga:int, payment_type:string (default "qris") }
TransaksiResponse:   { id, user_id, total_harga, status, payment_type, midtrans_order_id|null, qr_url|null, created_at, updated_at }

STATUS TRANSAKSI: PENDING → PAID | EXPIRED | FAILED  (enum di level aplikasi)

ERROR: 401 Unauthorized | 403 Forbidden (webhook signature invalid) | 404 Not Found | 422 Validation Error (Pydantic v2)

============================================================
ERD / MODEL DATA (BACKEND)
============================================================
users:       id UUID PK, clerk_id VARCHAR UK, email VARCHAR UK, name VARCHAR, created_at, updated_at
produk:      id UUID PK, nama VARCHAR, deskripsi TEXT, harga INTEGER, stok INTEGER, gambar_url VARCHAR, is_active BOOLEAN, created_at, updated_at
transaksi:   id UUID PK, user_id UUID FK→users, total_harga INTEGER, status VARCHAR(enum: PENDING/PAID/EXPIRED/FAILED), payment_type VARCHAR, midtrans_order_id VARCHAR UK (idempotency key), qr_url VARCHAR, created_at, updated_at

Relasi: users ||--o{ transaksi. Relasi produk↔transaksi BELUM ADA (item-level = Fase 2).
Catatan: users.clerk_id unique (1 Clerk account = 1 user). midtrans_order_id unique (idempotency key payment).

============================================================
FITUR MVP (Scope ini saja, jangan lebih)
============================================================
1. Landing page / halaman utama brand
2. Katalog produk publik + detail produk (pagination limit/offset)
3. Registrasi & login customer (Clerk)
4. Checkout + pembayaran QRIS (Duitku), tampilkan QR code dari qr_url
5. Halaman status transaksi customer (polling PENDING → PAID)
6. Panel admin: CRUD produk
7. Webhook sync user (Clerk) + payment callback (Duitku)
8. Caching list produk via Redis (TTL 60s)
9. Health check endpoint
10. Deployment ke production

FASE 2 (JANGAN masukkan ke plan MVP): keranjang multi-item (transaksi_item),
dashboard admin/riwayat transaksi, search & filter lanjutan, multi-payment selain QRIS,
notifikasi otomatis, kupon/diskon, kategori produk.

============================================================
NON-FUNCTIONAL
============================================================
- Mobile-friendly / responsive
- Performa: list produk cache Redis TTL 60s, load halaman < 3 detik
- Keamanan: auth Clerk (JWT), Svix Signature (auth webhook), HMAC Signature (payment webhook), validasi Pydantic v2
- Error response terstandar: 401/403/404/422
- Post-launch support 7 hari, respons bug kritis ≤ 4 jam

============================================================
OUTPUT YANG DIMINTA (dalam satu dokumen markdown)
============================================================
Buat dokumen bernama IMPLEMENTATION-PLAN.md berisi:

1. **Arsitektur & Struktur Repo**
   - Struktur folder untuk FRONTEND (React SPA) dan BACKEND (Python) secara terpisah (polyrepo).
   - Diagram alur request untuk setiap layer.

2. **Task Breakdown per Minggu (4 minggu)**
   - Minggu 1: ERD final, draf API Contract, wireframe, setup project FE & BE, kumpul aset.
   - Minggu 2: Scope Freeze, API Contract final, sign-off desain Hi-Fi, skeleton backend (repo + env), setup FE (React + Clerk + routing).
   - Minggu 3: Integrasi Clerk + QRIS + Redis (backend), slicing Figma→React, mock data → komponen, integrasi awal Clerk SDK.
   - Minggu 4: Integrasi API E2E, debugging, E2E testing, deployment production, dokumentasi handover, bug fixing.
   Setiap task: [ID], deskripsi, pemilik (Renaldi/Bagus/Virmanza/Fadli), dependensi, hasil deliverable.

3. **Definisi API Client Layer (Frontend)**
   - File/fungsi apa saja yang perlu dibuat (mis. src/api/client.ts, src/api/products.ts, dst).
   - Pola penanganan auth token Clerk → Authorization header.
   - Pola error handling (401 → redirect login, 404, 422).

4. **Daftar Halaman Frontend (Routing)**
   - Setiap route: path, komponen, data yang dibutuhkan, status auth (public/protected/admin).

5. **Langkah Implementasi Backend**
   - Setup Python (framework pilihan, struktur app, konfigurasi env).
   - Setup DB NeonDB + SQLAlchemy/migrasi.
   - Implementasi tiap endpoint sesuai API Contract, webhook signature verification, validasi Pydantic v2.
   - Redis caching untuk GET /products.
   - Integrasi Duitku (buat transaksi, dapatkan qr_url, verifikasi callback).

6. **Skema Mock Data (Frontend)**
   - Contoh JSON mock untuk ProdukResponse[], TransaksiResponse, UserResponse sesuai contract.

7. **Rencana Testing & QA**
   - Unit test, E2E test, QA checklist (oleh Fadli), UAT.

8. **Rencana Deployment**
   - Steps deployment frontend & backend ke production, env vars yang dibutuhkan, health check.

9. **Risiko & Mitigasi**
   - Aset telat (pakai dummy), API Contract berubah (lock di Minggu 2), integrasi payment lambat, dsb.

10. **Checklist TBD yang harus diklarifikasi sebelum Minggu 3**
   - Daftar dari PRD Bab 12 yang relevan untuk keputusan teknis.

KERJAKAN SECARA TERSTRUKTUR. Jangan menambahkan fitur di luar MVP.
Jangan mengubah tech stack. Semua keputusan harus konsisten dengan API Contract dan ERD di atas.
```

---

## Kalimat Konfirmasi (copy ke chat agent sebelum menjalankan prompt di atas)

> "Dokumen PRD yang kamu terima ini sudah benar dan lengkap. Seluruh informasi di dalamnya telah diperiksa dan **sesuai 100% dengan semua dokumen sumber** yang saya kirim: runbook tim eksekusi 4 minggu, ERD Backend UMKM, API Contract Backend UMKM, dan ringkasan project website UMKM brand product. Tech stack (React, Python, Postgres NeonDB, Redis, Clerk, QRIS via Duitku), skema JSON, status transaksi, struktur database, pembagian peran tim, dan aturan proyek sudah tertangkap semuanya. Tidak ada asumsi liar yang ditambahkan — hal-hal yang belum diputuskan sudah saya tandai di Bab 12 (Pertanyaan Terbuka/TBD) dan tidak dianggap sebagai keputusan final. Silakan lanjutkan membuat rencana implementasi sesuai PRD ini."
