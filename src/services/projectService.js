import api from '@/lib/api'

export const getProjects = async () => {
  const { data } = await api.get('/projects')
  return data.data.projects ?? []
}

export const getProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`)
  return data.data.project ?? data.data
}

export const createProject = async ({ name, description, contributors }) => {
  const { data } = await api.post('/projects', { name, description, contributors })
  return data.data
}

export const updateProject = async (id, { name, description, contributors }) => {
  const { data } = await api.put(`/projects/${id}`, { name, description, contributors })
  return data.data
}

export const addProjectContributor = async (projectId, email) => {
  const { data } = await api.post(`/projects/${projectId}/contributors`, { email })
  return data.data
}

export const removeProjectContributor = async (projectId, userId) => {
  const { data } = await api.delete(`/projects/${projectId}/contributors/${userId}`)
  return data.data
}

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`)
  return data
}