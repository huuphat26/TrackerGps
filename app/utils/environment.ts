import { api } from "@/services/api"
import { saveString } from "./storage"
import Config, { APP_ENV_KEY, reloadConfig } from "@/config"

/**
 * Switch the app to the development environment.
 */
export function switchToDev() {
  saveString(APP_ENV_KEY, "development")
  reloadConfig()

  // Update API Base URLs
  api.setBaseUrl(Config.API_URL)

  console.log("Switched to DEV environment. Base URL:", Config.API_URL)
}

/**
 * Switch the app to the production environment.
 */
export function switchToProd() {
  saveString(APP_ENV_KEY, "production")
  reloadConfig()

  // Update API Base URLs
  api.setBaseUrl(Config.API_URL)

  console.log("Switched to PROD environment. Base URL:", Config.API_URL)
}

/**
 * Gets the current environment name.
 */
export function getCurrentEnvironment(): "development" | "production" {
  return Config.environmentBadge?.text === "DEV" ? "development" : "production"
}
