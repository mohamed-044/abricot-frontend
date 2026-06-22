import api from '@/lib/api'

export const getProjectTasks = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/tasks`)
  return data.data.tasks ?? []
}