# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Website UMKM — Brand Product

**STATUS: DRAFT SEMENTARA**

| | |
| --- | --- |
| **Nama Produk** | Website UMKM Brand Product |
| **Versi Dokumen** | v0.1 |
| **Disusun oleh** | Bagus (Project Lead / Frontend Developer) |
| **Untuk** | Klien UMKM (via Fadli — Admin Marketing) |
| **Tanggal** | 10 Agustus 2026 |
| **Dokumen Terkait** | ERD Backend UMKM, API Contract Backend UMKM, Runbook Tim Eksekusi 4 Minggu |

---

# 1. Ringkasan Produk (Overview)

Klien adalah pelaku UMKM yang menjual produk brand lokal dan saat ini belum memiliki platform penjualan digital yang terstruktur. Proses penjualan masih mengandalkan kanal manual (chat, marketplace pihak ketiga), sehingga pengelolaan katalog, transaksi, dan data pelanggan tidak terpusat.

Solusi yang akan dibangun adalah website brand product berbasis React SPA dengan backend Python, database PostgreSQL (NeonDB), caching Redis, autentikasi Clerk, dan pembayaran QRIS via Duitku. Website ini mencakup katalog produk publik, alur pembelian dengan pembayaran QRIS, panel admin untuk manajemen produk, serta sinkronisasi user otomatis melalui Clerk webhook. Target: live, stabil, dan sesuai ekspektasi klien dalam siklus 4 minggu.

# 2. Tujuan & Sasaran (Goals)

- Menyediakan etalase digital yang menampilkan brand product UMKM secara profesional.
- Memungkinkan customer melakukan pembelian langsung via website dengan pembayaran QRIS.
- Memusatkan pengelolaan katalog produk dan data transaksi dalam satu sistem.
- Memberikan pengalaman belanja yang cepat, stabil, dan mobile-friendly.
- Mendelivery website production-ready dalam 4 minggu kerja.

# 3. Pengguna & Peran (Users & Roles)

- **Admin (Owner UMKM) :** Mengelola katalog produk (CRUD), memantau transaksi masuk, mengelola stok. Akses via Admin JWT.
- **Customer :** Menjelajahi katalog produk, melakukan pembelian dan pembayaran QRIS, melihat status transaksi. Akses via Bearer JWT (Clerk).

# 4. Ruang Lingkup (Scope)

## 4.1 Termasuk (MVP)

- Landing page / halaman utama brand
- Katalog produk publik dengan detail produk
- Registrasi dan login customer (Clerk)
- Alur checkout dengan pembayaran QRIS (Duitku)
- Halaman status transaksi customer
- Panel admin: CRUD produk
- Webhook sync user (Clerk) dan payment callback (Duitku)
- Caching list produk via Redis (TTL 60 detik)
- Health check endpoint
- Deployment ke environment production

## 4.2 Di Luar Lingkup Awal / Fase Lanjutan

- Relasi item-level pada transaksi / keranjang belanja multi-item (lihat Bab 11)
- Riwayat transaksi admin / dashboard analitik (lihat Bab 11)
- Fitur pencarian dan filter produk lanjutan (lihat Bab 11)
- Multi-payment method selain QRIS (lihat Bab 11)
- Notifikasi email/WhatsApp otomatis (lihat Bab 11)
- Manajemen kupon/diskon (lihat Bab 11)

# 5. Asumsi & Batasan (Assumptions & Constraints)

- **Tech Stack (disepakati):** React SPA (polyrepo), Python (backend), PostgreSQL via NeonDB, Redis, Clerk (auth), Duitku/QRIS (payment).
- **Arsitektur:** Polyrepo — frontend dan backend di repository terpisah.
- **API Contract First:** Struktur JSON disepakati maksimal Minggu 2. Frontend dan backend berjalan paralel menggunakan mock data.
- **Scope Freeze:** Tidak ada penambahan fitur baru setelah Minggu 2. Semua permintaan baru masuk backlog Fase 2.
- **Mitigasi Aset:** Jika klien terlambat mengirim aset (logo/foto/katalog) di Hari 1–2, digunakan data dummy.
- **[Asumsi Pengembang]** `transaksi` saat ini belum memiliki relasi ke `produk` (tidak ada tabel `order_item`). Detail item-level ditambahkan di Minggu 3 jika diperlukan, atau masuk Fase 2.
- **[Asumsi Pengembang]** `TransaksiCreate` hanya menerima `total_harga` dan `payment_type` — validasi harga di sisi server berdasarkan kalkulasi klien belum ada di MVP.
- **Timeline:** 4 minggu. Post-launch support 7 hari.
- **Laporan klien:** 2x seminggu (Senin & Kamis), format: Selesai / Sedang Dikerjakan / Dibutuhkan dari Klien.
- **Respons bug kritis:** ≤ 4 jam.

