import { Platform } from "react-native"
import {
  GOOGLE_MAPS_API_KEY_ANDROID,
  GOOGLE_MAPS_API_KEY_IOS,
  ADAFRUIT_USERNAME,
  ADAFRUIT_AIO_KEY,
  API_URL_DEV,
  API_URL_PROD,
} from "@env"

export const ENV = {
  development: {
    API_URL: API_URL_DEV ?? "http://localhost:3000/",
    GOOGLE_MAPS_API_KEY: Platform.select({
      android: GOOGLE_MAPS_API_KEY_ANDROID ?? "",
      ios: GOOGLE_MAPS_API_KEY_IOS ?? "",
      default: GOOGLE_MAPS_API_KEY_IOS ?? "",
    }),
    ADAFRUIT: {
      username: ADAFRUIT_USERNAME ?? "",
      aioKey: ADAFRUIT_AIO_KEY ?? "",
    },
    environmentBadge: {
      text: "DEV",
      visible: true,
      color: "#FF5100",
    },
  },
  production: {
    API_URL: API_URL_PROD ?? "http://localhost:3000/",
    GOOGLE_MAPS_API_KEY: Platform.select({
      android: GOOGLE_MAPS_API_KEY_ANDROID ?? "",
      ios: GOOGLE_MAPS_API_KEY_IOS ?? "",
      default: GOOGLE_MAPS_API_KEY_IOS ?? "",
    }),
    ADAFRUIT: {
      username: ADAFRUIT_USERNAME ?? "",
      aioKey: ADAFRUIT_AIO_KEY ?? "",
    },
    environmentBadge: {
      text: "PROD",
      visible: false,
      color: "#28AF37",
    },
  },
}
