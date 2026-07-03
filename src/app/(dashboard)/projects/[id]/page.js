'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProject } from '@/services/projectService'
import { getProjectTasks, createTask, updateTask, deleteTask } from '@/services/taskService'
import { useAuth } from '@/context/AuthContext'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowLeft, ChevronUp, ChevronDown, Search, Pencil, Trash2 } from 'lucide-react'
import TaskFormModal from '@/components/tasks/TaskFormModal'
import ProjectModal from '@/components/projects/ProjectModal'
import { toast } from 'sonner'
import styles from './page.module.css'


function getInitials(name) {
  return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const STATUS_LABELS = {
  TODO: { label: 'À faire', color: styles.statusTodo },
  IN_PROGRESS: { label: 'En cours', color: styles.statusInProgress },
  DONE: { label: 'Terminée', color: styles.statusDone },
}

function TaskItem({ task, onEdit, onDelete }) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const status = STATUS_LABELS[task.status] ?? STATUS_LABELS.TODO

  return (
    <div className={styles.taskCard}>
      {/* Header tâche */}
      <div className={styles.taskHeader}>
        <div className={styles.taskTitleRow}>
          <h3 className={styles.taskTitle}>{task.title}</h3>
          <span className={`${styles.statusBadge} ${status.color}`}>
            {status.label}
          </span>
        </div>
        <div className={styles.taskActions}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            •••
          </button>
          {menuOpen && (
            <div className={styles.taskMenu}>
              <button
                type="button"
                className={styles.taskMenuItem}
                onClick={() => {
                  setMenuOpen(false)
                  onEdit()
                }}
              >
                <Pencil size={14} /> Modifier
              </button>
              <button
                type="button"
                className={styles.taskMenuItem}
                onClick={() => {
                  setMenuOpen(false)
                  onDelete()
                }}
              >
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      <p className={styles.taskDescription}>{task.description}</p>

      {/* Échéance */}
      <div className={styles.dueDateWrapper}>
        <span className={styles.dueDateLabel}>Échéance :</span>
        <img src="/calendar-black.png" alt="" className={styles.calendarIcon} />
        <span className={styles.dueDateText}>
          {task.dueDate
            ? format(new Date(task.dueDate), 'd MMM', { locale: fr })
            : 'Pas de date'}
        </span>
      </div>

      {/* Assignés */}
      {task.assignees?.length > 0 && (
        <div className={styles.assigneesWrapper}>
          <span className={styles.assigneeLabel}>Assigné à :</span>
          {task.assignees.map((a) => (
              <div key={a.id} className={styles.assigneeTag}>
                <div className={styles.assigneeAvatar}>{getInitials(a.user?.name)}</div>
                <span className={styles.assigneeTagName}>{a.user?.name}</span>
              </div>
          ))}
        </div>
      )}

      {/* Commentaires */}
      <button
        onClick={() => setCommentsOpen(!commentsOpen)}
        className={styles.commentsBtn}
      >
        <span>Commentaires ({task.comments?.length ?? 0})</span>
        {commentsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {commentsOpen && task.comments?.length > 0 && (
        <div className={styles.commentsSection}>
          {task.comments.map((c) => (
            <div key={c.id} className={styles.commentCard}>
              <p className={styles.commentAuthor}>{c.author?.name}</p>
              <p className={styles.commentContent}>{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewMode, setViewMode] = useState('list')

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: !!id,
  })

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => getProjectTasks(id),
    enabled: !!id,
  })

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter ? t.status === statusFilter : true
    return matchSearch && matchStatus
  })

  const isOwnerOrAdmin = project?.userRole === 'ADMIN' || project?.ownerId === user?.id

  const allMembers = project?.owner
    ? [
        { id: project.owner.id, name: project.owner.name, role: 'OWNER' },
        ...(project.members ?? [])
          .filter((m) => m.user.id !== project.owner.id)
          .map((m) => ({ id: m.userId, name: m.user.name, role: m.role })),
      ]
    : []

  const queryClient = useQueryClient()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const createMutation = useMutation({
    mutationFn: (data) => createTask(id, {
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', id])
      setCreateModalOpen(false)
      toast.success('Tâche créée !')
    },
    onError: () => toast.error('Erreur lors de la création'),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => updateTask(id, editTask.id, {
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', id])
      setEditTask(null)
      toast.success('Tâche modifiée !')
    },
    onError: () => toast.error('Erreur lors de la modification'),
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId) => deleteTask(id, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', id])
      toast.success('Tâche supprimée !')
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })

  const allMembersForForm = project ? [
    ...(project.owner ? [{ id: project.owner.id, name: project.owner.name }] : []),
    ...(project.members ?? [])
      .filter((m) => m.user.id !== project.owner?.id)
      .map((m) => ({ id: m.userId, name: m.user.name })),
  ] : []

  if (loadingProject) return <p className={styles.statusText}>Chargement...</p>
  if (!project) return <p className={styles.statusText}>Projet introuvable.</p>

  return (
    <div>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className={styles.projectTitleRow}>
              <h1 className={styles.projectName}>{project.name}</h1>
              {isOwnerOrAdmin && (
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className={styles.editLink}
                >
                  Modifier
                </button>
              )}
            </div>
            <p className={styles.projectDescription}>{project.description}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={() => setCreateModalOpen(true)}
            className={styles.createBtn}
          >
            Créer une tâche
          </button>
        </div>
      </div>

      {/* Contributeurs */}
      <div className={styles.contributorsCard}>
        <span className={styles.contributorsLabel}>
          Contributeurs <span className={styles.contributorsCount}>{allMembers.length} personnes</span>
        </span>
        <div className={styles.contributorsList}>
          {allMembers.map((member) => (
            <div key={member.id} className={styles.contributorItem}>
              <div className={`${styles.memberAvatar} ${member.role === 'OWNER' ? styles.memberAvatarOwner : styles.memberAvatarOther}`}>
                {getInitials(member.name)}
              </div>
              {member.role === 'OWNER' ? (
                <span className={`${styles.badgeBase} ${styles.ownerBadge}`}>
                  Propriétaire
                </span>
              ) : (
                <span className={`${styles.badgeBase} ${styles.memberName}`}>{member.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Carte tâches */}
      <div className={styles.tasksCard}>
        {/* Header tâches */}
        <div className={styles.tasksCardHeader}>
          <div>
            <h2 className={styles.tasksCardTitle}>Tâches</h2>
            <p className={styles.tasksCardSubtitle}>Par ordre de priorité</p>
          </div>
          <div className={styles.controlsGroup}>
            <div className={styles.viewControls}>
              <button
                type="button"
                className={`${styles.viewBtn} ${styles.viewBtnList} ${viewMode === 'list' ? styles.activeViewBtn : ''}`}
                onClick={() => setViewMode('list')}
              >
                <img src="/check.png" alt="Liste" width="16" height="16" className={styles.viewBtnIcon} /> Liste
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${styles.viewBtnCalendar} ${viewMode === 'calendar' ? styles.activeViewBtn : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <img src="/calendar-orange.png" alt="Calendrier" width="16" height="16" className={styles.viewBtnIcon} /> Calendrier
              </button>
            </div>
            <div className={styles.taskFilters}>
              {/* Filtre statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.statusSelect}
            >
              <option value="">Statut</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminée</option>
            </select>

            {/* Recherche */}
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Rechercher une tâche"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <Search size={14} className={styles.searchIcon} />
            </div>
          </div>
        </div>
      </div>

        {/* Liste tâches */}
        {viewMode === 'calendar' ? (
          <div className={styles.calendarPlaceholder}>
            Vue calendrier à venir.
          </div>
        ) : loadingTasks ? (
          <p className={styles.statusText}>Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className={styles.statusText}>Aucune tâche.</p>
        ) : (
          <div className={styles.taskList}>
            {filtered.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => setEditTask(task)}
                onDelete={() => deleteMutation.mutate(task.id)}
              />
            ))}
          </div>
        )}
      </div>

      <TaskFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createMutation.mutate}
        members={allMembersForForm}
      />

      <TaskFormModal
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        onSubmit={updateMutation.mutate}
        members={allMembersForForm}
        defaultValues={editTask}
      />

      <ProjectModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={project}
      />
    </div>
  )
}