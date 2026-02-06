import { ApiEnvelope } from "../types"

export interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export type UserProfileResponse = ApiEnvelope<UserProfile>
