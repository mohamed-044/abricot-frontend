'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : '?'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/dashboard">
            <span className="text-xl font-black text-orange-600 tracking-tight">ABRIC🍑T</span>
          </Link>

          {/* Navigation centrale */}
          <nav className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition ${
                pathname === '/dashboard'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span>⊞</span> Tableau de bord
            </Link>
            <Link
              href="/projects"
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition ${
                pathname.startsWith('/projects')
                  ? 'text-orange-600 font-semibold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span>📁</span> Projets
            </Link>
          </nav>

          {/* Avatar utilisateur */}
          <button
            onClick={logout}
            className="w-10 h-10 rounded-full bg-orange-200 text-orange-700 font-bold text-sm flex items-center justify-center hover:bg-orange-300 transition"
            title="Se déconnecter"
          >
            {initials}
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black text-orange-600 tracking-tight">ABRIC🍑T</span>
          <span className="text-sm text-gray-400">Abricot 2025</span>
        </div>
      </footer>
    </div>
  )
}