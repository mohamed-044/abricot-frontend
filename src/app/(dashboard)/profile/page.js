import Link from 'next/link'
import styles from './page.module.css'
export default function ProfilePage() {
  return (
    <div className={styles.wrapper}>
      <h1>Profil</h1>
      <p>Page de profil utilisateur en construction.</p>
      <Link href="/dashboard" className={styles.backLink}>
        Retour au tableau de bord
      </Link>
    </div>
  )
}
