import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  initialHabits,
  initialJournal,
  initialNotifications,
  initialPreferences,
  initialTasks,
  initialUser,
} from '../data/mockData'
import { toDateKey, uid } from '../utils/helpers'

const AppContext = createContext(null)

const readPreference = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(initialUser)
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem('dayli-auth') === '1',
  )
  const [entries, setEntries] = useState(initialJournal)
  const [tasks, setTasks] = useState(initialTasks)
  const [habits, setHabits] = useState(initialHabits)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [preferences, setPreferences] = useState(() => ({
    ...initialPreferences,
    theme: readPreference('dayli-theme', 'light'),
    accent: readPreference('dayli-accent', 'indigo'),
  }))
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', preferences.theme === 'dark')
    root.dataset.accent = preferences.accent
    try {
      localStorage.setItem('dayli-theme', preferences.theme)
      localStorage.setItem('dayli-accent', preferences.accent)
    } catch {
      // Preferences stay in memory when storage is unavailable.
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.content = preferences.theme === 'dark' ? '#020617' : '#6366f1'
    }
  }, [preferences.theme, preferences.accent])

  useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer))
    },
    [],
  )

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const notify = useCallback(
    (title, message = '', type = 'success') => {
      const id = uid('toast')
      setToasts((current) => [...current.slice(-3), { id, title, message, type }])
      const timer = setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
        timers.current.delete(id)
      }, 3600)
      timers.current.set(id, timer)
      return id
    },
    [],
  )

  const login = useCallback(
    (email, password) => {
      const isValidEmail = email.trim().toLowerCase() === user.email.toLowerCase()
      const isValidPassword = password === 'daylipro'
      if (!isValidEmail || !isValidPassword) {
        notify(
          'Email atau kata sandi salah',
          'Gunakan akun demo: umar@daylipro.id / daylipro',
          'error',
        )
        return false
      }
      setIsAuthenticated(true)
      try {
        sessionStorage.setItem('dayli-auth', '1')
      } catch {
        // Session only lives in memory when storage is unavailable.
      }
      notify('Selamat datang kembali, Umar!', 'Semoga harimu menyenangkan dan teratur.', 'success')
      return true
    },
    [notify, user.email],
  )

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    try {
      sessionStorage.removeItem('dayli-auth')
    } catch {
      // Ignore storage errors.
    }
    notify('Kamu telah keluar', 'Sampai jumpa lagi di catatan berikutnya.', 'info')
  }, [notify])

  const updateProfile = useCallback(
    (payload) => {
      setUser((current) => {
        const fullName = payload.fullName?.trim() || current.fullName
        return {
          ...current,
          ...payload,
          fullName,
          name: fullName.split(' ')[0] || current.name,
        }
      })
      notify('Profil diperbarui', 'Perubahan profilmu sudah disimpan.', 'success')
    },
    [notify],
  )

  const addJournal = useCallback(
    (payload) => {
      const entry = {
        ...payload,
        id: uid('journal'),
        date: payload.date || toDateKey(),
        pinned: Boolean(payload.pinned),
      }
      setEntries((current) => [entry, ...current])
      notify('Jurnal tersimpan', 'Cerita hari ini sudah masuk ke arsipmu.', 'success')
      return entry
    },
    [notify],
  )

  const updateJournal = useCallback(
    (payload) => {
      setEntries((current) =>
        current.map((entry) => (entry.id === payload.id ? { ...entry, ...payload } : entry)),
      )
      notify('Jurnal diperbarui', 'Perubahan pada entrimu sudah disimpan.', 'success')
    },
    [notify],
  )

  const deleteJournal = useCallback(
    (id) => {
      setEntries((current) => current.filter((entry) => entry.id !== id))
      notify('Jurnal dihapus', 'Entri telah dipindahkan dari arsip.', 'delete')
    },
    [notify],
  )

  const togglePinJournal = useCallback(
    (id) => {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === id ? { ...entry, pinned: !entry.pinned } : entry,
        ),
      )
      notify('Pin diperbarui', 'Entri penting akan selalu muncul lebih dulu.', 'info')
    },
    [notify],
  )

  const addTask = useCallback(
    (payload) => {
      const task = {
        ...payload,
        id: uid('task'),
        completed: false,
        category: payload.category || 'Umum',
      }
      setTasks((current) => [task, ...current])
      notify('Tugas ditambahkan', 'Satu langkah kecil sudah masuk daftar.', 'success')
      return task
    },
    [notify],
  )

  const updateTask = useCallback(
    (payload) => {
      setTasks((current) =>
        current.map((task) => (task.id === payload.id ? { ...task, ...payload } : task)),
      )
      notify('Tugas diperbarui', 'Detail tugas berhasil diubah.', 'success')
    },
    [notify],
  )

  const deleteTask = useCallback(
    (id) => {
      setTasks((current) => current.filter((task) => task.id !== id))
      notify('Tugas dihapus', 'Tugas sudah dikeluarkan dari daftar.', 'delete')
    },
    [notify],
  )

  const toggleTask = useCallback(
    (id) => {
      const task = tasks.find((item) => item.id === id)
      if (!task) return
      const completed = !task.completed
      setTasks((current) =>
        current.map((item) => (item.id === id ? { ...item, completed } : item)),
      )
      if (completed) {
        notify('Tugas selesai!', `“${task.title}” berhasil dicentang.`, 'success')
      } else {
        notify('Tugas dibuka kembali', 'Kamu bisa mengerjakannya lagi kapan saja.', 'info')
      }
    },
    [notify, tasks],
  )

  const addHabit = useCallback(
    (payload) => {
      const habit = {
        ...payload,
        id: uid('habit'),
        createdAt: toDateKey(),
        history: [],
      }
      setHabits((current) => [habit, ...current])
      notify('Kebiasaan baru dibuat', 'Mulai hari ini, satu centang setiap hari.', 'success')
      return habit
    },
    [notify],
  )

  const updateHabit = useCallback(
    (payload) => {
      setHabits((current) =>
        current.map((habit) => (habit.id === payload.id ? { ...habit, ...payload } : habit)),
      )
      notify('Kebiasaan diperbarui', 'Detail kebiasaan sudah disimpan.', 'success')
    },
    [notify],
  )

  const deleteHabit = useCallback(
    (id) => {
      setHabits((current) => current.filter((habit) => habit.id !== id))
      notify('Kebiasaan dihapus', 'Riwayat kebiasaan ini ikut dihapus.', 'delete')
    },
    [notify],
  )

  const toggleHabitDate = useCallback(
    (id, date = toDateKey()) => {
      const habit = habits.find((item) => item.id === id)
      if (!habit) return
      const hasDate = habit.history.includes(date)
      setHabits((current) =>
        current.map((item) => {
          if (item.id !== id) return item
          const history = hasDate
            ? item.history.filter((value) => value !== date)
            : [...item.history, date]
          return { ...item, history }
        }),
      )
      notify(
        hasDate ? 'Centang dibatalkan' : 'Kebiasaan selesai!',
        hasDate
          ? `“${habit.name}” untuk hari ini dibatalkan.`
          : `“${habit.name}” berhasil dicatat. Pertahankan ritmenya!`,
        hasDate ? 'info' : 'success',
      )
    },
    [habits, notify],
  )

  const updatePreferences = useCallback((patch, options = {}) => {
    setPreferences((current) => ({ ...current, ...patch }))
    if (options.announce) {
      notify(options.announce.title, options.announce.message, options.announce.type || 'success')
    }
  }, [notify])

  const toggleTheme = useCallback(() => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark'
    setPreferences((current) => ({ ...current, theme: nextTheme }))
    notify(
      nextTheme === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif',
      'Tampilan disesuaikan dengan preferensimu.',
      'info',
    )
  }, [notify, preferences.theme])

  const setAccent = useCallback(
    (accent) => {
      setPreferences((current) => ({ ...current, accent }))
      notify('Warna aksen diperbarui', 'Tampilan Dayli Pro punya nuansa baru.', 'success')
    },
    [notify],
  )

  const setWater = useCallback((value) => {
    setPreferences((current) => ({
      ...current,
      water: Math.max(0, Math.min(current.waterTarget, value)),
    }))
  }, [])

  const setSleep = useCallback((value) => {
    setPreferences((current) => ({
      ...current,
      sleep: Math.max(4, Math.min(10, value)),
    }))
  }, [])

  const markNotificationsRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })))
    notify('Notifikasi ditandai dibaca', 'Semua pemberitahuan sudah kamu lihat.', 'info')
  }, [notify])

  const exportData = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: user,
      journal: entries,
      tasks,
      habits,
      preferences,
    }
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `dayli-pro-${toDateKey()}.json`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      notify('Data berhasil diekspor', 'File JSON berisi seluruh data demo telah diunduh.', 'success')
    } catch {
      notify('Export siap', 'Data demo berhasil disiapkan (mode simulasi).', 'info')
    }
  }, [entries, habits, notify, preferences, tasks, user])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      entries,
      tasks,
      habits,
      notifications,
      unreadNotifications: notifications.filter((item) => !item.read).length,
      preferences,
      toasts,
      login,
      logout,
      updateProfile,
      addJournal,
      updateJournal,
      deleteJournal,
      togglePinJournal,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitDate,
      updatePreferences,
      toggleTheme,
      setAccent,
      setWater,
      setSleep,
      markNotificationsRead,
      exportData,
      notify,
      dismissToast,
    }),
    [
      user,
      isAuthenticated,
      entries,
      tasks,
      habits,
      notifications,
      preferences,
      toasts,
      login,
      logout,
      updateProfile,
      addJournal,
      updateJournal,
      deleteJournal,
      togglePinJournal,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitDate,
      updatePreferences,
      toggleTheme,
      setAccent,
      setWater,
      setSleep,
      markNotificationsRead,
      exportData,
      notify,
      dismissToast,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
