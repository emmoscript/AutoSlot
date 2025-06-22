// UnifiedSimulationContext.tsx
// -------------------------------------------------------------
// Contexto unificado para la simulación realista de parqueos.
// Sincroniza el flujo completo: LPR (cámara), sensores y pagos.
//
// FLUJO DE ENTRADA:
// 1. LPR detecta el vehículo (simula cámara y placa)
// 2. Sensor marca el espacio como ocupado
// 3. Se crea una sesión activa para el vehículo
//
// FLUJO DE SALIDA:
// 1. Sensor detecta salida (libera espacio)
// 2. Se genera el pago/factura
// 3. Se actualiza el registro LPR como pagado y salido
// -------------------------------------------------------------

import React, { createContext, useState, useContext, useEffect, useCallback, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import type { LPRRecord, Reservation, ParkingLotWithSpaces } from '../types';

const generateDominicanPlate = (): string => {
  const prefixes = [
    'A', 'B', 'C', 'D', 'F', 'G', 'L', 'H', 'I', 'T', 'P', 'U', 'J', 'R', 'S', 'M',
    'OE', 'OF', 'OM', 'OP', 'EA', 'EG', 'EL', 'EM', 'ED', 'EI', 'VC', 'WD', 'OI',
    'EX', 'YX', 'Z', 'NZ', 'DD', 'X', 'K'
  ];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const numDigits = Math.max(1, 7 - prefix.length);
  const numbers = Array.from({ length: numDigits }, () => Math.floor(Math.random() * 10)).join('');
  return `${prefix}${numbers}`;
};

const generateRandomVehicleType = (): 'car' | 'truck' | 'motorcycle' | 'bus' => {
  const vehicles = [
    { type: 'car' as const, probability: 0.85 },
    { type: 'truck' as const, probability: 0.10 },
    { type: 'motorcycle' as const, probability: 0.04 },
    { type: 'bus' as const, probability: 0.01 }
  ];
  const random = Math.random();
  let cumulative = 0;
  for (const vehicle of vehicles) {
    cumulative += vehicle.probability;
    if (random <= cumulative) {
      return vehicle.type;
    }
  }
  return 'car';
};

interface VehicleSession {
  lprRecord: LPRRecord;
  spaceId: number;
  lotId: number;
  entryTime: Date;
  isActive: boolean;
}

interface UnifiedSimulationContextType {
  // LPR Data
  lprHistory: LPRRecord[];
  activeVehicles: LPRRecord[];
  
  // Payment Data
  transactions: Reservation[];
  
  // Sensor Data
  lots: ParkingLotWithSpaces[];
  loading: boolean;
  
  // Simulation Control
  isSimulating: boolean;
  isAutoMode: boolean;
  
  // Actions
  toggleSimulation: () => void;
  simulateManualEntry: (spaceId: number) => void;
  simulateManualExit: (spaceId: number) => void;
  startAutoMode: (intervalSeconds: number, eventsPerInterval: number, lotId: number | null) => void;
  stopAutoMode: () => void;
  resetAllSpaces: () => Promise<void>;
  refreshLots: () => Promise<void>;
}

const UnifiedSimulationContext = createContext<UnifiedSimulationContextType | undefined>(undefined);

/**
 * Proveedor de simulación unificada.
 * Sincroniza LPR, sensores y pagos para un flujo realista.
 */
export const UnifiedSimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [isSimulating, setIsSimulating] = useState(true);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [lprHistory, setLprHistory] = useState<LPRRecord[]>([]);
  const [activeVehicles, setActiveVehicles] = useState<LPRRecord[]>([]);
  const [transactions, setTransactions] = useState<Reservation[]>([]);
  const [lots, setLots] = useState<ParkingLotWithSpaces[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoInterval, setAutoInterval] = useState<number | null>(null);
  const [vehicleSessions, setVehicleSessions] = useState<VehicleSession[]>([]);

  // Fetch lots on mount
  const refreshLots = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/lots');
      if (response.ok) {
        const data = await response.json();
        setLots(data);
      }
    } catch (error) {
      console.error('Error fetching lots:', error);
      toast.error('Failed to load parking lots.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLots();
  }, [refreshLots]);

  // Simula un evento de sensor (ocupar/liberar espacio)
  // Actualiza el estado de los lotes y muestra notificación
  const simulateSensorEvent = useCallback(async (spaceId: number, eventType: 'vehicle_entered' | 'vehicle_exited') => {
    try {
      const response = await fetch('http://localhost:4000/api/sensors/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ space_id: spaceId, event_type: eventType })
      });

      if (response.ok) {
        const result = await response.json();
        // Update lots state
        setLots(prevLots => {
          return prevLots.map(lot => {
            if (lot.id === result.space.lot_id) {
              return {
                ...lot,
                spaces: lot.spaces.map(space => 
                  space.id === spaceId
                    ? { ...space, is_available: result.space.is_available }
                    : space
                )
              };
            }
            return lot;
          });
        });

        toast.success(
          `[${result.space.lot_name}] ${eventType === 'vehicle_entered' ? '🚗 Entered' : '✅ Exited'}: ${result.space.name}`
        );
      }
    } catch (error) {
      console.error('Error simulating sensor event:', error);
      toast.error('Failed to simulate sensor event');
    }
  }, []);

  // Simula la detección LPR (cámara captura placa y tipo)
  // Agrega el registro a la historia y vehículos activos
  const simulateLPRDetection = useCallback((vehicleType: 'car' | 'truck' | 'motorcycle' | 'bus', cameraLocation: string) => {
    const now = new Date();
    const plate = generateDominicanPlate();

    const newLPRRecord: LPRRecord = {
      id: Date.now(),
      lot_id: 1,
      license_plate: plate,
      vehicle_type: vehicleType,
      entry_time: now.toISOString(),
      camera_location: cameraLocation,
      confidence_score: 0.9 + Math.random() * 0.1,
      status: 'entered',
      payment_status: 'pending',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    setLprHistory(prev => [newLPRRecord, ...prev]);
    setActiveVehicles(prev => [newLPRRecord, ...prev]);

    toast.success(`📷 LPR detected: ${plate} (${vehicleType}) at ${cameraLocation}`);
    
    return newLPRRecord;
  }, []);

  /**
   * Simula el flujo completo de entrada:
   * 1. LPR detecta vehículo
   * 2. Sensor ocupa espacio
   * 3. Se crea sesión activa
   */
  const simulateVehicleEntry = useCallback(async (spaceId: number) => {
    try {
      // 1. LPR detects vehicle
      const vehicleType = generateRandomVehicleType();
      const lprRecord = simulateLPRDetection(vehicleType, 'entrance');
      
      // 2. Sensor confirms space occupation
      await simulateSensorEvent(spaceId, 'vehicle_entered');
      
      // 3. Create vehicle session
      const space = lots.flatMap(l => l.spaces).find(s => s.id === spaceId);
      if (space) {
        const session: VehicleSession = {
          lprRecord,
          spaceId,
          lotId: space.lot_id,
          entryTime: new Date(),
          isActive: true
        };
        setVehicleSessions(prev => [...prev, session]);
      }

      toast.success(`🚗 Vehicle entered successfully: ${lprRecord.license_plate}`);
    } catch (error) {
      console.error('Error in vehicle entry simulation:', error);
      toast.error('Failed to simulate vehicle entry');
    }
  }, [lots, simulateLPRDetection, simulateSensorEvent]);

  /**
   * Simula el flujo completo de salida:
   * 1. Sensor libera espacio
   * 2. Se genera pago
   * 3. Se actualiza LPR
   */
  const simulateVehicleExit = useCallback(async (spaceId: number) => {
    try {
      // Find the session for this space
      const session = vehicleSessions.find(s => s.spaceId === spaceId && s.isActive);
      if (!session) {
        toast.error('No active session found for this space');
        return;
      }

      const now = new Date();
      const duration_minutes = Math.round((now.getTime() - session.entryTime.getTime()) / (1000 * 60));
      const duration_hours = duration_minutes / 60;
      const base_price_per_hour = 50;
      const total_amount = Math.max(25, Math.ceil(duration_hours * base_price_per_hour));

      // 1. Generate payment transaction
      const newTransaction: Reservation = {
        id: session.lprRecord.id,
        parking_space_id: spaceId,
        user_phone: 'SIMULATED',
        start_time: session.lprRecord.entry_time,
        end_time: now.toISOString(),
        actual_duration: duration_minutes,
        total_cost: total_amount,
        status: 'completed',
        license_plate: session.lprRecord.license_plate,
        created_at: session.lprRecord.created_at,
      };

      // 2. Update LPR record
      const updatedLPRRecord: LPRRecord = {
        ...session.lprRecord,
        exit_time: now.toISOString(),
        status: 'exited',
        payment_status: 'paid',
        duration_minutes: duration_minutes,
      };

      // 3. Sensor confirms space liberation
      await simulateSensorEvent(spaceId, 'vehicle_exited');

      // 4. Update all states
      setTransactions(prev => [newTransaction, ...prev]);
      setLprHistory(prev => [updatedLPRRecord, ...prev.filter(r => r.id !== session.lprRecord.id)]);
      setActiveVehicles(prev => prev.filter(v => v.id !== session.lprRecord.id));
      setVehicleSessions(prev => prev.map(s => 
        s.spaceId === spaceId && s.isActive 
          ? { ...s, isActive: false }
          : s
      ));

      toast.success(`💰 Payment generated: ${session.lprRecord.license_plate} - $${total_amount}`);
    } catch (error) {
      console.error('Error in vehicle exit simulation:', error);
      toast.error('Failed to simulate vehicle exit');
    }
  }, [vehicleSessions, simulateSensorEvent]);

  // Manual simulation functions
  const simulateManualEntry = useCallback((spaceId: number) => {
    simulateVehicleEntry(spaceId);
  }, [simulateVehicleEntry]);

  const simulateManualExit = useCallback((spaceId: number) => {
    simulateVehicleExit(spaceId);
  }, [simulateVehicleExit]);

  // Auto mode functions
  const startAutoMode = useCallback((intervalSeconds: number, eventsPerInterval: number, lotId: number | null) => {
    if (autoInterval) return;

    toast.success(`Auto mode started.`);

    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:4000/api/sensors/simulate-random', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            count: eventsPerInterval,
            lotId: lotId 
          })
        });

        if (response.ok) {
          const result = await response.json();
          result.events.forEach((event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (event.event_type === 'vehicle_entered') {
              // Simulate LPR detection first, then sensor
              const vehicleType = generateRandomVehicleType();
              simulateLPRDetection(vehicleType, 'entrance');
              
              // Update lots state
              setLots(prevLots => {
                return prevLots.map(lot => {
                  if (lot.id === event.lot_id) {
                    return {
                      ...lot,
                      spaces: lot.spaces.map(space => 
                        space.id === event.space_id
                          ? { ...space, is_available: event.new_availability }
                          : space
                      )
                    };
                  }
                  return lot;
                });
              });
            } else if (event.event_type === 'vehicle_exited') {
              // Find session and generate payment
              const session = vehicleSessions.find(s => s.spaceId === event.space_id && s.isActive);
              if (session) {
                simulateVehicleExit(event.space_id);
              }
              
              // Update lots state
              setLots(prevLots => {
                return prevLots.map(lot => {
                  if (lot.id === event.lot_id) {
                    return {
                      ...lot,
                      spaces: lot.spaces.map(space => 
                        space.id === event.space_id
                          ? { ...space, is_available: event.new_availability }
                          : space
                      )
                    };
                  }
                  return lot;
                });
              });
            }
          });
        }
      } catch (error) {
        console.error('Error in auto mode:', error);
      }
    }, intervalSeconds * 1000);

    setAutoInterval(interval);
    setIsAutoMode(true);
  }, [autoInterval, simulateLPRDetection, simulateVehicleExit, vehicleSessions]);

  const stopAutoMode = useCallback(() => {
    if (autoInterval) {
      clearInterval(autoInterval);
      setAutoInterval(null);
      setIsAutoMode(false);
      toast.error('Auto mode stopped');
    }
  }, [autoInterval]);

  const resetAllSpaces = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/spaces/reset', {
        method: 'POST',
      });
      if (response.ok) {
        await refreshLots();
        setVehicleSessions([]);
        setActiveVehicles([]);
        toast.success('All parking spaces have been reset');
      }
    } catch (error) {
      toast.error('Failed to reset spaces');
    }
  }, [refreshLots]);

  const toggleSimulation = () => setIsSimulating(prev => !prev);

  const value: UnifiedSimulationContextType = {
    lprHistory,
    activeVehicles,
    transactions,
    lots,
    loading,
    isSimulating,
    isAutoMode,
    toggleSimulation,
    simulateManualEntry,
    simulateManualExit,
    startAutoMode,
    stopAutoMode,
    resetAllSpaces,
    refreshLots,
  };

  return (
    <UnifiedSimulationContext.Provider value={value}>
      {children}
    </UnifiedSimulationContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de simulación unificada.
 * Lanza error si se usa fuera del provider.
 */
export const useUnifiedSimulationContext = () => {
  const context = useContext(UnifiedSimulationContext);
  if (context === undefined) {
    throw new Error('useUnifiedSimulationContext must be used within a UnifiedSimulationProvider');
  }
  return context;
}; 