import { addDays, format, subDays } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

const today = new Date()
const dateKey = (date) => format(date, 'yyyy-MM-dd')
const daysAgo = (amount) => dateKey(subDays(today, amount))
const daysFromNow = (amount) => dateKey(addDays(today, amount))

export const MOODS = {
  senang: {
    key: 'senang',
    label: 'Senang',
    emoji: '😊',
    score: 5,
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    solid: 'bg-emerald-500',
    hex: '#10b981',
  },
  tenang: {
    key: 'tenang',
    label: 'Tenang',
    emoji: '😌',
    score: 4,
    className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    solid: 'bg-sky-500',
    hex: '#0ea5e9',
  },
  biasa: {
    key: 'biasa',
    label: 'Biasa saja',
    emoji: '😐',
    score: 3,
    className: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
    solid: 'bg-slate-400',
    hex: '#94a3b8',
  },
  lelah: {
    key: 'lelah',
    label: 'Lelah',
    emoji: '😴',
    score: 2,
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    solid: 'bg-amber-500',
    hex: '#f59e0b',
  },
  cemas: {
    key: 'cemas',
    label: 'Cemas',
    emoji: '😟',
    score: 1.5,
    className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    solid: 'bg-orange-500',
    hex: '#f97316',
  },
  sedih: {
    key: 'sedih',
    label: 'Sedih',
    emoji: '😔',
    score: 1,
    className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    solid: 'bg-rose-500',
    hex: '#f43f5e',
  },
}

export const MOOD_ORDER = ['senang', 'tenang', 'biasa', 'lelah', 'cemas', 'sedih']

export const PRIORITIES = {
  tinggi: {
    label: 'Tinggi',
    className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
    rank: 3,
  },
  sedang: {
    label: 'Sedang',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
    rank: 2,
  },
  rendah: {
    label: 'Rendah',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    rank: 1,
  },
}

export const HABIT_COLORS = [
  {
    key: 'sky',
    label: 'Langit',
    solid: 'bg-sky-500',
    soft: 'bg-sky-500/10',
    text: 'text-sky-500',
    border: 'border-sky-500/25',
    gradient: 'from-sky-400 to-sky-600',
  },
  {
    key: 'violet',
    label: 'Violet',
    solid: 'bg-violet-500',
    soft: 'bg-violet-500/10',
    text: 'text-violet-500',
    border: 'border-violet-500/25',
    gradient: 'from-violet-400 to-violet-600',
  },
  {
    key: 'emerald',
    label: 'Hijau',
    solid: 'bg-emerald-500',
    soft: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/25',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    key: 'amber',
    label: 'Amber',
    solid: 'bg-amber-500',
    soft: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/25',
    gradient: 'from-amber-400 to-amber-600',
  },
  {
    key: 'rose',
    label: 'Mawar',
    solid: 'bg-rose-500',
    soft: 'bg-rose-500/10',
    text: 'text-rose-500',
    border: 'border-rose-500/25',
    gradient: 'from-rose-400 to-rose-600',
  },
  {
    key: 'indigo',
    label: 'Indigo',
    solid: 'bg-indigo-500',
    soft: 'bg-indigo-500/10',
    text: 'text-indigo-500',
    border: 'border-indigo-500/25',
    gradient: 'from-indigo-400 to-indigo-600',
  },
]

export const HABIT_ICONS = [
  'Droplets',
  'BookOpen',
  'Dumbbell',
  'Moon',
  'Sparkles',
  'Coffee',
  'Footprints',
  'HeartPulse',
  'Leaf',
  'Music',
  'Brush',
  'Apple',
]

export const JOURNAL_TAGS = [
  'Refleksi',
  'Pekerjaan',
  'Kesehatan',
  'Keluarga',
  'Produktivitas',
  'Ide',
  'Pagi',
  'Tujuan',
  'Syukur',
]

