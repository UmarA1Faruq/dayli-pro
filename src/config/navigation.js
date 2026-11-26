import {
  BarChart3,
  CalendarDays,
  Flame,
  LayoutDashboard,
  ListChecks,
  NotebookPen,
  Settings,
} from 'lucide-react'

export const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Hari Ini',
    shortLabel: 'Beranda',
    title: 'Hari Ini',
    description: 'Ringkasan kecil untuk hari yang lebih terarah.',
    icon: LayoutDashboard,
    keywords: 'dashboard beranda hari ini home',
  },
  {
    path: '/journal',
    label: 'Jurnal',
    shortLabel: 'Jurnal',
    title: 'Jurnal',
    description: 'Ruang untuk menuangkan pikiran dan merawat diri.',
    icon: NotebookPen,
    keywords: 'jurnal catatan diary menulis mood',
  },
  {
    path: '/tasks',
    label: 'Tugas',
    shortLabel: 'Tugas',
    title: 'Tugas',
    description: 'Kelola hal penting tanpa kehilangan arah.',
    icon: ListChecks,
    keywords: 'tugas task todo pekerjaan',
  },
  {
    path: '/habits',
    label: 'Habit',
    shortLabel: 'Habit',
    title: 'Habit Tracker',
    description: 'Ritme kecil yang diulang akan menjadi perubahan.',
    icon: Flame,
    keywords: 'habit kebiasaan streak rutinitas',
  },
  {
    path: '/calendar',
    label: 'Kalender',
    shortLabel: 'Kalender',
    title: 'Kalender',
    description: 'Lihat pola harianmu dalam satu tampilan.',
    icon: CalendarDays,
    keywords: 'kalender calendar agenda tanggal',
  },
  {
    path: '/stats',
    label: 'Statistik',
    shortLabel: 'Statistik',
    title: 'Statistik',
    description: 'Kenali ritme dan progresmu dari waktu ke waktu.',
    icon: BarChart3,
    keywords: 'statistik grafik chart progres insight',
  },
  {
    path: '/settings',
    label: 'Pengaturan',
    shortLabel: 'Atur',
    title: 'Pengaturan',
    description: 'Sesuaikan Dayli Pro agar terasa seperti milikmu.',
    icon: Settings,
    keywords: 'pengaturan setting profil tema akun',
  },
]

export const PAGE_META = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.path, item]),
)

export const SIDEBAR_ITEMS = NAV_ITEMS

export const MOBILE_ITEMS = NAV_ITEMS.slice(0, 4)

export const MOBILE_MORE_ITEMS = NAV_ITEMS.slice(4)
