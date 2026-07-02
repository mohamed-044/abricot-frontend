import Link from 'next/link'
import styles from './page.module.css'
export default function NewProjectPage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Créer un projet</h1>
      <p className={styles.pageSubtitle}>Page de création de projet en construction.</p>
      <Link href="/projects" className={styles.backLink}>
        Retour aux projets
      </Link>
    </div>
  )
}
