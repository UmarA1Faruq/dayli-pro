import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  CheckCheck,
  ListChecks,
  Plus,
  Search,
  Sun,
  Target,
  X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PRIORITIES } from '../data/mockData'
import {
  cn,
  getTaskBucket,
  percentage,
  toDateKey,
} from '../utils/helpers'
import { PageHeader } from '../components/PageHeader'
import Card from '../components/Card'
import TaskItem from '../components/TaskItem'
import TaskFormModal from '../components/TaskFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'completed', label: 'Selesai' },
]

const GROUPS = [
  {
    key: 'overdue',
    title: 'Terlambat',
    description: 'Butuh perhatian lebih dulu',
    icon: AlertTriangle,
    iconClass: 'bg-rose-500/10 text-rose-500',
    badgeClass: 'bg-rose-500/10 text-rose-500',
  },
  {
    key: 'today',
    title: 'Hari ini',
    description: 'Fokus utama hari ini',
    icon: Sun,
    iconClass: 'bg-amber-500/10 text-amber-500',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    key: 'upcoming',
    title: 'Mendatang',
    description: 'Sudah terjadwal, belum mendesak',
    icon: CalendarClock,
    iconClass: 'bg-accent/10 text-accent',
    badgeClass: 'bg-accent/10 text-accent',
  },
  {
    key: 'completed',
    title: 'Selesai',
    description: 'Kerja bagus, satu per satu beres',
    icon: CheckCircle2,
    iconClass: 'bg-emerald-500/10 text-emerald-500',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
]

const sortPriority = (a, b) => PRIORITIES[b.priority].rank - PRIORITIES[a.priority].rank

export default function Tasks() {
  const { tasks, deleteTask, toggleTask } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [defaultDate, setDefaultDate] = useState(toDateKey())
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    const editId = searchParams.get('edit')
    const isNew = searchParams.get('new')
    if (editId) {
      const task = tasks.find((item) => item.id === editId)
      if (task) {
        setEditingTask(task)
        setDefaultDate(task.dueDate)
        setModalOpen(true)
      }
      setSearchParams({}, { replace: true })
    } else if (isNew) {
      setEditingTask(null)
      setDefaultDate(searchParams.get('date') || toDateKey())
      setModalOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams, tasks])

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
      overdue: tasks.filter((task) => getTaskBucket(task) === 'overdue').length,
      today: tasks.filter((task) => getTaskBucket(task) === 'today').length,
    }),
    [tasks],
  )

  const filteredTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return tasks.filter((task) => {
      if (filter === 'active' && task.completed) return false
      if (filter === 'completed' && !task.completed) return false
      if (!normalized) return true
      return `${task.title} ${task.note} ${task.category}`.toLowerCase().includes(normalized)
    })
  }, [filter, query, tasks])

  const groups = useMemo(() => {
    const result = []
    const activeTasks = filteredTasks.filter((task) => !task.completed)
    if (filter !== 'completed') {
      GROUPS.slice(0, 3).forEach((group) => {
        const items = activeTasks
          .filter((task) => getTaskBucket(task) === group.key)
          .sort((a, b) => {
            if (group.key === 'overdue' || group.key === 'upcoming') {
              const dateCompare = a.dueDate.localeCompare(b.dueDate)
              return dateCompare !== 0 ? dateCompare : sortPriority(a, b)
            }
            return sortPriority(a, b)
          })
        if (items.length > 0) result.push({ ...group, tasks: items })
      })
    }
    if (filter !== 'active') {
      const completedTasks = filteredTasks
        .filter((task) => task.completed)
        .sort((a, b) => b.dueDate.localeCompare(a.dueDate))
      if (completedTasks.length > 0) {
        result.push({ ...GROUPS[3], tasks: completedTasks })
      }
    }
    return result
  }, [filter, filteredTasks])

  const progress = percentage(counts.completed, counts.all)
  const hasSearch = Boolean(query.trim())

  const openNew = () => {
    setEditingTask(null)
    setDefaultDate(toDateKey())
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setDefaultDate(task.dueDate)
    setModalOpen(true)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Fokus & prioritas"
        title="Tugas"
        description="Tuliskan hal yang perlu dilakukan, tentukan prioritas, lalu selesaikan satu langkah setiap kali."
        actions={
          <button type="button" onClick={openNew} className="btn-primary">
            <Plus className="h-4 w-4" />
            Tambah tugas
          </button>
        }
      />

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                Progres keseluruhan
              </p>
              <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {counts.completed}{' '}
                <span className="text-sm font-semibold text-slate-400">dari {counts.all} tugas</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Selesai</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-extrabold text-emerald-500 shadow-sm dark:bg-slate-900">
              {progress}%
            </span>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Aktif</p>
            <p className="mt-0.5 text-sm font-extrabold text-slate-800 dark:text-slate-100">{counts.active}</p>
          </div>
          <div className="rounded-xl bg-amber-500/[0.07] px-3 py-2.5">
            <p className="text-[10px] font-semibold text-amber-600/70 dark:text-amber-400/70">Hari ini</p>
            <p className="mt-0.5 text-sm font-extrabold text-amber-600 dark:text-amber-400">{counts.today}</p>
          </div>
          <div className="rounded-xl bg-rose-500/[0.07] px-3 py-2.5">
            <p className="text-[10px] font-semibold text-rose-600/70 dark:text-rose-400/70">Terlambat</p>
            <p className="mt-0.5 text-sm font-extrabold text-rose-600 dark:text-rose-400">{counts.overdue}</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid w-full grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80 sm:inline-flex sm:w-auto">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition',
                filter === item.key
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              {item.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                  filter === item.key
                    ? 'bg-accent/10 text-accent'
                    : 'bg-slate-200/80 text-slate-400 dark:bg-slate-700 dark:text-slate-500',
                )}
              >
                {counts[item.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full xl:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input py-2 pl-10 pr-9 text-xs"
            placeholder="Cari tugas atau kategori…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Cari tugas"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Hapus pencarian"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={hasSearch ? Search : filter === 'completed' ? CheckCheck : ListChecks}
          title={
            hasSearch
              ? 'Tugas yang dicari belum ada'
              : filter === 'completed'
                ? 'Belum ada tugas selesai'
                : filter === 'active'
                  ? 'Tidak ada tugas aktif'
                  : 'Daftar tugasmu masih kosong'
          }
          description={
            hasSearch
              ? 'Coba kata kunci lain. Kamu juga bisa menghapus pencarian untuk melihat semuanya.'
              : filter === 'completed'
                ? 'Centang tugas aktifmu, nanti akan muncul di bagian selesai.'
                : filter === 'active'
                  ? 'Semua tugas sudah selesai. Waktunya menikmati ruang kosong.'
                  : 'Mulai dengan satu tugas kecil yang bisa diselesaikan hari ini.'
          }
          action={
            hasSearch ? (
              <button type="button" onClick={() => setQuery('')} className="btn-secondary">
                <X className="h-4 w-4" />
                Hapus pencarian
              </button>
            ) : filter !== 'completed' ? (
              <button type="button" onClick={openNew} className="btn-primary">
                <Plus className="h-4 w-4" />
                Tambah tugas
              </button>
            ) : null
          }
        />
      ) : (
        <div className="space-y-5">
          {groups.map((group) => {
            const Icon = group.icon
            return (
              <Card key={group.key} className="overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-slate-800 sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', group.iconClass)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        {group.title}
                      </h2>
                      <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                        {group.description}
                      </p>
                    </div>
                  </div>
                  <span className={cn('chip shrink-0 py-1', group.badgeClass)}>
                    {group.tasks.length} tugas
                  </span>
                </div>
                <div className="divide-y divide-slate-100 p-1.5 dark:divide-slate-800/70 sm:p-2">
                  {group.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="flex flex-col gap-3 border-dashed bg-transparent p-4 shadow-none dark:bg-transparent sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 text-[11px] text-slate-400 dark:text-slate-500">
          <CalendarDays className="h-4 w-4" />
          Tugas terlambat tetap bisa diselesaikan hari ini. Tidak perlu menunggu awal pekan.
        </div>
        <button type="button" onClick={openNew} className="btn-soft px-3 py-2 text-[11px]">
          <Plus className="h-3.5 w-3.5" />
          Tambah tugas baru
        </button>
      </Card>

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editingTask}
        defaultDate={defaultDate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteTask(deleteTarget.id)
          setDeleteTarget(null)
        }}
        title="Hapus tugas ini?"
        description={`“${deleteTarget?.title || ''}” akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus tugas"
      />
    </div>
  )
}
