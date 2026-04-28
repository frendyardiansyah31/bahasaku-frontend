# BahasaKu — Frontend

Platform latihan Bahasa Indonesia berbasis web. Dibangun dengan React 19 + Vite, menggunakan arsitektur **Feature-Sliced Design (FSD)** dan autentikasi berbasis **JWT**.

---

## Daftar Isi

1. [Tech Stack](#tech-stack)
2. [Struktur Folder](#struktur-folder)
3. [Arsitektur: Kenapa FSD?](#arsitektur-kenapa-fsd)
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
| **CSS Modules** | — | Scoped custom styles |

**Backend API:** `https://frendyardiansyah31-bahasaku-backend.hf.space`

---

## Struktur Folder

```
frontend/
├── .env                          # Environment variable (URL backend)
├── .env.example                  # Template .env untuk tim
├── index.html                    # HTML entry point, load font Sora
├── package.json                  # Daftar dependency
├── vite.config.js                # Konfigurasi Vite + alias @/
│
└── src/
    │
    ├── app/                      # Lapisan App — titik masuk aplikasi
    │   ├── main.jsx              # Entry point React, import Bootstrap CSS
    │   ├── App.jsx               # Root komponen, render AppRoutes
    │   └── providers/
    │       └── AppProviders.jsx  # BrowserRouter + inisialisasi auth
    │
    ├── pages/                    # Halaman — hanya layout, tidak ada logika
    │   ├── RegisterPage.jsx      # Halaman daftar (split layout)
    │   └── LoginPage.jsx         # Halaman masuk (split layout)
    │
    ├── features/                 # Fitur-fitur aplikasi (unit mandiri)
    │   └── auth/                 # Fitur autentikasi
    │       ├── api/
    │       │   └── authApi.js    # Axios calls ke endpoint auth
    │       ├── store/
    │       │   └── authStore.js  # Zustand store (state + actions)
    │       ├── components/
    │       │   ├── RegisterForm.jsx  # Form pendaftaran
    │       │   └── LoginForm.jsx     # Form login
    │       └── index.js          # Public exports fitur auth
    │
    ├── shared/                   # Kode yang dipakai lintas fitur
    │   ├── api/
    │   │   └── axiosInstance.js  # Axios instance + interceptor JWT
    │   ├── styles/
    │   │   └── auth.module.css   # CSS module untuk halaman auth
    │   └── utils/
    │       └── tokenStorage.js   # Helper baca/tulis token di localStorage
    │
    └── routes/                   # Konfigurasi routing
        ├── AppRoutes.jsx         # Semua definisi route
        └── guards/
            ├── PrivateRoute.jsx  # Guard: cek autentikasi + onboarding
            └── PublicRoute.jsx   # Guard: redirect jika sudah login
```

---

## Arsitektur: Kenapa FSD?

### Apa itu Feature-Sliced Design?

FSD adalah metodologi struktur folder yang mengorganisir kode berdasarkan **fitur bisnis**, bukan berdasarkan jenis file (bukan "components/, hooks/, utils/" semuanya di satu level).

### Lapisan FSD yang digunakan di project ini

```
app → pages → features → shared
```

Aturannya: **lapisan atas boleh import lapisan bawah, tidak boleh sebaliknya.**

| Lapisan | Isi | Boleh import dari |
|---|---|---|
| `app/` | Bootstrap aplikasi, providers | `features/`, `pages/`, `shared/`, `routes/` |
| `pages/` | Layout halaman | `features/`, `shared/` |
| `features/` | Logika bisnis per fitur | `shared/` |
| `shared/` | Kode umum tanpa logika bisnis | Tidak ada (dasar) |
| `routes/` | Routing & guards | `features/`, `pages/` |

### Kenapa FSD, bukan struktur biasa?

**Masalah struktur "biasa" (components/, hooks/, utils/):**
- Ketika fitur bertambah, folder `components/` jadi ratusan file campur aduk
- Tidak jelas file mana milik fitur apa
- Junior developer bingung harus edit file mana

**Keuntungan FSD di project ini:**
- `features/auth/` adalah unit mandiri — semua yang berkaitan auth ada di satu folder
- Mudah dihapus atau dipindah satu fitur tanpa merusak fitur lain
- Junior langsung tahu: "mau edit form register? masuk ke `features/auth/components/`"

### Kenapa Zustand, bukan Redux?

- Redux terlalu verbose untuk project ini (butuh action, reducer, selector terpisah)
- Zustand: state + action dalam satu file, tidak perlu boilerplate
- API-nya sederhana, cocok untuk tim yang ada anggota junior

### Kenapa Axios, bukan Fetch API?

- Interceptor: bisa otomatis attach token dan handle 401 di satu tempat
- Request/response transformation sudah built-in
- Error handling lebih mudah (fetch tidak throw error untuk 4xx/5xx)

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

**3. Buat file `.env`** (sudah ada, cek isinya)

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
- Memanggil `/src/app/main.jsx` sebagai entry point JavaScript

Tidak perlu diedit kecuali mau ganti font atau tambah meta tag.

---

### `vite.config.js`

Konfigurasi build tool. Saat ini hanya aktifkan plugin React dan alias `@` → `src/`.

```js
// Contoh penggunaan alias
import axiosInstance from '@/shared/api/axiosInstance';
// sama dengan:
import axiosInstance from '../../shared/api/axiosInstance';
```

---

### `src/app/main.jsx`

Entry point aplikasi. Tugas utama:
- Import Bootstrap CSS dan Bootstrap Icons secara global
- Render `<App>` di dalam `<AppProviders>` dan `<StrictMode>`

**Tambah CSS global baru di sini**, bukan di file komponen lain.

---

### `src/app/App.jsx`

Komponen root yang sangat simpel — hanya render `<AppRoutes />`. Kalau nanti butuh error boundary global, tambahkan di sini.

---

### `src/app/providers/AppProviders.jsx`

Semua "pembungkus" global ada di sini:
- `<BrowserRouter>` — untuk React Router
- `useEffect → initAuth()` — cek token di localStorage setiap kali halaman pertama kali dibuka

**Kalau tambah provider baru** (misalnya React Query, Theme provider), tambahkan di file ini.

---

### `src/shared/utils/tokenStorage.js`

Helper murni untuk baca/tulis localStorage. Tidak ada logika bisnis di sini.

| Fungsi | Kegunaan |
|---|---|
| `saveTokens(access, refresh)` | Simpan kedua token setelah login/register |
| `getAccessToken()` | Ambil access token (dipakai di interceptor) |
| `getRefreshToken()` | Ambil refresh token (dipakai saat 401) |
| `saveUser(user)` | Simpan object user (setelah login/register) |
| `getUser()` | Ambil object user (dipakai di `initAuth`) |
| `clearTokens()` | Hapus semua data (dipakai saat logout) |

**Key localStorage yang digunakan:**
- `bahasaku_access` — JWT access token
- `bahasaku_refresh` — JWT refresh token
- `bahasaku_user` — data user (JSON)

> **Catatan P2:** Untuk keamanan lebih baik, ganti penyimpanan ke httpOnly cookie sehingga JavaScript tidak bisa membaca token secara langsung.

---

### `src/shared/api/axiosInstance.js`

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

**Mekanisme antrian** — Jika ada 3 request gagal secara bersamaan saat token expired, hanya 1 refresh yang dikirim. 2 request lainnya menunggu dalam antrian (`failedQueue`) dan di-retry setelah refresh berhasil.

---

### `src/features/auth/api/authApi.js`

Daftar semua endpoint auth. File ini hanya berisi axios calls — tidak ada logika, tidak ada state.

| Fungsi | Method | Endpoint |
|---|---|---|
| `register(data)` | POST | `/api/auth/register/` |
| `login(data)` | POST | `/api/auth/login/` |
| `refreshToken(refresh)` | POST | `/api/auth/token/refresh/` |
| `logout(refresh)` | POST | `/api/auth/logout/` |

---

### `src/features/auth/store/authStore.js`

Otak dari fitur auth. Dibangun dengan Zustand.

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
| `clearError()` | Reset `error` ke null (dipanggil saat user mulai mengetik). |

**Fungsi internal `parseDrfError`** — Django REST Framework bisa mengembalikan error dalam berbagai format. Fungsi ini menormalisasi semuanya jadi satu string pesan:
- `{ detail: "..." }` → diambil langsung
- `{ email: ["error"], password: ["error"] }` → digabung jadi satu string
- Network error → pakai pesan fallback

---

### `src/features/auth/components/RegisterForm.jsx`

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
- `first_name` & `last_name` — wajib diisi
- `email` — wajib + format email valid
- `password` — wajib + minimal 8 karakter
- `password_confirm` — wajib + harus sama dengan `password`
- `terms` — checkbox harus dicentang

Field `terms` tidak dikirim ke API — hanya untuk validasi UI.

---

### `src/features/auth/components/LoginForm.jsx`

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

### `src/features/auth/index.js`

File ini adalah "pintu" public dari fitur auth. Komponen atau store dari luar fitur **harus import melalui file ini**, bukan langsung ke file internal.

```js
// BENAR ✓
import { RegisterForm, useAuthStore } from '@/features/auth';

// SALAH ✗ (langsung ke file internal)
import RegisterForm from '@/features/auth/components/RegisterForm';
```

Mengapa? Kalau suatu saat internal file dipindah atau di-rename, yang perlu diubah hanya `index.js`, bukan semua file yang mengimportnya.

---

### `src/pages/RegisterPage.jsx` & `src/pages/LoginPage.jsx`

Halaman wrapper. Tugasnya hanya menyusun layout, tidak ada logika bisnis.

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Panel Kiri (branding)  │  Panel Kanan (form) │
│  Hanya tampil ≥ 768px   │  Selalu tampil      │
└─────────────────────────────────────────────┘
```

Di mobile (<768px): panel kiri tersembunyi, logo kecil muncul di atas form.

---

### `src/shared/styles/auth.module.css`

CSS Module untuk styling halaman Register dan Login. Menggunakan CSS Modules (bukan global CSS) agar class tidak bentrok dengan komponen lain.

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

### `src/routes/guards/PrivateRoute.jsx`

Guard untuk route yang memerlukan login.

```
User akses /dashboard:
  ├─ isAuthenticated === false → redirect /login (simpan path asal)
  ├─ isAuthenticated === true + is_onboarded === false + bukan di /onboarding
  │    → redirect /onboarding
  └─ isAuthenticated === true + is_onboarded === true → render halaman
```

---

### `src/routes/guards/PublicRoute.jsx`

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
| `/onboarding` | PrivateRoute | OnboardingPage (placeholder) |
| `/dashboard` | PrivateRoute | DashboardPage (placeholder) |
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
authApi.login({ email, password })
  │  via
  ▼
axiosInstance.post('/api/auth/login/')
  │  response: { access, refresh, user }
  ▼
tokenStorage.saveTokens(access, refresh)
tokenStorage.saveUser(user)
  │
  ▼
authStore: set({ user, isAuthenticated: true })
  │
  ▼
LoginForm: navigate('/dashboard' | '/onboarding' | '/admin')
```

### Alur Auto-Refresh Token

```
axiosInstance.request (misal GET /api/topics/)
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
AppProviders useEffect → authStore.initAuth()
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

Cari dan ganti `#124663` di file `src/shared/styles/auth.module.css`. Warna ini dipakai untuk background panel kiri, tombol submit, focus ring, dan link.

---

### Ubah Validasi Form Register

Edit fungsi `validate()` di `src/features/auth/components/RegisterForm.jsx` (baris 24–51).

Contoh: menambahkan validasi password harus mengandung angka:
```js
if (!/\d/.test(form.password)) {
  errors.password = 'Password harus mengandung minimal satu angka.';
}
```

---

### Ubah Teks/Konten Panel Kiri (Branding)

Edit komponen `BrandPanel` di dalam:
- `src/pages/RegisterPage.jsx` — untuk halaman register
- `src/pages/LoginPage.jsx` — untuk halaman login

---

### Ubah Redirect Setelah Login

Edit fungsi `getRedirectPath` di `src/features/auth/components/LoginForm.jsx` (baris 35–39):

```js
const getRedirectPath = (user) => {
  if (!user.is_onboarded) return '/onboarding';
  if (user.role === 'admin') return '/admin';
  return '/dashboard'; // ← ubah default redirect di sini
};
```

---

### Tambah Route Baru

Edit `src/routes/AppRoutes.jsx`. Contoh menambahkan halaman profil:

```jsx
import ProfilePage from '../pages/ProfilePage';

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

Edit parameter `fallback` pada pemanggilan `parseDrfError` di `src/features/auth/store/authStore.js`:

```js
// Baris ~106 — untuk register
const message = parseDrfError(err, 'Teks error register di sini.');

// Baris ~128 — untuk login
const message = parseDrfError(err, 'Teks error login di sini.');
```

---

### Tambah Field Baru di Form Register

1. Tambahkan key di `INITIAL_FORM` (`RegisterForm.jsx`)
2. Tambahkan validasi di fungsi `validate()`
3. Tambahkan elemen `<input>` di JSX
4. Pastikan field dikirim ke API (tidak masuk daftar destructuring yang dibuang)

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
3. Pastikan `AppProviders.jsx` memanggil `initAuth()` di `useEffect`

---

### Error: Halaman tidak ditemukan / 404 saat refresh di browser

**Penyebab:** Server tidak tahu cara handle client-side routing — mengembalikan 404 untuk path selain `/`.

**Solusi untuk development:** Sudah ditangani otomatis oleh Vite dev server.

**Solusi untuk production:** Pastikan web server (Nginx/Apache) dikonfigurasi untuk selalu serve `index.html` untuk semua path:
```nginx
# Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

### Error: Bootstrap Icons tidak muncul (kotak kosong / placeholder)

**Penyebab:** Import Bootstrap Icons belum ada atau gagal dimuat.

**Pengecekan:** Pastikan baris berikut ada di `src/app/main.jsx`:
```js
import 'bootstrap-icons/font/bootstrap-icons.css';
```

---

### Warning di console: `Can't perform a React state update on an unmounted component`

**Penyebab:** Komponen di-unmount sebelum async operation selesai.

**Solusi sementara:** Ini warning umum di React dan tidak menyebabkan bug di production. Solusi proper menggunakan `AbortController` akan ditambahkan di iterasi berikutnya.

---

## Cara Tambah Fitur Baru

Contoh: menambahkan fitur **Materi** (`/topics`).

### 1. Buat folder fitur

```
src/features/topics/
├── api/
│   └── topicsApi.js     ← axios calls ke /api/topics/
├── store/
│   └── topicsStore.js   ← Zustand store
├── components/
│   └── TopicList.jsx    ← komponen UI
└── index.js             ← public exports
```

### 2. Buat file API (`topicsApi.js`)

```js
import axiosInstance from '@/shared/api/axiosInstance';

export const getTopics = () => axiosInstance.get('/api/topics/');
export const getTopic  = (id) => axiosInstance.get(`/api/topics/${id}/`);
```

### 3. Buat Zustand store (`topicsStore.js`)

Ikuti pola yang sama dengan `authStore.js`: state + actions dalam satu `create()`.

### 4. Buat halaman

```
src/pages/TopicsPage.jsx
```

Impor komponen dari `@/features/topics` dan susun layout di sini.

### 5. Daftarkan route

Edit `src/routes/AppRoutes.jsx`:
```jsx
import TopicsPage from '../pages/TopicsPage'; // hapus placeholder lama

<Route
  path="/topics"
  element={
    <PrivateRoute>
      <TopicsPage />
    </PrivateRoute>
  }
/>
```

### 6. Export dari index.js fitur

```js
// src/features/topics/index.js
export { default as TopicList }    from './components/TopicList';
export { default as useTopicsStore } from './store/topicsStore';
```

---

## Variabel Lingkungan (Environment Variables)

| Variable | Keterangan | Contoh Nilai |
|---|---|---|
| `VITE_API_URL` | Base URL backend API | `https://frendyardiansyah31-bahasaku-backend.hf.space` |

> Semua variable Vite harus diawali `VITE_` agar bisa diakses di kode React via `import.meta.env.VITE_*`.

---

## Model Data User

```json
{
  "id": "uuid",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "role": "user | admin",
  "level": "A1 | A2 | B1 | B2 | C1 | C2",
  "xp": 0,
  "streak": 0,
  "is_onboarded": false
}
```

Field yang paling krusial untuk logika routing:
- `is_onboarded` — menentukan apakah user diarahkan ke `/onboarding` setelah login
- `role` — menentukan apakah user diarahkan ke `/admin` atau `/dashboard`

---

*Iterasi 1 — Auth (Register & Login) selesai. Iterasi berikutnya: Onboarding, Dashboard, Materi.*
