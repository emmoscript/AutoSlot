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
  zone_type: 'premium' | 'standard' | 'economy';
  features?: string[];
  created_at: string;
  updated_at: string;
  
  // Opcional: Podríamos añadir el precio actual calculado
  current_price?: number;
  zone?: string;
}

export interface ParkingLotWithSpaces extends ParkingLot {
  spaces: ParkingSpace[];
}

export interface Reservation {
  id: number;
  parking_space_id: number;
  user_phone: string;
  start_time: string;
  end_time?: string;
  estimated_duration: number;
  actual_duration?: number;
  total_cost?: number;
  status: 'active' | 'completed' | 'cancelled';
  license_plate?: string;
  created_at: string;
  parking_space?: ParkingSpace;
  parking_lot?: ParkingLot; // Útil para mostrar info en las reservas
}

export interface PricingRule {
  id: number;
  zone_type: string;
  hour_start: number;
  hour_end: number;
  multiplier: number;
  day_of_week?: number;
  is_active: boolean;
}

export interface User {
  phone: string;
  name?: string;
  email?: string;
  preferred_payment?: string;
}

export interface SensorEvent {
  id: number;
  parking_space_id: number;
  event_type: 'vehicle_entered' | 'vehicle_exited' | 'sensor_error';
  timestamp: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface CreateReservationRequest {
  parking_space_id: number;
  user_phone: string;
  estimated_duration: number;
  license_plate?: string;
}

export interface UpdateAvailabilityRequest {
  is_available: boolean;
  sensor_triggered_at?: string;
}

export interface PricingCalculationRequest {
  parking_space_id: number;
  duration: number;
  datetime?: string;
}

export interface NearbySpacesRequest {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
  available?: boolean;
  zone?: string;
} 