import { Check } from 'lucide-react'
import { HABIT_COLORS, HABIT_ICONS } from '../data/mockData'
import { cn, getHabitColor } from '../utils/helpers'
import HabitIcon from './HabitIcon'

export default function HabitVisualPicker({ icon, color, onIconChange, onColorChange }) {
  const activeColor = getHabitColor(HABIT_COLORS, color)

  return (
    <div className="space-y-4">
      <div>
        <p className="label">Ikon</p>
        <div className="grid grid-cols-6 gap-2">
          {HABIT_ICONS.map((name) => {
            const selected = icon === name
            return (
              <button
                key={name}
                type="button"
                onClick={() => onIconChange(name)}
                aria-label={`Pilih ikon ${name}`}
                aria-pressed={selected}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-xl border transition',
                  selected
                    ? cn('border-transparent text-white shadow-sm', activeColor.solid)
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800',
                )}
              >
                <HabitIcon name={name} className="h-[18px] w-[18px]" />
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="label">Warna</p>
        <div className="flex flex-wrap items-center gap-2.5">
          {HABIT_COLORS.map((item) => {
            const selected = color === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onColorChange(item.key)}
                aria-label={`Pilih warna ${item.label}`}
                aria-pressed={selected}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-white transition',
                  item.solid,
                  selected
                    ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-slate-900'
                    : 'opacity-80 hover:opacity-100',
                )}
              >
                {selected && <Check className="h-4 w-4" strokeWidth={3} />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
