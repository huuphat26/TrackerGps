import mqtt, { MqttClient, IClientOptions } from "mqtt"

// Adafruit IO MQTT Configuration
const ADAFRUIT_IO_CONFIG = {
  host: "io.adafruit.com",
  port: 443, // WebSocket SSL port
  protocol: "wss" as const, // WebSocket Secure for React Native
}

export interface AdafruitCredentials {
  username: string
  aioKey: string
}

export interface MqttMessage {
  topic: string
  message: string
  timestamp: Date
}

type MessageCallback = (message: MqttMessage) => void
type ConnectionCallback = () => void
type ErrorCallback = (error: Error) => void

class MqttService {
  private client: MqttClient | null = null
  private credentials: AdafruitCredentials | null = null
  private messageCallbacks: MessageCallback[] = []
  private connectionCallbacks: ConnectionCallback[] = []
  private disconnectionCallbacks: ConnectionCallback[] = []
  private errorCallbacks: ErrorCallback[] = []
  private subscribedTopics: Set<string> = new Set()
  private isConnected: boolean = false
  private reconnectTimeout: number = 5000 // Timeout for reconnect attempts

  /**
   * Initialize MQTT connection to Adafruit IO
   * @param credentials - Adafruit IO username and AIO key
   */
  connect(credentials: AdafruitCredentials): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client && this.isConnected) {
        console.log("[MQTT] Already connected")
        resolve()
        return
      }

      this.credentials = credentials

      const options: IClientOptions = {
        host: ADAFRUIT_IO_CONFIG.host,
        port: ADAFRUIT_IO_CONFIG.port,
        protocol: ADAFRUIT_IO_CONFIG.protocol,
        username: credentials.username,
        password: credentials.aioKey,
        clientId: `rn_gps_${Date.now()}`,
        keepalive: 60,
        reconnectPeriod: this.reconnectTimeout,
        connectTimeout: 30000,
        clean: true,
      }

      const url = `${ADAFRUIT_IO_CONFIG.protocol}://${ADAFRUIT_IO_CONFIG.host}:${ADAFRUIT_IO_CONFIG.port}/mqtt`

      console.log("[MQTT] Connecting to Adafruit IO...")
      this.client = mqtt.connect(url, options)

      this.client.on("connect", () => {
        console.log("[MQTT] Connected to Adafruit IO")
        this.isConnected = true
        this.connectionCallbacks.forEach((cb) => cb())

        // Re-subscribe to previously subscribed topics
        this.subscribedTopics.forEach((topic) => {
          this.client?.subscribe(topic)
        })

        resolve()
      })

      this.client.on("message", (topic: string, payload: Buffer) => {
        const messageStr = payload.toString()
        const message: MqttMessage = {
          topic,
          message: messageStr,
          timestamp: new Date(),
        }
        // Try to parse as JSON if possible
        try {
          const jsonData = JSON.parse(messageStr)
          console.log("[MQTT] Payload (JSON):", JSON.stringify(jsonData, null, 2))
        } catch {
          console.log("[MQTT] Payload is not JSON, raw value:", messageStr)
        }
        console.log("═══════════════════════════════════════════")

        this.messageCallbacks.forEach((cb) => cb(message))
      })

      this.client.on("error", (error: Error) => {
        console.error("[MQTT] Error:", error.message)
        this.errorCallbacks.forEach((cb) => cb(error))
        reject(error)
      })

      this.client.on("close", () => {
        console.log("[MQTT] Connection closed")
        this.isConnected = false
        this.disconnectionCallbacks.forEach((cb) => cb())
      })

      this.client.on("reconnect", () => {
        console.log("[MQTT] Reconnecting...")
      })

      this.client.on("offline", () => {
        console.log("[MQTT] Client offline")
        this.isConnected = false
      })
    })
  }

  /**
   * Reconnect if the connection is lost
   */
  async reconnect(): Promise<void> {
    try {
      if (this.client) {
        console.log("[MQTT] Attempting to reconnect...")
        await this.connect(this.credentials!) // Make sure credentials are available
      }
    } catch (error) {
      console.error("[MQTT] Reconnect failed", error)
      setTimeout(() => this.reconnect(), this.reconnectTimeout) // Retry after timeout
    }
  }

  /**
   * Disconnect from MQTT broker
   */
  disconnect(): void {
    if (this.client) {
      console.log("[MQTT] Disconnecting...")
      this.client.end(true)
      this.client = null
      this.isConnected = false
      this.subscribedTopics.clear()
    }
  }

  /**
   * Subscribe to an Adafruit IO feed
   * @param feedName - Name of the feed (e.g., "gps-location")
   */
  subscribe(feedName: string): void {
    if (!this.client || !this.credentials) {
      console.error("[MQTT] Not connected. Call connect() first.")
      return
    }

    const topic = `${this.credentials.username}/feeds/${feedName}`
    console.log(`[MQTT] Subscribing to: ${topic}`)

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`[MQTT] Subscribe error: ${err.message}`)
      } else {
        console.log(`[MQTT] Subscribed to: ${topic}`)
        this.subscribedTopics.add(topic)
      }
    })
  }

  /**
   * Unsubscribe from a feed
   * @param feedName - Name of the feed
   */
  unsubscribe(feedName: string): void {
    if (!this.client || !this.credentials) {
      return
    }

    const topic = `${this.credentials.username}/feeds/${feedName}`
    this.client.unsubscribe(topic)
    this.subscribedTopics.delete(topic)
    console.log(`[MQTT] Unsubscribed from: ${topic}`)
  }

  /**
   * Publish data to an Adafruit IO feed
   * @param feedName - Name of the feed
   * @param value - Value to publish
   */
  publish(feedName: string, value: string | number): void {
    if (!this.client || !this.credentials) {
      console.error("[MQTT] Not connected. Call connect() first.")
      return
    }

    const topic = `${this.credentials.username}/feeds/${feedName}`
    const message = String(value)

    console.log(`[MQTT] Publishing to ${topic}: ${message}`)
    this.client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) {
        console.error(`[MQTT] Publish error: ${err.message}`)
      } else {
        console.log(`[MQTT] Published successfully`)
      }
    })
  }



  /**
   * Publish JSON object to an Adafruit IO feed
   * @param feedName - Name of the feed
   * @param data - JSON object to publish
   */
  publishJSON(feedName: string, data: Record<string, any>): void {
    if (!this.client || !this.credentials) {
      console.error("[MQTT] Not connected. Call connect() first.")
      return
    }

    const topic = `${this.credentials.username}/feeds/${feedName}`
    const message = JSON.stringify(data)

    console.log(`[MQTT] Publishing JSON to ${topic}:`, message)
    this.client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) {
        console.error(`[MQTT] Publish error: ${err.message}`)
      } else {
        console.log(`[MQTT] Published JSON successfully`)
      }
    })
  }

  /**
   * Register callback for incoming messages
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.push(callback)
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * Register callback for connection event
   */
  onConnect(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.push(callback)
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * Register callback for disconnection event
   */
  onDisconnect(callback: ConnectionCallback): () => void {
    this.disconnectionCallbacks.push(callback)
    return () => {
      this.disconnectionCallbacks = this.disconnectionCallbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * Register callback for errors
   */
  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.push(callback)
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * Check if connected
   */
  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

// Export singleton instance
export const mqttService = new MqttService()
