import { useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Flame, LogOut, Sparkles } from 'lucide-react'
import { SIDEBAR_ITEMS } from '../config/navigation'
import { useApp } from '../context/AppContext'
import {
  cn,
  getHabitStreak,
  percentage,
  toDateKey,
} from '../utils/helpers'
import Logo from './Logo'
import Avatar from './Avatar'

export default function Sidebar() {
  const { user, tasks, habits, logout } = useApp()
  const navigate = useNavigate()

  const summary = useMemo(() => {
    const todayKey = toDateKey()
    const todayTasks = tasks.filter((task) => task.dueDate === todayKey)
    const doneTasks = todayTasks.filter((task) => task.completed).length
    const doneHabits = habits.filter((habit) => habit.history.includes(todayKey)).length
    const bestStreak = habits.reduce(
      (best, habit) => Math.max(best, getHabitStreak(habit.history).best),
      0,
    )
    return {
      taskPercent: percentage(doneTasks, todayTasks.length),
      doneTasks,
      totalTasks: todayTasks.length,
      doneHabits,
      totalHabits: habits.length,
      bestStreak,
    }
  }, [habits, tasks])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-slate-200/70 bg-white/80 px-4 py-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:flex">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-9 flex flex-1 flex-col" aria-label="Navigasi utama">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
          Menu utama
        </p>
        <div className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition duration-200',
                    isActive
                      ? 'bg-accent text-white shadow-sm shadow-accent/25'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'h-[18px] w-[18px] transition',
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300',
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white/80" />}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>

        <div className="mt-auto pt-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-accent-strong to-violet-700 p-4 text-white shadow-lg shadow-accent/20">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/65">
                  <Sparkles className="h-3 w-3" />
                  Ritme hari ini
                </span>
                <Flame className="h-4 w-4 text-amber-300" />
              </div>
              <p className="mt-2.5 text-[22px] font-extrabold leading-none">
                {summary.doneHabits}
                <span className="text-sm font-semibold text-white/50">/{summary.totalHabits}</span>
              </p>
              <p className="mt-1 text-[11px] text-white/60">kebiasaan sudah dicentang</p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-emerald-300 transition-all duration-500"
                  style={{ width: `${percentage(summary.doneHabits, summary.totalHabits)}%` }}
                />
              </div>

              <div className="mt-3.5 flex items-center justify-between text-[10px] font-medium text-white/55">
                <span>{summary.doneTasks}/{summary.totalTasks} tugas hari ini</span>
                <span>{summary.bestStreak} hari terbaik</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900">
            <Avatar name={user.fullName} size="sm" showStatus />
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                {user.fullName}
              </p>
              <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                Lihat profil & pengaturan
              </p>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Keluar dari akun"
              title="Keluar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/journal?new=1')}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-accent dark:hover:bg-slate-800"
          >
            Tulis jurnal hari ini
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </nav>
    </aside>
  )
}
