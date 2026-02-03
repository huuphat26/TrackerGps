/**
 * useMap Hook - React Hook for using MapService with MapView
 * Provides easy-to-use map functionality with state management
 */

import { useRef, useState, useCallback, useEffect } from "react"
import { Platform } from "react-native"
import MapView, {
  Region,
  LatLng,
  Camera,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps"
import mapService, {
  MapCoordinate,
  MapRegion,
  MapMarker,
  DirectionsResult,
  GeocodeResult,
  DEFAULT_REGION,
} from "./MapService"
import Config from "../../config"

// ============================================================================
// Hook Return Type
// ============================================================================

export interface UseMapReturn {
  // Refs
  mapRef: React.RefObject<MapView | null>

  // State
  region: MapRegion
  markers: MapMarker[]
  selectedMarker: MapMarker | null
  isLoading: boolean
  error: string | null
  currentLocation: MapCoordinate | null

  // Provider
  provider: typeof PROVIDER_GOOGLE | typeof PROVIDER_DEFAULT

  // Region Actions
  setRegion: (region: MapRegion) => void
  animateToRegion: (region: MapRegion, duration?: number) => void
  animateToCoordinate: (coordinate: MapCoordinate, zoom?: number, duration?: number) => void
  fitToCoordinates: (coordinates: MapCoordinate[], padding?: number) => void

  // Marker Actions
  addMarker: (marker: MapMarker) => void
  removeMarker: (markerId: string) => void
  updateMarker: (markerId: string, updates: Partial<MapMarker>) => void
  clearMarkers: () => void
  selectMarker: (markerId: string | null) => void

  // Geocoding
  geocode: (address: string) => Promise<GeocodeResult | null>
  reverseGeocode: (coordinate: MapCoordinate) => Promise<GeocodeResult | null>

  // Directions
  getDirections: (
    origin: MapCoordinate,
    destination: MapCoordinate,
    mode?: "driving" | "walking" | "bicycling" | "transit",
  ) => Promise<DirectionsResult | null>

  // Utilities
  calculateDistance: (coord1: MapCoordinate, coord2: MapCoordinate) => number
  formatDistance: (meters: number) => string
  isCoordinateInRegion: (coordinate: MapCoordinate) => boolean
}

// ============================================================================
// Hook Options
// ============================================================================

export interface UseMapOptions {
  initialRegion?: MapRegion
  initialMarkers?: MapMarker[]
  onRegionChange?: (region: MapRegion) => void
  onMarkerPress?: (marker: MapMarker) => void
  trackUserLocation?: boolean
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useMap(options: UseMapOptions = {}): UseMapReturn {
  const {
    initialRegion = DEFAULT_REGION,
    initialMarkers = [],
    onRegionChange,
    onMarkerPress,
    trackUserLocation = false,
  } = options

  // Initialize service with API key
  useEffect(() => {
    mapService.initialize({
      googleMapsApiKey: Config.GOOGLE_MAPS_API_KEY,
      defaultRegion: initialRegion,
    })
  }, [])

  // Refs
  const mapRef = useRef<MapView>(null)

  // State
  const [region, setRegionState] = useState<MapRegion>(initialRegion)
  const [markers, setMarkers] = useState<MapMarker[]>(initialMarkers)
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<MapCoordinate | null>(null)

  // ============================================================================
  // Region Actions
  // ============================================================================

  const setRegion = useCallback(
    (newRegion: MapRegion) => {
      setRegionState(newRegion)
      onRegionChange?.(newRegion)
    },
    [onRegionChange],
  )

  const animateToRegion = useCallback((targetRegion: MapRegion, duration = 500) => {
    mapRef.current?.animateToRegion(targetRegion, duration)
    setRegionState(targetRegion)
  }, [])

  const animateToCoordinate = useCallback(
    (coordinate: MapCoordinate, zoom = 15, duration = 500) => {
      const delta = mapService.deltaFromZoom(zoom)
      const targetRegion: MapRegion = {
        ...coordinate,
        latitudeDelta: delta,
        longitudeDelta: delta,
      }
      animateToRegion(targetRegion, duration)
    },
    [animateToRegion],
  )

  const fitToCoordinates = useCallback((coordinates: MapCoordinate[], padding = 50) => {
    if (coordinates.length === 0) return

    mapRef.current?.fitToCoordinates(
      coordinates.map((c) => ({ latitude: c.latitude, longitude: c.longitude })),
      {
        edgePadding: { top: padding, right: padding, bottom: padding, left: padding },
        animated: true,
      },
    )
  }, [])

  // ============================================================================
  // Marker Actions
  // ============================================================================

  const addMarker = useCallback((marker: MapMarker) => {
    setMarkers((prev) => {
      // Replace if marker with same ID exists
      const exists = prev.find((m) => m.id === marker.id)
      if (exists) {
        return prev.map((m) => (m.id === marker.id ? marker : m))
      }
      return [...prev, marker]
    })
  }, [])

  const removeMarker = useCallback((markerId: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== markerId))
    setSelectedMarker((prev) => (prev?.id === markerId ? null : prev))
  }, [])

  const updateMarker = useCallback((markerId: string, updates: Partial<MapMarker>) => {
    setMarkers((prev) => prev.map((m) => (m.id === markerId ? { ...m, ...updates } : m)))
    setSelectedMarker((prev) => (prev?.id === markerId ? { ...prev, ...updates } : prev))
  }, [])

  const clearMarkers = useCallback(() => {
    setMarkers([])
    setSelectedMarker(null)
  }, [])

  const selectMarker = useCallback(
    (markerId: string | null) => {
      if (markerId === null) {
        setSelectedMarker(null)
        return
      }
      const marker = markers.find((m) => m.id === markerId)
      if (marker) {
        setSelectedMarker(marker)
        onMarkerPress?.(marker)
      }
    },
    [markers, onMarkerPress],
  )

  // ============================================================================
  // Geocoding
  // ============================================================================

  const geocode = useCallback(async (address: string): Promise<GeocodeResult | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await mapService.geocodeAddress(address)
      if (!result) {
        setError("Không tìm thấy địa chỉ")
      }
      return result
    } catch (err) {
      setError("Lỗi khi tìm địa chỉ")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reverseGeocode = useCallback(
    async (coordinate: MapCoordinate): Promise<GeocodeResult | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await mapService.reverseGeocode(coordinate)
        if (!result) {
          setError("Không tìm thấy địa chỉ")
        }
        return result
      } catch (err) {
        setError("Lỗi khi tìm địa chỉ")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // ============================================================================
  // Directions
  // ============================================================================

  const getDirections = useCallback(
    async (
      origin: MapCoordinate,
      destination: MapCoordinate,
      mode: "driving" | "walking" | "bicycling" | "transit" = "driving",
    ): Promise<DirectionsResult | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await mapService.getDirections(origin, destination, mode)
        if (!result) {
          setError("Không tìm thấy đường đi")
        }
        return result
      } catch (err) {
        setError("Lỗi khi tìm đường")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // ============================================================================
  // Utilities
  // ============================================================================

  const calculateDistance = useCallback((coord1: MapCoordinate, coord2: MapCoordinate): number => {
    return mapService.calculateDistance(coord1, coord2)
  }, [])

  const formatDistance = useCallback((meters: number): string => {
    return mapService.formatDistance(meters)
  }, [])

  const isCoordinateInRegion = useCallback(
    (coordinate: MapCoordinate): boolean => {
      return mapService.isCoordinateInRegion(coordinate, region)
    },
    [region],
  )

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Refs
    mapRef,

    // State
    region,
    markers,
    selectedMarker,
    isLoading,
    error,
    currentLocation,

    // Provider - Use PROVIDER_GOOGLE on both Android and iOS
    // Requires: npx expo prebuild --clean && npx expo run:ios/android
    provider: Platform.select({
      android: PROVIDER_GOOGLE,
      ios: PROVIDER_GOOGLE,
      default: PROVIDER_GOOGLE,
    }) as typeof PROVIDER_GOOGLE,

    // Region Actions
    setRegion,
    animateToRegion,
    animateToCoordinate,
    fitToCoordinates,

    // Marker Actions
    addMarker,
    removeMarker,
    updateMarker,
    clearMarkers,
    selectMarker,

    // Geocoding
    geocode,
    reverseGeocode,

    // Directions
    getDirections,

    // Utilities
    calculateDistance,
    formatDistance,
    isCoordinateInRegion,
  }
}

export default useMap
