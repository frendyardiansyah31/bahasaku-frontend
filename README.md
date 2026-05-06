# BahasaKu — Frontend

Platform latihan Bahasa Indonesia berbasis web. Dibangun dengan React 19 + Vite, menggunakan arsitektur **Modular Layered** dan autentikasi berbasis **JWT**.

---

## Daftar Isi

1. [Tech Stack](#tech-stack)
2. [Struktur Folder](#struktur-folder)
3. [Arsitektur: Modular Layered](#arsitektur-modular-layered)
4. [Setup Awal](#setup-awal)
5. [Penjelasan Tiap File](#penjelasan-tiap-file)
6. [Alur Data (Data Flow)](#alur-data-data-flow)
7. [Mau Ubah Sesuatu? Edit di Sini](#mau-ubah-sesuatu-edit-di-sini)
8. [Panduan Error & Troubleshooting](#panduan-error--troubleshooting)
9. [Cara Tambah Fitur Baru](#cara-tambah-fitur-baru)

---

## Tech Stack

| Teknologi | Versi | Peran |
|---|---|---|
| **React** | 19 | UI framework |
| **Vite** | 6 | Build tool & dev server |
| **React Router** | 6 | Client-side routing |
| **Zustand** | 5 | Global state management |
| **Axios** | 1 | HTTP client + interceptor JWT |
| **Bootstrap** | 5 | CSS framework (layout & komponen) |
| **Bootstrap Icons** | 1.11 | Icon library |
| **CSS Modules** | — | Scoped custom styles per modul |

**Backend API:** `https://frendyardiansyah31-bahasaku-backend.hf.space`

---

## Struktur Folder

```
frontend/
├── .env                                # Environment variable (URL backend)
├── .env.example                        # Template .env untuk tim
├── index.html                          # HTML entry point, load font Sora
├── package.json                        # Daftar dependency
├── vite.config.js                      # Konfigurasi Vite + alias @/
│
└── src/
    │
    ├── main.jsx                        # Entry point: CSS global, BrowserRouter, init auth
    ├── App.jsx                         # Root komponen, render AppRoutes
    │
    ├── modules/                        # Satu folder per fitur
    │   │
    │   ├── auth/                       # Modul autentikasi
    │   │   ├── authService.js          # Axios calls ke endpoint auth
    │   │   ├── authStore.js            # Zustand store (auth + onboarding actions)
    │   │   ├── auth.module.css         # CSS Module halaman register & login
    │   │   ├── components/
    │   │   │   ├── RegisterForm.jsx    # Form pendaftaran
    │   │   │   └── LoginForm.jsx       # Form login
    │   │   └── pages/
    │   │       ├── RegisterPage.jsx    # Halaman daftar (split layout)
    │   │       └── LoginPage.jsx       # Halaman masuk (split layout)
    │   │
    │   ├── onboarding/                 # Modul pengisian profil awal
    │   │   ├── onboardingService.js    # Axios call ke POST /api/user/onboarding/
    │   │   ├── onboarding.module.css   # CSS Module wizard onboarding
    │   │   └── pages/
    │   │       └── OnboardingPage.jsx  # Wizard 3 langkah (negara, level, sukses)
    │   │
    │   └── dashboard/                  # Modul halaman utama
    │       ├── dashboardService.js     # Axios call ke GET /api/dashboard/
    │       ├── dashboard.module.css    # CSS Module halaman dashboard
    │       └── pages/
    │           └── DashboardPage.jsx   # Dashboard (sidebar, XP, skill, streak, topik)
    │
    ├── shared/                         # Kode yang dipakai oleh semua modul
    │   ├── http.js                     # Axios instance + interceptor JWT
    │   ├── storage.js                  # Helper baca/tulis token di localStorage
    │   └── styles/
    │       ├── global.css              # CSS global (font body)
    │       └── notFound.module.css     # CSS Module halaman 404
    │
    └── routes/                         # Konfigurasi routing
        ├── AppRoutes.jsx               # Semua definisi route
        ├── PrivateRoute.jsx            # Guard: cek autentikasi + onboarding
        └── PublicRoute.jsx             # Guard: redirect jika sudah login
```

---

## Arsitektur: Modular Layered

### Konsep dasar

Kode diorganisir berdasarkan **fitur/modul**, bukan berdasarkan jenis file. Semua yang berkaitan dengan satu fitur ada di satu folder.

```
modules/auth/           ← semua kode auth di sini
  authService.js        ← layer data: HTTP calls
  authStore.js          ← layer state: Zustand
  components/           ← layer UI: form & komponen
  pages/                ← layer UI: halaman lengkap
```

### Tiga lapisan dalam setiap modul

| Layer | File | Tanggung Jawab |
|---|---|---|
| **Data** | `*Service.js` | Hanya kirim/terima data dari API. Tidak tahu soal state atau UI. |
| **State** | `*Store.js` | Simpan state global, jalankan business logic. Panggil service, update state. |
| **UI** | `components/`, `pages/` | Tampilkan data dari store/service, tidak panggil API langsung. |

### Kode bersama (shared/)

Kode yang dipakai oleh semua modul masuk ke `shared/`:

| File | Isi |
|---|---|
| `shared/http.js` | Axios instance — **infrastruktur HTTP** (interceptor, token attach) |
| `shared/storage.js` | localStorage helper — **penyimpanan token** |
| `shared/styles/global.css` | CSS global — **font body aplikasi** |
| `shared/styles/notFound.module.css` | CSS Module — **halaman 404** |

### Kenapa arsitektur ini?

**Mudah dipahami:** Semua kode auth ada di `modules/auth/`. Tidak perlu loncat ke 3 folder berbeda.

**Tidak ada aturan tersembunyi:** Import langsung dari file, tidak ada barrel export wajib yang harus dipelajari.

**Mudah ditambah fitur baru:** Buat `modules/topics/`, ikuti pola yang sama, selesai.

**Mudah dihapus fitur:** Hapus `modules/auth/`, tidak ada file lain yang rusak (selain route).

---

## Kenapa bukan Redux? Kenapa Axios bukan Fetch?

**Zustand vs Redux:** Redux butuh action, reducer, selector terpisah — terlalu verbose. Zustand: state + action dalam satu file, cocok untuk tim yang ada anggota baru.

**Axios vs Fetch:** Axios bisa pasang interceptor untuk otomatis attach token dan handle 401 di satu tempat. Fetch tidak throw error untuk status 4xx/5xx sehingga error handling lebih panjang.

---

## Setup Awal

### Prasyarat

- Node.js versi 18 atau lebih baru
- npm versi 9 atau lebih baru

### Langkah-langkah

**1. Clone dan masuk ke folder frontend**

```bash
cd frontend
```

**2. Install dependency**

```bash
npm install
```

**3. Buat file `.env`**

```bash
# Isi file .env
VITE_API_URL=https://frendyardiansyah31-bahasaku-backend.hf.space
```

> File `.env` tidak di-commit ke git. Gunakan `.env.example` sebagai template untuk anggota tim baru.

**4. Jalankan dev server**

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

**5. Build untuk production**

```bash
npm run build
```

Output ada di folder `dist/`.

---

## Penjelasan Tiap File

### `index.html`

HTML satu-satunya di project. Tugasnya:
- Memuat font **Sora** dari Google Fonts
- Menyediakan `<div id="root">` tempat React me-render aplikasi
- Memanggil `/src/main.jsx` sebagai entry point JavaScript

Tidak perlu diedit kecuali mau ganti font atau tambah meta tag.

---

### `vite.config.js`

Konfigurasi build tool. Saat ini hanya aktifkan plugin React dan alias `@` → `src/`.

```js
// Contoh penggunaan alias
import axiosInstance from '@/shared/http';
// sama dengan:
import axiosInstance from '../../shared/http';
```

---

### `src/main.jsx`

Entry point aplikasi. Tugas utama:
- Import Bootstrap CSS dan Bootstrap Icons secara global
- Import `shared/styles/global.css` untuk font `Sora` pada `body`
- Sediakan `<BrowserRouter>` untuk React Router
- Panggil `initAuth()` satu kali saat app pertama dibuka (cek token di localStorage)
- Render `<App>` di dalam `<StrictMode>`

**Tambah CSS global baru di sini**, bukan di file komponen lain.

---

### `src/App.jsx`

Komponen root yang sangat simpel — hanya render `<AppRoutes />`. Kalau nanti butuh error boundary global, tambahkan di sini.

---

### `src/shared/storage.js`

Helper murni untuk baca/tulis localStorage. Tidak ada logika bisnis di sini.

| Fungsi | Kegunaan |
|---|---|
| `saveTokens(access, refresh)` | Simpan kedua token setelah login/register |
| `getAccessToken()` | Ambil access token (dipakai di interceptor) |
| `getRefreshToken()` | Ambil refresh token (dipakai saat 401) |
| `saveUser(user)` | Simpan object user (setelah login/register/onboarding) |
| `getUser()` | Ambil object user (dipakai di `initAuth`) |
| `clearTokens()` | Hapus semua data (dipakai saat logout) |

**Key localStorage yang digunakan:**
- `bahasaku_access` — JWT access token
- `bahasaku_refresh` — JWT refresh token
- `bahasaku_user` — data user (JSON)

> **Catatan:** Untuk keamanan lebih baik, ganti penyimpanan ke httpOnly cookie sehingga JavaScript tidak bisa membaca token secara langsung.

---

### `src/shared/http.js`

Inti dari komunikasi HTTP. Semua request ke backend harus melalui file ini.

**Request Interceptor** — berjalan sebelum setiap request dikirim:
```
Request keluar → cek localStorage → ada token? → tambahkan header Authorization: Bearer <token>
```

**Response Interceptor** — berjalan setelah setiap response diterima:
```
Response 401 masuk
  └─ punya refresh token?
       ├─ YA  → POST /api/auth/token/refresh/
       │          ├─ berhasil → simpan token baru → ulangi request asal
       │          └─ gagal   → hapus semua token → redirect /login
       └─ TIDAK → hapus token → redirect /login
```

**Mekanisme antrian** — Jika ada beberapa request gagal bersamaan saat token expired, hanya 1 refresh yang dikirim. Request lain menunggu dalam antrian (`failedQueue`) dan di-retry setelah refresh berhasil.

---

### `src/shared/styles/global.css`

CSS global yang diimport di `main.jsx`. Saat ini hanya menetapkan font `Sora` untuk seluruh `body`. Tambahkan style global lain di sini jika diperlukan.

---

### `src/shared/styles/notFound.module.css`

CSS Module untuk halaman 404 yang dirender oleh rute `*` di `AppRoutes.jsx`.

---

### `src/modules/auth/authService.js`

Daftar semua endpoint auth. File ini hanya berisi axios calls — tidak ada logika, tidak ada state.

| Fungsi | Method | Endpoint |
|---|---|---|
| `register(data)` | POST | `/api/auth/register/` |
| `login(data)` | POST | `/api/auth/login/` |
| `refreshToken(refresh)` | POST | `/api/auth/token/refresh/` |
| `logout(refresh)` | POST | `/api/auth/logout/` |

---

### `src/modules/auth/authStore.js`

Otak dari fitur auth dan onboarding. Dibangun dengan Zustand.

**State:**

| State | Tipe | Keterangan |
|---|---|---|
| `user` | `object \| null` | Data user yang sedang login |
| `isAuthenticated` | `boolean` | True jika sudah login & token valid |
| `isLoading` | `boolean` | True saat request sedang berjalan |
| `error` | `string \| null` | Pesan error terakhir |

**Actions:**

| Action | Keterangan |
|---|---|
| `initAuth()` | Dipanggil saat app load. Cek token di localStorage, set `isAuthenticated`. |
| `registerUser(data)` | Panggil API register, simpan token & user, update state. |
| `loginUser(data)` | Panggil API login, simpan token & user, update state. |
| `logoutUser()` | Panggil API logout, hapus token, reset semua state ke awal. |
| `onboardUser(data)` | Kirim `country` + `initial_level` ke API, update `user` di state & storage. |
| `clearError()` | Reset `error` ke null (dipanggil saat user mulai mengetik). |

**Fungsi internal `parseDrfError`** — Django REST Framework bisa mengembalikan error dalam berbagai format. Fungsi ini menormalisasi semuanya jadi satu string pesan:
- `{ detail: "..." }` → diambil langsung
- `{ email: ["error"], password: ["error"] }` → digabung jadi satu string
- Network error → pakai pesan fallback

---

### `src/modules/auth/auth.module.css`

CSS Module untuk styling halaman Register dan Login. Colocated di dalam modul `auth/` agar mudah ditemukan.

**Class-class penting:**

| Class | Kegunaan |
|---|---|
| `.authWrapper` | Container utama, `min-height: 100vh`, flex row |
| `.brandPanel` | Panel kiri, background gradient #124663 |
| `.formPanel` | Panel kanan, background putih/abu |
| `.formContainer` | Card form, max-width 440px, border-radius 16px |
| `.inputField` | Styling input (border, focus ring biru) |
| `.inputField.isInvalid` | Border merah saat validasi gagal |
| `.submitBtn` | Tombol submit, background #124663 |
| `.alertError` | Alert merah untuk error dari API |
| `.togglePassword` | Tombol show/hide password |

---

### `src/modules/auth/components/RegisterForm.jsx`

Komponen form pendaftaran. Alur kerja:

```
User ketik → handleChange → update state lokal form
User klik "Daftar" → handleSubmit:
  1. Validasi client-side (validate())
     └─ ada error? → tampilkan di bawah field, STOP
  2. Panggil registerUser() dari store
     ├─ berhasil → navigate('/onboarding')
     └─ gagal    → store.error terisi → tampil di alert merah atas form
```

**Validasi yang dilakukan:**
- `name` — wajib diisi
- `email` — wajib + format email valid
- `password` — wajib + minimal 8 karakter
- `password_confirm` — wajib + harus sama dengan `password`
- `terms` — checkbox harus dicentang

Field `terms` tidak dikirim ke API — hanya untuk validasi UI.

---

### `src/modules/auth/components/LoginForm.jsx`

Komponen form login. Alur kerja:

```
User klik "Masuk" → handleSubmit:
  1. Validasi client-side
  2. Panggil loginUser() dari store
     └─ berhasil → getRedirectPath(user):
          ├─ is_onboarded === false → /onboarding
          ├─ role === 'admin'       → /admin
          └─ role === 'user'        → /dashboard
```

---

### `src/modules/auth/pages/RegisterPage.jsx` & `src/modules/auth/pages/LoginPage.jsx`

Halaman wrapper. Tugasnya hanya menyusun layout, tidak ada logika bisnis.

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Panel Kiri (branding)  │  Panel Kanan (form) │
│  Hanya tampil ≥ 768px   │  Selalu tampil      │
└─────────────────────────────────────────────┘
```

Di mobile (<768px): panel kiri tersembunyi, hero biru muncul di atas form.

---

### `src/modules/onboarding/onboardingService.js`

Service layer onboarding. Satu baris — hanya kirim data ke API.

| Fungsi | Method | Endpoint |
|---|---|---|
| `onboard(data)` | POST | `/api/user/onboarding/` |

`data` berisi `{ country, initial_level }`. `initial_level` hanya menerima `"A1"` atau `"A2"` sesuai API spec.

---

### `src/modules/onboarding/pages/OnboardingPage.jsx`

Wizard 3 langkah pengisian profil pertama. Dipanggil sekali setelah register selesai.

**Struktur komponen (semua dalam satu file):**

| Komponen | Peran |
|---|---|
| `OnboardingLayout` | Wrapper layout: header desktop (brand + StepBar) + card (mobileTop + stepIcon + children) |
| `StepBar` | Indikator langkah berupa circles + lines — hanya tampil di desktop |
| `StepDots` | Indikator langkah berupa pill dots — hanya tampil di mobile |

**Alur wizard:**

```
Step 1 — Greeting
  → tampilkan nama dari authStore.user.name
  → tombol Lanjut

Step 2 — Pilih Negara
  → grid 8 negara + search filter
  → tombol Kembali / Lanjut (disabled jika belum pilih)

Step 3 — Pilih Level
  → dua pilihan: A1 (Pemula) atau A2 (Dasar)
  → tombol Kembali / Mulai Belajar
  → klik → onboardUser({ country, initial_level }) dari authStore
  → berhasil → Step 4 (sukses)

Step 4 — Sukses
  → tampilkan ringkasan: nama, negara, level
  → tombol navigasi ke /dashboard
```

**Kenapa hanya A1 dan A2?** — API spec (`/api/user/onboarding/`) hanya menerima nilai `"A1"` atau `"A2"` untuk `initial_level`. Level lanjutan (B1/B2/C1/C2) tidak tersedia saat onboarding.

---

### `src/modules/onboarding/onboarding.module.css`

CSS Module untuk wizard onboarding. Mendukung tampilan desktop dan mobile dalam satu file.

**Responsive strategy:**
- Desktop: `.header` (brand + StepBar circles) di atas card, `.mobileTop` dan `.stepIcon` disembunyikan
- Mobile (`≤767px`): `.header` disembunyikan, card melebar full-screen, `.mobileTop` (brand + StepDots) dan `.stepIcon` tampil di dalam card
- Nav tombol didorong ke bawah dengan `margin-top: auto` di flex column card

---

### `src/modules/dashboard/dashboardService.js`

Service layer dashboard. Satu baris — fetch semua data dashboard dari satu endpoint.

| Fungsi | Method | Endpoint |
|---|---|---|
| `getDashboard()` | GET | `/api/dashboard/` |

Token JWT otomatis dilampirkan oleh interceptor di `shared/http.js`.

---

### `src/modules/dashboard/pages/DashboardPage.jsx`

Halaman utama setelah onboarding selesai. Mengonsumsi seluruh data dari `GET /api/dashboard/`.

**Struktur komponen (semua dalam satu file):**

| Konstanta/Helper | Peran |
|---|---|
| `SKILL_LABELS` | Map skill enum API (`kosakata/grammar/menyimak`) ke label Indonesia |
| `SKILL_COLOR` | Map skill ke CSS class warna (dot & progress bar) |
| `TOPIC_BG` | Map skill ke CSS class background icon topik rekomendasi |
| `TOPIC_ICON` | Map skill ke emoji icon |
| `NAV_ITEMS` | Array data sidebar nav (to, label, SVG icon) |
| `getGreeting()` | Sapa berdasarkan jam lokal: pagi/siang/sore/malam |
| `getInitials(name)` | Ambil 2 huruf pertama nama untuk avatar sidebar |
| `skillSubText(s)` | Tampilkan delta minggu ini atau status skill |

**Sections yang dirender:**

```
Sidebar
  ├─ Brand (logo + nama)
  ├─ Nav (NavLink — aktif otomatis by React Router)
  └─ User info (avatar initials, nama, level) + tombol Keluar

Main
  ├─ Topbar: greeting h1 + tanggal/topik baru + streak pill
  ├─ XP Card: level CEFR, progress bar XP, total XP circle
  ├─ Skills Grid: 3 card (kosakata, grammar, menyimak) + skor + bar + delta
  ├─ Streak Card: 7 hari terakhir (done/today/empty)
  └─ Bottom 2-col:
       ├─ Rekomendasi Topik: daftar topik dari algoritma adaptif
       └─ Ringkasan Aktivitas: sesi, soal, rata-rata skor, CEFR, skill terkuat, XP hari ini
```

**Loading & Error state:**
- Saat fetch berlangsung → full-screen "Memuat..."
- Jika fetch gagal → full-screen pesan error

**Logout:** Tombol "Keluar" di sidebar memanggil `logoutUser()` dari authStore. State `isAuthenticated` berubah ke `false`, PrivateRoute otomatis redirect ke `/login`.

---

### `src/modules/dashboard/dashboard.module.css`

CSS Module untuk halaman dashboard. Semua style colocated, tidak ada inline CSS di JSX kecuali nilai dinamis dari API (lebar XP bar dan skill bar dalam persen).

**Class helper tambahan:**

| Class | Kegunaan |
|---|---|
| `.skillKosakata/Grammar/Menyimak` | Warna background dot & progress bar per skill |
| `.topicBgKosakata/Grammar/Menyimak` | Warna background icon topik rekomendasi |
| `.sdayDone / .sdayToday / .sdayEmpty` | State hari di streak card |
| `.badgeBlue / .badgeGreen` | Badge CEFR dan skill terkuat di ringkasan aktivitas |

---

### `src/routes/PrivateRoute.jsx`

Guard untuk route yang memerlukan login.

```
User akses /dashboard:
  ├─ isAuthenticated === false → redirect /login (simpan path asal)
  ├─ isAuthenticated === true + is_onboarded === false + bukan di /onboarding
  │    → redirect /onboarding
  └─ isAuthenticated === true + is_onboarded === true → render halaman
```

---

### `src/routes/PublicRoute.jsx`

Guard untuk route yang hanya boleh diakses tamu (belum login).

```
User akses /login:
  ├─ isAuthenticated === true  → redirect /dashboard
  └─ isAuthenticated === false → render halaman login
```

---

### `src/routes/AppRoutes.jsx`

Pusat konfigurasi semua route. Peta route saat ini:

| Path | Guard | Halaman |
|---|---|---|
| `/register` | PublicRoute | RegisterPage |
| `/login` | PublicRoute | LoginPage |
| `/onboarding` | PrivateRoute | OnboardingPage |
| `/dashboard` | PrivateRoute | DashboardPage |
| `/topics` | PrivateRoute | TopicsPage (placeholder) |
| `/admin` | PrivateRoute | AdminPage (placeholder) |
| `/` | — | Redirect ke /dashboard |
| `*` | — | 404 Page |

---

## Alur Data (Data Flow)

### Alur Login

```
LoginForm
  │  user klik "Masuk"
  ▼
authStore.loginUser({ email, password })
  │  panggil
  ▼
authService.login({ email, password })
  │  via
  ▼
http.js (axiosInstance).post('/api/auth/login/')
  │  response: { access, refresh, user }
  ▼
storage.saveTokens(access, refresh)
storage.saveUser(user)
  │
  ▼
authStore: set({ user, isAuthenticated: true })
  │
  ▼
LoginForm: navigate('/dashboard' | '/onboarding' | '/admin')
```

### Alur Onboarding

```
OnboardingPage
  │  user selesai step 3 (pilih level), klik "Mulai Belajar"
  ▼
authStore.onboardUser({ country, initial_level })
  │  panggil
  ▼
onboardingService.onboard({ country, initial_level })
  │  via
  ▼
http.js.post('/api/user/onboarding/')
  │  response: { message, user }   ← user.is_onboarded sekarang true
  ▼
storage.saveUser(user)
  │
  ▼
authStore: set({ user })          ← is_onboarded: true disimpan di state
  │
  ▼
OnboardingPage: setStep(4)        ← tampilkan halaman sukses
  │  user klik "Mulai Latihan Pertama"
  ▼
navigate('/dashboard')
```

### Alur Dashboard

```
DashboardPage mount
  │  useEffect dipanggil
  ▼
dashboardService.getDashboard()
  │  via
  ▼
http.js.get('/api/dashboard/')    ← token JWT otomatis terlampir
  │  response: DashboardResponse
  ▼
setData(res.data)                 ← state lokal, tidak perlu global store
  │
  ▼
Render: greeting, level, streak, skills, recommended_topics, activity_summary
```

### Alur Auto-Refresh Token

```
http.js request (misal GET /api/dashboard/)
  │  response: 401 Unauthorized
  ▼
Response Interceptor
  │  ada refresh token di localStorage?
  ├─ YA → POST /api/auth/token/refresh/
  │          ├─ berhasil → saveTokens(newAccess) → retry request asal
  │          └─ gagal   → clearTokens() → window.location = '/login'
  └─ TIDAK → clearTokens() → window.location = '/login'
```

### Alur Inisialisasi App

```
Browser buka aplikasi
  │
main.jsx useEffect → authStore.initAuth()
  │  cek localStorage: ada access token?
  ├─ TIDAK → isAuthenticated = false
  └─ YA → decode JWT, cek expiry
               ├─ masih valid → isAuthenticated = true, user = getUser()
               └─ kedaluwarsa → clearTokens(), isAuthenticated = false
  │
AppRoutes render
  │  user akses /dashboard
  ▼
PrivateRoute cek isAuthenticated
  ├─ false → redirect /login
  └─ true  → cek is_onboarded
                ├─ false → redirect /onboarding
                └─ true  → render DashboardPage
```

---

## Mau Ubah Sesuatu? Edit di Sini

### Ganti URL Backend API

Edit file `.env`:
```
VITE_API_URL=https://url-backend-baru.com
```
Restart dev server setelah mengganti env variable.

---

### Ganti Warna Primary

Cari dan ganti `#124663` di file-file CSS Module masing-masing modul. Warna ini dipakai secara konsisten di semua modul (auth, onboarding, dashboard).

---

### Ubah Validasi Form Register

Edit fungsi `validate()` di `src/modules/auth/components/RegisterForm.jsx`.

Contoh: menambahkan validasi password harus mengandung angka:
```js
if (!/\d/.test(form.password)) {
  errors.password = 'Password harus mengandung minimal satu angka.';
}
```

---

### Ubah Teks/Konten Panel Kiri (Branding)

Edit komponen `BrandPanel` di dalam:
- `src/modules/auth/pages/RegisterPage.jsx` — untuk halaman register
- `src/modules/auth/pages/LoginPage.jsx` — untuk halaman login

---

### Ubah Redirect Setelah Login

Edit fungsi `getRedirectPath` di `src/modules/auth/components/LoginForm.jsx`:

```js
const getRedirectPath = (user) => {
  if (!user.is_onboarded) return '/onboarding';
  if (user.role === 'admin') return '/admin';
  return '/dashboard'; // ← ubah default redirect di sini
};
```

---

### Tambah Negara di Onboarding

Edit konstanta `COUNTRIES` di `src/modules/onboarding/pages/OnboardingPage.jsx`:

```js
const COUNTRIES = [
  { flag: '🇮🇩', name: 'Indonesia' },
  // tambahkan di sini
  { flag: '🇯🇵', name: 'Jepang' },
];
```

---

### Ubah Sapaan Waktu di Dashboard

Edit fungsi `getGreeting` di `src/modules/dashboard/pages/DashboardPage.jsx`:

```js
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Selamat pagi';   // ← ubah teks di sini
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
};
```

---

### Tambah Route Baru

Edit `src/routes/AppRoutes.jsx`. Contoh menambahkan halaman profil:

```jsx
import ProfilePage from '../modules/profile/pages/ProfilePage';

// Di dalam <Routes>:
<Route
  path="/profile"
  element={
    <PrivateRoute>
      <ProfilePage />
    </PrivateRoute>
  }
/>
```

---

### Ubah Pesan Error Default (saat API tidak merespons)

Edit parameter `fallback` pada pemanggilan `parseDrfError` di `src/modules/auth/authStore.js`:

```js
// untuk register
const message = parseDrfError(err, 'Teks error register di sini.');

// untuk login
const message = parseDrfError(err, 'Teks error login di sini.');

// untuk onboarding
const message = parseDrfError(err, 'Teks error onboarding di sini.');
```

---

### Tambah Field Baru di Form Register

1. Tambahkan key di `INITIAL_FORM` (`RegisterForm.jsx`)
2. Tambahkan validasi di fungsi `validate()`
3. Tambahkan elemen `<input>` di JSX
4. Pastikan field dikirim ke API

---

## Panduan Error & Troubleshooting

### Error: `VITE_API_URL is not defined` / request ke `undefined`

**Penyebab:** File `.env` tidak ada atau nama variable salah.

**Solusi:**
1. Pastikan file `.env` ada di root folder `frontend/`
2. Nama variable harus diawali `VITE_` agar dibaca oleh Vite
3. Restart dev server setelah edit `.env`

---

### Error: Network Error / CORS saat request ke backend

**Penyebab:** Backend belum mengizinkan origin `http://localhost:5173`.

**Solusi:** Minta tim backend menambahkan `http://localhost:5173` ke daftar allowed origins di konfigurasi CORS Django.

---

### Error: `401 Unauthorized` terus-menerus, redirect loop ke `/login`

**Penyebab:** Refresh token sudah kedaluwarsa atau tidak valid.

**Solusi:**
1. Buka DevTools → Application → Local Storage → hapus ketiga key `bahasaku_*`
2. Login ulang

---

### Error: Setelah register/login, data user `null`

**Penyebab:** Response dari endpoint tidak mengembalikan field `user`.

**Pengecekan:** Buka DevTools → Network → lihat response body endpoint `/api/auth/login/`. Harus ada `{ access, refresh, user }`.

**Solusi jika backend tidak return `user`:** Edit `authStore.js` di action `loginUser` dan `registerUser`:
```js
// Tambahkan GET /api/auth/me/ setelah login untuk ambil data user
const { data: userData } = await axiosInstance.get('/api/auth/me/');
saveUser(userData);
set({ user: userData, isAuthenticated: true, isLoading: false });
```

---

### Error: `isAuthenticated` selalu `false` meski sudah login

**Penyebab:** `initAuth()` tidak dipanggil, atau token tersimpan dengan nama key yang berbeda.

**Pengecekan:**
1. Buka DevTools → Application → Local Storage
2. Pastikan ada key `bahasaku_access` dengan nilai JWT (tiga bagian dipisah `.`)
3. Pastikan `src/main.jsx` memanggil `initAuth()` di `useEffect`

---

### Error: Dashboard menampilkan "Gagal memuat dashboard"

**Penyebab:** Request ke `GET /api/dashboard/` gagal (token expired, server down, atau onboarding belum selesai).

**Pengecekan:**
1. Buka DevTools → Network → lihat request ke `/api/dashboard/`
2. Status 401 → token bermasalah, coba logout dan login ulang
3. Status 400 → user belum onboarding, pastikan `is_onboarded: true` di localStorage

---

### Error: Halaman tidak ditemukan / 404 saat refresh di browser

**Penyebab:** Server tidak tahu cara handle client-side routing.

**Solusi untuk development:** Sudah ditangani otomatis oleh Vite dev server.

**Solusi untuk production (Nginx):**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

### Error: Bootstrap Icons tidak muncul (kotak kosong / placeholder)

**Penyebab:** Import Bootstrap Icons belum ada atau gagal dimuat.

**Pengecekan:** Pastikan baris berikut ada di `src/main.jsx`:
```js
import 'bootstrap-icons/font/bootstrap-icons.css';
```

---

### Warning di console: `Can't perform a React state update on an unmounted component`

**Penyebab:** Komponen di-unmount sebelum async operation selesai (misal navigasi cepat keluar dari dashboard).

**Solusi sementara:** Ini warning umum di React dan tidak menyebabkan bug di production. Solusi proper menggunakan `AbortController` akan ditambahkan di iterasi berikutnya.

---

## Cara Tambah Fitur Baru

Contoh: menambahkan fitur **Materi** (`/topics`).

### 1. Buat folder modul

```
src/modules/topics/
├── topicsService.js    ← axios calls ke /api/topics/
├── topics.module.css   ← CSS Module (opsional jika ada halaman custom)
└── pages/
    └── TopicsPage.jsx  ← halaman lengkap
```

### 2. Buat file service (`topicsService.js`)

```js
import axiosInstance from '../../shared/http';

export const getTopics = () => axiosInstance.get('/api/topics/');
export const getTopic  = (id) => axiosInstance.get(`/api/topics/${id}/`);
```

### 3. Buat halaman (`pages/TopicsPage.jsx`)

Fetch data langsung di komponen menggunakan `useEffect` (seperti DashboardPage), atau buat Zustand store terpisah jika state perlu dibagi antar halaman.

```jsx
import { useState, useEffect } from 'react';
import { getTopics } from '../topicsService';

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    getTopics().then(res => setTopics(res.data));
  }, []);

  return (
    <div>
      {topics.map(t => <div key={t.id}>{t.name}</div>)}
    </div>
  );
}
```

### 4. Daftarkan route

Edit `src/routes/AppRoutes.jsx`:
```jsx
import TopicsPage from '../modules/topics/pages/TopicsPage';

<Route
  path="/topics"
  element={
    <PrivateRoute>
      <TopicsPage />
    </PrivateRoute>
  }
/>
```

---

## Variabel Lingkungan (Environment Variables)

| Variable | Keterangan | Contoh Nilai |
|---|---|---|
| `VITE_API_URL` | Base URL backend API | `https://frendyardiansyah31-bahasaku-backend.hf.space` |

> Semua variable Vite harus diawali `VITE_` agar bisa diakses di kode React via `import.meta.env.VITE_*`.

---

## Model Data User

Sesuai OpenAPI spec (`UserObject`):

```json
{
  "id": 1,
  "name": "Ahmad Khalid",
  "email": "ahmad@uiii.ac.id",
  "role": "user | instructor | admin",
  "is_onboarded": false,
  "country": "Saudi Arabia",
  "initial_level": "A1 | A2"
}
```

Field yang paling krusial untuk logika routing:
- `is_onboarded` — menentukan apakah user diarahkan ke `/onboarding` setelah login
- `role` — menentukan apakah user diarahkan ke `/admin` atau `/dashboard`

Data XP, streak, dan skill score tidak disimpan di object user — semuanya dikembalikan oleh endpoint `GET /api/dashboard/` setiap kali halaman dashboard dibuka.

---

## Riwayat Perubahan Arsitektur

### Iterasi 1 — Awal: Feature-Sliced Design (FSD)

Project awalnya menggunakan FSD dengan struktur `app/ → pages/ → features/ → shared/`.

**Masalah yang ditemukan untuk konteks tim:**
- Aturan barrel export (`index.js`) tidak intuitif — mudah dilanggar tanpa error
- Dua folder bernama `api/` di level berbeda membingungkan (`shared/api/` vs `features/auth/api/`)
- Halaman auth dan komponen auth terpisah di dua folder berbeda (`pages/` dan `features/auth/components/`)
- Terlalu banyak layer untuk project skala kecil-menengah

### Iterasi 1 — Refactor: Modular Layered Architecture

Migrasi ke Modular Layered dengan perubahan berikut:

| Sebelum (FSD) | Sesudah (Modular Layered) | Alasan |
|---|---|---|
| `src/features/auth/api/authApi.js` | `src/modules/auth/authService.js` | Nama `authService` lebih deskriptif |
| `src/features/auth/store/authStore.js` | `src/modules/auth/authStore.js` | Lebih datar, lebih mudah ditemukan |
| `src/features/auth/components/` | `src/modules/auth/components/` | Semua auth di satu tempat |
| `src/pages/LoginPage.jsx` | `src/modules/auth/pages/LoginPage.jsx` | Halaman dan komponen satu modul tidak terpisah |
| `src/shared/api/axiosInstance.js` | `src/shared/http.js` | Tidak ada lagi dua folder `api/`, nama jelas |
| `src/shared/utils/tokenStorage.js` | `src/shared/storage.js` | Lebih datar, nama jelas |
| `src/app/providers/AppProviders.jsx` | Digabung ke `src/main.jsx` | Hapus indirection yang tidak perlu |
| `src/routes/guards/PrivateRoute.jsx` | `src/routes/PrivateRoute.jsx` | Hapus subfolder untuk 2 file |
| `src/features/auth/index.js` | Dihapus | Barrel export tidak wajib, import langsung natural |

### Iterasi 2 — Onboarding & Dashboard

Penambahan dua modul baru mengikuti pola yang sama:

| Perubahan | Keterangan |
|---|---|
| `src/modules/auth/auth.module.css` | CSS Module auth dipindah dari `shared/styles/` ke dalam modul auth (colocated) |
| `src/shared/styles/global.css` | Ditambahkan untuk font body global, diimport di `main.jsx` |
| `src/shared/styles/notFound.module.css` | Ditambahkan untuk halaman 404 |
| `src/modules/onboarding/` | Modul baru: wizard 3 langkah pengisian profil awal |
| `src/modules/dashboard/` | Modul baru: halaman utama dengan sidebar, XP, skill, streak, dan topik |
| `authStore.onboardUser` | Action baru ditambahkan di authStore untuk submit data onboarding |

---

*Iterasi 2 — Onboarding & Dashboard selesai. Iterasi berikutnya: Topics, History, Progress, Profile, Admin.*
