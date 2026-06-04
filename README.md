# NutriSi — Panduan Menjalankan

## Struktur Folder
```
NutriSi/
├── backend/          ← Server Node.js + MySQL
└── frontend/         ← React + Vite
```

---

## 1. Setup Database MySQL (Laragon)

1. Buka **Laragon** → Start All (MySQL + Apache)
2. Buka **phpMyAdmin** → `http://localhost/phpmyadmin`
3. Buat database baru:
   ```sql
   CREATE DATABASE `smart nutrition tracker`;
   ```
4. Tabel dibuat **otomatis** saat backend pertama kali dijalankan.

---

## 2. Jalankan Backend

```bash
cd backend
npm install
node server.js
```

Server berjalan di → **http://localhost:5000**

### Endpoint API:
| Method | Endpoint                  | Keterangan              |
|--------|---------------------------|-------------------------|
| POST   | /api/auth/register        | Daftar akun             |
| POST   | /api/auth/login           | Masuk                   |
| POST   | /api/auth/personalize     | Simpan profil anak      |
| GET    | /api/auth/profile         | Ambil profil            |
| GET    | /api/foods?query=...      | Cari bahan makanan      |
| GET    | /api/logs?date=YYYY-MM-DD | Log makan per tanggal   |
| POST   | /api/logs                 | Tambah log makan        |
| DELETE | /api/logs/:id             | Hapus log makan         |
| GET    | /api/logs/history         | Riwayat semua log       |
| GET    | /api/recommendations      | Rekomendasi ML          |

> Auth menggunakan `Authorization: Bearer {userId}` (disimpan otomatis oleh frontend)

---

## 3. Jalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di → **http://localhost:5173**

Semua request `/api/...` otomatis di-proxy ke `http://localhost:5000`

---

## 4. Alur Penggunaan

```
Onboarding → Daftar (Register) → Personalisasi Profil Anak
  → Home Dashboard → Log Makanan (search real-time dari dataset)
  → Riwayat → Rekomendasi ML → Detail AKG → Profile
```

---

## Tech Stack

| Layer     | Teknologi                              |
|-----------|----------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS 4         |
| HTTP      | **Axios** (via `src/services/api.js`)  |
| Backend   | Express.js (RESTful API)               |
| Database  | MySQL via mysql2                       |
| AI/ML     | Python Decision Tree + JS Fallback     |
| Auth      | bcryptjs + Bearer Token                |

## Catatan Penting

- **Dataset `final_dataset.csv`** harus ada di root workspace (sejajar dengan folder `backend/`)
- **Token** disimpan di `localStorage` sebagai `nutrisi_token`
- **Model ML**: Backend mencoba Python (`predict.py`) dulu, jika gagal fallback ke JavaScript rules engine
- **Mockup UI**: Lihat file `MOCKUP.md` untuk wireframe dan design system lengkap
