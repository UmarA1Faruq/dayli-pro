import { Link } from 'react-router-dom'
import { CalendarCheck2, Sparkles } from 'lucide-react'
import { cn } from '../utils/helpers'

export default function Logo({ compact = false, link = true, className, light = false }) {
  const content = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-accent via-violet-500 to-fuchsia-500 shadow-lg shadow-accent/25">
        <CalendarCheck2 className="h-5 w-5 text-white" strokeWidth={2.4} />
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-950" />
      </span>
      {!compact && (
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              'flex items-baseline gap-1.5 text-[19px] font-extrabold tracking-tight',
              light ? 'text-white' : 'text-slate-900 dark:text-white',
            )}
          >
            Dayli
            <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              Pro
            </span>
          </span>
          <span
            className={cn(
              'text-[10px] font-medium tracking-wide',
              light ? 'text-white/60' : 'text-slate-400 dark:text-slate-500',
            )}
          >
            Catat harimu, rapikan hidupmu.
          </span>
        </span>
      )}
    </span>
  )

  if (!link) return content

  return (
    <Link to="/dashboard" aria-label="Dayli Pro — ke dashboard" className="inline-flex">
      {content}
    </Link>
  )
}

export function LogoMark({ className }) {
  return (
    <span
      className={cn(
        'relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent via-violet-500 to-fuchsia-500 shadow-lg shadow-accent/25',
        className,
      )}
    >
      <CalendarCheck2 className="h-5 w-5 text-white" strokeWidth={2.4} />
      <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-amber-300" />
    </span>
  )
}
