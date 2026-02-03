/**
 * MapService - Google Maps Service for React Native
 * Based on Expo docs: https://docs.expo.dev/versions/latest/sdk/map-view/
 *
 * This service provides utilities for working with Google Maps in React Native
 */

import { Platform } from "react-native"
import { PROVIDER_GOOGLE, Region, LatLng, Camera } from "react-native-maps"

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface MapCoordinate {
  latitude: number
  longitude: number
}

export interface MapRegion extends MapCoordinate {
  latitudeDelta: number
  longitudeDelta: number
}

export interface MapMarker {
  id: string
  coordinate: MapCoordinate
  title?: string
  description?: string
  pinColor?: string
  icon?: any
}

export interface MapPolyline {
  id: string
  coordinates: MapCoordinate[]
  strokeColor?: string
  strokeWidth?: number
}

export interface MapPolygon {
  id: string
  coordinates: MapCoordinate[]
  fillColor?: string
  strokeColor?: string
  strokeWidth?: number
}

export interface MapCircle {
  id: string
  center: MapCoordinate
  radius: number // in meters
  fillColor?: string
  strokeColor?: string
  strokeWidth?: number
}

export interface DirectionsResult {
  coordinates: MapCoordinate[]
  distance: number // in meters
  duration: number // in seconds
  polyline: string
}

export interface GeocodeResult {
  address: string
  coordinate: MapCoordinate
  placeId?: string
}