export const DAILY_QUOTES = [
  {
    text: 'Langkah kecil yang konsisten selalu lebih baik daripada kesempurnaan yang tertunda.',
    author: 'Dayli Pro',
  },
  {
    text: 'Hari ini adalah kesempatan baru untuk menjadi versi terbaik dirimu.',
    author: 'Umar',
  },
  {
    text: 'Rawat pikiranmu seperti kamu merawat tubuhmu. Beri ia ruang untuk bernapas.',
    author: 'Refleksi harian',
  },
  {
    text: 'Jangan tunggu semangat datang. Mulailah, semangat akan menyusul.',
    author: 'Prinsip kecil',
  },
  {
    text: 'Pelan-pelan saja. Yang penting kamu tidak berhenti.',
    author: 'Pengingat hari ini',
  },
  {
    text: 'Kemajuanmu mungkin belum terlihat, tetapi ia nyata. Teruslah melangkah.',
    author: 'Dayli Pro',
  },
  {
    text: 'Rasa syukur mengubah apa yang kita punya menjadi cukup.',
    author: 'Refleksi harian',
  },
]

export const initialUser = {
  name: 'Umar',
  fullName: 'Umar Faruq',
  email: 'umar@daylipro.id',
  joinedAt: '12 Januari 2025',
  tagline: 'Pembelajar yang mencoba hidup lebih teratur, satu hari setiap kali.',
}

export const initialJournal = [
  {
    id: 'j1',
    title: 'Pagi yang lebih tenang',
    content:
      'Hari ini aku bangun lebih awal dari biasanya. Tidak ada suara notifikasi, hanya suara burung di luar jendela dan uap dari cangkir kopi.\n\nAku sempat duduk diam selama sepuluh menit tanpa membuka ponsel. Rasanya sederhana, tapi ternyata itulah yang aku butuhkan. Kadang ketenangan tidak datang dari menyelesaikan semuanya, melainkan dari berhenti sebentar untuk menyadari bahwa tidak semuanya harus selesai hari ini.\n\nCatatan untuk diriku: pertahankan ritual kecil ini.',
    date: daysAgo(0),
    mood: 'tenang',
    tags: ['Refleksi', 'Pagi'],
    pinned: true,
  },
  {
    id: 'j2',
    title: 'Belajar menerima ketidakpastian',
    content:
      'Ada satu proyek yang belum jelas arahnya. Awalnya aku merasa cemas karena ingin semuanya segera rapi. Tapi hari ini aku belajar bahwa tidak semua hal bisa dikendalikan.\n\nAku menuliskan hal-hal yang masih bisa aku lakukan, lalu mengerjakannya satu per satu. Sisanya, aku serahkan pada proses. Ternyata beban di dada sedikit lebih ringan setelah itu.',
    date: daysAgo(1),
    mood: 'cemas',
    tags: ['Refleksi', 'Pekerjaan'],
    pinned: false,
  },
  {
    id: 'j3',
    title: 'Progress kecil tetap progress',
    content:
      'Hari ini aku berhasil menyelesaikan laporan yang tertunda selama tiga hari. Tidak sempurna, tapi selesai. Aku sering lupa bahwa menyelesaikan sesuatu dengan kadar 80% jauh lebih baik daripada menunggu momen sempurna yang tak kunjung datang.\n\nMalam ini aku ingin berterima kasih pada diriku sendiri karena sudah mau duduk dan memulai.',
    date: daysAgo(2),
    mood: 'senang',
    tags: ['Produktivitas', 'Syukur'],
    pinned: true,
  },
  {
    id: 'j4',
    title: 'Hari yang melelahkan, tapi baik-baik saja',
    content:
      'Rapat dari pagi sampai sore, lalu masih harus menyelesaikan beberapa pekerjaan rumah. Energiku terkuras, dan sempat merasa ingin menyerah pada rutinitas.\n\nTapi aku ingat bahwa lelah bukan tanda gagal. Malam ini aku memilih beristirahat lebih awal dan tidak memaksakan diri untuk produktif. Besok adalah hari baru.',
    date: daysAgo(3),
    mood: 'lelah',
    tags: ['Kesehatan', 'Pekerjaan'],
    pinned: false,
  },
  {
    id: 'j5',
    title: 'Ide proyek sampingan',
    content:
      'Di tengah perjalanan pulang, tiba-tiba muncul ide untuk membuat proyek kecil: sebuah tempat menyimpan catatan harian yang sederhana dan menyenangkan. Aku menuliskan beberapa fitur yang mungkin berguna.\n\nBelum tahu kapan akan mulai, tapi rasanya menyenangkan punya sesuatu untuk dikerjakan karena ingin, bukan karena harus.',
    date: daysAgo(5),
    mood: 'senang',
    tags: ['Ide', 'Pekerjaan'],
    pinned: false,
  },
  {
    id: 'j8',
    title: 'Sore biasa yang cukup',
    content:
      'Tidak ada hal besar yang terjadi hari ini. Aku mengerjakan pekerjaan seperti biasa, minum kopi, lalu duduk sebentar di dekat jendela.\n\nAwalnya aku merasa hari ini terlalu “biasa”. Tapi kemudian aku sadar, hari yang tenang dan tidak penuh tekanan juga layak disyukuri.',
    date: daysAgo(4),
    mood: 'biasa',
    tags: ['Refleksi', 'Syukur'],
    pinned: false,
  },
  {
    id: 'j6',
    title: 'Jalan sore di taman',
    content:
      'Aku mengajak keluarga jalan-jalan di taman. Langitnya berwarna jingga, anginnya sejuk, dan untuk beberapa saat tidak ada yang perlu dikhawatirkan.\n\nMomen seperti ini mengingatkan bahwa kebahagiaan sering kali tidak mahal. Cukup waktu, orang-orang yang kita sayangi, dan kemauan untuk hadir sepenuhnya.',
    date: daysAgo(6),
    mood: 'senang',
    tags: ['Keluarga', 'Syukur'],
    pinned: false,
  },
  {
    id: 'j7',
    title: 'Merenungkan tujuan bulan ini',
    content:
      'Aku duduk sebentar untuk meninjau tujuan bulan ini. Beberapa sudah tercapai, beberapa masih jauh. Aku memutuskan untuk tidak menghakimi diri sendiri, melainkan menyesuaikan rencana.\n\nFokus bulan ini: lebih sedikit janji, lebih banyak tindakan kecil yang konsisten.',
    date: daysAgo(9),
    mood: 'tenang',
    tags: ['Tujuan', 'Refleksi'],
    pinned: false,
  },
]

