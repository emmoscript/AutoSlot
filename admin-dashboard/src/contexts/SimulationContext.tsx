import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { LPRRecord, Reservation } from '../../../shared/types';

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

interface SimulationContextType {
  lprHistory: LPRRecord[];
  transactions: Reservation[];
  activeVehicles: LPRRecord[];
  isSimulating: boolean;
  toggleSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSimulating, setIsSimulating] = useState(true);
  const [activeVehicles, setActiveVehicles] = useState<LPRRecord[]>([]);
  const [lprHistory, setLprHistory] = useState<LPRRecord[]>([]);
  const [transactions, setTransactions] = useState<Reservation[]>([]);

  const toggleSimulation = () => setIsSimulating(prev => !prev);

  useEffect(() => {
    if (!isSimulating) return;

    const simulationTick = () => {
      const shouldExit = activeVehicles.length > 5 && Math.random() < 0.4;

      if (shouldExit) {
        const vehicleIndex = Math.floor(Math.random() * activeVehicles.length);
        const exitingVehicle = activeVehicles[vehicleIndex];
        const now = new Date();

        const entryTime = new Date(exitingVehicle.entry_time);
        const duration_minutes = Math.round((now.getTime() - entryTime.getTime()) / (1000 * 60));
        const duration_hours = duration_minutes / 60;
        const base_price_per_hour = 50;
        const total_amount = Math.max(25, Math.ceil(duration_hours * base_price_per_hour));

        const newTransaction: Reservation = {
          id: exitingVehicle.id,
          parking_space_id: exitingVehicle.id,
          user_phone: 'SIMULATED',
          start_time: exitingVehicle.entry_time,
          end_time: now.toISOString(),
          estimated_duration: 0,
          actual_duration: duration_minutes,
          total_cost: total_amount,
          status: 'completed',
          license_plate: exitingVehicle.license_plate,
          created_at: exitingVehicle.created_at,
        };

        const updatedRecord: LPRRecord = {
          ...exitingVehicle,
          exit_time: now.toISOString(),
          status: 'exited',
          payment_status: 'paid',
          duration_minutes: duration_minutes,
        };

        setTransactions(prev => [newTransaction, ...prev]);
        setLprHistory(prev => [updatedRecord, ...prev.filter(r => r.id !== exitingVehicle.id)]);
        setActiveVehicles(prev => prev.filter(v => v.id !== exitingVehicle.id));
      } else {
        const now = new Date();
        const plate = generateDominicanPlate();

        const newEntry: LPRRecord = {
          id: Date.now(),
          lot_id: 1,
          license_plate: plate,
          vehicle_type: generateRandomVehicleType(),
          entry_time: now.toISOString(),
          camera_location: 'entrance',
          confidence_score: 0.9 + Math.random() * 0.1,
          status: 'entered',
          payment_status: 'pending',
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
        };

        setLprHistory(prev => [newEntry, ...prev]);
        setActiveVehicles(prev => [newEntry, ...prev]);
      }
    };

    const interval = setInterval(simulationTick, 7000);
    return () => clearInterval(interval);
  }, [isSimulating, activeVehicles]);

  const value = {
    lprHistory,
    transactions,
    activeVehicles,
    isSimulating,
    toggleSimulation,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulationContext = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
}; 