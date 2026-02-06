import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { DeviceEventEmitter } from "react-native"
import { useMMKVString } from "react-native-mmkv"
import { api, AuthService, LoginRequest, RegisterRequest, UserProfile } from "@/services/api"
import { GeneralApiProblem } from "@/services/api/apiProblem"
import { showToast } from "@/utils/toastService"
import { navigationRef } from "@/navigators/navigationUtilities"

export type AuthContextType = {
  isAuthenticated: boolean
  authToken?: string
  authEmail?: string
  user?: UserProfile
  setAuthToken: (token?: string) => void
  setAuthEmail: (email: string) => void
  setUser: (user?: UserProfile) => void
  logout: () => void
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  validationError: string
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [authToken, setAuthToken] = useMMKVString("AuthProvider.authToken")
  const [authEmail, setAuthEmail] = useMMKVString("AuthProvider.authEmail")
  const [userString, setUserString] = useMMKVString("AuthProvider.user")
  const [isLoading, setIsLoading] = useState(false)

  const user = useMemo(() => {
    try {
      return userString ? JSON.parse(userString) : undefined
    } catch {
      return undefined
    }
  }, [userString])

  const setUser = useCallback(
    (user?: UserProfile) => {
      setUserString(user ? JSON.stringify(user) : undefined)
    },
    [setUserString],
  )

  const logout = useCallback(() => {
    setAuthToken(undefined)
    setAuthEmail("")
    setUser(undefined)
    api.setHeader("Authorization", "")
    // if (navigationRef.isReady()) {
    //   navigationRef.resetRoot({
    //     index: 0,
    //     routes: [{ name: "Auth" }],
    //   })
    // }
  }, [setAuthEmail, setAuthToken, setUser])

  useEffect(() => {
    if (authToken) {
      api.setHeader("Authorization", `Bearer ${authToken}`)
    } else {
      api.setHeader("Authorization", "")
    }
  }, [authToken])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("LOGOUT", logout)
    return () => subscription.remove()
  }, [logout])

  const login = useCallback(
    async (data: LoginRequest) => {
      setIsLoading(true)
      try {
        const response = await AuthService.login(data)
        if (response.data?.token) {
          api.setHeader("Authorization", `Bearer ${response.data.token}`)
          setAuthToken(response.data.token)
          setAuthEmail(data.email)
          showToast({
            message: response.data.message || "Đăng nhập thành công",
            type: "SUCCESS",
            duration: 3000,
          })
        }
      } catch (error: any) {
        const apiError = error as GeneralApiProblem
        showToast({
          message:
            apiError.kind === "unauthorized"
              ? error?.message
              : "Đã có lỗi xảy ra trong quá trình đăng nhập",
          type: "ERROR",
          duration: 3000,
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [setAuthEmail, setAuthToken],
  )

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true)
    try {
      const response = await AuthService.register(data)
      showToast({
        message: response.data?.message || "Tạo tài khoản thành công",
        type: "SUCCESS",
        duration: 3000,
      })
    } catch (error) {
      showToast({
        message: "Đã có lỗi xảy ra trong quá trình đăng ký",
        type: "ERROR",
        duration: 3000,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return "can't be blank"
    if (authEmail.length < 6) return "must be at least 6 characters"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "must be a valid email address"
    return ""
  }, [authEmail])

  const value = {
    isAuthenticated: !!authToken,
    authToken,
    authEmail,
    user,
    setAuthToken,
    setAuthEmail,
    setUser,
    logout,
    login,
    register,
    validationError,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
