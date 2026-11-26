import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Flame,
  ListChecks,
  Minus,
  MoonStar,
  NotebookPen,
  PenLine,
  Plus,
  Quote,
  Sparkles,
  Target,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { HABIT_COLORS, PRIORITIES } from '../data/mockData'
import {
  cn,
  formatFullDate,
  formatSleep,
  getDailyQuote,
  getGreeting,
  getHabitColor,
  getHabitStreak,
  getInitials,
  getJournalExcerpt,
  getMood,
  getMoodForDate,
  getTaskBucket,
  percentage,
  toDateKey,
} from '../utils/helpers'
import Card, { CardHeader } from '../components/Card'
import TaskItem from '../components/TaskItem'
import HabitIcon from '../components/HabitIcon'
import EmptyState from '../components/EmptyState'

function SummaryCard({ icon: Icon, iconClass, label, value, suffix, description, progress, accentBar }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
            {label}
          </p>
          <p className="mt-1.5 text-[26px] font-extrabold leading-none tracking-tight text-slate-900 dark:text-white">
            {value}
            {suffix && <span className="ml-0.5 text-base font-semibold text-slate-400 dark:text-slate-500">{suffix}</span>}
          </p>
          <p className="mt-1.5 truncate text-[11px] text-slate-400 dark:text-slate-500">{description}</p>
        </div>
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', iconClass)}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      {typeof progress === 'number' && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={cn('h-full rounded-full transition-all duration-500', accentBar)}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </Card>
  )
}

