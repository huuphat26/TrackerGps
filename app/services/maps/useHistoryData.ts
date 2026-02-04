import { useState } from "react"
import { LatLng } from "react-native-maps"

export type StatusType = "moving" | "stop" | "engine_on" | "parked" | "offline"

export interface HistoryLogEntry {
  id: string
  time: string
  location: string
  eventTitle: string
  subInfo?: string
  statusType: StatusType
  coordinate: LatLng
}

export interface HistoryRoute {
  id: string
  points: HistoryLogEntry[]
}

export const useHistoryData = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(false)

  const mockLogs: HistoryLogEntry[] = [
    {
      id: "1",
      time: "10:00:25 AM",
      location: "123 Main St, New York, NY 10001",
      eventTitle: "Moving",
      statusType: "moving",
      coordinate: { latitude: 10.8231, longitude: 106.6297 },
    },
    {
      id: "2",
      time: "09:45:10 AM",
      location: "456 Broadway Ave, New York, NY 10013",
      eventTitle: "Short Stop",
      subInfo: "Duration: 15m",
      statusType: "stop",
      coordinate: { latitude: 10.824, longitude: 106.63 },
    },
    {
      id: "3",
      time: "09:15:00 AM",
      location: "Ignition On",
      eventTitle: "Engine On",
      subInfo: "Battery: 12.4V",
      statusType: "engine_on",
      coordinate: { latitude: 10.825, longitude: 106.631 },
    },
    {
      id: "4",
      time: "08:30:45 AM",
      location: "789 Park Lane South, Brooklyn, NY 11201",
      eventTitle: "Parked(Overnight)",
      subInfo: "Duration: 8h 15m",
      statusType: "parked",
      coordinate: { latitude: 10.826, longitude: 106.632 },
    },
    {
      id: "5",
      time: "12:15:00 AM",
      location: "System Check",
      eventTitle: "Offline",
      statusType: "offline",
      coordinate: { latitude: 10.827, longitude: 106.633 },
    },
  ]

  const fetchHistory = async (date: Date, _deviceId: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)
    return mockLogs
  }

  return {
    fetchHistory,
    currentDate,
    setCurrentDate,
    loading,
  }
}
