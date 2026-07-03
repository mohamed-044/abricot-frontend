import api from '@/lib/api'

export const searchUsers = async (query) => {
  const { data } = await api.get(`/users/search?query=${query}`)
  return data.data.users ?? []
}