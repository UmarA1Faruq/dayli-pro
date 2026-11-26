import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Hash, Pin, PinOff, Plus, X } from 'lucide-react'
import { JOURNAL_TAGS, MOODS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn, formatFullDate, toDateKey } from '../utils/helpers'
import Modal from './Modal'
import MoodPicker from './MoodPicker'

const emptyForm = (date) => ({
  title: '',
  content: '',
  mood: 'tenang',
  tags: [],
  pinned: false,
  date: date || toDateKey(),
})

export default function JournalEditorModal({ open, onClose, entry, defaultDate }) {
  const { addJournal, updateJournal } = useApp()
  const [form, setForm] = useState(emptyForm(defaultDate))
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState('')
  const titleRef = useRef(null)
  const isEditing = Boolean(entry)

  useEffect(() => {
    if (!open) return
    if (entry) {
      setForm({
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags || [],
        pinned: Boolean(entry.pinned),
        date: entry.date,
      })
    } else {
      setForm(emptyForm(defaultDate))
    }
    setTagInput('')
    setError('')
    const timer = setTimeout(() => titleRef.current?.focus(), 120)
    return () => clearTimeout(timer)
  }, [defaultDate, entry, open])

  const update = (patch) => setForm((current) => ({ ...current, ...patch }))

  const addTag = (tagValue) => {
    const tag = tagValue.trim().replace(/^#/, '')
    if (!tag) return
    setForm((current) =>
      current.tags.includes(tag) || current.tags.length >= 6
        ? current
        : { ...current, tags: [...current.tags, tag] },
    )
    setTagInput('')
  }

  const removeTag = (tag) => {
    setForm((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Beri judul singkat agar mudah ditemukan kembali.')
      return
    }
    if (!form.content.trim()) {
      setError('Tuliskan setidaknya satu kalimat untuk hari ini.')
      return
    }
    if (isEditing) {
      updateJournal({ ...entry, ...form, title: form.title.trim(), content: form.content.trim() })
    } else {
      addJournal({ ...form, title: form.title.trim(), content: form.content.trim() })
    }
    onClose()
  }

  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0
  const readTime = Math.max(1, Math.ceil(wordCount / 200))
  const suggestedTags = JOURNAL_TAGS.filter((tag) => !form.tags.includes(tag)).slice(0, 7)
  const mood = MOODS[form.mood]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit jurnal' : 'Tulis jurnal baru'}
      description={
        isEditing
          ? `Catatan dari ${formatFullDate(form.date)}`
          : 'Luangkan beberapa menit untuk menuliskan apa yang ada di pikiranmu.'
      }
      size="lg"
      footer={
        <div className="flex gap-3">
          <button type="button" className="btn-secondary flex-1 sm:flex-none sm:px-6" onClick={onClose}>
            Batal
          </button>
          <button type="submit" form="journal-form" className="btn-primary flex-1 sm:px-8">
            {isEditing ? 'Simpan perubahan' : 'Simpan jurnal'}
          </button>
        </div>
      }
    >
      <form id="journal-form" onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="journal-title" className="label">
            Judul
          </label>
          <input
            ref={titleRef}
            id="journal-title"
            className="input text-[15px] font-semibold"
            placeholder="Apa yang ingin kamu ingat dari hari ini?"
            value={form.title}
            onChange={(event) => update({ title: event.target.value })}
            maxLength={90}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="journal-date" className="label">
              Tanggal
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="journal-date"
                type="date"
                className="input pl-10"
                value={form.date}
                onChange={(event) => update({ date: event.target.value })}
              />
            </div>
          </div>
          <div>
            <span className="label">Tandai penting</span>
            <button
              type="button"
              role="switch"
              aria-checked={form.pinned}
              onClick={() => update({ pinned: !form.pinned })}
              className={cn(
                'flex h-[42px] items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition',
                form.pinned
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
              )}
            >
              {form.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              {form.pinned ? 'Disematkan' : 'Sematkan'}
            </button>
          </div>
        </div>

        <div>
          <span className="label">Bagaimana perasaanmu?</span>
          <MoodPicker value={form.mood} onChange={(value) => update({ mood: value })} />
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            Kamu memilih <span className="font-semibold">{mood?.emoji} {mood?.label}</span>. Tidak ada
            perasaan yang salah.
          </p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="journal-content" className="label mb-0">
              Isi jurnal
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {wordCount} kata · ±{readTime} menit baca
            </span>
          </div>
          <textarea
            id="journal-content"
            className="input min-h-[220px] resize-y leading-relaxed"
            placeholder="Hari ini aku merasa…"
            value={form.content}
            onChange={(event) => update({ content: event.target.value })}
          />
        </div>

        <div>
          <span className="label">Tag</span>
          {form.tags.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-accent/10 py-1 pl-2.5 pr-1 text-xs font-semibold text-accent"
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Hapus tag ${tag}`}
                    className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full hover:bg-accent/15"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-10"
                placeholder="Tambah tag sendiri…"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ',') {
                    event.preventDefault()
                    addTag(tagInput)
                  }
                }}
                maxLength={18}
              />
            </div>
            <button
              type="button"
              onClick={() => addTag(tagInput)}
              disabled={!tagInput.trim()}
              className="btn-secondary px-3"
              aria-label="Tambah tag"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {suggestedTags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 transition hover:border-accent/30 hover:bg-accent/5 hover:text-accent dark:border-slate-700 dark:text-slate-400"
                >
                  <Plus className="h-2.5 w-2.5" />
                  {tag}
                </button>
              ))}
            </div>
          )}
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
