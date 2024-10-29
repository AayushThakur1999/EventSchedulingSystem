import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (error: AxiosError) => void;
}

// Get the base URL based on environment
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    // In development, use the proxy path that matches vite.config.ts
    return "";
  }
  // In production, you might want to use the full URL
  return "/api/v1"; // Adjust this based on your production API URL
};

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // needed for cookies
});

// Refresh token state management
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: AxiosError | null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

// Add request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token check for refresh token requests
    if (config.url?.includes("refresh-token")) {
      return config;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Helper function to determine if we should retry the request
const shouldRetryRequest = (error: AxiosError, retryCount: number): boolean => {
  const MAX_RETRIES = 3;

  // Don't retry if:
  // 1. We've reached max retries
  // 2. It's a 401 error (unauthorized)
  // 3. There's no response (network error)
  if (
    retryCount >= MAX_RETRIES ||
    error.response?.status === 401 ||
    error.response?.status === 404 ||
    !error.response
  ) {
    return false;
  }

  return true;
};

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      retryCount?: number;
    };

    // Initialize retryCount if it doesn't exist
    if (originalRequest.retryCount === undefined) {
      originalRequest.retryCount = 0;
    }

    // Handle 401 errors and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axios.post(
            "/users/refresh-token",
            {},
            {
              withCredentials: true,
            }
          );
          console.log("interceptor response:", response);

          isRefreshing = false;
          processQueue(null);

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError);
          isRefreshing = false;

          // Redirect to login if refresh fails
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return api(originalRequest);
      });
    }

    // Check if we should retry the request using the helper function
    if (shouldRetryRequest(error, originalRequest.retryCount)) {
      originalRequest.retryCount += 1;
      const retryDelay = 1000 * Math.pow(2, originalRequest.retryCount); // Exponential backoff

      console.error(
        `Error executing request, retrying (attempt ${originalRequest.retryCount}): `,
        error
      );

      // Wait for the delay
      await new Promise((resolve) => setTimeout(resolve, retryDelay));

      // Retry the request
      return api(originalRequest);
    }

    // If we shouldn't retry or have exhausted all retries, reject with the error
    return Promise.reject(error);
  }
);

export default api;

// This version would work if httpOnly flag was false
/* import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";

export interface JWTTokensPayload {
  _id: string;
  email?: string;
  username?: string;
  fullname?: string;
  exp: number;
}

interface QueueItem {
  resolve: (value?: string | null) => void; // Resolve to the token or null
  reject: (error: AxiosError) => void;
}

// Get the base URL based on environment
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    // In development, use the proxy path that matches vite.config.ts
    return "";
  }
  // In production, you might want to use the full URL
  return "/api/v1"; // Adjust this based on your production API URL
};

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // needed for cookies
});

// Function to get cookies
const getCookies = (): { [key: string]: string } => {
  return document.cookie
    .split(";")
    .reduce((acc: { [key: string]: string }, curr) => {
      const [key, value] = curr.trim().split("=");
      acc[key] = value;
      return acc;
    }, {});
};

// Function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JWTTokensPayload>(token);
    // Check if token is expired - adding a 30 second buffer
    return decoded.exp * 1000 <= Date.now() + 30000;
  } catch (error) {
    console.error("Error while decoding token:", error);
    return true;
  }
};

// Refresh token state management
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const cookies = getCookies();
    const accessToken = cookies.accessToken;

    // Skip token check for refresh token requests
    if (config.url?.includes("refresh-token")) {
      return config;
    }

    if (accessToken && isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Call your refresh token endpoint
          const response = await axios.post<{ accessToken: string }>(
            "/users/refresh-token",
            {},
            {
              withCredentials: true,
            }
          );

          isRefreshing = false;
          processQueue(null, response.data.accessToken);
        } catch (error) {
          processQueue(error as AxiosError, null);
          isRefreshing = false;

          // Redirect to login if refresh fails
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }

      // Add request to queue if we're already refreshing
      const retryOriginalRequest = new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });

      return retryOriginalRequest.then(() => {
        return config;
      });
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axios.post<{ accessToken: string }>(
            "/users/refresh-token",
            {},
            {
              withCredentials: true,
            }
          );
          console.log("interceptor response:", response);

          isRefreshing = false;
          processQueue(null, response.data.accessToken);

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          isRefreshing = false;

          // Redirect to login if refresh fails
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return api(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);

export default api; */
