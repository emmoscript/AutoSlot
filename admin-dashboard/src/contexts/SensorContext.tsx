import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { ParkingLotWithSpaces, ParkingSpace } from '../types';

// Tipo para unificar los datos de eventos de los sensores
type SensorEventPayload = {
  space_id: number;
  lot_id: number;
  level: number;
  new_availability: boolean;
  event_type: string;
  space_name: string;
  lot_name: string;
};

interface SensorContextType {
  lots: ParkingLotWithSpaces[];
  loading: boolean;
  isAutoMode: boolean;
  autoInterval: number | null;
  lastEventLocation: { lotId: number; level: number } | null;
  refreshLots: () => Promise<void>;
  simulateSensorEvent: (spaceId: number, eventType: 'vehicle_entered' | 'vehicle_exited') => Promise<void>;
  startAutoMode: (intervalSeconds: number, eventsPerInterval: number, lotId: number | null) => void;
  stopAutoMode: () => void;
  resetAllSpaces: () => Promise<void>;
  refreshAfterCreate: () => Promise<void>;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

interface SensorProviderProps {
  children: React.ReactNode;
}

export const SensorProvider: React.FC<SensorProviderProps> = ({ children }) => {
  const [lots, setLots] = useState<ParkingLotWithSpaces[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoInterval, setAutoInterval] = useState<number | null>(null);
  const [lastEventLocation, setLastEventLocation] = useState<{ lotId: number; level: number } | null>(null);

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

  const handleSensorEvent = useCallback((event: SensorEventPayload) => {
    setLots(prevLots => {
      const newLots = prevLots.map(lot => {
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
      
      setLastEventLocation({ lotId: event.lot_id, level: event.level });
      return newLots;
    });

    if (event.event_type && event.space_name) {
      toast.success(
        `[${event.lot_name}] ${event.event_type === 'vehicle_entered' ? '🚗 Entered' : '✅ Exited'}: ${event.space_name}`
      );
    }
  }, []);

  const simulateSensorEvent = useCallback(async (spaceId: number, eventType: 'vehicle_entered' | 'vehicle_exited') => {
    try {
      const spaceToUpdate = lots.flatMap(l => l.spaces).find(s => s.id === spaceId);
      if (!spaceToUpdate) return;
      
      const response = await fetch('http://localhost:4000/api/sensors/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ space_id: spaceId, event_type: eventType })
      });

      if (response.ok) {
        const result = await response.json();
        handleSensorEvent({
          space_id: result.space.id,
          lot_id: result.space.lot_id,
          level: result.space.level,
          new_availability: result.space.is_available,
          event_type: eventType,
          space_name: result.space.name,
          lot_name: result.space.lot_name,
        });
      }
    } catch (error) {
      console.error('Error simulating sensor event:', error);
      toast.error('Failed to simulate sensor event');
    }
  }, [lots, handleSensorEvent]);

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
          result.events.forEach((event: SensorEventPayload) => {
            handleSensorEvent(event);
          });
        }
      } catch (error) {
        console.error('Error in auto mode:', error);
      }
    }, intervalSeconds * 1000);

    setAutoInterval(interval);
    setIsAutoMode(true);
  }, [autoInterval, handleSensorEvent]);

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
        toast.success('All parking spaces have been reset');
      }
    } catch (error) {
      toast.error('Failed to reset spaces');
    }
  }, [refreshLots]);

  const refreshAfterCreate = useCallback(async () => {
    await refreshLots();
  }, [refreshLots]);

  const value: SensorContextType = {
    lots,
    loading,
    isAutoMode,
    autoInterval,
    lastEventLocation,
    refreshLots,
    simulateSensorEvent,
    startAutoMode,
    stopAutoMode,
    resetAllSpaces,
    refreshAfterCreate
  };

  return (
    <SensorContext.Provider value={value}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensorContext = () => {
  const context = useContext(SensorContext);
  if (context === undefined) {
    throw new Error('useSensorContext must be used within a SensorProvider');
  }
  return context;
}; 