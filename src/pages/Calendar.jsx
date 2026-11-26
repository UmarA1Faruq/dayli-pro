import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  NotebookPen,
  PenLine,
  Plus,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { HABIT_COLORS, PRIORITIES } from '../data/mockData'
import {
  cn,
  formatFullDate,
  getHabitColor,
  getMood,
  toDateKey,
} from '../utils/helpers'
import { PageHeader } from '../components/PageHeader'
import Card from '../components/Card'
import Modal from '../components/Modal'
import HabitIcon from '../components/HabitIcon'
import useMediaQuery from '../hooks/useMediaQuery'

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

const DOTS = [
  { key: 'journal', className: 'bg-accent' },
  { key: 'task', className: 'bg-amber-500' },
  { key: 'habit', className: 'bg-emerald-500' },
]

function DayActivities({
  date,
  journals,
  dayTasks,
  completedHabits,
  onToggleTask,
  onOpenJournal,
  onWriteJournal,
  onAddTask,
}) {
  const total = journals.length + dayTasks.length + completedHabits.length

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
              {isSameDay(date, new Date()) ? 'Hari ini' : format(date, 'EEEE', { locale: localeId })}
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {format(date, 'd MMMM yyyy', { locale: localeId })}
            </h2>
          </div>
          <span className="chip bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {total} aktivitas
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          {formatFullDate(date)}
        </p>
      </div>

      <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-4">
        <section>
          <div className="flex items-center justify-between">
            <h3 className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
              <NotebookPen className="h-3.5 w-3.5 text-accent" />
              Jurnal
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">{journals.length}</span>
          </div>
          {journals.length > 0 ? (
            <div className="mt-2 space-y-1.5">
              {journals.map((entry) => {
                const mood = getMood(entry.mood)
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => onOpenJournal(entry)}
                    className="flex w-full items-start gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-left transition hover:bg-accent/5 dark:bg-slate-800/50 dark:hover:bg-accent/10"
                  >
                    <span className="mt-0.5 text-base leading-none">{mood.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {entry.title}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-slate-400">
                        {mood.label} · {entry.tags.slice(0, 2).join(', ') || 'Tanpa tag'}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="mt-2 rounded-xl border border-dashed border-slate-200 px-3 py-2.5 text-[11px] text-slate-400 dark:border-slate-700 dark:text-slate-500">
              Belum ada catatan jurnal pada hari ini.
            </p>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
              <ListChecks className="h-3.5 w-3.5 text-amber-500" />
              Tugas
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">{dayTasks.length}</span>
          </div>
          {dayTasks.length > 0 ? (
            <div className="mt-2 space-y-1.5">
              {dayTasks.map((task) => {
                const priority = PRIORITIES[task.priority]
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50"
                  >
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      aria-label={task.completed ? `Buka kembali ${task.title}` : `Selesaikan ${task.title}`}
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition',
                        task.completed
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 text-transparent hover:border-emerald-500 dark:border-slate-600',
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-xs font-semibold text-slate-700 dark:text-slate-200',
                          task.completed && 'text-slate-400 line-through dark:text-slate-500',
                        )}
                      >
                        {task.title}
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-slate-400">
                        <span className={cn('h-1.5 w-1.5 rounded-full', priority.dot)} />
                        {priority.label}
                        {task.completed && ' · Selesai'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="mt-2 rounded-xl border border-dashed border-slate-200 px-3 py-2.5 text-[11px] text-slate-400 dark:border-slate-700 dark:text-slate-500">
              Tidak ada tugas dengan jatuh tempo di tanggal ini.
            </p>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Habit
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">{completedHabits.length}</span>
          </div>
          {completedHabits.length > 0 ? (
            <div className="mt-2 space-y-1.5">
              {completedHabits.map((habit) => {
                const color = getHabitColor(HABIT_COLORS, habit.color)
                return (
                  <div
                    key={habit.id}
                    className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50"
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                        color.soft,
                        color.text,
                      )}
                    >
                      <HabitIcon name={habit.icon} className="h-3.5 w-3.5" />
                    </span>
                    <p className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {habit.name}
                    </p>
                    <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="mt-2 rounded-xl border border-dashed border-slate-200 px-3 py-2.5 text-[11px] text-slate-400 dark:border-slate-700 dark:text-slate-500">
              Belum ada habit yang dicentang.
            </p>
          )}
        </section>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
        <button type="button" onClick={onWriteJournal} className="btn-soft px-2 py-2.5 text-xs">
          <PenLine className="h-3.5 w-3.5" />
          Tulis jurnal
        </button>
        <button type="button" onClick={onAddTask} className="btn-secondary px-2 py-2.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Tambah tugas
        </button>
      </div>
    </div>
  )
}

export default function Calendar() {
  const { entries, tasks, habits, toggleTask } = useApp()
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 1280px)')
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [viewDate])

  const activityMap = useMemo(() => {
    const map = {}
    days.forEach((day) => {
      const key = toDateKey(day)
      map[key] = {
        journal: entries.some((entry) => entry.date === key),
        task: tasks.some((task) => task.dueDate === key),
        habit: habits.some((habit) => habit.history.includes(key)),
      }
    })
    return map
  }, [days, entries, habits, tasks])

  const selectedKey = toDateKey(selectedDate)
  const selectedData = useMemo(
    () => ({
      journals: entries.filter((entry) => entry.date === selectedKey),
      dayTasks: tasks.filter((task) => task.dueDate === selectedKey),
      completedHabits: habits.filter((habit) => habit.history.includes(selectedKey)),
    }),
    [entries, habits, selectedKey, tasks],
  )

  const selectedTotal =
    selectedData.journals.length + selectedData.dayTasks.length + selectedData.completedHabits.length

  const changeMonth = (delta) => {
    const next = addMonths(viewDate, delta)
    setViewDate(next)
    if (!isSameMonth(selectedDate, next)) setSelectedDate(startOfMonth(next))
  }

  const goToday = () => {
    const now = new Date()
    setViewDate(now)
    setSelectedDate(now)
  }

  const handleSelectDay = (day) => {
    setSelectedDate(day)
    if (!isSameMonth(day, viewDate)) setViewDate(day)
    if (!isDesktop) setMobilePanelOpen(true)
  }

  const openJournal = (entry) => {
    setMobilePanelOpen(false)
    navigate(`/journal?entry=${entry.id}`)
  }

  const writeJournal = () => {
    setMobilePanelOpen(false)
    navigate(`/journal?new=1&date=${selectedKey}`)
  }

  const addTask = () => {
    setMobilePanelOpen(false)
    navigate(`/tasks?new=1&date=${selectedKey}`)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Pola harian"
        title="Kalender"
        description="Lihat jejak jurnal, tugas, dan kebiasaanmu dalam satu tampilan. Klik tanggal untuk melihat ceritanya."
        actions={
          <button type="button" onClick={goToday} className="btn-secondary">
            <CalendarDays className="h-4 w-4" />
            Hari ini
          </button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <CalendarDays className="h-[18px] w-[18px]" />
              </span>
              <div>
                <h2 className="text-base font-bold capitalize tracking-tight text-slate-900 dark:text-white">
                  {format(viewDate, 'MMMM yyyy', { locale: localeId })}
                </h2>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {selectedTotal} aktivitas pada tanggal terpilih
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Bulan sebelumnya"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goToday}
                className="h-8 rounded-lg border border-slate-200 px-2.5 text-[10px] font-bold text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Hari ini
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Bulan berikutnya"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-2.5 sm:p-4">
            <div className="mb-1.5 grid grid-cols-7 gap-1 sm:mb-2 sm:gap-1.5">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="py-1 text-center text-[9px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 sm:text-[10px]"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {days.map((day) => {
                const key = toDateKey(day)
                const inMonth = isSameMonth(day, viewDate)
                const today = isSameDay(day, new Date())
                const selected = isSameDay(day, selectedDate)
                const markers = activityMap[key] || {}
                const activityCount = DOTS.filter((dot) => markers[dot.key]).length
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    aria-label={`${format(day, 'd MMMM yyyy', { locale: localeId })}, ${activityCount} jenis aktivitas`}
                    aria-pressed={selected}
                    className={cn(
                      'relative flex min-h-[54px] flex-col items-center justify-between rounded-xl border p-1.5 text-center transition sm:min-h-[82px] sm:items-start sm:p-2 sm:text-left',
                      inMonth
                        ? 'border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/60'
                        : 'border-transparent opacity-35 hover:bg-slate-50 dark:hover:bg-slate-800/40',
                      selected &&
                        'border-accent/40 bg-accent/[0.05] hover:border-accent/50 hover:bg-accent/[0.07]',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition sm:h-7 sm:w-7',
                        today
                          ? 'bg-accent text-white shadow-sm'
                          : selected
                            ? 'text-accent'
                            : 'text-slate-600 dark:text-slate-300',
                      )}
                    >
                      {format(day, 'd')}
                    </span>

                    {activityCount > 0 && (
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        {DOTS.filter((dot) => markers[dot.key]).map((dot) => (
                          <span key={dot.key} className={cn('h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5', dot.className)} />
                        ))}
                      </span>
                    )}
                    {activityCount === 0 && <span className="hidden h-1.5 sm:block" />}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-slate-100 px-1 pt-3 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Jurnal
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Tugas
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Habit
              </span>
              <span className="ml-auto hidden text-[10px] text-slate-300 dark:text-slate-600 sm:block">
                Klik tanggal untuk detail
              </span>
            </div>
          </div>
        </Card>

        <Card className="hidden overflow-hidden xl:sticky xl:top-[92px] xl:flex xl:h-[calc(100vh-116px)] xl:max-h-[680px] xl:flex-col">
          <DayActivities
            date={selectedDate}
            journals={selectedData.journals}
            dayTasks={selectedData.dayTasks}
            completedHabits={selectedData.completedHabits}
            onToggleTask={toggleTask}
            onOpenJournal={openJournal}
            onWriteJournal={writeJournal}
            onAddTask={addTask}
          />
        </Card>
      </div>

      <Modal
        open={mobilePanelOpen && !isDesktop}
        onClose={() => setMobilePanelOpen(false)}
        title="Aktivitas harian"
        description={formatFullDate(selectedDate)}
        size="md"
        bodyClassName="p-0"
        className="max-h-[86dvh]"
      >
        <DayActivities
          date={selectedDate}
          journals={selectedData.journals}
          dayTasks={selectedData.dayTasks}
          completedHabits={selectedData.completedHabits}
          onToggleTask={toggleTask}
          onOpenJournal={openJournal}
          onWriteJournal={writeJournal}
          onAddTask={addTask}
        />
      </Modal>
    </div>
  )
}
