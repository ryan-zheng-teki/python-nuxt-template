// /services/api.ts

import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Define a class to encapsulate Axios instance and related methods
class ApiService {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      // Add other default configurations here
    })

    // Set up request interceptors if needed
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        // For example, attach auth tokens here
        // const token = getAuthToken()
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`
        // }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Set up response interceptors if needed
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        // Handle global errors here
        // For example, redirect to login on 401
        // if (error.response.status === 401) {
        //   redirectToLogin()
        // }
        return Promise.reject(error)
      }
    )
  }

  // Generic GET request
  public get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config)
  }

  // Generic POST request
  public post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config)
  }

  // Similarly, you can add put, delete, etc.
}

// Always use direct API URL in development for now
const API_BASE_URL = 'http://localhost:6233'

// Export a singleton instance
const apiService = new ApiService(API_BASE_URL)

export default apiService