export const initialTasks = [
  {
    id: 't1',
    title: 'Review proposal klien',
    note: 'Baca ulang bagian anggaran dan timeline sebelum dikirim.',
    priority: 'tinggi',
    dueDate: daysAgo(0),
    completed: false,
    category: 'Pekerjaan',
  },
  {
    id: 't2',
    title: 'Olahraga 30 menit',
    note: 'Jalan cepat atau yoga ringan di rumah.',
    priority: 'sedang',
    dueDate: daysAgo(0),
    completed: true,
    category: 'Kesehatan',
  },
  {
    id: 't3',
    title: 'Baca 20 halaman buku',
    note: 'Lanjutkan Atomic Habits bab 5.',
    priority: 'rendah',
    dueDate: daysAgo(0),
    completed: false,
    category: 'Pengembangan Diri',
  },
  {
    id: 't4',
    title: 'Kirim laporan progres',
    note: 'Kirim ringkasan capaian minggu ini ke tim.',
    priority: 'tinggi',
    dueDate: daysAgo(0),
    completed: true,
    category: 'Pekerjaan',
  },
  {
    id: 't5',
    title: 'Bayar tagihan listrik',
    note: 'Jatuh tempo kemarin. Segera selesaikan.',
    priority: 'tinggi',
    dueDate: daysAgo(1),
    completed: false,
    category: 'Keuangan',
  },
  {
    id: 't6',
    title: 'Rapat mingguan tim',
    note: 'Siapkan update singkat tentang progres desain.',
    priority: 'sedang',
    dueDate: daysFromNow(1),
    completed: false,
    category: 'Pekerjaan',
  },
  {
    id: 't7',
    title: 'Belanja bahan masakan',
    note: 'Sayur, telur, buah, dan kopi.',
    priority: 'rendah',
    dueDate: daysFromNow(3),
    completed: false,
    category: 'Rumah',
  },
  {
    id: 't8',
    title: 'Tulis draf artikel',
    note: 'Target 800 kata untuk artikel blog pribadi.',
    priority: 'sedang',
    dueDate: daysFromNow(5),
    completed: false,
    category: 'Pekerjaan',
  },
  {
    id: 't9',
    title: 'Backup foto ke cloud',
    note: 'Pindahkan foto bulan lalu ke folder arsip.',
    priority: 'rendah',
    dueDate: daysAgo(2),
    completed: true,
    category: 'Digital',
  },
  {
    id: 't10',
    title: 'Telepon orang tua',
    note: 'Minimal 15 menit, tanpa multitasking.',
    priority: 'rendah',
    dueDate: daysFromNow(2),
    completed: false,
    category: 'Keluarga',
  },
]

