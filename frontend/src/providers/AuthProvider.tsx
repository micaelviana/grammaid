'use client'
import api from "@/utils/api"
import { createContext, useState, useEffect } from "react"

interface UserSession {
  userId: string
  userType: string
  userName: string
  email?: string
  userLevel?: string
}

interface IAuthContext {
  user: UserSession | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const InitialAuthContextData: IAuthContext = {
  user: null,
  login: async () => false,
  logout: () => { },
}

export const AuthContext = createContext<IAuthContext>(InitialAuthContextData)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/v1/me')
        if (res.status === 200) {
          setUser(res.data)
        }
      } catch (error) {
        // Sem sessão ativa, deixa user como null
        console.log('Nenhuma sessão ativa')
        console.log(error)
      }
    }
    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/v1/login', {
        email,
        password,
      });
      if (res.status === 200) {
        const data = await res.data
        setUser(data)
        return true
      }
      return false
    } catch (error) {
      // Erro de autenticação (401) ou outro erro da API
      console.log('Erro no login:', error)
      return false
    }
  }

  const logout = async () => {
    const res = await api.post('/v1/logout')
    if (res.status === 200) {
      setUser(null)
    }
  }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider >
}

export default AuthProvider
