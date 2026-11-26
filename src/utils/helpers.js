import {
  differenceInCalendarDays,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfYear,
  subDays,
} from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { DAILY_QUOTES, MOODS } from '../data/mockData'

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

export const toDate = (value) => (value instanceof Date ? value : parseISO(value))

export const toDateKey = (date = new Date()) => format(date, 'yyyy-MM-dd')

export const formatFullDate = (date = new Date()) =>
  format(toDate(date), 'EEEE, d MMMM yyyy', { locale: localeId })

export const formatShortDate = (date) =>
  format(toDate(date), 'd MMM', { locale: localeId })

export const formatMediumDate = (date) =>
  format(toDate(date), 'd MMM yyyy', { locale: localeId })

export const formatMonthYear = (date = new Date()) =>
  format(toDate(date), 'MMMM yyyy', { locale: localeId })

export const formatDateInput = (date = new Date()) => format(toDate(date), 'yyyy-MM-dd')

export const getGreeting = (date = new Date()) => {
  const hour = date.getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 19) return 'Selamat sore'
  return 'Selamat malam'
}

export const getDailyQuote = (date = new Date()) => {
  const index = differenceInCalendarDays(startOfDay(date), startOfYear(date)) % DAILY_QUOTES.length
  return DAILY_QUOTES[index]
}

export const getTaskBucket = (task, now = new Date()) => {
  if (task.completed) return 'completed'
  const difference = differenceInCalendarDays(toDate(task.dueDate), now)
  if (difference < 0) return 'overdue'
  if (difference === 0) return 'today'
  return 'upcoming'
}

export const formatDueDate = (date, now = new Date()) => {
  const difference = differenceInCalendarDays(toDate(date), now)
  if (difference === 0) return 'Hari ini'
  if (difference === 1) return 'Besok'
  if (difference === -1) return 'Kemarin'
  if (difference < -1) return `Terlambat ${Math.abs(difference)} hari`
  if (difference <= 6) return format(toDate(date), 'EEEE', { locale: localeId })
  return format(toDate(date), 'd MMM yyyy', { locale: localeId })
}

export const isDateKeyToday = (value) => isSameDay(toDate(value), new Date())

export const getMood = (key) => MOODS[key] || MOODS.biasa

export const getMoodForDate = (entries, date) => {
  const key = toDateKey(date)
  const forDate = entries.filter((entry) => entry.date === key)
  return forDate.length ? getMood(forDate[0].mood) : null
}

export const getHabitColor = (colors, key) =>
  colors.find((color) => color.key === key) || colors[0]

const uniqueSorted = (values) => [...new Set(values)].sort()

export const getHabitStreak = (history, now = new Date()) => {
  const dates = uniqueSorted(history)
  const set = new Set(dates)
  let cursor = startOfDay(now)
  if (!set.has(toDateKey(cursor))) {
    cursor = subDays(cursor, 1)
  }
  let current = 0
  while (set.has(toDateKey(cursor))) {
    current += 1
    cursor = subDays(cursor, 1)
  }

  let best = 0
  let run = 0
  let previous = null
  dates.forEach((dateString) => {
    const date = toDate(dateString)
    if (previous && differenceInCalendarDays(date, previous) === 1) {
      run += 1
    } else {
      run = 1
    }
    best = Math.max(best, run)
    previous = date
  })

  return { current, best }
}

export const getLastNDays = (count, now = new Date()) => {
  const days = []
  for (let index = count - 1; index >= 0; index -= 1) {
    days.push(subDays(startOfDay(now), index))
  }
  return days
}

export const getHabitCompletion = (habit, days) => {
  const set = new Set(habit.history)
  return days.filter((day) => set.has(toDateKey(day))).length
}

export const getJournalExcerpt = (content, length = 150) => {
  const singleLine = content.replace(/\n+/g, ' ').trim()
  return singleLine.length > length ? `${singleLine.slice(0, length).trim()}…` : singleLine
}

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

export const plural = (count, word) => `${count} ${word}`

export const formatWater = (value, target) => `${value} / ${target} gelas`

export const formatSleep = (hours) => {
  const whole = Math.floor(hours)
  const minutes = Math.round((hours - whole) * 60)
  if (minutes === 0) return `${whole} jam`
  return `${whole} jam ${minutes} mnt`
}

export const percentage = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0)

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const searchEntries = (entries, query) => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []
  return entries.filter((entry) => {
    const haystack = [entry.title, entry.content, entry.tags.join(' '), getMood(entry.mood).label]
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalized)
  })
}

export const getMoodWeekData = (entries, days) =>
  days.map((day) => {
    const key = toDateKey(day)
    const entry = entries.find((item) => item.date === key)
    const mood = entry ? getMood(entry.mood) : null
    return {
      day: format(day, 'EEE', { locale: localeId }),
      fullDate: format(day, 'd MMM', { locale: localeId }),
      score: mood ? mood.score : null,
      mood: mood?.label || 'Belum ada catatan',
      emoji: mood?.emoji || '—',
    }
  })

export const getDaysInRange = (start, end) => {
  const days = []
  let cursor = startOfDay(start)
  const final = startOfDay(end)
  while (cursor <= final) {
    days.push(cursor)
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
  }
  return days
}
