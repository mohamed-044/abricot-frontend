import api from '@/lib/api'

const setToken = (token) => {
  localStorage.setItem('token', token)
  document.cookie = `token=${token}; path=/`
}

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  setToken(data.data.token)
  return data.data
}

export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data.data
}

export const logout = () => {
  localStorage.removeItem('token')
  document.cookie = 'token=; path=/; max-age=0'
}

export const getMe = async () => {
  const { data } = await api.get('/auth/profile')
  return data.data
}