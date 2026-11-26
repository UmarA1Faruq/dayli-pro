import { Check, Flame, Pencil, Trash2 } from 'lucide-react'
import { HABIT_COLORS } from '../data/mockData'
import {
  cn,
  getHabitColor,
  getHabitStreak,
  getLastNDays,
  toDateKey,
} from '../utils/helpers'
import HabitIcon from './HabitIcon'

export default function HabitItem({
  habit,
  onToggleDate,
  onEdit,
  onDelete,
  className,
}) {
  const color = getHabitColor(HABIT_COLORS, habit.color)
  const days = getLastNDays(7)
  const streak = getHabitStreak(habit.history)
  const todayKey = toDateKey()
  const completedToday = habit.history.includes(todayKey)
  const completedThisWeek = days.filter((day) => habit.history.includes(toDateKey(day))).length

  return (
    <div
      className={cn(
        'card card-hover group overflow-hidden p-5',
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            color.soft,
            color.text,
          )}
        >
          <HabitIcon name={habit.icon} className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold leading-snug text-slate-900 dark:text-white">
            {habit.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400 dark:text-slate-500">
            {habit.description || 'Kebiasaan kecil, dampak besar.'}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <span
            className={cn(
              'mr-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold',
              streak.current > 0
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
            )}
            title={`Streak saat ini: ${streak.current} hari`}
          >
            <Flame className="h-3 w-3" />
            {streak.current}
          </span>
          <button
            type="button"
            onClick={() => onEdit?.(habit)}
            aria-label={`Edit ${habit.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-accent/10 hover:text-accent"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(habit)}
            aria-label={`Hapus ${habit.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {days.map((day, index) => {
          const key = toDateKey(day)
          const done = habit.history.includes(key)
          const today = key === todayKey
          const dayName = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][(day.getDay() + 6) % 7]
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggleDate?.(habit.id, key)}
              aria-label={`${done ? 'Batalkan' : 'Centang'} ${habit.name} tanggal ${day.getDate()}`}
              className="group/day flex flex-col items-center gap-1.5 rounded-xl py-1 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <span
                className={cn(
                  'text-[10px] font-semibold',
                  today ? 'text-accent' : 'text-slate-400 dark:text-slate-500',
                )}
              >
                {dayName}
              </span>
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold transition',
                  done
                    ? cn('border-transparent text-white shadow-sm', color.solid)
                    : 'border-slate-200 bg-white text-slate-400 group-hover/day:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500',
                  today && !done && 'ring-2 ring-accent/30 ring-offset-2 ring-offset-white dark:ring-offset-slate-900',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : day.getDate()}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          <span>{completedThisWeek}/7 minggu ini</span>
          <span className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
          <span>Terbaik {streak.best} hari</span>
        </div>
        <button
          type="button"
          onClick={() => onToggleDate?.(habit.id, todayKey)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition',
            completedToday
              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400'
              : cn(color.soft, color.text, 'hover:brightness-95'),
          )}
        >
          {completedToday ? (
            <>
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              Selesai hari ini
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Centang hari ini
            </>
          )}
        </button>
      </div>
    </div>
  )
}
