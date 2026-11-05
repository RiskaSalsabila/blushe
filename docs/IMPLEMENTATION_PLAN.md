# Blushé Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web Sistem Pendukung Keputusan (SPK) rekomendasi produk dan shade blush on "Blushé" berbasis Next.js 15+, TypeScript, CSS Design Tokens acuan prototype, SQLite lokal, dan algoritma VIKOR terisolasi.

**Architecture:** Fullstack Next.js (App Router) di `D:\IF23\SMT 7\.ika\TA\blushe\app`. Frontend publik mereproduksi 100% desain dan alur wizard 4-langkah dari `prototype/index.html`. Modul VIKOR matematika murni terpisah di `lib/vikor.ts` dengan unit test Vitest. Database SQLite lokal (`blushe.db`) menangani katalog Merek, Produk, Shade, Kriteria, dan Nilai Alternatif serta autentikasi admin.

**Tech Stack:** Next.js 15+ (React 19), TypeScript, Native CSS Modules / Tokens, `better-sqlite3`, Vitest, bcryptjs.

**Spec:** [SYSTEM_DESIGN_SPEC.md](file:///D:/IF23/SMT%207/.ika/TA/blushe/docs/SYSTEM_DESIGN_SPEC.md)

## Global Constraints
- Target folder implementasi: `D:\IF23\SMT 7\.ika\TA\blushe\app`
- Folder acuan `prototype/` tidak boleh diubah atau dihapus.
- Styling wajib mempertahankan token: `--ink: #302521`, `--muted: #84736d`, `--rose: #b96f70`, `--rose-dark: #915455`, `--cream: #fbf8f4`, `--paper: #fffdfa`, `--line: #eee4de`, font Playfair Display & DM Sans.
- Seluruh data contoh fiktif wajib memiliki label `DATA SIMULASI` / `DEMO`.
- Penanganan zero denominator pada VIKOR wajib menghasilkan nilai terdefinisi (bukan NaN/Infinity).

---

### Task 1: Scaffolding Project & Environment Setup

**Files:**
- Create: `D:\IF23\SMT 7\.ika\TA\blushe\app\package.json`
- Create: `D:\IF23\SMT 7\.ika\TA\blushe\app\tsconfig.json`
- Create: `D:\IF23\SMT 7\.ika\TA\blushe\app\next.config.ts`
- Create: `D:\IF23\SMT 7\.ika\TA\blushe\app\vitest.config.ts`

**Interfaces:**
- Produces: Project Next.js + Vitest yang siap di-build dan diuji (`npm run dev`, `npm test`).

- [ ] **Step 1: Inisialisasi package.json dengan dependencies**
Tulis `package.json` dengan scripts `dev`, `build`, `start`, dan `test` (vitest), dependensi `better-sqlite3`, `bcryptjs`, dan devDependencies `@types/better-sqlite3`, `@types/bcryptjs`, `vitest`.

- [ ] **Step 2: Buat konfigurasi tsconfig.json dan next.config.ts**
Path aliases `@/*` mengarah ke `./src/*`.

- [ ] **Step 3: Setup vitest.config.ts**
Konfigurasikan environment Node dan path alias.

- [ ] **Step 4: Jalankan npm install di folder app**
Run: `npm install` di `D:\IF23\SMT 7\.ika\TA\blushe\app`
Expected: Dependencies terinstal tanpa error.

---

### Task 2: Modul VIKOR Matematika Terisolasi & Unit Tests

**Files:**
- Create: `src/lib/vikor.ts`
- Test: `tests/vikor.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface Criterion {
    id: number;
    code: string;
    name: string;
    type: 'benefit' | 'cost';
    weight: number;
  }
  export interface Alternative {
    id: number;
    name: string;
    scores: Record<string, number>; // key: criterion.code
  }
  export interface VikorResult {
    alternativeId: number;
    name: string;
    S: number;
    R: number;
    Q: number;
    rank: number;
    isCompromiseSolution: boolean;
  }
  export function calculateVikor(
    alternatives: Alternative[],
    criteria: Criterion[],
    v?: number // default 0.5
  ): { ranked: VikorResult[]; fStar: Record<string, number>; fMinus: Record<string, number>; DQ: number; c1Pass: boolean; c2Pass: boolean };
  ```

- [ ] **Step 1: Tulis unit test untuk VIKOR di `tests/vikor.test.ts`**
Uji:
1. Perhitungan standar dengan data contoh matriks 3 alternatif x 3 kriteria.
2. Penanganan zero denominator ($f^* = f^-$).
3. Penanganan hanya 1 alternatif ($Q = 0$).
4. Kriteria campuran benefit dan cost.

- [ ] **Step 2: Jalankan vitest untuk memverifikasi test gagal**
Run: `npm test`
Expected: FAIL (Cannot find module `src/lib/vikor.ts`).

- [ ] **Step 3: Implementasikan fungsi `calculateVikor` di `src/lib/vikor.ts`**
Implementasikan $f^*, f^-$, normalisasi jarak berbobot, $S_i, R_i, Q_i$, serta pengecekan kondisi kompromi C1 & C2. Tangani pembagian dengan nol dengan nilai aman 0.

- [ ] **Step 4: Jalankan vitest untuk memverifikasi seluruh test lulus**
Run: `npm test`
Expected: 100% tests PASS.

---

### Task 3: Database SQLite Schema & Seed Data

**Files:**
- Create: `src/lib/db.ts`
- Create: `src/lib/seed.ts`
- Test: `tests/db.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export function getDb(): import('better-sqlite3').Database;
  export function runMigrations(): void;
  export function seedDemoData(): void;
  ```

- [ ] **Step 1: Tulis unit test database di `tests/db.test.ts`**
Uji pembuatan tabel `brands`, `products`, `product_shades`, `criteria`, `alternative_scores`, `admin_users`, dan pastikan seeding berjalan idempotent.

- [ ] **Step 2: Implementasikan `src/lib/db.ts`**
Buat inisialisasi koneksi `better-sqlite3` ke `blushe.db` dengan WAL mode dan fungsi pembuatan tabel sesuai `SYSTEM_DESIGN_SPEC.md`.

- [ ] **Step 3: Implementasikan `src/lib/seed.ts`**
Isi database dengan data merek, produk, shade simulasi dari `prototype/index.html` (Petal Theory, Mellow Muse, Dear Petal, Rose Atelier, Bloom Theory), kriteria awal (C1, C2, C3, C4), dan akun admin default (`admin` / hash bcrypt).

- [ ] **Step 4: Jalankan test database**
Run: `npm test tests/db.test.ts`
Expected: PASS, database `blushe.db` terbentuk dengan tabel lengkap.

---

### Task 4: Porting Visual Tokens, Global Styles, dan Font Setup

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

**Interfaces:**
- Consumes: CSS Variables & styling dari `prototype/index.html`.
- Produces: Shell aplikasi dengan font Playfair Display & DM Sans, warna warm rose & cream, dan reset CSS.

- [ ] **Step 1: Buat `src/app/globals.css`**
Pindahkan seluruh token warna (`--ink`, `--muted`, `--rose`, `--rose-dark`, `--rose-light`, `--cream`, `--paper`, `--line`, `--green`, `--shadow`) dan class styling komponen (hero, compact blush, floating swatch, wizard, choice cards, product card, modal, dll.).

- [ ] **Step 2: Buat `src/app/layout.tsx`**
Setup metadata judul "Blushé — Temukan shade yang terasa milikmu", import Google Fonts `Playfair Display` dan `DM Sans`.

---

### Task 5: Komponen Frontend Pengguna (Wizard 4 Langkah & Hasil Rekomendasi)

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Hero.tsx`
- Create: `src/components/HowItWorks.tsx`
- Create: `src/components/Wizard.tsx`
- Create: `src/components/ProductDetailModal.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/api/recommend/route.ts`

**Interfaces:**
- Wizard Props & State:
  ```ts
  interface UserProfileState {
    tone: string | null;
    undertone: string | null;
    colors: string[];
    formula: string | null;
    budget: number | null;
  }
  ```
- Produces: Halaman pengguna interaktif yang berfungsi dari Step 0 (Skin tone & Undertone), Step 1 (Warna & Formula), Step 2 (Budget), hingga Step 3 (Hasil Rekomendasi dengan rank, harga, formula, dan modal detail).

- [ ] **Step 1: Buat komponen `Navbar.tsx`, `Hero.tsx`, dan `HowItWorks.tsx`**
Pastikan ilustrasi CSS compact blush, floating swatches, dan anchor scrolling bekerja persis seperti prototype.

- [ ] **Step 2: Buat komponen `Wizard.tsx` dengan 4 langkah interaktif**
State manajemen:
- Step 0: Single select tone (Fair, Light, Medium, Tan, Deep) & undertone (Warm, Cool, Neutral).
- Step 1: Multi select colors & single select formula (termasuk "Bebas").
- Step 2: Single select budget options.
- Step 3: Tampilan summary pills, kartu produk hasil rekomendasi, badge `DATA SIMULASI`, empty state jika filter terlalu ketat, tombol "Ubah preferensi", dan "Mulai dari awal".

- [ ] **Step 3: Buat `ProductDetailModal.tsx`**
Dapat dibuka dari tombol "Lihat detail" pada setiap kartu produk, ditutup via tombol X atau klik di luar modal (backdrop), serta penekanan tombol Escape.

- [ ] **Step 4: Buat `src/app/api/recommend/route.ts`**
Menerima payload preferensi pengguna, menjalankan filter formula & budget pada database/seed, mengeksekusi perhitungan VIKOR, dan mengembalikan hasil ranking terurut.

- [ ] **Step 5: Hubungkan ke `src/app/page.tsx` dan verifikasi di browser**
Run: `npm run dev` dan buka `http://localhost:3000`
Verifikasi: Seluruh langkah wizard dapat dioperasikan, kartu dipilih, dan modal terbuka.

---

### Task 6: Modul Pengelola (Admin Dashboard & CRUD)

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/admin/criteria/page.tsx`
- Create: `src/app/admin/scores/page.tsx`
- Create: `src/app/admin/vikor/page.tsx`
- Create: `src/app/api/auth/route.ts`
- Create: `src/app/api/admin/products/route.ts`
- Create: `src/app/api/admin/criteria/route.ts`
- Create: `src/app/api/admin/scores/route.ts`

**Interfaces:**
- Produces: Antarmuka pengelola katalog produk-shade, parameter kriteria/bobot, matriks skor alternatif, serta layar verifikasi kalkulasi VIKOR.

- [ ] **Step 1: Implementasikan Login & Auth Session (`src/app/admin/login/page.tsx` & `src/app/api/auth/route.ts`)**
Form login admin sederhana menggunakan username dan password yang diverifikasi terhadap database `admin_users`.

- [ ] **Step 2: Implementasikan Dashboard Admin (`src/app/admin/page.tsx`)**
Kartu ringkasan total brand, produk, shade alternatif, dan kriteria aktif.

- [ ] **Step 3: Implementasikan CRUD Produk & Shade (`src/app/admin/products/page.tsx`)**
Menambah, mengedit, dan menonaktifkan produk dan shade (formula, warna hex, harga).

- [ ] **Step 4: Implementasikan Pengelolaan Kriteria & Bobot (`src/app/admin/criteria/page.tsx`)**
Tabel kriteria C1–C4, pengeditan bobot $w_j$, arah benefit/cost, dan validasi $\sum w_j = 1.0$.

- [ ] **Step 5: Implementasikan Matriks Skor Alternatif (`src/app/admin/scores/page.tsx`)**
Grid pengisian nilai kriteria per produk-shade.

- [ ] **Step 6: Implementasikan Layar Audit VIKOR (`src/app/admin/vikor/page.tsx`)**
Simulasi kalkulasi VIKOR langkah-demi-langkah dengan tabel nilai $f^*, f^-$, tabel matriks ternormalisasi, nilai $S_i, R_i, Q_i$, serta pengecekan kondisi kompromi C1 & C2.

---

### Task 7: Verifikasi Menyeluruh, Linting, & Dokumentasi Handoff

**Files:**
- Test: Seluruh unit test dan build Next.js.
- Create: `D:\IF23\SMT 7\.ika\TA\blushe\app\README.md` (Panduan menjalankan & instruksi pengujian).

- [ ] **Step 1: Jalankan seluruh unit test**
Run: `npm test`
Expected: Seluruh test algoritma VIKOR dan database pass.

- [ ] **Step 2: Jalankan build Next.js**
Run: `npm run build`
Expected: Build selesai tanpa error TypeScript atau linting.

- [ ] **Step 3: Tulis panduan lengkap di `app/README.md`**
Sertakan cara `npm install`, `npm run dev`, `npm test`, akun default admin, serta catatan pemisahan data demo simulasi.
