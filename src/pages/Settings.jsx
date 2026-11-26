import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Check,
  Download,
  Info,
  LogOut,
  Mail,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cn } from '../utils/helpers'
import { PageHeader } from '../components/PageHeader'
import Card, { CardHeader } from '../components/Card'
import Avatar from '../components/Avatar'
import ConfirmDialog from '../components/ConfirmDialog'

const ACCENTS = [
  { key: 'indigo', label: 'Indigo', className: 'bg-indigo-500' },
  { key: 'violet', label: 'Violet', className: 'bg-violet-500' },
  { key: 'rose', label: 'Mawar', className: 'bg-rose-500' },
  { key: 'sky', label: 'Langit', className: 'bg-sky-500' },
  { key: 'emerald', label: 'Hijau', className: 'bg-emerald-500' },
]

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
        checked ? 'bg-accent' : 'bg-slate-300 dark:bg-slate-700',
      )}
    >
      <span
        className={cn(
          'inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition',
          checked ? 'translate-x-[22px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  )
}

export default function Settings() {
  const {
    user,
    updateProfile,
    preferences,
    updatePreferences,
    setAccent,
    toggleTheme,
    exportData,
    logout,
  } = useApp()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState(user.fullName)
  const [tagline, setTagline] = useState(user.tagline || '')
  const [error, setError] = useState('')
  const [logoutOpen, setLogoutOpen] = useState(false)

  const handleProfileSubmit = (event) => {
    event.preventDefault()
    if (!fullName.trim()) {
      setError('Nama profil tidak boleh kosong.')
      return
    }
    setError('')
    updateProfile({ fullName: fullName.trim(), tagline: tagline.trim() })
  }

  const handleTheme = (theme) => {
    if (preferences.theme === theme) return
    updatePreferences(
      { theme },
      {
        announce: {
          title: theme === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif',
          message: 'Tampilan disesuaikan dengan preferensimu.',
          type: 'info',
        },
      },
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Ruang pribadimu"
        title="Pengaturan"
        description="Sesuaikan profil dan tampilan Dayli Pro. Semua perubahan langsung terasa di seluruh aplikasi."
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card className="p-5 sm:p-6">
            <CardHeader
              icon={UserRound}
              title="Profil"
              description="Nama ini akan muncul di sapaan dan sidebar."
            />

            <form onSubmit={handleProfileSubmit} className="mt-5">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row sm:items-center">
                <Avatar name={fullName || user.fullName} size="lg" showStatus />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {fullName || user.fullName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                    {user.email}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="chip bg-accent/10 text-accent">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </span>
                    <span className="chip bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <CalendarDays className="h-3 w-3" />
                      Bergabung {user.joinedAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="settings-name" className="label">
                    Nama lengkap
                  </label>
                  <input
                    id="settings-name"
                    className="input"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    maxLength={40}
                  />
                </div>
                <div>
                  <label htmlFor="settings-email" className="label">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="settings-email"
                      className="input cursor-not-allowed pl-10 pr-3 text-slate-400 dark:text-slate-500"
                      value={user.email}
                      disabled
                      readOnly
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                    Email akun demo tidak dapat diubah.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="settings-tagline" className="label">
                  Tentangmu <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                <textarea
                  id="settings-tagline"
                  className="input min-h-[76px] resize-y"
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  maxLength={140}
                  placeholder="Satu kalimat tentang dirimu…"
                />
              </div>

              {error && (
                <p className="mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="hidden text-[10px] text-slate-400 dark:text-slate-500 sm:block">
                  Perubahan hanya tersimpan selama sesi demo ini.
                </p>
                <button type="submit" className="btn-primary ml-auto">
                  <Save className="h-4 w-4" />
                  Simpan perubahan
                </button>
              </div>
            </form>
          </Card>

          <Card className="p-5 sm:p-6">
            <CardHeader
              icon={Download}
              title="Data & privasi"
              description="Semua data demo tersimpan di memori perangkatmu, tanpa server."
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={exportData}
                className="group flex items-start gap-3 rounded-2xl border border-slate-200/80 p-4 text-left transition hover:border-accent/30 hover:bg-accent/[0.03] dark:border-slate-800"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Download className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">
                    Export Data
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-400">
                    Unduh jurnal, tugas, dan habit sebagai file JSON.
                  </span>
                </span>
              </button>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">
                    Privat secara default
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-400">
                    Tidak ada data yang dikirim ke server atau pihak ketiga.
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3 text-[10px] leading-relaxed text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Data bersifat sementara. Memuat ulang halaman akan mengembalikan data demo awal, jadi
              gunakan Export Data jika ingin menyimpan salinan.
            </div>
          </Card>

          <Card className="border-rose-200/80 bg-rose-50/30 p-5 dark:border-rose-500/20 dark:bg-rose-500/[0.04] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                  <LogOut className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Keluar dari akun</h2>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Kamu akan kembali ke halaman masuk. Data demo tetap ada sampai halaman dimuat ulang.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="btn border border-rose-200 bg-white text-rose-500 hover:bg-rose-500 hover:text-white dark:border-rose-500/30 dark:bg-slate-900"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <CardHeader
              icon={Palette}
              title="Tampilan"
              description="Atur suasana Dayli Pro sesuai preferensimu."
            />

            <div className="mt-4">
              <p className="label">Mode</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTheme('light')}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-3 transition',
                    preferences.theme === 'light'
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/10'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800',
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/15 text-amber-500">
                    <Sun className="h-[18px] w-[18px]" />
                  </span>
                  <span
                    className={cn(
                      'text-[11px] font-semibold',
                      preferences.theme === 'light' ? 'text-accent' : 'text-slate-500 dark:text-slate-400',
                    )}
                  >
                    Terang
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTheme('dark')}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-3 transition',
                    preferences.theme === 'dark'
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/10'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800',
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400">
                    <Moon className="h-[18px] w-[18px]" />
                  </span>
                  <span
                    className={cn(
                      'text-[11px] font-semibold',
                      preferences.theme === 'dark' ? 'text-accent' : 'text-slate-500 dark:text-slate-400',
                    )}
                  >
                    Gelap
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-slate-800/50">
              <div>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Mode gelap</p>
                <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">Nyaman untuk malam hari.</p>
              </div>
              <Toggle
                checked={preferences.theme === 'dark'}
                onChange={toggleTheme}
                label="Aktifkan mode gelap"
              />
            </div>

            <div className="mt-5">
              <p className="label">Warna aksen</p>
              <div className="flex flex-wrap gap-2.5">
                {ACCENTS.map((accent) => {
                  const selected = preferences.accent === accent.key
                  return (
                    <button
                      key={accent.key}
                      type="button"
                      onClick={() => setAccent(accent.key)}
                      aria-label={`Pilih warna aksen ${accent.label}`}
                      aria-pressed={selected}
                      title={accent.label}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full text-white transition',
                        accent.className,
                        selected
                          ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-slate-900'
                          : 'opacity-80 hover:scale-105 hover:opacity-100',
                      )}
                    >
                      {selected && <Check className="h-4 w-4" strokeWidth={3} />}
                    </button>
                  )
                })}
              </div>
              <p className="mt-2.5 text-[10px] text-slate-400 dark:text-slate-500">
                Warna aksen digunakan pada navigasi, tombol, dan grafik.
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between bg-accent px-3 py-2 text-white">
                <span className="text-[10px] font-bold">Dayli Pro</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              </div>
              <div className="bg-white p-3 dark:bg-slate-900">
                <div className="skeleton h-2 w-3/4 rounded-full" />
                <div className="mt-2 skeleton h-2 w-1/2 rounded-full" />
                <div className="mt-3 flex gap-1.5">
                  <span className="h-5 flex-1 rounded-md bg-accent/25" />
                  <span className="h-5 flex-1 rounded-md bg-accent/50" />
                  <span className="h-5 flex-1 rounded-md bg-accent" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <CardHeader
              icon={Sparkles}
              title="Tentang Dayli Pro"
              description="Aplikasi pencatatan harian personal."
            />
            <div className="mt-4 space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-500">Versi</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">1.0.0 · Demo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-500">Pengguna</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">1 (Admin)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-500">Penyimpanan</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Memori lokal</span>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-accent/[0.06] px-3.5 py-3 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
              “Catat harimu, rapikan hidupmu.” Dibuat untuk membantu melihat hari dengan lebih jernih.
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Keluar dari Dayli Pro?"
        description="Kamu perlu masuk kembali untuk melanjutkan. Catatan demo di sesi ini tidak akan hilang sampai halaman dimuat ulang."
        confirmLabel="Ya, keluar"
      />
    </div>
  )
}
