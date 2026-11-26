import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  Hash,
  NotebookPen,
  Search,
  SearchX,
  X,
} from 'lucide-react'
import { NAV_ITEMS } from '../config/navigation'
import { useApp } from '../context/AppContext'
import { cn, getMood, searchEntries } from '../utils/helpers'
import HabitIcon from './HabitIcon'
import { HABIT_COLORS } from '../data/mockData'
import { getHabitColor } from '../utils/helpers'

function Highlight({ text, query }) {
  if (!query.trim()) return text
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-accent/15 px-0.5 text-accent">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  )
}

export default function CommandPalette({ open, onClose }) {
  const { entries, tasks, habits } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    setQuery('')
    setActiveIndex(0)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => inputRef.current?.focus(), 60)
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose, open])

  const groups = useMemo(() => {
    const normalized = query.trim()
    const result = []

    const pages = NAV_ITEMS.filter((item) => {
      if (!normalized) return true
      return `${item.label} ${item.title} ${item.keywords} ${item.description}`
        .toLowerCase()
        .includes(normalized.toLowerCase())
    })
    if (pages.length) {
      result.push({
        label: 'Halaman',
        items: pages.map((item) => ({
          key: `page-${item.path}`,
          title: item.label,
          subtitle: item.description,
          icon: item.icon,
          type: 'page',
          onSelect: () => {
            onClose()
            navigate(item.path)
          },
        })),
      })
    }

    const entryResults = normalized
      ? searchEntries(entries, normalized).slice(0, 4)
      : [...entries].filter((entry) => entry.pinned).slice(0, 3)
    if (entryResults.length) {
      result.push({
        label: normalized ? 'Jurnal' : 'Jurnal tersemat',
        items: entryResults.map((entry) => {
          const mood = getMood(entry.mood)
          return {
            key: `journal-${entry.id}`,
            title: entry.title,
            subtitle: `${mood.emoji} ${mood.label} · ${entry.tags.slice(0, 2).join(' · ') || 'Tanpa tag'}`,
            icon: NotebookPen,
            type: 'journal',
            onSelect: () => {
              onClose()
              navigate(`/journal?entry=${entry.id}`)
            },
          }
        }),
      })
    }

    if (normalized) {
      const taskResults = tasks
        .filter((task) =>
          `${task.title} ${task.note} ${task.category}`.toLowerCase().includes(normalized.toLowerCase()),
        )
        .slice(0, 3)
      if (taskResults.length) {
        result.push({
          label: 'Tugas',
          items: taskResults.map((task) => ({
            key: `task-${task.id}`,
            title: task.title,
            subtitle: `${task.completed ? 'Selesai' : 'Aktif'} · ${task.category}`,
            icon: Hash,
            type: 'task',
            onSelect: () => {
              onClose()
              navigate(`/tasks?edit=${task.id}`)
            },
          })),
        })
      }

      const habitResults = habits
        .filter((habit) =>
          `${habit.name} ${habit.description}`.toLowerCase().includes(normalized.toLowerCase()),
        )
        .slice(0, 3)
      if (habitResults.length) {
        result.push({
          label: 'Kebiasaan',
          items: habitResults.map((habit) => ({
            key: `habit-${habit.id}`,
            title: habit.name,
            subtitle: habit.description || 'Kebiasaan harian',
            type: 'habit',
            habit,
            onSelect: () => {
              onClose()
              navigate(`/habits?edit=${habit.id}`)
            },
          })),
        })
      }
    }

    return result
  }, [entries, habits, navigate, onClose, query, tasks])

  const flatItems = useMemo(() => groups.flatMap((group) => group.items), [groups])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const element = scrollRef.current?.querySelector('[data-active="true"]')
    element?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % Math.max(flatItems.length, 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + flatItems.length) % Math.max(flatItems.length, 1))
    } else if (event.key === 'Enter' && flatItems[activeIndex]) {
      event.preventDefault()
      flatItems[activeIndex].onSelect()
    }
  }

  if (!open) return null

  let runningIndex = -1

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 sm:pt-[11vh]">
      <button
        type="button"
        aria-label="Tutup pencarian"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-[3px] animate-fade-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian global"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl animate-zoom-in dark:border-slate-700 dark:bg-slate-900"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-slate-800">
          <Search className="h-[18px] w-[18px] shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari halaman, jurnal, tugas, atau habit…"
            className="h-14 flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Bersihkan pencarian"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800 sm:block">
              ESC
            </kbd>
          )}
        </div>

        <div ref={scrollRef} className="custom-scrollbar max-h-[58vh] overflow-y-auto p-2">
          {flatItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <SearchX className="h-5 w-5" />
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Tidak ada hasil</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-400">
                Coba kata kunci lain, atau cari “jurnal”, “tugas”, atau “habit”.
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="mb-1 last:mb-0">
                <p className="px-3 pb-1.5 pt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    runningIndex += 1
                    const index = runningIndex
                    const active = index === activeIndex
                    const Icon = item.icon
                    const habitColor =
                      item.type === 'habit' ? getHabitColor(HABIT_COLORS, item.habit.color) : null
                    return (
                      <button
                        key={item.key}
                        type="button"
                        data-active={active}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={item.onSelect}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                          active
                            ? 'bg-accent/10'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/70',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                            active
                              ? 'bg-accent text-white'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                          )}
                        >
                          {item.type === 'habit' ? (
                            <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', active ? 'bg-accent text-white' : cn(habitColor.soft, habitColor.text))}>
                              <HabitIcon name={item.habit.icon} className="h-4 w-4" />
                            </span>
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                            <Highlight text={item.title} query={query} />
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] text-slate-400 dark:text-slate-500">
                            {item.subtitle}
                          </span>
                        </span>
                        {active && (
                          <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-accent" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
          <div className="flex items-center gap-3 text-[9px] font-medium text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-slate-200 p-0.5 dark:border-slate-700">
                <ArrowUp className="h-2.5 w-2.5" />
              </kbd>
              <kbd className="rounded border border-slate-200 p-0.5 dark:border-slate-700">
                <ArrowDown className="h-2.5 w-2.5" />
              </kbd>
              jelajahi
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-slate-200 p-0.5 dark:border-slate-700">
                <CornerDownLeft className="h-2.5 w-2.5" />
              </kbd>
              pilih
            </span>
          </div>
          <span className="text-[9px] font-medium text-slate-300 dark:text-slate-600">
            {flatItems.length} hasil
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
