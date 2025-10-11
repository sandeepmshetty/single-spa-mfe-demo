import { ApiResponse } from './types';
import { API_ENDPOINTS, HTTP_STATUS } from './constants';

/**
 * HTTP client for API calls with authentication and error handling
 */
export class ApiClient {
  private baseURL: string = API_ENDPOINTS.BASE_URL;
  private defaultTimeout = 10000;

  constructor(baseURL?: string) {
    if (baseURL) {
      this.baseURL = baseURL;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request('GET', endpoint, undefined, params);
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request('POST', endpoint, data);
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request('PUT', endpoint, data);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request('PATCH', endpoint, data);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request('DELETE', endpoint);
  }

  /**
   * Generic request method
   */
  private async request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildURL(endpoint, params);
      const config: RequestInit = {
        method,
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(this.defaultTimeout)
      };

      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      return {
        data: responseData,
        success: true,
        message: 'Request successful',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`API Request failed [${method} ${endpoint}]:`, error);
      
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Get request headers
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Add authentication header if token exists
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Get authentication token from shared auth service
   */
  private getAuthToken(): string | null {
    // In a real implementation, this would get the token from the auth service
    // For now, we'll check local storage directly
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mfe-auth-token');
    }
    return null;
  }

  /**
   * Set base URL
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  /**
   * Set request timeout
   */
  setTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
  }

  /**
   * Create a new instance with different base URL
   */
  createInstance(baseURL: string): ApiClient {
    return new ApiClient(baseURL);
  }

  /**
   * Upload file
   */
  async uploadFile<T = any>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }

      const headers: Record<string, string> = {};
      
      // Add authentication header if token exists
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        signal: AbortSignal.timeout(this.defaultTimeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      return {
        data: responseData,
        success: true,
        message: 'File uploaded successfully',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`File upload failed [${endpoint}]:`, error);
      
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();