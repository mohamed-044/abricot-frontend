import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Folder, MessageSquare } from 'lucide-react'
import styles from './KanbanBoard.module.css'

const COLUMNS = [
  { key: 'TODO', label: 'À faire', color: styles.statusTodo },
  { key: 'IN_PROGRESS', label: 'En cours', color: styles.statusInProgress },
  { key: 'DONE', label: 'Terminée', color: styles.statusDone },
]

function TaskCard({ task }) {
  const status = COLUMNS.find((c) => c.key === task.status)

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{task.title}</h3>
        <span className={`${styles.statusBadge} ${status?.color}`}>
          {status?.label}
        </span>
      </div>
      <p className={styles.cardDescription}>{task.description}</p>
      <div className={styles.cardMeta}>
        <span className={styles.cardMetaItem}>
          <Folder size={12} /> {task.project?.name}
        </span>
        <span>|</span>
        <span className={styles.cardMetaItem}>
          <img src="/calendar.png" alt="" className={styles.calendarIcon} />
          {task.dueDate
            ? format(new Date(task.dueDate), 'd MMM', { locale: fr })
            : 'Pas de date'}
        </span>
        <span>|</span>
        <span className={styles.cardMetaItem}>
          <MessageSquare size={12} /> {task.comments?.length ?? 0}
        </span>
      </div>
      <Link
        href={`/projects/${task.projectId}`}
        className={styles.viewButton}
      >
        Voir
      </Link>
    </div>
  )
}

export default function KanbanBoard({ tasks }) {
  return (
    <div className={styles.board}>
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key)
        return (
          <div key={col.key} className={styles.column}>
            <div className={styles.columnHeader}>
              <h2 className={styles.columnTitle}>{col.label}</h2>
              <span className={styles.columnCount}>
                {colTasks.length}
              </span>
            </div>
            <div className={styles.taskList}>
              {colTasks.length === 0 ? (
                <p className={styles.emptyState}>Aucune tâche</p>
              ) : (
                colTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}