const habitHistory = (offsets) => offsets.map((offset) => daysAgo(offset))

export const initialHabits = [
  {
    id: 'h1',
    name: 'Minum 8 gelas air',
    description: 'Tetap terhidrasi sepanjang hari.',
    icon: 'Droplets',
    color: 'sky',
    createdAt: daysAgo(30),
    history: habitHistory([0, 1, 3, 4, 5, 6, 7, 8, 9]),
  },
  {
    id: 'h2',
    name: 'Baca 20 menit',
    description: 'Waktu tenang bersama buku pilihan.',
    icon: 'BookOpen',
    color: 'amber',
    createdAt: daysAgo(21),
    history: habitHistory([0, 1, 3, 4, 6, 7, 8]),
  },
  {
    id: 'h3',
    name: 'Olahraga 30 menit',
    description: 'Bergerak setiap hari, sekecil apa pun.',
    icon: 'Dumbbell',
    color: 'rose',
    createdAt: daysAgo(18),
    history: habitHistory([0, 2, 4, 6, 9, 10]),
  },
  {
    id: 'h4',
    name: 'Meditasi 10 menit',
    description: 'Menarik napas dan hadir di momen ini.',
    icon: 'Sparkles',
    color: 'violet',
    createdAt: daysAgo(14),
    history: habitHistory([1, 3, 5, 7]),
  },
  {
    id: 'h5',
    name: 'Tidur sebelum 23.00',
    description: 'Memberi tubuh waktu pulih yang cukup.',
    icon: 'Moon',
    color: 'indigo',
    createdAt: daysAgo(26),
    history: habitHistory([0, 1, 2, 3, 4, 5, 6, 8, 9]),
  },
]

export const initialPreferences = {
  accent: 'indigo',
  theme: 'light',
  water: 5,
  waterTarget: 8,
  sleep: 7.5,
  sleepTarget: 8,
}

export const initialNotifications = [
  {
    id: 'n1',
    title: 'Ritme harianmu membaik',
    message: 'Kamu telah menyelesaikan habit selama 4 hari berturut-turut.',
    time: '10 menit lalu',
    type: 'streak',
    read: false,
  },
  {
    id: 'n2',
    title: 'Ada tugas yang terlambat',
    message: '“Bayar tagihan listrik” sudah melewati tanggal jatuh tempo.',
    time: '2 jam lalu',
    type: 'task',
    read: false,
  },
  {
    id: 'n3',
    title: 'Jurnal hari ini sudah tersimpan',
    message: 'Terima kasih sudah meluangkan waktu untuk menulis.',
    time: '3 jam lalu',
    type: 'journal',
    read: true,
  },
]

export { daysAgo, daysFromNow, localeId, today }
