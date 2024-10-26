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
