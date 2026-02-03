import { mqttService, MqttMessage } from "./MqttService"

interface CameraImage {
  b64: string
  size?: number
  type?: string
}

class CameraUploadService {
  private static readonly FEED_NAME = "camera-upload"

  /**
   * Publish image data (base64 or string reference) to camera-upload feed
   * @param imageData - The image data to upload
   */
  uploadImage(imageData: string): void {
    mqttService.publish(CameraUploadService.FEED_NAME, imageData)
  }

  /**
   * Subscribe to camera image updates
   * @param callback - Function to handle incoming image data
   * @returns Cleanup function
   */
  onImageReceived(callback: (image: CameraImage) => void): () => void {
    mqttService.subscribe(CameraUploadService.FEED_NAME)

    const listener = (message: MqttMessage) => {
      if (message.topic.endsWith(`/feeds/${CameraUploadService.FEED_NAME}`)) {
        try {
          const data = JSON.parse(message.message)
          if (data.b64) {
            callback({
                b64: data.b64,
                size: data.size,
                type: data.type
            })
          }
        } catch (e) {
             console.warn("[CameraUploadService] Failed to parse image data", e)
        }
      }
    }

    const unsubscribe = mqttService.onMessage(listener)
    return () => unsubscribe()
  }
}

export const cameraUploadService = new CameraUploadService()
