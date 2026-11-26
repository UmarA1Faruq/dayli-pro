import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Flag, Flame, ListChecks, NotebookPen, Tag } from 'lucide-react'
import { HABIT_COLORS, JOURNAL_TAGS, MOODS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn, getHabitColor, toDateKey } from '../utils/helpers'
import Modal from './Modal'
import MoodPicker from './MoodPicker'
import PriorityPicker from './PriorityPicker'
import HabitVisualPicker from './HabitVisualPicker'
import HabitIcon from './HabitIcon'

const TABS = [
  { key: 'journal', label: 'Jurnal', icon: NotebookPen, hint: 'Tuangkan pikiranmu' },
  { key: 'task', label: 'Tugas', icon: ListChecks, hint: 'Catat satu langkah' },
  { key: 'habit', label: 'Habit', icon: Flame, hint: 'Bangun ritme kecil' },
]

const initialJournal = () => ({
  title: '',
  content: '',
  mood: 'tenang',
  date: toDateKey(),
  tag: '',
})

const initialTask = () => ({
  title: '',
  note: '',
  priority: 'sedang',
  dueDate: toDateKey(),
  category: 'Umum',
})

const initialHabit = () => ({
  name: '',
  description: '',
  icon: 'Sparkles',
  color: 'violet',
})

