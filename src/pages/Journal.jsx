import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowUpRight,
  CalendarDays,
  FilterX,
  NotebookPen,
  Pin,
  PinOff,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { MOOD_ORDER } from '../data/mockData'
import {
  cn,
  formatMediumDate,
  getJournalExcerpt,
  getMood,
  toDateKey,
} from '../utils/helpers'
import { PageHeader } from '../components/PageHeader'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import JournalEditorModal from '../components/JournalEditorModal'

export default function Journal() {
  const { entries, deleteJournal, togglePinJournal } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('all')
  const [moodFilter, setMoodFilter] = useState('all')
  const [pinnedOnly, setPinnedOnly] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [defaultDate, setDefaultDate] = useState(toDateKey())
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    const entryId = searchParams.get('entry')
    const isNew = searchParams.get('new')
    if (entryId) {
      const entry = entries.find((item) => item.id === entryId)
      if (entry) {
        setEditingEntry(entry)
        setDefaultDate(entry.date)
        setEditorOpen(true)
      }
      setSearchParams({}, { replace: true })
    } else if (isNew) {
      setEditingEntry(null)
      setDefaultDate(searchParams.get('date') || toDateKey())
      setEditorOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [entries, searchParams, setSearchParams])

  const tags = useMemo(
    () => [...new Set(entries.flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b)),
    [entries],
  )

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return entries
      .filter((entry) => {
        if (tagFilter !== 'all' && !entry.tags.includes(tagFilter)) return false
        if (moodFilter !== 'all' && entry.mood !== moodFilter) return false
        if (pinnedOnly && !entry.pinned) return false
        if (!normalized) return true
        const haystack = [
          entry.title,
          entry.content,
          entry.tags.join(' '),
          getMood(entry.mood).label,
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(normalized)
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.date.localeCompare(a.date)
      })
  }, [entries, moodFilter, pinnedOnly, query, tagFilter])

  const hasFilters = Boolean(query || tagFilter !== 'all' || moodFilter !== 'all' || pinnedOnly)
  const currentMonth = toDateKey().slice(0, 7)
  const pinnedCount = entries.filter((entry) => entry.pinned).length
  const monthCount = entries.filter((entry) => entry.date.startsWith(currentMonth)).length

  const openNew = () => {
    setEditingEntry(null)
    setDefaultDate(toDateKey())
    setEditorOpen(true)
  }

  const openEntry = (entry) => {
    setEditingEntry(entry)
    setDefaultDate(entry.date)
    setEditorOpen(true)
  }

  const resetFilters = () => {
    setQuery('')
    setTagFilter('all')
    setMoodFilter('all')
    setPinnedOnly(false)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Ruang refleksi"
        title="Jurnal"
        description="Simpan cerita, perasaan, dan hal-hal kecil yang ingin kamu ingat. Tidak ada aturan menulis yang terlalu ketat di sini."
        actions={
          <button type="button" onClick={openNew} className="btn-primary">
            <Plus className="h-4 w-4" />
            Tulis jurnal
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <NotebookPen className="h-3.5 w-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px]">Total entri</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {entries.length}
          </p>
        </Card>
        <Card className="p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px]">Bulan ini</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {monthCount}
          </p>
        </Card>
        <Card className="p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <Pin className="h-3.5 w-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px]">Tersemat</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {pinnedCount}
          </p>
        </Card>
      </div>

      <Card className="p-3.5 sm:p-4">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10 pr-9"
              placeholder="Cari judul, isi, atau tag…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Cari jurnal"
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

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <select
                className="select py-2 pl-9 text-xs sm:w-[145px]"
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                aria-label="Filter tag"
              >
                <option value="all">Semua tag</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <select
                className="select py-2 pl-9 text-xs sm:w-[145px]"
                value={moodFilter}
                onChange={(event) => setMoodFilter(event.target.value)}
                aria-label="Filter mood"
              >
                <option value="all">Semua mood</option>
                {MOOD_ORDER.map((key) => (
                  <option key={key} value={key}>
                    {getMood(key).emoji} {getMood(key).label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPinnedOnly((current) => !current)}
            className={cn(
              'inline-flex h-[38px] items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition sm:self-auto',
              pinnedOnly
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
            aria-pressed={pinnedOnly}
          >
            <Pin className="h-3.5 w-3.5" />
            Tersemat
          </button>
        </div>

        {hasFilters && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Menampilkan <span className="font-bold text-slate-700 dark:text-slate-200">{filteredEntries.length}</span>{' '}
              dari {entries.length} entri
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
            >
              <FilterX className="h-3.5 w-3.5" />
              Reset filter
            </button>
          </div>
        )}
      </Card>

      {filteredEntries.length === 0 ? (
        <EmptyState
          icon={hasFilters ? Search : NotebookPen}
          title={hasFilters ? 'Belum ada yang cocok' : 'Jurnalmu masih kosong'}
          description={
            hasFilters
              ? 'Coba kata kunci lain atau longgarkan filter. Cerita yang kamu cari mungkin ada di halaman lain.'
              : 'Mulai dari satu kalimat sederhana tentang hari ini. Tidak perlu sempurna, cukup jujur.'
          }
          action={
            hasFilters ? (
              <button type="button" onClick={resetFilters} className="btn-secondary">
                <FilterX className="h-4 w-4" />
                Reset filter
              </button>
            ) : (
              <button type="button" onClick={openNew} className="btn-primary">
                <Plus className="h-4 w-4" />
                Tulis entri pertama
              </button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredEntries.map((entry) => {
            const mood = getMood(entry.mood)
            return (
              <Card
                key={entry.id}
                className={cn(
                  'group relative flex flex-col overflow-hidden p-5 card-hover',
                  entry.pinned && 'ring-1 ring-accent/15',
                )}
              >
                {entry.pinned && (
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-violet-500 to-fuchsia-400" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={cn('chip shrink-0 py-1', mood.className)}>
                      <span>{mood.emoji}</span>
                      {mood.label}
                    </span>
                    <span className="truncate text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {formatMediumDate(entry.date)}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => togglePinJournal(entry.id)}
                      aria-label={entry.pinned ? 'Lepas sematan' : 'Sematkan entri'}
                      title={entry.pinned ? 'Lepas sematan' : 'Sematkan entri'}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition',
                        entry.pinned
                          ? 'text-amber-500 hover:bg-amber-500/10'
                          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800',
                      )}
                    >
                      {entry.pinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(entry)}
                      aria-label={`Hapus ${entry.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openEntry(entry)}
                  className="mt-4 flex-1 text-left"
                >
                  <h2 className="text-[16px] font-bold leading-snug tracking-tight text-slate-900 transition group-hover:text-accent dark:text-white">
                    {entry.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {getJournalExcerpt(entry.content, 190)}
                  </p>
                </button>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setTagFilter(tag)}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 transition hover:bg-accent/10 hover:text-accent dark:bg-slate-800 dark:text-slate-400"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-[10px] font-medium text-slate-300 dark:text-slate-600">
                    {entry.content.trim().split(/\s+/).length} kata
                  </span>
                  <button
                    type="button"
                    onClick={() => openEntry(entry)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
                  >
                    Baca entri
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <JournalEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        entry={editingEntry}
        defaultDate={defaultDate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteJournal(deleteTarget.id)
            if (editingEntry?.id === deleteTarget.id) setEditorOpen(false)
          }
          setDeleteTarget(null)
        }}
        title="Hapus entri jurnal?"
        description={`“${deleteTarget?.title || ''}” akan dihapus dari arsip. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus entri"
      />
    </div>
  )
}
