import api from '@/lib/api'

export const getProjectTasks = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/tasks`)
  return data.data.tasks ?? []
}

export const createTask = async (projectId, taskData) => {
  const { data } = await api.post(`/projects/${projectId}/tasks`, taskData)
  return data.data
}

export const updateTask = async (projectId, taskId, taskData) => {
  const { data } = await api.put(`/projects/${projectId}/tasks/${taskId}`, taskData)
  return data.data
}

export const deleteTask = async (projectId, taskId) => {
  const { data } = await api.delete(`/projects/${projectId}/tasks/${taskId}`)
  return data
}