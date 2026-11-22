import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { AppStore } from '@/stores/AppStore';
import { logger } from '@/common/logger';
import Utils from '@/utils/utils';

export interface ApiResponse<T = unknown> {
  code: number;
  status: string;
  data: T;
  doing?: boolean;
}

export class ApiError extends Error {
  code: number;
  status: string;

  constructor(code: number, status: string) {
    super(status);
    this.code = code;
    this.status = status;
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private instance: AxiosInstance;
  private store: AppStore;
  private baseURL: string;

  constructor(store: AppStore) {
    this.store = store;
    this.baseURL = store.srvPrefix;
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: unknown) => {
        const axiosErr = error as AxiosError;
        if (axiosErr.response) {
          const status = axiosErr.response.status;
          const message = (axiosErr.response.data as { message?: string })?.message || 'Request failed';
          logger.error(`API Error [${status}]: ${message}`);
        } else if (axiosErr.request) {
          logger.error('Network Error: No response received');
        } else {
          logger.error('Request Error:', (error as Error).message);
        }
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: unknown, showMessage: boolean = true): never {
    let apiError: ApiError;

    if (error instanceof ApiError) {
      apiError = error;
    } else {
      const axiosErr = error as AxiosError;
      if (axiosErr.response) {
        const respData = axiosErr.response.data as { code?: number; status?: string };
        apiError = new ApiError(
          respData?.code || -1,
          respData?.status || 'Request failed'
        );
      } else {
        apiError = new ApiError(-1, 'Network error');
      }
    }

    if (showMessage) {
      Utils.message_notify({
        content: apiError.status,
        type: 'error'
      });
    }

    throw apiError;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.instance.request({
        method,
        url,
        data,
        ...config,
      });

      const result = response.data;

      if (result.code !== 0) {
        throw new ApiError(result.code, result.status);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async requestRaw<T>(
    method: string,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.request({
      method,
      url,
      data,
      ...config,
    });

    return response.data;
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }
}

let apiClient: ApiClient | null = null;

export function initApiClient(store: AppStore): void {
  if (!apiClient) {
    apiClient = new ApiClient(store);
  }
}

export function getApiClient(): ApiClient {
  if (!apiClient) {
    throw new Error('API client not initialized. Call initApiClient first.');
  }
  return apiClient;
}
