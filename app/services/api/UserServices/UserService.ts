import { api } from "../index"
import { UserProfileResponse } from "./UserType"

const UserPath = {
  GET_USER: "/api/user",
} as const

export const UserServices = {
  getUser: async (): Promise<UserProfileResponse> => {
    return api.get<UserProfileResponse>(UserPath.GET_USER)
  },
}
