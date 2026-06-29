import Link from 'next/link'
import styles from './page.module.css'
export default function ProjectsPage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Projets</h1>
      <p className={styles.description}>Liste des projets en construction.</p>
      <Link href="/dashboard" className={styles.backLink}>
        Retour au tableau de bord
      </Link>
    </div>
  )
}
