import { useEffect, useState, useCallback, useRef } from "react"
import { mqttService, MqttMessage, AdafruitCredentials } from "./MqttService"

interface UseMqttOptions {
  autoConnect?: boolean
  credentials?: AdafruitCredentials
  feeds?: string[]
}

interface UseMqttReturn {
  isConnected: boolean
  messages: MqttMessage[]
  lastMessage: MqttMessage | null
  error: Error | null
  connect: (credentials: AdafruitCredentials) => Promise<void>
  disconnect: () => void
  subscribe: (feedName: string) => void
  unsubscribe: (feedName: string) => void
  publish: (feedName: string, value: string | number) => void

  clearMessages: () => void
}

/**
 * React hook for using MQTT service with Adafruit IO
 */
export function useMqtt(options: UseMqttOptions = {}): UseMqttReturn {
  const { autoConnect = false, credentials, feeds = [] } = options
  
  const [isConnected, setIsConnected] = useState(mqttService.getConnectionStatus())
  const [messages, setMessages] = useState<MqttMessage[]>([])
  const [lastMessage, setLastMessage] = useState<MqttMessage | null>(null)
  const [error, setError] = useState<Error | null>(null)
  
  const isInitialized = useRef(false)

  // Setup event listeners
  useEffect(() => {
    const unsubscribeMessage = mqttService.onMessage((message) => {
      setMessages((prev) => [...prev, message])
      setLastMessage(message)
    })

    const unsubscribeConnect = mqttService.onConnect(() => {
      setIsConnected(true)
      setError(null)
    })

    const unsubscribeDisconnect = mqttService.onDisconnect(() => {
      setIsConnected(false)
    })

    const unsubscribeError = mqttService.onError((err) => {
      setError(err)
    })

    return () => {
      unsubscribeMessage()
      unsubscribeConnect()
      unsubscribeDisconnect()
      unsubscribeError()
    }
  }, [])

  // Auto connect if credentials provided
  useEffect(() => {
    if (autoConnect && credentials && !isInitialized.current) {
      isInitialized.current = true
      mqttService.connect(credentials).then(() => {
        // Subscribe to feeds after connection
        feeds.forEach((feed) => {
          mqttService.subscribe(feed)
        })
      }).catch((err) => {
        setError(err)
      })
    }
  }, [autoConnect, credentials, feeds])

  const connect = useCallback(async (creds: AdafruitCredentials) => {
    try {
      setError(null)
      await mqttService.connect(creds)
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const disconnect = useCallback(() => {
    mqttService.disconnect()
  }, [])

  const subscribe = useCallback((feedName: string) => {
    mqttService.subscribe(feedName)
  }, [])

  const unsubscribe = useCallback((feedName: string) => {
    mqttService.unsubscribe(feedName)
  }, [])

  const publish = useCallback((feedName: string, value: string | number) => {
    mqttService.publish(feedName, value)
  }, [])



  const clearMessages = useCallback(() => {
    setMessages([])
    setLastMessage(null)
  }, [])

  return {
    isConnected,
    messages,
    lastMessage,
    error,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    clearMessages,
  }
}
