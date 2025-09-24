import { createContext, useContext, useMemo, useState } from 'react'
import { login as apiLogin, register as apiRegister } from './api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const json = localStorage.getItem('user')
    return json ? JSON.parse(json) : null
  })

  const value = useMemo(() => ({
    user,
    async login(credentials) {
      const data = await apiLogin(credentials)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    },
    async register(payload) {
      const data = await apiRegister(payload)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }), [user])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}


