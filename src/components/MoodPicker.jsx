import { MOODS, MOOD_ORDER } from '../data/mockData'
import { cn } from '../utils/helpers'

export default function MoodPicker({ value, onChange, compact = false }) {
  return (
    <div className={cn('grid gap-2', compact ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-3 sm:grid-cols-6')}>
      {MOOD_ORDER.map((key) => {
        const mood = MOODS[key]
        const selected = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={selected}
            className={cn(
              'flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 transition',
              selected
                ? 'border-accent bg-accent/5 ring-2 ring-accent/15'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800',
            )}
          >
            <span className={compact ? 'text-lg leading-none' : 'text-xl leading-none'}>
              {mood.emoji}
            </span>
            <span
              className={cn(
                'text-[10px] font-semibold',
                selected ? 'text-accent' : 'text-slate-500 dark:text-slate-400',
              )}
            >
              {mood.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
