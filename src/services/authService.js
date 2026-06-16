import api from '@/lib/api'

const setToken = (token) => {
  localStorage.setItem('token', token)
  document.cookie = `token=${token}; path=/`
}

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  setToken(data.token)
  return data
}

export const register = async (email, password, name) => {
  const { data } = await api.post('/auth/register', { email, password, name })
  return data
}

export const logout = () => {
  localStorage.removeItem('token')
  document.cookie = 'token=; path=/; max-age=0'
}

export const getMe = async () => {
  const { data } = await api.get('/users/me')
  return data
}