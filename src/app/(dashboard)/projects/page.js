'use client'

import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/services/projectService'
import { getProjectTasks } from '@/services/taskService'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import styles from './page.module.css'

function getInitials(name) {
  return name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function ProjectCard({ project }) {
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', project.id],
    queryFn: () => getProjectTasks(project.id),
  })

  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'DONE').length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  const owner = project.owner
  const members = project.members ?? []

  // Construire la liste complète : owner en premier, puis les membres
  const teamMembers = [
    { id: owner.id, name: owner.name, role: 'OWNER' },
    ...members
      .filter((m) => m.user.id !== owner.id) // éviter les doublons
      .map((m) => ({ id: m.userId, name: m.user.name, role: m.role })),
  ]

  return (
    <Link href={`/projects/${project.id}`}>
      <div className={styles.card}>
        {/* Titre + description */}
        <div>
          <h3 className={styles.projectName}>{project.name}</h3>
          <p className={styles.projectDesc}>{project.description}</p>
        </div>

        {/* Progression */}
        <div>
          <div className={styles.progressLabel}>
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.progressText}>{done}/{total} tâches terminées</p>
        </div>

        {/* Équipe */}
        <div>
          <div className={styles.teamLabel}>
            <img src="/team.png" alt="" style={{ width: 11.5, height: 11 }} />
            <span>Équipe ({teamMembers.length})</span>
          </div>
          <div className={styles.teamList}>
            {teamMembers.map((member) => (
              <div key={member.id} className={styles.teamMember}>
                <div className={`${styles.avatar} ${member.role === 'OWNER' ? styles.avatarOwner : ''}`}>
                  {getInitials(member.name)}
                </div>
                {member.role === 'OWNER' && (
                  <span className={styles.ownerBadge}>
                    Propriétaire
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
export default function ProjectsPage() {
  const { user } = useAuth()

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    enabled: !!user,
  })

  return (
    <div>
      {/* En-tête */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Mes projets</h1>
          <p className={styles.pageSubtitle}>Gérez vos projets</p>
        </div>
        <Link
          href="/projects/new"
          className={styles.createButton}
        >
          + Créer un projet
        </Link>
      </div>

      {/* Grille projets */}
      {isLoading ? (
        <p className={styles.statusMessage}>Chargement...</p>
      ) : projects.length === 0 ? (
        <p className={styles.statusMessage}>Aucun projet pour l'instant.</p>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}