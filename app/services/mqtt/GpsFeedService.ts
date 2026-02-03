import { mqttService, MqttMessage } from "./MqttService"

interface LocationUpdate {
  lat: number
  lon: number
  ele?: number
}

class GpsFeedService {
  private static readonly FEED_NAME = "gps-feed"

  /**
   * Publish GPS location data to gps-feed
   * @param lat - Latitude
   * @param lon - Longitude
   * @param ele - Elevation (optional, default 0)
   */
  publishLocation(lat: number, lon: number, ele: number = 0): void {
    const locationData = {
      lat,
      lon,
      ele,
    }
    
    mqttService.publishJSON(GpsFeedService.FEED_NAME, locationData)
  }

  /**
   * Subscribe to GPS location updates
   * @param callback - Function to handle incoming location data
   * @returns Cleanup function
   */
  onLocationUpdate(callback: (location: LocationUpdate) => void): () => void {
    mqttService.subscribe(GpsFeedService.FEED_NAME)

    const listener = (message: MqttMessage) => {
        if (message.topic.endsWith(`/feeds/${GpsFeedService.FEED_NAME}`)) {
            try {
                const data = JSON.parse(message.message)
                // Adafruit IO might send strings for numbers in JSON depending on source, but usually numbers.
                // Or if it is CSV format? The current MapScreen assumes JSON with lat/lon strings.
                // We'll try to support both string and number inputs.
                if (data.lat !== undefined && data.lon !== undefined) {
                    const location: LocationUpdate = {
                        lat: Number(data.lat),
                        lon: Number(data.lon),
                        ele: data.ele ? Number(data.ele) : 0
                    }
                    callback(location)
                }
            } catch (e) {
                console.warn("[GpsFeedService] Failed to parse location data", e)
            }
        }
    }

    const unsubscribe = mqttService.onMessage(listener)
    return () => unsubscribe()
  }
}

export const gpsFeedService = new GpsFeedService()
