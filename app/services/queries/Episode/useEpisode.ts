import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { EnumKey } from "@/services/queries/EnumKey"

export const useEpisodeList = () => {
  const query = useQuery({
    queryKey: [EnumKey.EPISODE],
    queryFn: async () => {
      const response = await api.getEpisodes()
      if (response.kind === "ok") {
        return response.episodes
      }
      throw new Error(response.kind)
    },
    meta: {
      errorMessage: "Failed to load episodes",
    },
  })

  return {
    episodes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  }
}
