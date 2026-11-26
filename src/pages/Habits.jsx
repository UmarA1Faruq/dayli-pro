import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Flame, Leaf, Plus, Sparkles, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  cn,
  getHabitStreak,
  getLastNDays,
  percentage,
  toDateKey,
} from '../utils/helpers'
import { PageHeader } from '../components/PageHeader'
import Card from '../components/Card'
import HabitItem from '../components/HabitItem'
import HabitFormModal from '../components/HabitFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

export default function Habits() {
  const { habits, deleteHabit, toggleHabitDate } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (!editId) return
    const habit = habits.find((item) => item.id === editId)
    if (habit) {
      setEditingHabit(habit)
      setModalOpen(true)
    }
    setSearchParams({}, { replace: true })
  }, [habits, searchParams, setSearchParams])

  const stats = useMemo(() => {
    const todayKey = toDateKey()
    const doneToday = habits.filter((habit) => habit.history.includes(todayKey)).length
    const days = getLastNDays(7)
    const daily = days.map((day) => {
      const key = toDateKey(day)
      const completed = habits.filter((habit) => habit.history.includes(key)).length
      return {
        day,
        key,
        completed,
        percent: percentage(completed, habits.length),
        label: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][day.getDay()],
      }
    })
    const bestStreak = habits.reduce(
      (best, habit) => Math.max(best, getHabitStreak(habit.history).best),
      0,
    )
    const currentBest = habits.reduce(
      (best, habit) => Math.max(best, getHabitStreak(habit.history).current),
      0,
    )
    const weeklyChecks = daily.reduce((total, day) => total + day.completed, 0)
    const weeklyTarget = habits.length * 7
    return {
      doneToday,
      daily,
      bestStreak,
      currentBest,
      weeklyChecks,
      weeklyTarget,
      weeklyPercent: percentage(weeklyChecks, weeklyTarget),
    }
  }, [habits])

  const openNew = () => {
    setEditingHabit(null)
    setModalOpen(true)
  }

  const openEdit = (habit) => {
    setEditingHabit(habit)
    setModalOpen(true)
  }

  const todayPercent = percentage(stats.doneToday, habits.length)

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Ritme kecil"
        title="Habit Tracker"
        description="Konsistensi tidak lahir dalam sehari. Centang satu kebiasaan kecil, lalu ulangi besok."
        actions={
          <button type="button" onClick={openNew} className="btn-primary">
            <Plus className="h-4 w-4" />
            Tambah habit
          </button>
        }
      />

      {habits.length > 0 ? (
        <>
          <Card className="overflow-hidden p-0">
            <div className="grid md:grid-cols-[1.2fr_1fr]">
              <div className="relative overflow-hidden bg-gradient-to-br from-accent via-accent-strong to-violet-700 p-5 text-white sm:p-6">
                <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      Ritme hari ini
                    </span>
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold backdrop-blur">
                      {todayPercent}%
                    </span>
                  </div>
                  <p className="mt-3 text-[30px] font-extrabold leading-none tracking-tight">
                    {stats.doneToday}
                    <span className="text-base font-semibold text-white/50">/{habits.length}</span>
                  </p>
                  <p className="mt-1.5 text-xs text-white/60">
                    {stats.doneToday === habits.length
                      ? 'Semua kebiasaan hari ini selesai. Luar biasa!'
                      : `${habits.length - stats.doneToday} kebiasaan lagi untuk hari ini.`}
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-emerald-300 transition-all duration-500"
                      style={{ width: `${todayPercent}%` }}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-4 text-[11px] text-white/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-amber-300" />
                      Streak aktif {stats.currentBest} hari
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
                      Rekor {stats.bestStreak} hari
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Konsistensi 7 hari</h2>
                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                      {stats.weeklyChecks} dari {stats.weeklyTarget} centang minggu ini
                    </p>
                  </div>
                  <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {stats.weeklyPercent}%
                  </span>
                </div>

                <div className="mt-5 flex h-28 items-end justify-between gap-2">
                  {stats.daily.map((day, index) => (
                    <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <div className="relative flex h-full w-full max-w-[32px] items-end overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                        <div
                          className={cn(
                            'w-full rounded-lg transition-all duration-500',
                            index === stats.daily.length - 1
                              ? 'bg-gradient-to-t from-accent to-accent-light'
                              : 'bg-accent/60',
                          )}
                          style={{ height: `${Math.max(day.percent, 5)}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-[9px] font-semibold',
                          index === stats.daily.length - 1
                            ? 'text-accent'
                            : 'text-slate-400 dark:text-slate-500',
                        )}
                      >
                        {day.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Kebiasaanmu</h2>
              <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                Klik hari mana pun dalam 7 hari terakhir untuk mengubah centang.
              </p>
            </div>
            <button type="button" onClick={openNew} className="btn-secondary hidden px-3 py-2 text-xs sm:inline-flex">
              <Plus className="h-3.5 w-3.5" />
              Tambah
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggleDate={toggleHabitDate}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>

          <Card className="flex flex-col gap-3 border-dashed bg-transparent p-4 shadow-none dark:bg-transparent sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              <Leaf className="h-4 w-4 shrink-0 text-emerald-500" />
              Mulai dari kebiasaan yang sangat kecil. Yang penting bisa diulang, bukan terlihat hebat.
            </div>
            <button type="button" onClick={openNew} className="btn-soft px-3 py-2 text-[11px]">
              <Plus className="h-3.5 w-3.5" />
              Habit baru
            </button>
          </Card>
        </>
      ) : (
        <EmptyState
          icon={Flame}
          title="Belum ada kebiasaan"
          description="Pilih satu kebiasaan kecil yang ingin kamu bangun. Misalnya minum air, membaca, atau tidur lebih awal."
          action={
            <button type="button" onClick={openNew} className="btn-primary">
              <Plus className="h-4 w-4" />
              Buat kebiasaan pertama
            </button>
          }
        />
      )}

      <HabitFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        habit={editingHabit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteHabit(deleteTarget.id)
          setDeleteTarget(null)
        }}
        title="Hapus kebiasaan ini?"
        description={`Riwayat centang “${deleteTarget?.name || ''}” juga akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus habit"
      />
    </div>
  )
}