# 6. Kebutuhan Fungsional (Functional Requirements)

## 6.1 Sistem — Autentikasi & User Sync

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **AUTH-1** | Sistem menerima Clerk webhook (Svix Signature) dan melakukan sync data user ke database (create/update). | **Wajib** |
| **AUTH-2** | Customer dapat mendaftar dan login menggunakan Clerk (email/social). | **Wajib** |
| **AUTH-3** | Customer dapat melihat profil sendiri melalui `GET /api/v1/users/me`. | **Wajib** |
| **AUTH-4** | Customer dapat memperbarui nama profil melalui `PATCH /api/v1/users/me`. | **Penting** |

## 6.2 Admin — Manajemen Produk

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **PROD-1** | Admin dapat membuat produk baru dengan nama, deskripsi, harga, stok, gambar URL, dan status aktif (`POST /api/v1/products`). | **Wajib** |
| **PROD-2** | Admin dapat mengedit produk yang sudah ada (`PUT /api/v1/products/{id}`). | **Wajib** |
| **PROD-3** | Admin dapat menghapus produk (`DELETE /api/v1/products/{id}`). | **Wajib** |
| **PROD-4** | Admin dapat melihat seluruh daftar produk termasuk yang tidak aktif. | **Wajib** |

## 6.3 Customer — Katalog Produk

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **KTLG-1** | Sistem menampilkan daftar produk aktif secara publik (`GET /api/v1/products`, cached 60 detik via Redis). | **Wajib** |
| **KTLG-2** | Sistem menampilkan halaman detail produk (`GET /api/v1/products/{id}`). | **Wajib** |
| **KTLG-3** | Sistem mendukung pagination pada list produk (`?limit=20&offset=0`). | **Wajib** |

## 6.4 Customer — Transaksi & Pembayaran QRIS

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **TRX-1** | Customer dapat membuat transaksi baru yang menginisiasi pembayaran QRIS (`POST /api/v1/transactions`). | **Wajib** |
| **TRX-2** | Sistem mengembalikan `qr_url` yang dapat ditampilkan sebagai QR code kepada customer. | **Wajib** |
| **TRX-3** | Customer dapat melihat status transaksi (`GET /api/v1/transactions/{id}`). | **Wajib** |
| **TRX-4** | Sistem menerima payment callback dari Duitku (HMAC Signature) dan memperbarui status transaksi (`PENDING → PAID / EXPIRED / FAILED`). | **Wajib** |

## 6.5 Sistem — Infrastruktur

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **SYS-1** | Sistem menyediakan health check endpoint (`GET /health`). | **Wajib** |
| **SYS-2** | Sistem mengembalikan error response terstandar (401, 403, 404, 422) dengan format konsisten. | **Wajib** |
| **SYS-3** | Sistem mendukung OpenAPI auto-generated documentation di `/docs`. | **Penting** |

# 7. Alur Pengguna Utama (Key User Flows)

## 7.1 Alur Pembelian Produk via QRIS (Happy Path)

1. Customer mengakses website dan menjelajahi katalog produk.
2. Customer membuka halaman detail produk.
3. Customer klik "Beli" (harus sudah login via Clerk; jika belum, diarahkan ke halaman login).
4. Sistem mengirim `POST /api/v1/transactions` dengan `total_harga` dan `payment_type: "qris"`.
5. Backend menginisiasi pembayaran ke Duitku, menyimpan transaksi dengan status "PENDING".
6. Sistem mengembalikan `TransaksiResponse` berisi `qr_url`.
7. Frontend menampilkan QR code QRIS kepada customer.
8. Customer membayar menggunakan aplikasi e-wallet / mobile banking.
9. Duitku mengirim payment callback ke `POST /api/v1/payments/webhook`.
10. Backend memverifikasi HMAC Signature, memperbarui status transaksi menjadi "PAID".
11. Customer melihat status transaksi berubah menjadi "PAID" di halaman status.

