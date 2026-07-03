'use client'
import { useAuth } from '@/context/AuthContext'
import { useMyTasks } from '@/hooks/useMyTasks'
import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Folder, MessageSquare } from 'lucide-react'
import styles from './page.module.css'
import KanbanBoard from '@/components/tasks/KanbanBoard'
const STATUS_LABELS = {
  TODO: { label: 'À faire', color: styles.statusTodo },
  IN_PROGRESS: { label: 'En cours', color: styles.statusInProgress },
  DONE: { label: 'Terminée', color: styles.statusDone },
}
export default function DashboardPage() {
  const { user } = useAuth()
  const [view, setView] = useState('list')
  const [search, setSearch] = useState('')
  const { tasks, isLoading } = useMyTasks()
  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Tableau de bord</h1>
          <p className={styles.pageSubtitle}>
            Bonjour {user?.name}, voici un aperçu de vos projets et tâches
          </p>
        </div>
        <Link href="/projects/new" className={styles.createButton}>
          + Créer un projet
        </Link>
      </div>
      <div className={styles.viewTabs}>
        <button
          type="button"
          onClick={() => setView('list')}
          className={`${styles.tabButton} ${view === 'list' ? styles.activeTab : ''}`}
        >
          ☰ Liste
        </button>
        <button
          type="button"
          onClick={() => setView('kanban')}
          className={`${styles.tabButton} ${view === 'kanban' ? styles.activeTab : ''}`}
        >
          ⊞ Kanban
        </button>
      </div>
      <div className={styles.card}>
        {view === 'list' ? (
          <>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Mes tâches assignées</h2>
                <p className={styles.cardSubtitle}>Par ordre de priorité</p>
              </div>
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="Rechercher une tâche"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
                <img src="/search.png" alt="" className={styles.searchIcon} />
              </div>
            </div>
            {isLoading ? (
              <p className={styles.statusMessage}>Chargement...</p>
            ) : filtered.length === 0 ? (
              <p className={styles.statusMessage}>Aucune tâche assignée.</p>
            ) : (
              <div className={styles.taskList}>
                {filtered.map((task) => {
                  const status = STATUS_LABELS[task.status] ?? STATUS_LABELS.TODO
                  return (
                    <div key={task.id} className={styles.taskItem}>
                      <div className={styles.taskInfo}>
                        <div className={styles.taskTitleRow}>
                          <h3 className={styles.taskTitle}>{task.title}</h3>
                          <span className={`${styles.statusBadge} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className={styles.taskDescription}>{task.description}</p>
                        <div className={styles.taskMeta}>
                          <span className={styles.metaItem}>
                            <Folder size={12} /> {task.project?.name}
                          </span>
                          <span>|</span>
                            <span className={styles.metaItem}>
                              <img src="/calendar.png" alt="" className={styles.calendarIcon} />
                              {task.dueDate
                                ? format(new Date(task.dueDate), 'd MMM', { locale: fr })
                                : 'Pas de date'}
                            </span>
                          <span>|</span>
                          <span className={styles.metaItem}>
                            <MessageSquare size={12} /> {task.comments?.length ?? 0}
                          </span>
                        </div>
                      </div>
                      <Link href={`/projects/${task.projectId}`} className={styles.taskLink}>
                        Voir
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <KanbanBoard tasks={filtered} />
        )}
      </div>
    </div>
  )
}
