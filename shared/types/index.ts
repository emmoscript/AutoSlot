export interface ParkingSpace {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_available: boolean;
  base_price: number;
  current_price: number;
  zone_type: 'premium' | 'standard' | 'economy';
  max_hours: number;
  features?: string[]; // ['covered', 'security', 'accessible']
  rating?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
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

export interface DynamicPricingConfig {
  base_price: number;
  occupancy_factor: number;
  time_factor: number;
  event_factor: number;
}

export interface ParkingLot {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  // Añade aquí más campos si son necesarios
}

export interface LPRRecord {
  id: number;
  lot_id: number;
  license_plate: string;
  vehicle_type: 'car' | 'truck' | 'motorcycle' | 'bus';
  entry_time: string;
  exit_time?: string;
  camera_location: 'entrance' | 'exit';
  confidence_score: number;
  image_url?: string;
  status: 'entered' | 'exited' | 'active';
  payment_status: 'paid' | 'pending' | 'unpaid';
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
  parking_lot?: ParkingLot;
}

export interface LPRAnalytics {
  // ... existing code ...
} 