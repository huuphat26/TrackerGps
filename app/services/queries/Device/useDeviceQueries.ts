import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  DeviceService,
  ListDevicesParams,
  RegisterDeviceRequest,
  UpdateDeviceRequest,
} from "@/services/api"

/**
 * Hook to list all devices with pagination and filters
 */
// ...existing code...
export const useDevices = (params: ListDevicesParams) => {
  return useQuery({
    queryKey: ["devices", params],
    queryFn: async () => {
      const response = await DeviceService.listDevices(params)
      return response
    },
  })
}

/**
 * Hook to register a new device
 */
export const useRegisterDevice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterDeviceRequest) => DeviceService.registerDevice(data),
    onSuccess: () => {
      // Invalidate devices list to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
  })
}

/**
 * Hook to get device details
 */
export const useDeviceDetails = (id: string) => {
  return useQuery({
    queryKey: ["device", id],
    queryFn: async () => {
      const response = await DeviceService.getDeviceDetails(id)
      return response
    },
    enabled: !!id,
  })
}

/**
 * Hook to update device information
 */
export const useUpdateDevice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeviceRequest }) =>
      DeviceService.updateDevice(id, data),
    onSuccess: (data, variables) => {
      // Update specific device and list
      queryClient.invalidateQueries({ queryKey: ["device", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
  })
}

/**
 * Hook to get device location history
 */
export const useDeviceHistory = (
  deviceId: string,
  params: { page: number; pageSize: number; from?: string; to?: string },
) => {
  return useQuery({
    queryKey: ["deviceHistory", deviceId, params],
    queryFn: async () => {
      const response = await DeviceService.getDeviceHistory(deviceId, params)
      return response?.data
    },
    enabled: !!deviceId,
  })
}
