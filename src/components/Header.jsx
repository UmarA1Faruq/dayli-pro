import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  ChevronDown,
  Flame,
  ListChecks,
  LogOut,
  Moon,
  NotebookPen,
  Search,
  Settings,
  Sun,
  UserRound,
} from 'lucide-react'
import { PAGE_META } from '../config/navigation'
import { useApp } from '../context/AppContext'
import { cn } from '../utils/helpers'
import { LogoMark } from './Logo'
import Avatar from './Avatar'

const notificationIcons = {
  streak: Flame,
  task: ListChecks,
  journal: NotebookPen,
}

export default function Header({ onSearch }) {
  const {
    user,
    notifications,
    unreadNotifications,
    markNotificationsRead,
    logout,
    preferences,
    toggleTheme,
  } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const meta = PAGE_META[location.pathname] || { label: 'Dayli Pro' }
  const [openMenu, setOpenMenu] = useState(null)
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    setOpenMenu(null)
  }, [location.pathname])

  useEffect(() => {
    if (!openMenu) return undefined
    const handlePointerDown = (event) => {
      if (
        openMenu === 'notifications' &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setOpenMenu(null)
      }
      if (
        openMenu === 'profile' &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpenMenu(null)
      }
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [openMenu])

  const handleLogout = () => {
    setOpenMenu(null)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-slate-50/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-[76px] lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
            <LogoMark className="h-9 w-9 rounded-xl" />
            <span className="block text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">
              Dayli <span className="text-accent">Pro</span>
            </span>
          </Link>
          <div className="hidden min-w-0 lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Dayli Pro <span className="mx-1 text-slate-300 dark:text-slate-700">/</span> {meta.label}
            </p>
            <h1 className="mt-0.5 truncate text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">
              {meta.label}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={onSearch}
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-400 shadow-sm transition hover:border-slate-300 hover:text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-slate-700 dark:hover:text-slate-300 md:flex md:w-56 xl:w-64"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Cari apa saja…</span>
            <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              Ctrl K
            </kbd>
          </button>

          <button
            type="button"
            onClick={onSearch}
            aria-label="Cari"
            className="icon-btn md:hidden"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={preferences.theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            className="icon-btn"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>

          <div ref={notificationsRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() =>
                setOpenMenu((current) => (current === 'notifications' ? null : 'notifications'))
              }
              aria-label="Notifikasi"
              aria-expanded={openMenu === 'notifications'}
              className="icon-btn relative"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadNotifications > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-50 dark:ring-slate-950" />
              )}
            </button>

            {openMenu === 'notifications' && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/10 animate-zoom-in dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Notifikasi</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {unreadNotifications > 0
                        ? `${unreadNotifications} belum dibaca`
                        : 'Semua sudah dibaca'}
                    </p>
                  </div>
                  {unreadNotifications > 0 && (
                    <button
                      type="button"
                      onClick={markNotificationsRead}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-accent hover:underline"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto p-2">
                  {notifications.map((item) => {
                    const Icon = notificationIcons[item.type] || Bell
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'flex gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/70',
                          !item.read && 'bg-accent/[0.04] dark:bg-accent/[0.06]',
                        )}
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-100">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                            {item.message}
                          </p>
                          <p className="mt-1 text-[9px] font-medium text-slate-400 dark:text-slate-500">
                            {item.time}
                          </p>
                        </div>
                        {!item.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div ref={profileRef} className="relative ml-0.5">
            <button
              type="button"
              onClick={() => setOpenMenu((current) => (current === 'profile' ? null : 'profile'))}
              aria-label="Menu profil"
              aria-expanded={openMenu === 'profile'}
              className="flex items-center gap-1 rounded-full p-0.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Avatar name={user.fullName} size="sm" showStatus />
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            </button>

            {openMenu === 'profile' && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-60 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-zoom-in dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-1 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-800/60">
                  <Avatar name={user.fullName} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {user.fullName}
                    </p>
                    <p className="truncate text-[10px] text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenu(null)
                    navigate('/settings')
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <UserRound className="h-4 w-4 text-slate-400" />
                  Profil saya
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenu(null)
                    navigate('/settings')
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Pengaturan
                </button>
                <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-rose-500 transition hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
