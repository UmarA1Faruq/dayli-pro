import { PRIORITIES } from '../data/mockData'
import { cn } from '../utils/helpers'

const options = ['rendah', 'sedang', 'tinggi']

export default function PriorityPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
      {options.map((key) => {
        const priority = PRIORITIES[key]
        const selected = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition',
              selected
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', priority.dot)} />
            {priority.label}
          </button>
        )
      })}
    </div>
  )
}
