import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    console.log("In axios setup the API URL is: " + process.env.NEXT_PUBLIC_API_URL);
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "",
      withCredentials: false,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (typeof window !== "undefined") {
          const session = await getSession();
          if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Unauthorized request");
          // Could redirect to login here
        }
        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.axiosInstance;
  }
}

export const apiClient = new ApiClient();
