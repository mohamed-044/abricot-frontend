import Link from 'next/link'
import styles from './page.module.css'
export default function NewProjectPage() {
  return (
    <div className={styles.wrapper}>
      <h1>Créer un projet</h1>
      <p>Page de création de projet en construction.</p>
      <Link href="/projects" className={styles.backLink}>
        Retour aux projets
      </Link>
    </div>
  )
}
