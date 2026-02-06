import { useQuery } from "@tanstack/react-query"
import { UserServices } from "@/services/api"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"

export const useProfile = () => {
  const { setUser, isAuthenticated } = useAuth()

  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await UserServices.getUser()
      return response?.data
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    }
  }, [query.data, setUser])

  return query
}
