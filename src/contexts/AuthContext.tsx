import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_ADMIN = {
  id: 'admin-1',
  name: 'Quản trị viên',
  email: 'admin@example.com',
  role: 'ADMIN',
}

/** Mock: chỉ chấp nhận admin@example.com / 123456 */
function mockLogin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ok =
        email.trim().toLowerCase() === 'admin@example.com' && password === '123456'
      if (ok) {
        resolve({ success: true })
      } else {
        resolve({
          success: false,
          error: 'Email hoặc mật khẩu không đúng. Thử: admin@example.com / 123456',
        })
      }
    }, 500)
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = sessionStorage.getItem('admin_user')
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  })

  const login = useCallback(async (email: string, password: string) => {
    const result = await mockLogin(email, password)
    if (result.success) {
      const u = { ...MOCK_ADMIN, email: email.trim().toLowerCase() }
      setUser(u)
      sessionStorage.setItem('admin_user', JSON.stringify(u))
    }
    return result
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem('admin_user')
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider')
  return ctx
}
