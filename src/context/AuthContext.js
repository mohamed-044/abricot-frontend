'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, logout as logoutService } from '@/services/authService'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    logoutService()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
