import { useEffect, useRef, useState } from 'react'
import { Check, Flame } from 'lucide-react'
import { HABIT_COLORS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn, getHabitColor } from '../utils/helpers'
import Modal from './Modal'
import HabitIcon from './HabitIcon'
import HabitVisualPicker from './HabitVisualPicker'

const emptyForm = {
  name: '',
  description: '',
  icon: 'Sparkles',
  color: 'violet',
}

export default function HabitFormModal({ open, onClose, habit }) {
  const { addHabit, updateHabit } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const nameRef = useRef(null)
  const isEditing = Boolean(habit)
  const color = getHabitColor(HABIT_COLORS, form.color)

  useEffect(() => {
    if (!open) return
    if (habit) {
      setForm({
        name: habit.name,
        description: habit.description || '',
        icon: habit.icon,
        color: habit.color,
      })
    } else {
      setForm(emptyForm)
    }
    setError('')
    const timer = setTimeout(() => nameRef.current?.focus(), 120)
    return () => clearTimeout(timer)
  }, [habit, open])

  const update = (patch) => setForm((current) => ({ ...current, ...patch }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Beri nama kebiasaan yang ingin kamu bangun.')
      return
    }
    if (isEditing) {
      updateHabit({
        ...habit,
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
      })
    } else {
      addHabit({ ...form, name: form.name.trim(), description: form.description.trim() })
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit kebiasaan' : 'Kebiasaan baru'}
      description={
        isEditing
          ? 'Sesuaikan nama, ikon, atau warna kebiasaanmu.'
          : 'Pilih satu kebiasaan kecil yang bisa kamu ulang setiap hari.'
      }
      footer={
        <div className="flex gap-3">
          <button type="button" className="btn-secondary flex-1 sm:flex-none sm:px-6" onClick={onClose}>
            Batal
          </button>
          <button type="submit" form="habit-form" className="btn-primary flex-1 sm:px-8">
            {isEditing ? 'Simpan perubahan' : 'Buat kebiasaan'}
          </button>
        </div>
      }
    >
      <form id="habit-form" onSubmit={handleSubmit} className="space-y-5">
        <div
          className={cn(
            'flex items-center gap-3.5 rounded-2xl border p-4',
            color.border,
            color.soft,
          )}
        >
          <span
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm',
              color.solid,
            )}
          >
            <HabitIcon name={form.icon} className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {form.name || 'Nama kebiasaanmu'}
            </p>
            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
              {form.description || 'Deskripsi singkat akan tampil di sini.'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold text-amber-600 dark:bg-slate-900/50 dark:text-amber-400">
              <Flame className="h-3 w-3" />0
            </span>
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-white',
                color.solid,
              )}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="habit-name" className="label">
            Nama kebiasaan
          </label>
          <input
            ref={nameRef}
            id="habit-name"
            className="input text-[15px] font-semibold"
            placeholder="Contoh: Minum 8 gelas air"
            value={form.name}
            onChange={(event) => update({ name: event.target.value })}
            maxLength={60}
          />
        </div>

        <div>
          <label htmlFor="habit-description" className="label">
            Deskripsi <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <input
            id="habit-description"
            className="input"
            placeholder="Kenapa kebiasaan ini penting untukmu?"
            value={form.description}
            onChange={(event) => update({ description: event.target.value })}
            maxLength={110}
          />
        </div>

        <HabitVisualPicker
          icon={form.icon}
          color={form.color}
          onIconChange={(icon) => update({ icon })}
          onColorChange={(value) => update({ color: value })}
        />

        <p className="rounded-xl bg-slate-50 px-3.5 py-3 text-[11px] leading-relaxed text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          Kebiasaan akan tampil setiap hari. Kamu bisa mencentang tanggal mana pun dalam 7 hari
          terakhir. Streak dihitung dari centang berturut-turut.
        </p>

        {error && (
          <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
