import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Flame,
  Smile,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { HABIT_COLORS, MOOD_ORDER, MOODS } from '../data/mockData'
import {
  cn,
  formatShortDate,
  getHabitColor,
  getHabitStreak,
  getLastNDays,
  getMood,
  getMoodWeekData,
  percentage,
  toDateKey,
} from '../utils/helpers'
import { PageHeader } from '../components/PageHeader'
import Card, { CardHeader } from '../components/Card'
import HabitIcon from '../components/HabitIcon'

const ACCENT_HEX = {
  indigo: '#6366f1',
  violet: '#8b5cf6',
  rose: '#f43f5e',
  sky: '#0ea5e9',
  emerald: '#10b981',
}

function StatTile({ icon: Icon, iconClass, label, value, suffix, description, bar, barClass }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
            {label}
          </p>
          <p className="mt-1.5 text-[25px] font-extrabold leading-none tracking-tight text-slate-900 dark:text-white">
            {value}
            {suffix && <span className="ml-0.5 text-sm font-semibold text-slate-400">{suffix}</span>}
          </p>
          <p className="mt-1.5 line-clamp-2 min-h-[26px] text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            {description}
          </p>
        </div>
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', iconClass)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {typeof bar === 'number' && (
        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className={cn('h-full rounded-full', barClass)} style={{ width: `${Math.min(bar, 100)}%` }} />
        </div>
      )}
    </Card>
  )
}

function MoodTooltip({ active, payload, isDark }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div
      className={cn(
        'rounded-xl border px-3 py-2 shadow-xl',
        isDark
          ? 'border-slate-700 bg-slate-900 text-slate-100'
          : 'border-slate-200 bg-white text-slate-800',
      )}
    >
      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{data.fullDate}</p>
      <p className="mt-1 text-xs font-bold">
        {data.emoji} {data.mood}
      </p>
      {data.score && <p className="mt-0.5 text-[10px] text-slate-400">Skor mood {data.score}/5</p>}
    </div>
  )
}

function HabitTooltip({ active, payload, isDark }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className={cn(
        'rounded-xl border px-3 py-2 shadow-xl',
        isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white',
      )}
    >
      <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
        {payload[0].payload.day}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
        {payload[0].value}% habit selesai
      </p>
    </div>
  )
}

