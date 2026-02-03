import { mqttService, MqttMessage } from "./MqttService"

class CameraCommandService {
  private static readonly FEED_NAME = "camera-command"

  /**
   * Send a command to the camera-command feed
   * @param command - The command string to send
   */
  sendCommand(command: string): void {
    mqttService.publish(CameraCommandService.FEED_NAME, command)
  }

  /**
   * Subscribe to camera commands
   * @param callback - Function to handle incoming commands
   * @returns Cleanup function to unsubscribe listener
   */
  onCommandReceived(callback: (command: string) => void): () => void {
    // Ensure we are subscribed to the topic on MQTT level
    mqttService.subscribe(CameraCommandService.FEED_NAME)

    // Register a global message listener and filter for this feed
    // Note: This relies on checking the topic in the message
    // structure relative to the username. 
    // Since topic includes username (username/feeds/feedName), checking suffix is safer.
    
    const listener = (message: MqttMessage) => {
        if (message.topic.endsWith(`/feeds/${CameraCommandService.FEED_NAME}`)) {
            callback(message.message)
        }
    }

    const unsubscribe = mqttService.onMessage(listener)
    
    return () => {
        unsubscribe()
        // We generally don't unsubscribe from the MQTT topic itself 
        // because other listeners might need it, or we might re-subscribe soon.
        // If strict cleanup is needed, we'd need reference counting in MqttService.
        // For now, valid to just stop listening.
    }
  }
}

export const cameraCommandService = new CameraCommandService()
