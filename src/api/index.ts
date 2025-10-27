import axios, { AxiosError } from "axios";
let accessToken: string | null = null;

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
export const setToken = (token: string | null) => {
  accessToken = token;
};

const handleTokenRefresh = async () => {
  try {
    const res = await instance.get("/auth/refresh-token");
    if (res && res?.data) {
      accessToken = res.data.data.token;
      return accessToken;
    }
  } catch (error) {
    return error;
  }
};

instance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any & {
      _retry?: boolean;
    };
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
      const newToken = await handleTokenRefresh();

      if (newToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return instance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