function ChartEmpty({ icon: Icon, title, description }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 px-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">{title}</p>
      <p className="mt-1 max-w-[240px] text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default function Stats() {
  const { entries, tasks, habits, preferences } = useApp()
  const isDark = preferences.theme === 'dark'
  const accent = ACCENT_HEX[preferences.accent] || ACCENT_HEX.indigo
  const deviceTrack = isDark ? '#1e293b' : '#f1f5f9'
  const axisColor = isDark ? '#64748b' : '#94a3b8'
  const gridColor = isDark ? '#1e293b' : '#e8edf3'

  const stats = useMemo(() => {
    const days = getLastNDays(7)
    const moodData = getMoodWeekData(entries, days)
    const moodScores = moodData.filter((item) => item.score !== null).map((item) => item.score)
    const averageMood = moodScores.length
      ? moodScores.reduce((total, score) => total + score, 0) / moodScores.length
      : null
    const closestMoodKey = averageMood
      ? MOOD_ORDER.reduce((closest, key) =>
          Math.abs(MOODS[key].score - averageMood) < Math.abs(MOODS[closest].score - averageMood)
            ? key
            : closest,
        )
      : null

    const completedTasks = tasks.filter((task) => task.completed).length
    const taskPercent = percentage(completedTasks, tasks.length)

    const habitDaily = days.map((day) => {
      const key = toDateKey(day)
      const done = habits.filter((habit) => habit.history.includes(key)).length
      return {
        day: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][day.getDay()],
        fullDate: formatShortDate(day),
        completed: done,
        percent: percentage(done, habits.length),
      }
    })
    const habitChecks = habitDaily.reduce((total, item) => total + item.completed, 0)
    const habitTarget = habits.length * days.length
    const habitPercent = percentage(habitChecks, habitTarget)

    const habitStreaks = habits
      .map((habit) => ({ habit, ...getHabitStreak(habit.history) }))
      .sort((a, b) => b.best - a.best)
    const longestStreak = habitStreaks[0]?.best || 0
    const activeStreak = habitStreaks.reduce((best, item) => Math.max(best, item.current), 0)
    const topHabits = habitStreaks.slice(0, 3)

    return {
      days,
      moodData,
      averageMood,
      closestMoodKey,
      completedTasks,
      taskPercent,
      activeTasks: tasks.length - completedTasks,
      habitDaily,
      habitChecks,
      habitTarget,
      habitPercent,
      longestStreak,
      activeStreak,
      topHabits,
    }
  }, [entries, habits, tasks])

  const moodMeta = stats.closestMoodKey ? getMood(stats.closestMoodKey) : null
  const taskChart = [
    { name: 'Selesai', value: stats.completedTasks, color: '#10b981' },
    { name: 'Belum selesai', value: stats.activeTasks, color: deviceTrack },
  ]

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Lihat lebih jernih"
        title="Statistik"
        description="Angka bukan penilaian, tapi cermin. Lihat ritme mingguanmu untuk mengambil langkah yang lebih ringan."
        actions={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <CalendarDays className="h-3.5 w-3.5 text-accent" />
            {formatShortDate(stats.days[0])} – {formatShortDate(stats.days[6])}
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile
          icon={Smile}
          iconClass="bg-amber-500/10 text-amber-500"
          label="Mood rata-rata"
          value={moodMeta ? moodMeta.emoji : '—'}
          suffix={stats.averageMood ? ` ${stats.averageMood.toFixed(1).replace('.', ',')}/5` : ''}
          description={moodMeta ? moodMeta.label : 'Belum ada catatan'}
          bar={stats.averageMood ? (stats.averageMood / 5) * 100 : 0}
          barClass="bg-amber-400"
        />
        <StatTile
          icon={CheckCircle2}
          iconClass="bg-emerald-500/10 text-emerald-500"
          label="Tugas selesai"
          value={`${stats.taskPercent}%`}
          description={`${stats.completedTasks} dari ${tasks.length} tugas selesai`}
          bar={stats.taskPercent}
          barClass="bg-emerald-500"
        />
        <StatTile
          icon={BarChart3}
          iconClass="bg-accent/10 text-accent"
          label="Konsistensi habit"
          value={`${stats.habitPercent}%`}
          description={`${stats.habitChecks} dari ${stats.habitTarget} centang`}
          bar={stats.habitPercent}
          barClass="bg-accent"
        />
        <StatTile
          icon={Flame}
          iconClass="bg-rose-500/10 text-rose-500"
          label="Streak terpanjang"
          value={stats.longestStreak}
          suffix=" hari"
          description={`Aktif ${stats.activeStreak} hari berturut-turut`}
          bar={stats.longestStreak ? Math.min(stats.longestStreak * 10, 100) : 0}
          barClass="bg-rose-500"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <CardHeader
            icon={Sparkles}
            title="Mood mingguan"
            description="Skor dari entri jurnal tujuh hari terakhir."
            action={
              <span className="chip bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {moodMeta ? `${moodMeta.emoji} ${moodMeta.label}` : 'Belum ada data'}
              </span>
            }
          />
          <div className="mt-4 h-[250px] w-full sm:h-[280px]">
            {stats.moodData.some((item) => item.score !== null) ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.moodData} margin={{ top: 12, right: 10, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={accent} stopOpacity={0.65} />
                      <stop offset="100%" stopColor={accent} stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke={gridColor} vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: axisColor, fontSize: 10, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis
                    domain={[0.5, 5.5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: axisColor, fontSize: 10 }}
                    width={42}
                  />
                  <Tooltip
                    content={<MoodTooltip isDark={isDark} />}
                    cursor={{ stroke: accent, strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.35 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="url(#moodLine)"
                    strokeWidth={2.5}
                    connectNulls
                    dot={{
                      r: 4,
                      fill: isDark ? '#0f172a' : '#ffffff',
                      stroke: accent,
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6, fill: accent, stroke: isDark ? '#0f172a' : '#ffffff', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmpty
                icon={Smile}
                title="Belum ada mood minggu ini"
                description="Tulis satu entri jurnal agar grafik mood mulai terisi."
              />
            )}
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Skor mood dihitung dari 1 (paling berat) hingga 5 (paling baik).
            </p>
            <span className="hidden items-center gap-1 text-[10px] font-semibold text-emerald-500 sm:inline-flex">
              <Sparkles className="h-3 w-3" />
              {stats.moodData.filter((item) => item.score).length} hari tercatat
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <CardHeader
            icon={CheckCircle2}
            title="Penyelesaian tugas"
            description="Semua tugas yang tercatat."
          />
          <div className="relative mx-auto mt-2 h-[210px] w-full max-w-[240px]">
            {tasks.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskChart}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={64}
                      outerRadius={86}
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {taskChart.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[28px] font-extrabold leading-none tracking-tight text-slate-900 dark:text-white">
                    {stats.taskPercent}%
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">selesai</p>
                </div>
              </>
            ) : (
              <ChartEmpty
                icon={CheckCircle2}
                title="Belum ada tugas tercatat"
                description="Tambahkan tugas pertamamu untuk melihat persentase penyelesaian."
              />
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-emerald-500/[0.07] px-3 py-2.5">
              <p className="text-[9px] font-semibold text-emerald-600/70 dark:text-emerald-400/70">Selesai</p>
              <p className="mt-0.5 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {stats.completedTasks}
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 px-3 py-2.5 dark:bg-slate-800">
              <p className="text-[9px] font-semibold text-slate-400">Belum selesai</p>
              <p className="mt-0.5 text-sm font-extrabold text-slate-600 dark:text-slate-300">
                {stats.activeTasks}
              </p>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            {stats.taskPercent >= 70
              ? 'Ritme tugasmu sehat. Pertahankan cara kerja ini.'
              : stats.taskPercent >= 40
                ? 'Kamu di jalur yang baik. Fokus pada satu tugas prioritas.'
                : 'Coba pilih satu tugas kecil untuk memulai momentum.'}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <CardHeader
            icon={BarChart3}
            title="Konsistensi habit"
            description="Persentase kebiasaan yang selesai setiap hari."
            action={
              <span className="chip bg-accent/10 text-accent">{stats.habitPercent}% minggu ini</span>
            }
          />
          <div className="mt-4 h-[240px] w-full">
            {habits.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.habitDaily} margin={{ top: 10, right: 8, left: -26, bottom: 0 }} barCategoryGap="28%">
                  <defs>
                    <linearGradient id="habitBars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={accent} stopOpacity={0.55} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke={gridColor} vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: axisColor, fontSize: 10, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 50, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: axisColor, fontSize: 9 }}
                    width={44}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    content={<HabitTooltip isDark={isDark} />}
                    cursor={{ fill: isDark ? 'rgba(148,163,184,0.06)' : 'rgba(15,23,42,0.03)', radius: 8 }}
                  />
                  <Bar dataKey="percent" fill="url(#habitBars)" radius={[7, 7, 3, 3]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmpty
                icon={BarChart3}
                title="Belum ada habit untuk diukur"
                description="Buat satu kebiasaan kecil agar konsistensinya bisa kamu lihat di sini."
              />
            )}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {stats.habitChecks} centang dari {stats.habitTarget} target mingguan
            </p>
            <p className="text-[10px] font-semibold text-accent">
              {stats.habitPercent >= 80
                ? 'Ritme yang kuat'
                : stats.habitPercent >= 50
                  ? 'Terus bertumbuh'
                  : 'Mulai dari satu centang'}
            </p>
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-5 text-white">
            <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Rekor terbaik</p>
                <p className="mt-2 text-[34px] font-extrabold leading-none">
                  {stats.longestStreak}
                  <span className="ml-1 text-sm font-semibold text-white/70">hari</span>
                </p>
                <p className="mt-1.5 text-[11px] text-white/75">streak habit terpanjangmu</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Trophy className="h-5 w-5 text-amber-100" />
              </span>
            </div>
            <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold backdrop-blur">
              <Flame className="h-3 w-3 text-amber-100" />
              Streak aktif saat ini {stats.activeStreak} hari
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
              Tiga kebiasaan terkuat
            </h3>
            <div className="mt-3 space-y-3">
              {stats.topHabits.map((item, index) => {
                const color = getHabitColor(HABIT_COLORS, item.habit.color)
                return (
                  <div key={item.habit.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        color.soft,
                        color.text,
                      )}
                    >
                      <HabitIcon name={item.habit.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        {item.habit.name}
                      </p>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={cn('h-full rounded-full', color.solid)}
                          style={{
                            width: `${stats.longestStreak ? (item.best / stats.longestStreak) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="shrink-0 text-right">
                      <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-200">
                        {item.best} hari
                      </span>
                      <span className="block text-[9px] text-slate-400">ke-{index + 1}</span>
                    </span>
                  </div>
                )
              })}
              {stats.topHabits.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-[11px] text-slate-400 dark:border-slate-700">
                  Belum ada kebiasaan untuk diukur.
                </p>
              )}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 px-3.5 py-3 text-[10px] leading-relaxed text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              Streak terbaik dihitung dari centang berturut-turut. Satu hari terlewat bukan akhir,
              mulai lagi besok.
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
