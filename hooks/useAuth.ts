import { useEffect, useState } from 'react'
import { ApiClient } from '../api/client'
import { User } from '../types/user.types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface UseAuthReturn extends AuthState {
  login: (token: string) => void
  logout: () => void
  setUser: (user: User | null) => void
}

export function useAuth(apiClient: ApiClient): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      loadUser()
    } else {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const loadUser = async () => {
    try {
      const response = await apiClient.get('/users/me')
      if (response.success && response.data) {
        setState({
          user: response.data,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }

  const login = (token: string) => {
    localStorage.setItem('auth_token', token)
    loadUser()
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    apiClient.setAuthToken(null)
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const setUser = (user: User | null) => {
    setState((prev) => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }))
  }

  return {
    ...state,
    login,
    logout,
    setUser,
  }
}