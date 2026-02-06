import { DeviceEventEmitter } from "react-native"
import { loadString } from "@/utils/storage"
import BaseConfig from "./config.base"
import { ENV } from "./env"

export const APP_ENV_KEY = "APP_ENVIRONMENT"

/**
 * Gets the initial configuration based on stored environment or fallback to __DEV__.
 */
const getInitialConfig = () => {
  const storedEnv = loadString(APP_ENV_KEY)
  if (storedEnv === "production") return ENV.production
  if (storedEnv === "development") return ENV.development

  return __DEV__ ? ENV.development : ENV.production
}

const ExtraConfig = getInitialConfig()

/**
 * The unified application configuration.
 */
const Config = { ...BaseConfig, ...ExtraConfig }

/**
 * Reloads the configuration at runtime.
 */
export const reloadConfig = () => {
  const newExtra = getInitialConfig()
  Object.assign(Config, newExtra)
  DeviceEventEmitter.emit("CONFIG_RELOADED")
}

export default Config
