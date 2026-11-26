import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { cn } from '../utils/helpers'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'
import CommandPalette from './CommandPalette'
import QuickAddModal from './QuickAddModal'
import PageSkeleton from './PageSkeleton'
import Toaster from './Toaster'

export default function Layout() {
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const closeQuickAdd = useCallback(() => setQuickAddOpen(false), [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen((current) => !current)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    setSearchOpen(false)
    setQuickAddOpen(false)
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    const timer = setTimeout(() => setLoading(false), 320)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />

      <div className="lg:pl-[280px]">
        <Header onSearch={() => setSearchOpen(true)} />

        <main className="mx-auto w-full max-w-[1440px] px-4 pb-32 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-14 lg:pt-8">
          <div key={location.pathname} className={cn(!loading && 'page-enter')}>
            {loading ? <PageSkeleton pathname={location.pathname} /> : <Outlet />}
          </div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setQuickAddOpen(true)}
        aria-label="Tambah cepat"
        className="group fixed bottom-[5.75rem] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-float transition duration-200 hover:-translate-y-0.5 hover:bg-accent-strong active:scale-95 lg:bottom-8 lg:right-8"
      >
        <Plus className="h-6 w-6 transition duration-300 group-hover:rotate-90" strokeWidth={2.4} />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 lg:block">
          Tambah cepat
        </span>
      </button>

      <MobileNav />
      <CommandPalette open={searchOpen} onClose={closeSearch} />
      <QuickAddModal open={quickAddOpen} onClose={closeQuickAdd} />
      <Toaster />
    </div>
  )
}