## 7.2 Alur Registrasi & Login Customer

1. Customer klik "Daftar" atau "Masuk" di website.
2. Clerk SDK menampilkan komponen autentikasi (sign-up / sign-in).
3. Customer menyelesaikan registrasi atau login.
4. Clerk mengirim webhook ke `POST /api/v1/auth/webhook`.
5. Backend memverifikasi Svix Signature, melakukan sync/create user ke database.
6. Customer diarahkan ke halaman utama dalam kondisi terautentikasi.

## 7.3 Alur Admin Mengelola Produk

1. Admin login via Clerk (role admin).
2. Admin mengakses panel admin produk.
3. Admin membuat produk baru: mengisi nama, deskripsi, harga, stok, URL gambar, status aktif.
4. Sistem menyimpan produk ke database (`POST /api/v1/products`).
5. Produk muncul di katalog publik (setelah cache Redis expired, maksimal 60 detik).

## 7.4 Alur Pembayaran Gagal / Expired

1. Customer membuat transaksi dan menerima QR code.
2. Customer tidak menyelesaikan pembayaran dalam batas waktu.
3. Duitku mengirim callback dengan status `EXPIRED` atau `FAILED`.
4. Backend memperbarui status transaksi.
5. Customer melihat status transaksi berubah menjadi "EXPIRED" atau "FAILED".

# 8. Model Data (High-Level)

| **Entitas** | **Field Utama** | **Keterangan** |
| --- | --- | --- |
| **users** | id (UUID PK), clerk_id (UK), email (UK), name, created_at, updated_at | Profil pengguna, sync dari Clerk webhook |
| **produk** | id (UUID PK), nama, deskripsi, harga (INTEGER), stok (INTEGER), gambar_url, is_active (BOOLEAN), created_at, updated_at | Katalog produk UMKM |
| **transaksi** | id (UUID PK), user_id (FK → users), total_harga (INTEGER), status, payment_type, midtrans_order_id (UK), qr_url, created_at, updated_at | Order + payment QRIS. Status enum: PENDING, PAID, EXPIRED, FAILED |
| [**transaksi_item**] | [id, transaksi_id (FK), produk_id (FK), qty, harga_satuan] | Fase Lanjutan — relasi item-level per transaksi |

**Catatan:**
- Relasi `users ||--o{ transaksi` (satu user, banyak transaksi).
- Relasi `produk` ke `transaksi` sengaja belum ada di MVP. Item-level detail masuk Fase 2.
- `users.clerk_id` — unique index, satu Clerk account = satu user.
- `transaksi.midtrans_order_id` — unique, idempotency key untuk payment.
- `transaksi.status` — enum di level aplikasi.
- Field dalam [tanda kurung siku] merupakan bagian dari fitur Fase Lanjutan (Bab 11).

# 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Responsivitas :** Mobile-friendly, tampilan optimal di perangkat mobile dan desktop.
- **Performa :** List produk di-cache Redis dengan TTL 60 detik. Target waktu load halaman < 3 detik.
- **Keamanan :** Autentikasi via Clerk (JWT), verifikasi Svix Signature pada auth webhook, verifikasi HMAC Signature pada payment webhook. Validasi input menggunakan Pydantic v2.
- **Stabilitas :** Health check endpoint tersedia. Error response terstandar (401, 403, 404, 422).
- **Deployment :** Production-ready deployment. Post-launch support 7 hari dengan SLA bug kritis ≤ 4 jam.

# 10. Integrasi Pihak Ketiga

