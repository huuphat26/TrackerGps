import { useState, useEffect, useCallback } from "react"
import * as Location from "expo-location"
import { useMqtt } from "./useMqtt"
import { gpsFeedService } from "./GpsFeedService"

export interface GPSLocationData {
  latitude: number
  longitude: number
  altitude: number | null
  accuracy: number | null
  timestamp: number
}

interface UseGPSLocationOptions {
  /**
   * Feed name to publish location data to
   * @default "gps-feed"
   */
  feedName?: string
  /**
   * Auto-publish location when it changes
   * @default false
   */
  autoPublish?: boolean
  /**
   * Watch location changes (continuous updates)
   * @default false
   */
  watchLocation?: boolean
  /**
   * Minimum time interval between location updates (ms)
   * Only used when watchLocation is true
   * @default 5000
   */
  updateInterval?: number
}

interface UseGPSLocationReturn {
  /** Current location data */
  location: GPSLocationData | null
  /** Location permission status */
  hasPermission: boolean | null
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: string | null
  /** Request location permissions */
  requestPermission: () => Promise<boolean>
  /** Get current location once */
  getCurrentLocation: () => Promise<void>
  /** Manually publish current location to Adafruit IO */
  publishCurrentLocation: () => void
  /** Start watching location changes */
  startWatching: () => Promise<void>
  /** Stop watching location changes */
  stopWatching: () => void
  /** Is currently watching location */
  isWatching: boolean
}

/**
 * Hook for managing GPS location with MQTT publishing to Adafruit IO
 */
export function useGPSLocation(
  options: UseGPSLocationOptions = {}
): UseGPSLocationReturn {
  const {
    feedName = "gps-feed",
    autoPublish = false,
    watchLocation = false,
    updateInterval = 5000,
  } = options

  const { isConnected } = useMqtt()
  const [location, setLocation] = useState<GPSLocationData | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWatching, setIsWatching] = useState(false)
  const [locationSubscription, setLocationSubscription] =
    useState<Location.LocationSubscription | null>(null)

  // Request location permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const { status } = await Location.requestForegroundPermissionsAsync()
      const granted = status === "granted"
      setHasPermission(granted)

      if (!granted) {
        setError("Location permission denied")
      }

      return granted
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Permission request failed"
      setError(errorMsg)
      console.error("[GPS] Permission error:", errorMsg)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!hasPermission) {
        const granted = await requestPermission()
        if (!granted) return
      }

      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const locationData: GPSLocationData = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        altitude: result.coords.altitude,
        accuracy: result.coords.accuracy,
        timestamp: result.timestamp,
      }

      setLocation(locationData)
      console.log("[GPS] Location obtained:", locationData)

      // Auto-publish if enabled
      if (autoPublish && isConnected) {
        gpsFeedService.publishLocation(
          locationData.latitude,
          locationData.longitude,
          locationData.altitude ?? 0
        )
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to get location"
      setError(errorMsg)
      console.error("[GPS] Location error:", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [hasPermission, requestPermission, autoPublish, isConnected, feedName])

  // Manually publish current location
  const publishCurrentLocation = useCallback(() => {
    if (!location) {
      console.warn("[GPS] No location available to publish")
      return
    }

    if (!isConnected) {
      console.warn("[GPS] MQTT not connected, cannot publish")
      return
    }

    gpsFeedService.publishLocation(
      location.latitude,
      location.longitude,
      location.altitude ?? 0
    )
    console.log("[GPS] Published location to Adafruit IO")
  }, [location, isConnected, feedName])

  // Start watching location
  const startWatching = useCallback(async () => {
    try {
      if (isWatching) {
        console.log("[GPS] Already watching location")
        return
      }

      if (!hasPermission) {
        const granted = await requestPermission()
        if (!granted) return
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: updateInterval,
          distanceInterval: 10, // Update every 10 meters
        },
        (result) => {
          const locationData: GPSLocationData = {
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
            altitude: result.coords.altitude,
            accuracy: result.coords.accuracy,
            timestamp: result.timestamp,
          }

          setLocation(locationData)
          console.log("[GPS] Location updated:", locationData)

          // Auto-publish if enabled
          if (autoPublish && isConnected) {
            gpsFeedService.publishLocation(
              locationData.latitude,
              locationData.longitude,
              locationData.altitude ?? 0
            )
          }
        }
      )

      setLocationSubscription(subscription)
      setIsWatching(true)
      console.log("[GPS] Started watching location")
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to watch location"
      setError(errorMsg)
      console.error("[GPS] Watch error:", errorMsg)
    }
  }, [
    isWatching,
    hasPermission,
    requestPermission,
    updateInterval,
    autoPublish,
    isConnected,
    feedName,
  ])

  // Stop watching location
  const stopWatching = useCallback(() => {
    if (locationSubscription) {
      locationSubscription.remove()
      setLocationSubscription(null)
      setIsWatching(false)
      console.log("[GPS] Stopped watching location")
    }
  }, [locationSubscription])

  // Check permission on mount
  useEffect(() => {
    ;(async () => {
      const { status } = await Location.getForegroundPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  // Auto-start watching if enabled
  useEffect(() => {
    if (watchLocation && hasPermission) {
      startWatching()
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove()
      }
    }
  }, [watchLocation, hasPermission])

  return {
    location,
    hasPermission,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
    publishCurrentLocation,
    startWatching,
    stopWatching,
    isWatching,
  }
}
