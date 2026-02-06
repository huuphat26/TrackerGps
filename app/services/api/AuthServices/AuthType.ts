import { ApiEnvelope } from "../types"

// Request types
export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

// Response types
export interface UserDto {
  id: string
  name: string
  email: string
}

export interface RegisterResult {
  message: string
  user: UserDto
}

export interface LoginResult {
  message: string
  token: string
}

// Wrapped response types
export type RegisterResponse = ApiEnvelope<RegisterResult>
export type LoginResponse = ApiEnvelope<LoginResult>