| **Layanan** | **Fungsi** | **Catatan** |
| --- | --- | --- |
| **Clerk** | Autentikasi (sign-up/sign-in), manajemen user, JWT, webhook sync user | MVP — SDK frontend + webhook backend |
| **Duitku (QRIS)** | Payment gateway QRIS, generate QR code, payment callback | MVP — via `midtrans_order_id` sebagai idempotency key |
| **NeonDB (PostgreSQL)** | Database utama | MVP |
| **Redis** | Caching list produk (TTL 60s) | MVP |

# 11. Fitur Usulan / Fase Lanjutan

- **Keranjang Belanja Multi-Item (transaksi_item).** Menambahkan relasi item-level antara `transaksi` dan `produk` sehingga customer bisa membeli beberapa produk dalam satu transaksi. Terkait dengan entitas `transaksi_item`.

- **Dashboard Admin / Riwayat Transaksi.** Panel admin untuk melihat seluruh transaksi, filter by status/tanggal, dan ringkasan revenue.

- **Pencarian & Filter Produk Lanjutan.** Fitur search by nama, filter by kategori/range harga, sorting.

- **Multi-Payment Method.** Dukungan transfer bank, e-wallet selain QRIS, kartu kredit.

- **Notifikasi Otomatis.** Email atau WhatsApp otomatis ke customer saat status transaksi berubah (PAID, EXPIRED).

- **Manajemen Kupon & Diskon.** Sistem promo code dan diskon per produk atau per transaksi.

- **Kategori Produk.** Tabel kategori terpisah untuk pengelompokan produk.

# 12. Pertanyaan Terbuka / TBD

- Nama brand / nama website yang akan ditampilkan?
- Relasi item-level (`transaksi_item`) apakah masuk Minggu 3 atau ditunda ke Fase 2?
- Validasi harga di server — apakah backend memvalidasi `total_harga` terhadap harga produk aktual, atau frontend yang menghitung?
- Batas waktu expiry pembayaran QRIS (berapa menit)?
- Apakah admin bisa melihat daftar transaksi di MVP, atau hanya customer yang bisa cek status transaksi sendiri?
- Role admin ditentukan di Clerk (metadata) atau hardcode di backend?
- Upload gambar produk — admin upload file atau paste URL? Jika upload, storage di mana (S3/Cloudinary)?
- Domain production yang akan digunakan?
- Apakah perlu halaman "Tentang Kami" / "Kontak" di MVP?
- Desain logo dan aset brand sudah tersedia atau masih dalam proses?

# 13. Glosarium

- **MVP (Minimum Viable Product) :** Versi produk pertama dengan fitur inti minimum yang layak dirilis.
- **SPA (Single Page Application) :** Arsitektur frontend di mana navigasi halaman tidak memuat ulang seluruh halaman.
- **Polyrepo :** Strategi penyimpanan kode di mana frontend dan backend berada di repository terpisah.
- **API Contract :** Kesepakatan format request/response JSON antara frontend dan backend sebelum coding dimulai.
- **Scope Freeze :** Titik di mana tidak ada fitur baru yang boleh ditambahkan ke scope MVP.
- **QRIS :** Standar QR code pembayaran nasional Indonesia.
- **Clerk :** Layanan autentikasi pihak ketiga untuk manajemen user, sign-up/sign-in, dan JWT.
- **Svix Signature :** Mekanisme verifikasi keaslian webhook dari Clerk.
- **HMAC Signature :** Mekanisme verifikasi keaslian callback dari payment gateway.
- **Idempotency Key :** Identifier unik yang mencegah duplikasi transaksi jika callback diterima lebih dari sekali.
- **Redis :** In-memory data store yang digunakan untuk caching data agar respons API lebih cepat.
- **NeonDB :** Layanan PostgreSQL serverless cloud-native.
- **Pydantic v2 :** Library validasi data di Python yang digunakan untuk memvalidasi request body API.
- **Mock Data :** Data tiruan yang digunakan frontend saat backend belum siap, berdasarkan schema API Contract.
- **UAT (User Acceptance Testing) :** Pengujian akhir oleh klien untuk memastikan sistem sesuai ekspektasi sebelum go-live.
- **E2E (End-to-End) :** Pengujian alur lengkap dari frontend hingga backend dan sebaliknya.

---

**--- Akhir Dokumen v0.1 ---**
