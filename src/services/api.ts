import { ApiResponse, ChatRequest, ChatResponse, Scheme } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async sendMessage(chatRequest: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(chatRequest),
    });
  }

  async getSchemes(query?: string, category?: string): Promise<ApiResponse<Scheme[]>> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    const endpoint = `/schemes${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Scheme[]>(endpoint);
  }

  async getSchemeById(id: string): Promise<ApiResponse<Scheme>> {
    return this.request<Scheme>(`/schemes/${id}`);
  }
}

export const apiService = new ApiService();
