import axios from 'axios';
import type { ParkingLot, ParkingLotWithSpaces, UpdateAvailabilityRequest } from '../types';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Parking Lots API
export const parkingLotApi = {
  getAll: async (): Promise<ParkingLot[]> => {
    const response = await api.get('/lots');
    return response.data;
  },
  
  getById: async (id: number): Promise<ParkingLotWithSpaces> => {
    const response = await api.get(`/lots/${id}`);
    return response.data;
  },

  create: async (lotData: Omit<ParkingLot, 'id' | 'created_at' | 'updated_at'>): Promise<ParkingLot> => {
    const response = await api.post('/lots', lotData);
    return response.data;
  },
};

// Parking Spaces API (para acciones sobre un espacio individual)
export const parkingSpaceApi = {
  updateAvailability: async (id: number, data: UpdateAvailabilityRequest): Promise<void> => {
    await api.patch(`/spaces/${id}/availability`, data);
  },
  
  // Si necesitamos crear/editar espacios individuales en el futuro, iría aquí
  // create: async (data: Omit<ParkingSpace, 'id'>) => { ... }
  // update: async (id: number, data: Partial<ParkingSpace>) => { ... }
};

// Health check
export const healthApi = {
  check: () => api.get('/health'),
}; 