export interface MapServiceConfig {
  googleMapsApiKey?: string
  defaultRegion?: MapRegion
  defaultZoom?: number
}

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_REGION: MapRegion = {
  latitude: 10.762622, // Ho Chi Minh City
  longitude: 106.660172,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

export const DEFAULT_ZOOM = 15

export const MAP_TYPES = {
  STANDARD: "standard",
  SATELLITE: "satellite",
  HYBRID: "hybrid",
  TERRAIN: "terrain",
  NONE: "none",
} as const

export type MapType = (typeof MAP_TYPES)[keyof typeof MAP_TYPES]

// Pin colors
export const PIN_COLORS = {
  RED: "red",
  GREEN: "green",
  BLUE: "blue",
  ORANGE: "#FF5722",
  PURPLE: "purple",
  YELLOW: "yellow",
  CYAN: "cyan",
  GOLD: "gold",
} as const

// ============================================================================
// Map Service Class
// ============================================================================

class MapService {
  private apiKey: string = ""
  private defaultRegion: MapRegion = DEFAULT_REGION

  /**
   * Initialize the map service with configuration
   */
  initialize(config: MapServiceConfig) {
    if (config.googleMapsApiKey) {
      this.apiKey = config.googleMapsApiKey
    }
    if (config.defaultRegion) {
      this.defaultRegion = config.defaultRegion
    }
  }

  /**
   * Get the map provider based on platform
   * Returns PROVIDER_GOOGLE for consistent experience across platforms
   */
  getProvider() {
    return PROVIDER_GOOGLE
  }

  /**
   * Get default region
   */
  getDefaultRegion(): MapRegion {
    return this.defaultRegion
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @returns distance in meters
   */
  calculateDistance(coord1: MapCoordinate, coord2: MapCoordinate): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180
    const φ2 = (coord2.latitude * Math.PI) / 180
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  /**
   * Format distance for display
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`
    }
    return `${(meters / 1000).toFixed(2)} km`
  }

  /**
   * Calculate region that fits all given coordinates
   */
  getRegionForCoordinates(coordinates: MapCoordinate[], padding = 0.1): MapRegion {
    if (coordinates.length === 0) {
      return this.defaultRegion
    }

    if (coordinates.length === 1) {
      return {
        ...coordinates[0],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    }

    let minLat = coordinates[0].latitude
    let maxLat = coordinates[0].latitude
    let minLng = coordinates[0].longitude
    let maxLng = coordinates[0].longitude

    coordinates.forEach((coord) => {
      minLat = Math.min(minLat, coord.latitude)
      maxLat = Math.max(maxLat, coord.latitude)
      minLng = Math.min(minLng, coord.longitude)
      maxLng = Math.max(maxLng, coord.longitude)
    })

    const latDelta = (maxLat - minLat) * (1 + padding)
    const lngDelta = (maxLng - minLng) * (1 + padding)

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    }
  }

  /**
   * Get camera position from region
   */
  getCameraFromRegion(region: MapRegion, zoom?: number): Camera {
    return {
      center: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      pitch: 0,
      heading: 0,
      altitude: 1000,
      zoom: zoom ?? this.zoomFromDelta(region.latitudeDelta),
    }
  }

  /**
   * Convert latitude delta to zoom level (approximate)
   */
  zoomFromDelta(latDelta: number): number {
    return Math.round(Math.log(360 / latDelta) / Math.LN2)
  }

  /**
   * Convert zoom level to latitude delta (approximate)
   */
  deltaFromZoom(zoom: number): number {
    return 360 / Math.pow(2, zoom)
  }

  /**
   * Geocode an address to coordinates using Google Geocoding API
   */
  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    if (!this.apiKey) {
      console.warn("[MapService] API key not set. Cannot geocode.")
      return null
    }

    try {
      const encodedAddress = encodeURIComponent(address)
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.apiKey}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0]
        return {
          address: result.formatted_address,
          coordinate: {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          },
          placeId: result.place_id,
        }
      }

      console.warn("[MapService] Geocoding failed:", data.status)
      return null
    } catch (error) {
      console.error("[MapService] Geocoding error:", error)
      return null
    }
  }

  /**
   * Reverse geocode coordinates to address using Google Geocoding API
   */
  async reverseGeocode(coordinate: MapCoordinate): Promise<GeocodeResult | null> {
    if (!this.apiKey) {
      console.warn("[MapService] API key not set. Cannot reverse geocode.")
      return null
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${this.apiKey}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0]
        return {
          address: result.formatted_address,
          coordinate,
          placeId: result.place_id,
        }
      }

      console.warn("[MapService] Reverse geocoding failed:", data.status)
      return null
    } catch (error) {
      console.error("[MapService] Reverse geocoding error:", error)
      return null
    }
  }

  /**
   * Get directions between two points using Google Directions API
   */
  async getDirections(
    origin: MapCoordinate,
    destination: MapCoordinate,
    mode: "driving" | "walking" | "bicycling" | "transit" = "driving",
  ): Promise<DirectionsResult | null> {
    if (!this.apiKey) {
      console.warn("[MapService] API key not set. Cannot get directions.")
      return null
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&key=${this.apiKey}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === "OK" && data.routes.length > 0) {
        const route = data.routes[0]
        const leg = route.legs[0]

        // Decode polyline to coordinates
        const coordinates = this.decodePolyline(route.overview_polyline.points)

        return {
          coordinates,
          distance: leg.distance.value,
          duration: leg.duration.value,
          polyline: route.overview_polyline.points,
        }
      }

      console.warn("[MapService] Directions failed:", data.status)
      return null
    } catch (error) {
      console.error("[MapService] Directions error:", error)
      return null
    }
  }

  /**
   * Decode Google polyline to coordinates
   */
  decodePolyline(encoded: string): MapCoordinate[] {
    const coordinates: MapCoordinate[] = []
    let index = 0
    let lat = 0
    let lng = 0

    while (index < encoded.length) {
      let shift = 0
      let result = 0
      let byte: number

      do {
        byte = encoded.charCodeAt(index++) - 63
        result |= (byte & 0x1f) << shift
        shift += 5
      } while (byte >= 0x20)

      const dlat = result & 1 ? ~(result >> 1) : result >> 1
      lat += dlat

      shift = 0
      result = 0

      do {
        byte = encoded.charCodeAt(index++) - 63
        result |= (byte & 0x1f) << shift
        shift += 5
      } while (byte >= 0x20)

      const dlng = result & 1 ? ~(result >> 1) : result >> 1
      lng += dlng

      coordinates.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      })
    }

    return coordinates
  }

  /**
   * Create a marker object
   */
  createMarker(
    id: string,
    coordinate: MapCoordinate,
    options?: Partial<Omit<MapMarker, "id" | "coordinate">>,
  ): MapMarker {
    return {
      id,
      coordinate,
      ...options,
    }
  }

  /**
   * Check if a coordinate is within a region
   */
  isCoordinateInRegion(coordinate: MapCoordinate, region: MapRegion): boolean {
    const latMin = region.latitude - region.latitudeDelta / 2
    const latMax = region.latitude + region.latitudeDelta / 2
    const lngMin = region.longitude - region.longitudeDelta / 2
    const lngMax = region.longitude + region.longitudeDelta / 2

    return (
      coordinate.latitude >= latMin &&
      coordinate.latitude <= latMax &&
      coordinate.longitude >= lngMin &&
      coordinate.longitude <= lngMax
    )
  }

  /**
   * Calculate bearing between two coordinates
   * @returns bearing in degrees (0-360)
   */
  calculateBearing(from: MapCoordinate, to: MapCoordinate): number {
    const φ1 = (from.latitude * Math.PI) / 180
    const φ2 = (to.latitude * Math.PI) / 180
    const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180

    const y = Math.sin(Δλ) * Math.cos(φ2)
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

    const θ = Math.atan2(y, x)
    const bearing = ((θ * 180) / Math.PI + 360) % 360

    return bearing
  }

  /**
   * Get compass direction from bearing
   */
  getCompassDirection(bearing: number): string {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    const index = Math.round(bearing / 45) % 8
    return directions[index]
  }

  /**
   * Calculate a new coordinate from a starting point, bearing, and distance
   */
  calculateDestination(
    start: MapCoordinate,
    bearing: number,
    distanceMeters: number,
  ): MapCoordinate {
    const R = 6371e3 // Earth's radius in meters
    const δ = distanceMeters / R // Angular distance
    const θ = (bearing * Math.PI) / 180 // Bearing in radians

    const φ1 = (start.latitude * Math.PI) / 180
    const λ1 = (start.longitude * Math.PI) / 180

    const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ))

    const λ2 =
      λ1 +
      Math.atan2(
        Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
        Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2),
      )

    return {
      latitude: (φ2 * 180) / Math.PI,
      longitude: (λ2 * 180) / Math.PI,
    }
  }
}

// Export singleton instance
export const mapService = new MapService()

export default mapService
