import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Menu, X } from 'lucide-react'
import { MOBILE_ITEMS, MOBILE_MORE_ITEMS } from '../config/navigation'
import { cn } from '../utils/helpers'

export default function MobileNav() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreActive = MOBILE_MORE_ITEMS.some((item) => item.path === location.pathname)

  useEffect(() => {
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!moreOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleEscape = (event) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [moreOpen])

  return (
    <>
      <nav
        aria-label="Navigasi mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/92 lg:hidden"
      >
        <div className="mx-auto grid h-[62px] max-w-lg grid-cols-5 items-stretch px-1">
          {MOBILE_ITEMS.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 text-[9px] font-semibold transition',
                  active ? 'text-accent' : 'text-slate-400 dark:text-slate-500',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-11 items-center justify-center rounded-xl transition',
                    active && 'bg-accent/10',
                  )}
                >
                  <Icon className={cn('h-[19px] w-[19px]', active && 'stroke-[2.4]')} />
                </span>
                {item.shortLabel}
                {active && <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-accent" />}
              </Link>
            )
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 text-[9px] font-semibold transition',
              moreActive ? 'text-accent' : 'text-slate-400 dark:text-slate-500',
            )}
            aria-expanded={moreOpen}
            aria-label="Menu lainnya"
          >
            <span
              className={cn(
                'flex h-7 w-11 items-center justify-center rounded-xl transition',
                moreActive && 'bg-accent/10',
              )}
            >
              <Menu className="h-[19px] w-[19px]" />
            </span>
            Lainnya
            {moreActive && <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-accent" />}
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] animate-fade-in"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border border-slate-200/80 bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl animate-slide-up dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Menu lainnya</h2>
                <p className="mt-0.5 text-[11px] text-slate-400">Lihat ritme hidupmu dari sudut lain.</p>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Tutup"
                className="icon-btn h-9 w-9"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>
            <div className="space-y-1.5">
              {MOBILE_MORE_ITEMS.map((item) => {
                const Icon = item.icon
                const active = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border p-3 transition',
                      active
                        ? 'border-accent/20 bg-accent/5'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/70',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        active
                          ? 'bg-accent text-white'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold text-slate-800 dark:text-slate-100">
                        {item.label}
                      </span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                        {item.description}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