export default function Dashboard() {
  const {
    user,
    entries,
    tasks,
    habits,
    preferences,
    toggleTask,
    toggleHabitDate,
    setWater,
    setSleep,
    notify,
  } = useApp()
  const navigate = useNavigate()
  const now = new Date()
  const todayKey = toDateKey(now)
  const quote = getDailyQuote(now)

  const data = useMemo(() => {
    const todayTasks = tasks
      .filter((task) => task.dueDate === todayKey)
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        return PRIORITIES[b.priority].rank - PRIORITIES[a.priority].rank
      })
    const completedTasks = todayTasks.filter((task) => task.completed).length
    const overdueTasks = tasks.filter((task) => getTaskBucket(task) === 'overdue')
    const habitsDone = habits.filter((habit) => habit.history.includes(todayKey)).length
    const mood = getMoodForDate(entries, now)
    const bestStreak = habits.reduce(
      (best, habit) => Math.max(best, getHabitStreak(habit.history).best),
      0,
    )
    const lastEntry = entries[0]
    return {
      todayTasks,
      completedTasks,
      overdueTasks,
      habitsDone,
      mood,
      bestStreak,
      lastEntry,
    }
  }, [entries, habits, now, tasks, todayKey])

  const taskPercent = percentage(data.completedTasks, data.todayTasks.length)
  const habitPercent = percentage(data.habitsDone, habits.length)
  const waterPercent = percentage(preferences.water, preferences.waterTarget)
  const sleepPercent = percentage(preferences.sleep, preferences.sleepTarget)
  const sleepDifference = Math.round((preferences.sleep - preferences.sleepTarget) * 60)
  const sleepLabel =
    preferences.sleep >= 8
      ? 'Istirahat yang cukup'
      : preferences.sleep >= 7
        ? 'Hampir memenuhi target'
        : preferences.sleep >= 6
          ? 'Sedikit kurang dari target'
          : 'Tubuh butuh lebih banyak istirahat'

  const increaseWater = () => {
    const next = Math.min(preferences.waterTarget, preferences.water + 1)
    setWater(next)
    if (next === preferences.waterTarget && preferences.water < preferences.waterTarget) {
      notify('Target air minum tercapai!', 'Tubuhmu berterima kasih. Pertahankan sampai malam.', 'success')
    }
  }

  const decreaseWater = () => setWater(preferences.water - 1)

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent-strong to-violet-700 p-5 text-white shadow-xl shadow-accent/20 sm:p-7">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-fuchsia-400/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '38px 38px',
              maskImage: 'radial-gradient(ellipse at right, black, transparent 70%)',
            }}
          />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
              {formatFullDate(now)}
            </p>
            <h1 className="mt-2 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]">
              {getGreeting(now)}, {user.name}{' '}
              <span className="inline-block origin-bottom-right animate-[fade-in_0.6s_ease-out_0.2s_both]">👋</span>
            </h1>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/65">
              {data.todayTasks.length > 0
                ? `Ada ${data.todayTasks.length - data.completedTasks} tugas yang menunggu dan ${habits.length - data.habitsDone} habit untuk dicentang. Mulai pelan-pelan, ya.`
                : 'Belum ada tugas untuk hari ini. Nikmati ruang kosong dan tuliskan apa yang kamu rasakan.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/journal?new=1"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-accent shadow-sm transition hover:bg-white/90 active:scale-[0.98]"
              >
                <PenLine className="h-4 w-4" />
                Tulis jurnal
              </Link>
              <Link
                to="/tasks"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                Lihat tugas
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="w-full max-w-sm shrink-0 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">
                <Sparkles className="h-3 w-3 text-amber-300" />
                Kutipan harian
              </span>
              <Quote className="h-4 w-4 text-white/30" />
            </div>
            <p className="mt-2.5 text-[12.5px] font-medium leading-relaxed text-white/90">
              “{quote.text}”
            </p>
            <p className="mt-2 text-[10px] font-medium text-white/45">— {quote.author}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <SummaryCard
          icon={CheckCircle2}
          iconClass="bg-emerald-500/10 text-emerald-500"
          label="Tugas selesai"
          value={data.completedTasks}
          suffix={`/${data.todayTasks.length}`}
          description={
            data.todayTasks.length === 0
              ? 'Tidak ada tugas hari ini'
              : `${data.todayTasks.length - data.completedTasks} tugas lagi untuk diselesaikan`
          }
          progress={taskPercent}
          accentBar="bg-emerald-500"
        />
        <SummaryCard
          icon={Flame}
          iconClass="bg-amber-500/10 text-amber-500"
          label="Habit hari ini"
          value={data.habitsDone}
          suffix={`/${habits.length}`}
          description={`Streak terbaikmu ${data.bestStreak} hari`}
          progress={habitPercent}
          accentBar="bg-accent"
        />
        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                Mood hari ini
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[24px] leading-none">{data.mood?.emoji || '🫧'}</span>
                <p className="truncate text-[22px] font-extrabold leading-none tracking-tight text-slate-900 dark:text-white">
                  {data.mood?.label || 'Belum diisi'}
                </p>
              </div>
              <p className="mt-2 truncate text-[11px] text-slate-400 dark:text-slate-500">
                {data.mood ? 'Dari jurnal hari ini' : 'Tulis jurnal untuk mencatat mood'}
              </p>
            </div>
            {data.mood ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xl">
                {data.mood.emoji}
              </span>
            ) : (
              <Link
                to="/journal?new=1"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition hover:bg-amber-500/15"
                aria-label="Tulis jurnal hari ini"
              >
                <PenLine className="h-[18px] w-[18px]" />
              </Link>
            )}
          </div>
          {data.lastEntry && (
            <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-accent">
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="truncate">{data.lastEntry.title}</span>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <Card className="p-4 sm:p-5">
            <CardHeader
              icon={ListChecks}
              title="Tugas hari ini"
              description="Selesaikan satu per satu, tidak perlu terburu-buru."
              action={
                <Link
                  to="/tasks"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-accent transition hover:bg-accent/10"
                >
                  Lihat semua
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              }
            />

            {data.todayTasks.length === 0 ? (
              <EmptyState
                compact
                icon={ListChecks}
                title="Hari ini masih lapang"
                description="Tidak ada tugas dengan jatuh tempo hari ini. Kamu bisa menambah satu langkah kecil."
                action={
                  <button
                    type="button"
                    onClick={() => navigate('/tasks?new=1')}
                    className="btn-soft px-3 py-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah tugas
                  </button>
                }
                className="mt-4 border-0 bg-slate-50/80 dark:bg-slate-800/30"
              />
            ) : (
              <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/70">
                {data.todayTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    compact
                    onToggle={toggleTask}
                    onEdit={(item) => navigate(`/tasks?edit=${item.id}`)}
                  />
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <Target className="h-3.5 w-3.5 text-emerald-500" />
                {data.todayTasks.length === 0
                  ? 'Tambahkan tugas untuk mulai melacak progres.'
                  : taskPercent === 100
                    ? 'Semua tugas hari ini selesai. Kerja bagus!'
                    : `${taskPercent}% tugas hari ini selesai`}
              </div>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 sm:ml-6 sm:max-w-[160px]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${taskPercent}%` }}
                />
              </div>
            </div>

            {data.overdueTasks.length > 0 && (
              <Link
                to="/tasks"
                className="mt-3 flex items-center gap-2 rounded-xl bg-rose-500/[0.07] px-3.5 py-2.5 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-400"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {data.overdueTasks.length} tugas terlambat perlu perhatian
                <ArrowRight className="ml-auto h-3.5 w-3.5" />
              </Link>
            )}
          </Card>

          <Card className="p-4 sm:p-5">
            <CardHeader
              icon={NotebookPen}
              title="Jurnal terakhir"
              description="Satu paragraf kecil bisa jadi ruang pulang."
              action={
                <Link
                  to="/journal"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-accent transition hover:bg-accent/10"
                >
                  Lihat semua
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              }
            />

            {data.lastEntry ? (
              <button
                type="button"
                onClick={() => navigate(`/journal?entry=${data.lastEntry.id}`)}
                className="group mt-4 w-full rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-left transition hover:border-accent/30 hover:bg-accent/[0.03] dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-accent/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getMood(data.lastEntry.mood).emoji}</span>
                    <span className={cn('chip py-0.5', getMood(data.lastEntry.mood).className)}>
                      {getMood(data.lastEntry.mood).label}
                    </span>
                    {data.lastEntry.pinned && (
                      <span className="chip bg-amber-500/10 py-0.5 text-amber-600 dark:text-amber-400">
                        Disematkan
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    {formatFullDate(data.lastEntry.date).replace(/^[^,]+,\s/, '')}
                    <ArrowUpRight className="h-3 w-3 transition group-hover:text-accent" />
                  </span>
                </div>
                <h3 className="mt-2.5 text-[15px] font-bold text-slate-900 transition group-hover:text-accent dark:text-white">
                  {data.lastEntry.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {getJournalExcerpt(data.lastEntry.content, 180)}
                </p>
              </button>
            ) : (
              <EmptyState
                compact
                icon={NotebookPen}
                title="Belum ada catatan"
                description="Mulai dengan menuliskan satu hal yang kamu syukuri hari ini."
                action={
                  <Link to="/journal?new=1" className="btn-soft px-3 py-2 text-xs">
                    <PenLine className="h-3.5 w-3.5" />
                    Tulis jurnal
                  </Link>
                }
                className="mt-4 border-0 bg-slate-50/80 dark:bg-slate-800/30"
              />
            )}
          </Card>
        </div>

        <aside className="space-y-5 xl:col-span-4">
          <Card className="p-4 sm:p-5">
            <CardHeader
              icon={Droplets}
              title="Air minum"
              description={`Target ${preferences.waterTarget} gelas setiap hari.`}
              action={
                <span className="rounded-full bg-sky-500/10 px-2 py-1 text-[10px] font-bold text-sky-600 dark:text-sky-400">
                  {waterPercent}%
                </span>
              }
            />
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[28px] font-extrabold leading-none tracking-tight text-slate-900 dark:text-white">
                  {preferences.water}
                  <span className="ml-1 text-sm font-semibold text-slate-400">/ {preferences.waterTarget}</span>
                </p>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">gelas hari ini</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decreaseWater}
                  disabled={preferences.water === 0}
                  aria-label="Kurangi satu gelas"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={increaseWater}
                  disabled={preferences.water >= preferences.waterTarget}
                  aria-label="Tambah satu gelas"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex gap-1.5">
              {Array.from({ length: preferences.waterTarget }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setWater(index + 1)}
                  aria-label={`Isi ${index + 1} gelas`}
                  className={cn(
                    'h-7 flex-1 rounded-md transition',
                    index < preferences.water
                      ? 'bg-sky-500 hover:bg-sky-600'
                      : 'bg-slate-100 hover:bg-sky-500/20 dark:bg-slate-800',
                  )}
                />
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
              {preferences.water >= preferences.waterTarget
                ? 'Target tercapai. Jangan lupa minum secukupnya, bukan berlebihan.'
                : `Minum ${preferences.waterTarget - preferences.water} gelas lagi untuk mencapai target.`}
            </p>
          </Card>

          <Card className="p-4 sm:p-5">
            <CardHeader
              icon={MoonStar}
              title="Jam tidur"
              description="Tidur malam tadi."
            />
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-[28px] font-extrabold leading-none tracking-tight text-slate-900 dark:text-white">
                {formatSleep(preferences.sleep)}
              </p>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-[10px] font-bold',
                  preferences.sleep >= 8
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : preferences.sleep >= 7
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                )}
              >
                {sleepLabel}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[10px] font-medium text-slate-400">Target {preferences.sleepTarget} jam</p>
              <p
                className={cn(
                  'text-[10px] font-semibold',
                  sleepDifference >= 0 ? 'text-emerald-500' : 'text-amber-500',
                )}
              >
                {sleepDifference >= 0 ? `+${sleepDifference} mnt` : `${sleepDifference} mnt`}
              </p>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={preferences.sleep}
              onChange={(event) => setSleep(Number(event.target.value))}
              className="mt-4 w-full"
              aria-label="Atur jam tidur"
            />
            <div className="mt-2 flex justify-between text-[9px] font-medium text-slate-300 dark:text-slate-600">
              <span>4 jam</span>
              <span>7 jam</span>
              <span>10 jam</span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  preferences.sleep >= preferences.sleepTarget ? 'bg-emerald-500' : 'bg-accent',
                )}
                style={{ width: `${sleepPercent}%` }}
              />
            </div>
            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
              {preferences.sleep >= preferences.sleepTarget
                ? 'Kamu tidur sesuai target malam ini.'
                : `Kurang ${Math.abs(sleepDifference)} menit dari target tidurmu.`}
            </p>
          </Card>

          <Card className="p-4 sm:p-5">
            <CardHeader
              icon={Flame}
              title="Habit hari ini"
              description={`${data.habitsDone} dari ${habits.length} sudah selesai.`}
              action={
                <Link
                  to="/habits"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-accent transition hover:bg-accent/10"
                >
                  Semua
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
            <div className="mt-3 space-y-1">
              {habits.slice(0, 5).map((habit) => {
                const color = getHabitColor(HABIT_COLORS, habit.color)
                const done = habit.history.includes(todayKey)
                const streak = getHabitStreak(habit.history)
                return (
                  <div
                    key={habit.id}
                    className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        color.soft,
                        color.text,
                      )}
                    >
                      <HabitIcon name={habit.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {habit.name}
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                        <Flame className="h-2.5 w-2.5" />
                        {streak.current} hari beruntun
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleHabitDate(habit.id)}
                      aria-label={done ? `Batalkan ${habit.name}` : `Centang ${habit.name}`}
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition',
                        done
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 text-transparent hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 dark:border-slate-600',
                      )}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-[9px] font-extrabold text-accent">
                {getInitials(user.name)}
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                Jaga ritmenya, bukan kesempurnaannya.
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
