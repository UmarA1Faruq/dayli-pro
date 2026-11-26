import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Flag, FolderOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { toDateKey } from '../utils/helpers'
import Modal from './Modal'
import PriorityPicker from './PriorityPicker'

const CATEGORIES = [
  'Umum',
  'Pekerjaan',
  'Pribadi',
  'Kesehatan',
  'Keuangan',
  'Rumah',
  'Keluarga',
  'Digital',
  'Pengembangan Diri',
]

const emptyForm = (date) => ({
  title: '',
  note: '',
  priority: 'sedang',
  dueDate: date || toDateKey(),
  category: 'Umum',
})

export default function TaskFormModal({ open, onClose, task, defaultDate }) {
  const { addTask, updateTask } = useApp()
  const [form, setForm] = useState(emptyForm(defaultDate))
  const [error, setError] = useState('')
  const titleRef = useRef(null)
  const isEditing = Boolean(task)

  useEffect(() => {
    if (!open) return
    if (task) {
      setForm({
        title: task.title,
        note: task.note || '',
        priority: task.priority,
        dueDate: task.dueDate,
        category: task.category || 'Umum',
      })
    } else {
      setForm(emptyForm(defaultDate))
    }
    setError('')
    const timer = setTimeout(() => titleRef.current?.focus(), 120)
    return () => clearTimeout(timer)
  }, [defaultDate, open, task])

  const update = (patch) => setForm((current) => ({ ...current, ...patch }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Tuliskan nama tugas terlebih dahulu.')
      return
    }
    if (!form.dueDate) {
      setError('Pilih tanggal jatuh tempo untuk tugas ini.')
      return
    }
    if (isEditing) {
      updateTask({ ...task, ...form, title: form.title.trim(), note: form.note.trim() })
    } else {
      addTask({ ...form, title: form.title.trim(), note: form.note.trim() })
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit tugas' : 'Tambah tugas baru'}
      description={
        isEditing
          ? 'Perbarui detail tugas agar tetap sesuai prioritasmu.'
          : 'Tuliskan satu langkah jelas yang bisa kamu selesaikan.'
      }
      footer={
        <div className="flex gap-3">
          <button type="button" className="btn-secondary flex-1 sm:flex-none sm:px-6" onClick={onClose}>
            Batal
          </button>
          <button type="submit" form="task-form" className="btn-primary flex-1 sm:px-8">
            {isEditing ? 'Simpan perubahan' : 'Tambah tugas'}
          </button>
        </div>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="label">
            Nama tugas
          </label>
          <input
            ref={titleRef}
            id="task-title"
            className="input text-[15px] font-semibold"
            placeholder="Contoh: Review proposal klien"
            value={form.title}
            onChange={(event) => update({ title: event.target.value })}
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="task-note" className="label">
            Catatan <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <textarea
            id="task-note"
            className="input min-h-[86px] resize-y"
            placeholder="Detail kecil yang membantu kamu mengerjakannya…"
            value={form.note}
            onChange={(event) => update({ note: event.target.value })}
            maxLength={300}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-due" className="label">
              Jatuh tempo
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="task-due"
                type="date"
                className="input pl-10"
                value={form.dueDate}
                onChange={(event) => update({ dueDate: event.target.value })}
              />
            </div>
          </div>
          <div>
            <label htmlFor="task-category" className="label">
              Kategori
            </label>
            <div className="relative">
              <FolderOpen className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                id="task-category"
                className="select pl-10"
                value={form.category}
                onChange={(event) => update({ category: event.target.value })}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <span className="label">
            <span className="inline-flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5 text-slate-400" />
              Prioritas
            </span>
          </span>
          <PriorityPicker value={form.priority} onChange={(value) => update({ priority: value })} />
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            Prioritas tinggi akan ditampilkan lebih menonjol di daftar.
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
