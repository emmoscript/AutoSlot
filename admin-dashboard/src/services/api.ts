// API configuration and services for AutoSlot Admin Dashboard

// Production URL - Replace 'your-app-name.onrender.com' with your actual Render URL
// Example: 'https://autoslot-backend-api.onrender.com'
const API_BASE_URL = 'https://your-app-name.onrender.com/api'; // ⚠️ REPLACE WITH YOUR ACTUAL RENDER URL!

// API User interface
interface ApiUser {
  id: number;
  name: string;
  email: string;
  vehicle_plate?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  phone?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Export as User for external use
export type User = ApiUser;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: ApiUser;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API client class
class ApiClient {
  private token: string | null = null;

  constructor() {
    // Retrieve token from localStorage if available
    this.token = localStorage.getItem('autoslot_admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (this.token) {
      (headers as any).Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log(`📡 API Response [${response.status}]:`, data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.token) {
      this.token = response.token;
      localStorage.setItem('autoslot_admin_token', response.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await this.request('/auth/logout', {
          method: 'POST',
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('autoslot_admin_token');
    }
  }

  async getCurrentUser(): Promise<ApiUser> {
    return this.request<ApiUser>('/auth/me');
  }

  // User management methods (for admin CRUD)
  async getUsers(): Promise<ApiUser[]> {
    const response = await this.request<{ users: ApiUser[] }>('/auth/users');
    return response.users || [];
  }

  async updateUser(userId: number, userData: Partial<ApiUser>): Promise<ApiUser> {
    return this.request<ApiUser>(`/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: number): Promise<void> {
    await this.request(`/auth/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('autoslot_admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('autoslot_admin_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Legacy API interfaces for existing components
export interface ParkingLot {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface ParkingSpace {
  id: number;
  lot_id: number;
  name: string;
  level: number;
  is_available: boolean;
  base_price: number;
  zone_type: string;
  created_at: string;
  updated_at: string;
}

export interface ParkingLotWithSpaces extends ParkingLot {
  spaces: ParkingSpace[];
}

// Legacy parking lot API for backward compatibility
export const parkingLotApi = {
  async getAll(): Promise<ParkingLot[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/lots`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching lots:', error);
      return [];
    }
  },

  async getById(id: number): Promise<ParkingLotWithSpaces | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/lots/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lot:', error);
      return null;
    }
  },

  async create(lotData: Omit<ParkingLot, 'id' | 'created_at' | 'updated_at'>): Promise<ParkingLot> {
    const response = await fetch(`${API_BASE_URL}/lots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lotData),
    });
    return response.json();
  },

  async update(id: number, lotData: Partial<ParkingLot>): Promise<ParkingLot> {
    const response = await fetch(`${API_BASE_URL}/lots/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lotData),
    });
    return response.json();
  },

  async delete(id: number): Promise<void> {
    await fetch(`${API_BASE_URL}/lots/${id}`, {
      method: 'DELETE',
    });
  }
};

// Export the API client
export { apiClient };