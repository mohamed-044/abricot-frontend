'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './layout.module.css'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : user?.email
      ? user.email[0].toUpperCase()
      : '?'

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>

          <Link href="/dashboard">
            <img src="/Logo.png" alt="Abricot" className={styles.logo} />
          </Link>

          <nav className={styles.nav}>
            <Link
              href="/dashboard"
              className={`${styles.navLink} ${
                pathname === '/dashboard' ? styles.navLinkDashboardActive : styles.navLinkInactive
              }`}
            >
              <img src={pathname === '/dashboard' ? '/dashboard-white.png' : '/dashboard-orange.png'} alt="" className={styles.navIcon} /> Tableau de bord
            </Link>
            <Link
              href="/projects"
              className={`${styles.navLink} ${
                pathname.startsWith('/projects') ? styles.navLinkProjectsActive : styles.navLinkInactive
              }`}
            >
              <img src={pathname.startsWith('/projects') ? '/projects-white.png' : '/projects-orange.png'} alt="" className={styles.navIcon} /> Projets
            </Link>
          </nav>

          <Link
            href="/profile"
            className={`${styles.avatar} ${pathname !== '/profile' ? styles.avatarInactive : ''}`}
            title="Mon compte"
          >
            {initials}
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <img src="/Logo-black.png" alt="Abricot" className={styles.footerLogo} />
          <span className={styles.footerText}>Abricot 2025</span>
        </div>
      </footer>
    </div>
  )
}