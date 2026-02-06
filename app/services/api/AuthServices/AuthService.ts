import { api } from "../index"
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./AuthType"

const AuthPath = {
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
} as const

export const AuthService = {
  /**
   * Register a new user
   */
  register: (payload: RegisterRequest) => api.post<RegisterResponse>(AuthPath.REGISTER, payload),

  /**
   * Login user
   */
  login: (payload: LoginRequest) => api.post<LoginResponse>(AuthPath.LOGIN, payload),
}

export type AuthServiceType = typeof AuthService
