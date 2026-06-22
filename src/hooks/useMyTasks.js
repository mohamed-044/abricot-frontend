import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/services/projectService'
import { getProjectTasks } from '@/services/taskService'
import { useAuth } from '@/context/AuthContext'

export function useMyTasks() {
  const { user } = useAuth()

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    enabled: !!user,
  })

  const { data: myTasks = [], isLoading: loadingTasks } = useQuery({
  queryKey: ['myTasks', projects.map((p) => p.id)],
  queryFn: async () => {
    const allTasks = await Promise.all(
      projects.map((p) => getProjectTasks(p.id))
    )
    const flat = allTasks.flat()
    return flat.filter((task) =>
      task.assignees?.some((a) => a.user?.id === user?.id)
    )
  },
  enabled: projects.length > 0 && !!user?.id,
})

  return {
    tasks: myTasks,
    isLoading: loadingProjects || loadingTasks,
  }
}