/**
 * These are configuration settings for the production environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
import { Platform } from "react-native"
import {
  GOOGLE_MAPS_API_KEY_ANDROID,
  GOOGLE_MAPS_API_KEY_IOS,
  ADAFRUIT_USERNAME,
  ADAFRUIT_AIO_KEY,
} from "@env"

export default {
  API_URL: "https://api.rss2json.com/v1/",
  GOOGLE_MAPS_API_KEY: Platform.select({
    android: GOOGLE_MAPS_API_KEY_ANDROID ?? "",
    ios: GOOGLE_MAPS_API_KEY_IOS ?? "",
    default: GOOGLE_MAPS_API_KEY_IOS ?? "",
  }),
  ADAFRUIT: {
    username: ADAFRUIT_USERNAME ?? "",
    aioKey: ADAFRUIT_AIO_KEY ?? "",
  },
}