export default function QuickAddModal({ open, onClose }) {
  const { addJournal, addTask, addHabit } = useApp()
  const [tab, setTab] = useState('journal')
  const [journal, setJournal] = useState(initialJournal)
  const [task, setTask] = useState(initialTask)
  const [habit, setHabit] = useState(initialHabit)
  const [error, setError] = useState('')
  const titleRef = useRef(null)
  const activeTab = TABS.find((item) => item.key === tab)
  const habitColor = getHabitColor(HABIT_COLORS, habit.color)

  useEffect(() => {
    if (!open) return
    setTab('journal')
    setJournal(initialJournal())
    setTask(initialTask())
    setHabit(initialHabit())
    setError('')
    const timer = setTimeout(() => titleRef.current?.focus(), 150)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    setError('')
    const timer = setTimeout(() => titleRef.current?.focus(), 80)
    return () => clearTimeout(timer)
  }, [tab])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (tab === 'journal') {
      if (!journal.title.trim()) {
        setError('Beri judul singkat untuk jurnalmu.')
        return
      }
      if (!journal.content.trim()) {
        setError('Tuliskan setidaknya satu kalimat.')
        return
      }
      addJournal({
        title: journal.title.trim(),
        content: journal.content.trim(),
        mood: journal.mood,
        date: journal.date,
        tags: journal.tag ? [journal.tag] : [],
        pinned: false,
      })
    }

    if (tab === 'task') {
      if (!task.title.trim()) {
        setError('Tuliskan nama tugas terlebih dahulu.')
        return
      }
      addTask({
        title: task.title.trim(),
        note: task.note.trim(),
        priority: task.priority,
        dueDate: task.dueDate || toDateKey(),
        category: task.category,
      })
    }

    if (tab === 'habit') {
      if (!habit.name.trim()) {
        setError('Beri nama kebiasaan yang ingin kamu bangun.')
        return
      }
      addHabit({
        name: habit.name.trim(),
        description: habit.description.trim(),
        icon: habit.icon,
        color: habit.color,
      })
    }

    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tambah cepat"
      description={activeTab ? activeTab.hint : 'Catat satu hal kecil untuk hari ini.'}
      size="md"
      footer={
        <div className="flex gap-3">
          <button type="button" className="btn-secondary flex-1 sm:flex-none sm:px-6" onClick={onClose}>
            Batal
          </button>
          <button type="submit" form="quick-add-form" className="btn-primary flex-1 sm:px-8">
            {tab === 'journal' ? 'Simpan jurnal' : tab === 'task' ? 'Tambah tugas' : 'Buat habit'}
          </button>
        </div>
      }
    >
      <div className="mb-5 grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
        {TABS.map((item) => {
          const Icon = item.icon
          const active = tab === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition',
                active
                  ? 'bg-white text-accent shadow-sm dark:bg-slate-900'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>

      <form id="quick-add-form" onSubmit={handleSubmit} className="space-y-4">
        {tab === 'journal' && (
          <>
            <div>
              <label htmlFor="quick-journal-title" className="label">
                Judul
              </label>
              <input
                ref={titleRef}
                id="quick-journal-title"
                className="input font-semibold"
                placeholder="Apa yang ingin kamu ingat hari ini?"
                value={journal.title}
                onChange={(event) => setJournal((current) => ({ ...current, title: event.target.value }))}
                maxLength={90}
              />
            </div>
            <div>
              <span className="label">Mood</span>
              <MoodPicker
                compact
                value={journal.mood}
                onChange={(mood) => setJournal((current) => ({ ...current, mood }))}
              />
            </div>
            <div>
              <label htmlFor="quick-journal-content" className="label">
                Isi singkat
              </label>
              <textarea
                id="quick-journal-content"
                className="input min-h-[120px] resize-y leading-relaxed"
                placeholder="Hari ini terasa…"
                value={journal.content}
                onChange={(event) =>
                  setJournal((current) => ({ ...current, content: event.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="quick-journal-date" className="label">
                  Tanggal
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="quick-journal-date"
                    type="date"
                    className="input pl-10"
                    value={journal.date}
                    onChange={(event) =>
                      setJournal((current) => ({ ...current, date: event.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <label htmlFor="quick-journal-tag" className="label">
                  Tag
                </label>
                <div className="relative">
                  <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    id="quick-journal-tag"
                    className="select pl-10"
                    value={journal.tag}
                    onChange={(event) =>
                      setJournal((current) => ({ ...current, tag: event.target.value }))
                    }
                  >
                    <option value="">Tanpa tag</option>
                    {JOURNAL_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Pilihan mood: <span className="font-semibold">{MOODS[journal.mood]?.emoji} {MOODS[journal.mood]?.label}</span>
            </p>
          </>
        )}

        {tab === 'task' && (
          <>
            <div>
              <label htmlFor="quick-task-title" className="label">
                Nama tugas
              </label>
              <input
                ref={titleRef}
                id="quick-task-title"
                className="input font-semibold"
                placeholder="Contoh: Kirim laporan mingguan"
                value={task.title}
                onChange={(event) => setTask((current) => ({ ...current, title: event.target.value }))}
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="quick-task-note" className="label">
                Catatan <span className="font-normal text-slate-400">(opsional)</span>
              </label>
              <textarea
                id="quick-task-note"
                className="input min-h-[80px] resize-y"
                placeholder="Detail singkat tugas ini…"
                value={task.note}
                onChange={(event) => setTask((current) => ({ ...current, note: event.target.value }))}
                maxLength={200}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="quick-task-date" className="label">
                  Jatuh tempo
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="quick-task-date"
                    type="date"
                    className="input pl-10"
                    value={task.dueDate}
                    onChange={(event) =>
                      setTask((current) => ({ ...current, dueDate: event.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <label htmlFor="quick-task-category" className="label">
                  Kategori
                </label>
                <select
                  id="quick-task-category"
                  className="select"
                  value={task.category}
                  onChange={(event) =>
                    setTask((current) => ({ ...current, category: event.target.value }))
                  }
                >
                  {['Umum', 'Pekerjaan', 'Pribadi', 'Kesehatan', 'Keuangan', 'Rumah', 'Keluarga', 'Digital'].map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <div>
              <span className="label inline-flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5 text-slate-400" />
                Prioritas
              </span>
              <PriorityPicker
                value={task.priority}
                onChange={(priority) => setTask((current) => ({ ...current, priority }))}
              />
            </div>
          </>
        )}

        {tab === 'habit' && (
          <>
            <div
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3.5',
                habitColor.border,
                habitColor.soft,
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white',
                  habitColor.solid,
                )}
              >
                <HabitIcon name={habit.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {habit.name || 'Kebiasaan barumu'}
                </p>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {habit.description || 'Mulai kecil, ulangi setiap hari.'}
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="quick-habit-name" className="label">
                Nama kebiasaan
              </label>
              <input
                ref={titleRef}
                id="quick-habit-name"
                className="input font-semibold"
                placeholder="Contoh: Minum 8 gelas air"
                value={habit.name}
                onChange={(event) => setHabit((current) => ({ ...current, name: event.target.value }))}
                maxLength={60}
              />
            </div>
            <div>
              <label htmlFor="quick-habit-description" className="label">
                Deskripsi <span className="font-normal text-slate-400">(opsional)</span>
              </label>
              <input
                id="quick-habit-description"
                className="input"
                placeholder="Alasan kecil di balik kebiasaan ini…"
                value={habit.description}
                onChange={(event) =>
                  setHabit((current) => ({ ...current, description: event.target.value }))
                }
                maxLength={100}
              />
            </div>
            <HabitVisualPicker
              icon={habit.icon}
              color={habit.color}
              onIconChange={(icon) => setHabit((current) => ({ ...current, icon }))}
              onColorChange={(color) => setHabit((current) => ({ ...current, color }))}
            />
          </>
        )}

        {error && (
          <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
