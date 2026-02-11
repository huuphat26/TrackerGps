import { ApiResponse, PaginatedResponse } from "../types"

export type DeviceStatus = "online" | "offline"
export type DeviceVehicleType = "car" | "bike" | "truck"

export interface Device {
  id: string
  deviceId: string
  name: string
  licensePlate?: string
  type: DeviceVehicleType
  status: DeviceStatus
  battery: number | null
  signal: number | null
  lastPosition?: {
    latitude: number
    longitude: number
  }
  lastLatitude?: number | null
  lastLongitude?: number | null
  lastSeen?: string
  lastSeenAt?: string | null
  createdAt: string
  updatedAt?: string
  userId?: string
  mqttUsername?: string
  mqttPassword?: string
  feedKey?: string
  isOnline?: boolean
}

export interface MqttConfig {
  host: string
  port: number
  username: string
  password?: string
  feedKey: string
}

export interface DeviceWithMqtt extends Device {
  mqttConfig: MqttConfig
}

export type RegisterDeviceResponse = ApiResponse<DeviceWithMqtt>

export interface ListDevicesParams {
  page: number
  pageSize: number
  status?: DeviceStatus
  type?: DeviceVehicleType
}

export interface RegisterDeviceRequest {
  deviceId: string
  name: string
  type?: DeviceVehicleType
}

export interface UpdateDeviceRequest {
  name?: string
  type?: DeviceVehicleType
  status?: DeviceStatus
}

export interface LocationHistoryItem {
  latitude: number
  longitude: number
  createdAt: string
}

export type DeviceListResponse = PaginatedResponse<Device>
export type DeviceDetailResponse = Device
export type LocationHistoryResponse = PaginatedResponse<LocationHistoryItem>
