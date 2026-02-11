import { api } from "../index"
import {
  DeviceDetailResponse,
  DeviceListResponse,
  ListDevicesParams,
  LocationHistoryResponse,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
  UpdateDeviceRequest,
} from "./DeviceType"

const DevicePath = {
  DEVICES: "/api/devices",
  DEVICE_DETAILS: (id: string) => `/api/devices/${id}`,
  DEVICE_HISTORY: (deviceId: string) => `/api/devices/${deviceId}/location/history`,
  LOCATIONS: "/api/locations",
} as const

export const DeviceService = {
  /**
   * List all devices with pagination and filters
   */
  async listDevices(params: ListDevicesParams): Promise<DeviceListResponse> {
    return api.get<DeviceListResponse>(DevicePath.DEVICES, params)
  },

  /**
   * Register a new device
   */
  async registerDevice(data: RegisterDeviceRequest): Promise<RegisterDeviceResponse> {
    return api.post<RegisterDeviceResponse>(DevicePath.DEVICES, data)
  },

  /**
   * Get device details
   */
  async getDeviceDetails(id: string): Promise<DeviceDetailResponse> {
    return api.get<DeviceDetailResponse>(DevicePath.DEVICE_DETAILS(id))
  },

  /**
   * Update device information
   */
  async updateDevice(id: string, data: UpdateDeviceRequest): Promise<DeviceDetailResponse> {
    const response = await api.apisauce.patch<DeviceDetailResponse>(
      DevicePath.DEVICE_DETAILS(id),
      data,
    )
    if (!response.ok) {
      throw response.data || { kind: "unknown" }
    }
    return response.data as DeviceDetailResponse
  },

  /**
   * Get device location history
   */
  async getDeviceHistory(
    deviceId: string,
    params: { page: number; pageSize: number; from?: string; to?: string },
  ): Promise<LocationHistoryResponse> {
    return api.get<LocationHistoryResponse>(DevicePath.DEVICE_HISTORY(deviceId), params)
  },
}
