import React, { useState, useEffect } from 'react';
import { Car, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { parkingLotApi } from '../services/api';
import type { ParkingLotWithSpaces, ParkingSpace } from '../types';

interface SensorSimulatorProps {
  onSpaceUpdate?: (updatedSpace: ParkingSpace) => void;
}

const SensorSimulator: React.FC<SensorSimulatorProps> = ({ onSpaceUpdate }) => {
  const [lots, setLots] = useState<ParkingLotWithSpaces[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoInterval, setAutoInterval] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLots();
  }, []);

  const loadLots = async () => {
    try {
      setLoading(true);
      const lotsData = await parkingLotApi.getAll();
      const lotsWithSpaces = await Promise.all(
        lotsData.map(lot => parkingLotApi.getById(lot.id))
      );
      setLots(lotsWithSpaces);
    } catch (error) {
      console.error('Error loading lots:', error);
      toast.error('Failed to load parking lots');
    } finally {
      setLoading(false);
    }
  };

  const simulateSensorEvent = async (spaceId: number, eventType: 'vehicle_entered' | 'vehicle_exited') => {
    try {
      const response = await fetch('http://localhost:4000/api/sensors/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          space_id: spaceId,
          event_type: eventType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to trigger sensor event');
      }

      const result = await response.json();
      
      // Actualizar el estado local
      setLots(prevLots => 
        prevLots.map(lot => ({
          ...lot,
          spaces: lot.spaces.map(space => 
            space.id === spaceId ? { ...space, is_available: result.space.is_available } : space
          )
        }))
      );

      // Notificar al componente padre si es necesario
      if (onSpaceUpdate) {
        onSpaceUpdate(result.space);
      }

      toast.success(`${eventType === 'vehicle_entered' ? 'Vehicle entered' : 'Vehicle exited'} space ${result.space.name}`);
      
    } catch (error) {
      console.error('Error simulating sensor event:', error);
      toast.error('Failed to simulate sensor event');
    }
  };

  const startAutoMode = () => {
    if (autoInterval) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:4000/api/sensors/simulate-random', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            count: 1,
            delay_ms: 2000
          })
        });

        if (response.ok) {
          const result = await response.json();
          await loadLots(); // Recargar datos
          
          if (result.events.length > 0) {
            const event = result.events[0];
            toast.success(`${event.event_type === 'vehicle_entered' ? 'Vehicle entered' : 'Vehicle exited'} ${event.space_name} at ${event.lot_name}`);
          }
        }
      } catch (error) {
        console.error('Error in auto mode:', error);
      }
    }, 3000); // Evento cada 3 segundos

    setAutoInterval(interval);
    setIsAutoMode(true);
    toast.success('Auto mode started - random events every 3 seconds');
  };

  const stopAutoMode = () => {
    if (autoInterval) {
      clearInterval(autoInterval);
      setAutoInterval(null);
    }
    setIsAutoMode(false);
    toast.success('Auto mode stopped');
  };

  const resetAllSpaces = async () => {
    try {
      // Simular múltiples eventos para resetear todos los espacios
      const allSpaces = lots.flatMap(lot => lot.spaces);
      
      for (const space of allSpaces) {
        if (!space.is_available) {
          await simulateSensorEvent(space.id, 'vehicle_exited');
        }
      }
      
      toast.success('All spaces reset to available');
    } catch (error) {
      console.error('Error resetting spaces:', error);
      toast.error('Failed to reset spaces');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Sensor Simulator
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={isAutoMode ? stopAutoMode : startAutoMode}
            className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
              isAutoMode 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isAutoMode ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAutoMode ? 'Stop Auto' : 'Start Auto'}
          </button>
          <button
            onClick={resetAllSpaces}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {lots.map(lot => (
          <div key={lot.id} className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">{lot.name}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {lot.spaces.slice(0, 12).map(space => (
                <div
                  key={space.id}
                  className={`
                    p-2 rounded-md text-center text-xs font-medium cursor-pointer transition-colors
                    ${space.is_available 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }
                  `}
                  onClick={() => setSelectedSpace(space)}
                >
                  <div className="font-bold">{space.name}</div>
                  <div className="text-xs opacity-75">L{space.level}</div>
                </div>
              ))}
              {lot.spaces.length > 12 && (
                <div className="p-2 rounded-md text-center text-xs text-gray-500">
                  +{lot.spaces.length - 12} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para simular evento específico */}
      {selectedSpace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Simulate Sensor Event
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Space: <span className="font-medium">{selectedSpace.name}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Lot: <span className="font-medium">{lots.find(l => l.spaces.some(s => s.id === selectedSpace.id))?.name}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Level: <span className="font-medium">{selectedSpace.level}</span>
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className={`font-medium ${selectedSpace.is_available ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedSpace.is_available ? 'Available' : 'Occupied'}
                </span>
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  simulateSensorEvent(selectedSpace.id, 'vehicle_entered');
                  setSelectedSpace(null);
                }}
                disabled={!selectedSpace.is_available}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center"
              >
                <Car className="w-4 h-4 mr-1" />
                Vehicle Enters
              </button>
              <button
                onClick={() => {
                  simulateSensorEvent(selectedSpace.id, 'vehicle_exited');
                  setSelectedSpace(null);
                }}
                disabled={selectedSpace.is_available}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center"
              >
                <Car className="w-4 h-4 mr-1" />
                Vehicle Exits
              </button>
            </div>
            
            <button
              onClick={() => setSelectedSpace(null)}
              className="w-full mt-3 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorSimulator; 