# Dayli Pro

Aplikasi pencatatan harian pribadi (satu pengguna) untuk jurnal, tugas, habit, dan statistik harian.

> Catat harimu, rapikan hidupmu.

## Status

Fase UI/UX. Semua data masih dummy (`src/data/mockData.js`) dan state hidup di memori — belum ada backend, database, atau API.

## Fitur

- **Login** — form dummy, langsung masuk dashboard
- **Dashboard "Hari Ini"** — sapaan sesuai waktu, kutipan harian, ringkasan tugas/habit/mood, widget air minum & jam tidur
- **Jurnal** — CRUD entri, mood, tag, pin, pencarian, filter
- **Tugas** — CRUD, prioritas (rendah/sedang/tinggi), due date, filter & pengelompokan
- **Habit Tracker** — CRUD habit, centang harian, streak, tampilan 7 hari
- **Kalender** — tampilan bulanan + panel detail aktivitas per tanggal
- **Statistik** — grafik mood, persentase tugas selesai, konsistensi habit, streak terpanjang
- **Pengaturan** — profil, dark mode, warna aksen, export data (dummy), logout
- **Global** — Quick Add melayang, command palette (Ctrl+K), toast notifikasi, responsif mobile-first

## Tech Stack

- React 18 + Vite 6
- Tailwind CSS 3
- lucide-react (ikon)
- Recharts (grafik)
- react-router-dom 6
- date-fns

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Struktur

```
src/
  components/   komponen UI (Sidebar, Card, TaskItem, HabitItem, modal, dsb.)
  pages/        Dashboard, Tasks, Habits, Journal, Calendar, Stats, Settings, Login
  context/      AppContext — state aplikasi + aksi CRUD
  data/         mockData — data dummy bahasa Indonesia
  config/       navigation
  hooks/        useMediaQuery
  utils/        helper (cn, toDateKey, formatter, dsb.)
```

## Lisensi

Belum ditentukan.
