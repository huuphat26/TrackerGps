import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { DeviceEventEmitter } from "react-native"

import Config from "@/config"
import type { EpisodeItem } from "@/services/api/types"

import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse } from "./types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })

    // Add interceptor to handle 401 Unauthorized
    this.apisauce.addResponseTransform((response) => {
      if (response.status === 401) {
        DeviceEventEmitter.emit("LOGOUT")
      }
    })
  }

  /**
   * Set a header for all subsequent requests.
   */
  setHeader(name: string, value: string) {
    this.apisauce.setHeader(name, value)
  }

  /**
   * Set the base URL of the API.
   */
  setBaseUrl(url: string) {
    this.apisauce.setBaseURL(url)
  }

  /**
   * Generic GET request
   */
  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const response: ApiResponse<T> = await this.apisauce.get(path, params)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      throw problem || { kind: "unknown" }
    }

    return response.data as T
  }

  /**
   * Generic POST request
   */
  async post<T>(path: string, data?: any): Promise<T> {
    const response: ApiResponse<T> = await this.apisauce.post(path, data)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      throw problem || { kind: "unknown" }
    }

    return response.data as T
  }

  /**
   * Generic PUT request
   */
  async put<T>(path: string, data?: any): Promise<T> {
    const response: ApiResponse<T> = await this.apisauce.put(path, data)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      throw problem || { kind: "unknown" }
    }

    return response.data as T
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(path: string, params?: Record<string, any>): Promise<T> {
    const response: ApiResponse<T> = await this.apisauce.delete(path, params)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      throw problem || { kind: "unknown" }
    }

    return response.data as T
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   * @deprecated Use the generic get method instead
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeItem[] } | GeneralApiProblem> {
    try {
      const rawData = await this.get<ApiFeedResponse>(
        `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
      )

      const episodes: EpisodeItem[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}`, e.stack)
      }
      return e as GeneralApiProblem
    }
  }
}

// Singleton instances of the API for convenience
export const api = new Api()

export * from "./AuthServices/AuthService"
export * from "./AuthServices/AuthType"
export * from "./UserServices/UserService"
export * from "./UserServices/UserType"
