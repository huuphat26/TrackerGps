import { useCallback, useEffect, useRef, useState } from "react"
import { useMqtt } from "@/services/mqtt"
import Config from "@/config"

export type MqttConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error"

export interface UseMqttConnectionOptions {
  /**
   * Auto-connect on mount
   * @default true
   */
  autoConnect?: boolean
  /**
   * Max retry attempts on connection failure
   * @default 3
   */
  maxRetries?: number
  /**
   * Enable auto-retry on network errors
   * @default true
   */
  enableAutoRetry?: boolean
}

export interface UseMqttConnectionReturn {
  status: MqttConnectionStatus
  error: string | null
  retryCount: number
  connect: () => Promise<void>
  disconnect: () => void
  retry: () => Promise<void>
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Hook to manage MQTT connection with manual control and auto-retry logic
 *
 * @example
 * ```tsx
 * const { status, connect, disconnect, retry } = useMqttConnection({
 *   autoConnect: true,
 *   maxRetries: 3,
 * })
 * ```
 */
export function useMqttConnection(options: UseMqttConnectionOptions = {}): UseMqttConnectionReturn {
  const { autoConnect = true, maxRetries = 3, enableAutoRetry = true } = options

  const { connect: mqttConnect, disconnect: mqttDisconnect } = useMqtt()

  const [status, setStatus] = useState<MqttConnectionStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const isConnecting = useRef(false)
  const isMounted = useRef(true)

  /**
   * Connect to MQTT broker
   */
  const connect = useCallback(async () => {
    if (isConnecting.current) {
      console.log("[useMqttConnection] Already connecting, skipping...")
      return
    }

    if (!Config.ADAFRUIT.username || !Config.ADAFRUIT.aioKey) {
      const errorMsg = "Missing Adafruit credentials in Config"
      console.error("[useMqttConnection]", errorMsg)
      setStatus("error")
      setError(errorMsg)
      return
    }

    try {
      isConnecting.current = true
      setStatus("connecting")
      setError(null)

      console.log("[useMqttConnection] Connecting to MQTT broker...")

      await mqttConnect({
        username: Config.ADAFRUIT.username,
        aioKey: Config.ADAFRUIT.aioKey,
      })

      if (!isMounted.current) return

      console.log("[useMqttConnection] ✅ Connected successfully")
      setStatus("connected")
      setRetryCount(0) // Reset retry count on success
    } catch (err) {
      if (!isMounted.current) return

      const errorMsg = err instanceof Error ? err.message : "Connection failed"
      console.error("[useMqttConnection] ❌ Connection error:", errorMsg)

      setStatus("error")
      setError(errorMsg)

      // Auto-retry if enabled
      if (enableAutoRetry && retryCount < maxRetries) {
        const nextRetry = retryCount + 1
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Exponential backoff, max 10s

        console.log(
          `[useMqttConnection] 🔄 Retry attempt ${nextRetry}/${maxRetries} in ${delay}ms...`,
        )

        setRetryCount(nextRetry)
        await sleep(delay)

        if (isMounted.current) {
          await connect()
        }
      } else if (retryCount >= maxRetries) {
        console.error("[useMqttConnection] ❌ Max retries reached. Please retry manually.")
      }
    } finally {
      isConnecting.current = false
    }
  }, [mqttConnect, retryCount, maxRetries, enableAutoRetry])

  /**
   * Disconnect from MQTT broker
   */
  const disconnect = useCallback(() => {
    console.log("[useMqttConnection] Disconnecting...")
    mqttDisconnect()
    setStatus("disconnected")
    setError(null)
    setRetryCount(0)
  }, [mqttDisconnect])

  /**
   * Manual retry connection
   */
  const retry = useCallback(async () => {
    console.log("[useMqttConnection] Manual retry triggered")
    setRetryCount(0) // Reset retry count for manual retry
    await connect()
  }, [connect])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      isMounted.current = false
      disconnect()
    }
  }, []) // Empty deps - only run on mount/unmount

  return {
    status,
    error,
    retryCount,
    connect,
    disconnect,
    retry,
  }
}
