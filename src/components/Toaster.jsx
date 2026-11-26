import { AlertCircle, CheckCircle2, Info, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cn } from '../utils/helpers'

const toastStyles = {
  success: {
    icon: CheckCircle2,
    iconClass: 'bg-emerald-500/10 text-emerald-500',
    bar: 'bg-emerald-500',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'bg-rose-500/10 text-rose-500',
    bar: 'bg-rose-500',
  },
  delete: {
    icon: Trash2,
    iconClass: 'bg-rose-500/10 text-rose-500',
    bar: 'bg-rose-500',
  },
  info: {
    icon: Info,
    iconClass: 'bg-accent/10 text-accent',
    bar: 'bg-accent',
  },
}

export default function Toaster() {
  const { toasts, dismissToast } = useApp()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-4 z-[120] flex flex-col items-end gap-2.5 sm:inset-x-auto sm:right-6 sm:top-6 sm:w-full sm:max-w-sm"
    >
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.success
        const Icon = style.icon
        return (
          <div
            key={toast.id}
            className="pointer-events-auto relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xl shadow-slate-900/10 backdrop-blur animate-toast-in dark:border-slate-700 dark:bg-slate-900/95"
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  style.iconClass,
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold leading-snug text-slate-900 dark:text-white">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Tutup notifikasi"
                className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className={cn('absolute inset-x-0 bottom-0 h-0.5 opacity-70', style.bar)} />
          </div>
        )
      })}
    </div>
  )
}
