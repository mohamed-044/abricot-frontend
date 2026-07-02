import api from '@/lib/api'

export const getProjects = async () => {
  const { data } = await api.get('/projects')
  return data.data.projects ?? []
}

export const getProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`)
  return data.data
}