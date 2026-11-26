import { CalendarDays, Check, Pencil, Tag, Trash2 } from 'lucide-react'
import { PRIORITIES } from '../data/mockData'
import { cn, formatDueDate, getTaskBucket } from '../utils/helpers'

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  compact = false,
  className,
}) {
  const priority = PRIORITIES[task.priority] || PRIORITIES.sedang
  const bucket = getTaskBucket(task)
  const overdue = bucket === 'overdue'

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 transition hover:border-slate-200 hover:bg-slate-50/80 dark:hover:border-slate-700 dark:hover:bg-slate-800/50',
        task.completed && 'opacity-70',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onToggle?.(task.id)}
        aria-label={task.completed ? `Buka kembali ${task.title}` : `Selesaikan ${task.title}`}
        className={cn(
          'mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-lg border-2 transition duration-200',
          task.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 bg-white text-transparent hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 dark:border-slate-600 dark:bg-slate-900',
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onEdit?.(task)}
          className={cn(
            'block w-full truncate text-left text-sm font-semibold text-slate-800 transition hover:text-accent dark:text-slate-100',
            task.completed && 'text-slate-400 line-through dark:text-slate-500',
          )}
          title={task.title}
        >
          {task.title}
        </button>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className={cn('chip px-2 py-0.5 text-[10px]', priority.className)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', priority.dot)} />
            {priority.label}
          </span>

          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px] font-medium',
              overdue && !task.completed
                ? 'text-rose-500'
                : 'text-slate-400 dark:text-slate-500',
            )}
          >
            <CalendarDays className="h-3 w-3" />
            {formatDueDate(task.dueDate)}
          </span>

          {!compact && task.category && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <Tag className="h-3 w-3" />
              {task.category}
            </span>
          )}
        </div>

        {!compact && task.note && (
          <p className="mt-1.5 line-clamp-1 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
            {task.note}
          </p>
        )}

      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-accent/10 hover:text-accent"
            aria-label={`Edit ${task.title}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500"
            aria-label={`Hapus ${task.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
