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
  current_price?: number;
}

// Este tipo combinado será muy útil para la página de detalles
export type ParkingLotWithSpaces = ParkingLot & {
  spaces: ParkingSpace[];
};

export interface Reservation {
  id: number;
  parking_space_id: number;
  user_phone: string;
  start_time: string;
  end_time?: string;
  status: 'active' | 'completed' | 'cancelled';
  license_plate?: string;
  created_at: string;
  parking_space?: ParkingSpace;
  parking_lot?: ParkingLot;
}

// Nuevos tipos para el sistema de pagos
export interface PaymentTerminal {
  id: number;
  lot_id: number;
  name: string;
  location: string;
  terminal_type: 'card' | 'cash' | 'mobile' | 'qr';
  status: 'active' | 'inactive' | 'maintenance';
  last_transaction?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string; // ID único del ticket
  reservation_id: number;
  parking_space_id: number;
  lot_id: number;
  amount: number;
  currency: string;
  payment_method: 'card' | 'cash' | 'mobile' | 'qr';
  terminal_id: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_time: string;
  license_plate?: string;
  duration_hours: number;
  base_price: number;
  dynamic_price: number;
  discount?: number;
  tax?: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  parking_space?: ParkingSpace;
  parking_lot?: ParkingLot;
  terminal?: PaymentTerminal;
}

export interface PaymentAnalytics {
  total_revenue: number;
  total_transactions: number;
  average_transaction: number;
  revenue_by_method: Record<string, number>;
  revenue_by_lot: Record<string, number>;
  revenue_by_hour: Record<string, number>;
  revenue_by_day: Record<string, number>;
  top_performing_terminals: PaymentTerminal[];
  recent_transactions: PaymentTransaction[];
}

// Nuevos tipos para el sistema LPR
export interface LPRRecord {
  id: number;
  lot_id: number;
  license_plate: string;
  vehicle_type: 'car' | 'truck' | 'motorcycle' | 'bus';
  entry_time: string;
  exit_time?: string;
  duration_minutes?: number;
  camera_location: 'entrance' | 'exit' | 'level_1' | 'level_2';
  confidence_score: number;
  image_url?: string;
  status: 'entered' | 'exited' | 'active';
  payment_status: 'unpaid' | 'paid' | 'pending';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
  parking_lot?: ParkingLot;
}

export interface LPRAnalytics {
  total_vehicles: number;
  active_vehicles: number;
  average_duration: number;
  vehicles_by_type: Record<string, number>;
  vehicles_by_hour: Record<string, number>;
  top_plates: Array<{ plate: string; visits: number }>;
  recent_activity: LPRRecord[];
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

export interface SensorEvent {
  id: number;
  parking_space_id: number;
  event_type: 'vehicle_entered' | 'vehicle_exited' | 'sensor_error';
  timestamp: string;
  confidence: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface DashboardStats {
  total_spaces: number;
  occupied_spaces: number;
  available_spaces: number;
  daily_revenue: number;
  active_reservations: number;
  total_reservations: number;
  total_vehicles: number;
  active_vehicles: number;
}

export interface CreateReservationRequest {
  parking_space_id: number;
  user_phone: string;
  estimated_duration: number;
  license_plate?: string;
}

export interface UpdateAvailabilityRequest {
  is_available: boolean;
} 