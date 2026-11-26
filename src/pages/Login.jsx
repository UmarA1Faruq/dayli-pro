import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Droplets,
  Eye,
  EyeOff,
  Flame,
  Loader2,
  LockKeyhole,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Logo, { LogoMark } from '../components/Logo'
import { cn, formatFullDate } from '../utils/helpers'

const previewTasks = [
  { label: 'Review proposal klien', done: false },
  { label: 'Kirim laporan progres', done: true },
  { label: 'Olahraga 30 menit', done: true },
]

export default function Login() {
  const { login, notify, preferences, toggleTheme } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('umar@daylipro.id')
  const [password, setPassword] = useState('daylipro')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Email dan kata sandi wajib diisi.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const success = login(email, password, remember)
      setLoading(false)
      if (success) {
        navigate('/dashboard', { replace: true })
      } else {
        setError('Email atau kata sandi belum tepat. Coba akun demo di bawah.')
      }
    }, 650)
  }

  const fillDemo = () => {
    setEmail('umar@daylipro.id')
    setPassword('daylipro')
    setError('')
    notify('Akun demo siap', 'Klik “Masuk ke Dayli Pro” untuk melanjutkan.', 'info')
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col xl:p-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-accent/35 blur-[110px]" />
          <div className="absolute -bottom-40 right-[-10%] h-[480px] w-[480px] rounded-full bg-violet-600/25 blur-[120px]" />
          <div className="absolute right-[20%] top-[30%] h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[90px]" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
              backgroundSize: '46px 46px',
              maskImage: 'radial-gradient(ellipse at center, black, transparent 72%)',
            }}
          />
        </div>

        <div className="relative z-10">
          <Logo light />
        </div>

        <div className="relative z-10 my-auto max-w-xl py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Ruang pribadimu, satu tempat
          </span>

          <h1 className="mt-6 text-balance text-[44px] font-extrabold leading-[1.08] tracking-[-0.03em] xl:text-[52px]">
            Catat harimu,
            <br />
            <span className="bg-gradient-to-r from-accent-light via-white to-fuchsia-200 bg-clip-text text-transparent">
              rapikan hidupmu.
            </span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/60">
            Jurnal, tugas, kebiasaan, dan ritme harianmu dalam satu ruang yang tenang. Mulai dari
            langkah kecil hari ini.
          </p>

          <div className="relative mt-10 max-w-md">
            <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-white/10 to-transparent blur-xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
                    Hari ini
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">{formatFullDate()}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  4 hari konsisten
                </span>
              </div>

              <div className="mt-5 space-y-2.5">
                {previewTasks.map((task) => (
                  <div
                    key={task.label}
                    className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] px-3 py-2.5"
                  >
                    <span
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-md border',
                        task.done
                          ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                          : 'border-white/25',
                      )}
                    >
                      {task.done && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-medium',
                        task.done ? 'text-white/40 line-through' : 'text-white/85',
                      )}
                    >
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white/[0.06] p-3">
                  <Droplets className="h-4 w-4 text-sky-300" />
                  <p className="mt-2 text-sm font-extrabold text-white">5/8</p>
                  <p className="text-[9px] text-white/40">gelas air</p>
                </div>
                <div className="rounded-xl bg-white/[0.06] p-3">
                  <Flame className="h-4 w-4 text-amber-300" />
                  <p className="mt-2 text-sm font-extrabold text-white">7 hari</p>
                  <p className="text-[9px] text-white/40">streak terbaik</p>
                </div>
                <div className="rounded-xl bg-white/[0.06] p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <p className="mt-2 text-sm font-extrabold text-white">2/4</p>
                  <p className="text-[9px] text-white/40">tugas selesai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[11px] font-medium text-white/40">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            100% privat
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span>Dibuat untuk satu pengguna</span>
          <span className="h-3 w-px bg-white/15" />
          <span>Data demo lokal</span>
        </div>
      </aside>

      <main className="relative flex min-h-[100dvh] flex-col px-5 py-5 sm:px-8 sm:py-7">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={preferences.theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            className="icon-btn border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          <div className="mb-8">
            <LogoMark className="mb-5 h-12 w-12 lg:hidden" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              Selamat datang kembali
            </p>
            <h2 className="mt-2 text-[30px] font-extrabold tracking-tight text-slate-900 dark:text-white">
              Masuk ke Dayli Pro
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Lanjutkan ritme harianmu. Semua catatanmu menunggu di sini.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="label">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  className="input h-12 pl-11"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="label">
                Kata sandi
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input h-12 px-11"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={remember}
                onClick={() => setRemember((current) => !current)}
                className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <span
                  className={cn(
                    'flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition',
                    remember
                      ? 'border-accent bg-accent text-white'
                      : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900',
                  )}
                >
                  {remember && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                Ingat saya
              </button>
              <button
                type="button"
                onClick={() =>
                  notify(
                    'Akun demo',
                    'Gunakan umar@daylipro.id dengan kata sandi “daylipro”.',
                    'info',
                  )
                }
                className="text-xs font-semibold text-accent hover:underline"
              >
                Lupa kata sandi?
              </button>
            </div>

            {error && (
              <p className="rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium leading-relaxed text-rose-600 dark:text-rose-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary h-12 w-full rounded-xl text-[14px] shadow-float"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyiapkan harimu…
                </>
              ) : (
                <>
                  Masuk ke Dayli Pro
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">Akun demo</p>
              <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                umar@daylipro.id · daylipro
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="shrink-0 self-center text-[11px] font-bold text-accent hover:underline"
            >
              Isi otomatis
            </button>
          </div>

          <p className="mt-8 text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
            Dengan masuk, kamu menyetujui{' '}
            <button
              type="button"
              onClick={() => notify('Kebijakan privasi', 'Semua data pada demo ini hanya tersimpan di perangkatmu.', 'info')}
              className="font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-accent dark:text-slate-400"
            >
              Kebijakan Privasi
            </button>{' '}
            Dayli Pro.
          </p>
        </div>

        <p className="mx-auto w-full max-w-[400px] text-center text-[10px] text-slate-300 dark:text-slate-600">
          © 2026 Dayli Pro · Dibuat dengan tenang untuk hari yang lebih teratur.
        </p>
      </main>
    </div>
  )
}
