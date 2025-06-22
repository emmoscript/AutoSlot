import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { ParkingSpace } from '../types';

interface PricingFactors {
  occupancyMultiplier: number;
  timeMultiplier: number;
  eventMultiplier: number;
  demandMultiplier: number;
  basePrice: number;
}

interface DynamicFloorPlanProps {
  spaces: ParkingSpace[];
  level: number;
  pricingFactors: PricingFactors;
  isPricingEnabled: boolean;
}

const DynamicFloorPlan: React.FC<DynamicFloorPlanProps> = ({ 
  spaces, 
  level, 
  pricingFactors, 
  isPricingEnabled 
}) => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);

  // Simular eventos cercanos
  const nearbyEvents = [
    { name: 'Concierto Central Park', distance: 0.5, attendees: 5000, impact: 'high' },
    { name: 'Feria Gastronómica', distance: 1.2, attendees: 2000, impact: 'medium' },
    { name: 'Maratón Ciudad', distance: 2.0, attendees: 10000, impact: 'high' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentDay(now.getDay());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, []);

  const calculateDynamicPrice = (space: ParkingSpace) => {
    if (!isPricingEnabled) return space.base_price || 5.0;

    const basePrice = pricingFactors.basePrice;
    const totalSpaces = spaces.length;
    const occupiedSpaces = spaces.filter(s => !s.is_available).length;
    const occupancy = occupiedSpaces / totalSpaces;
    const occupancyFactor = 1 + (occupancy * (pricingFactors.occupancyMultiplier - 1));

    // Factor de tiempo (horas pico)
    const isPeakHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);
    const isWeekend = currentDay === 0 || currentDay === 6;
    const timeFactor = isPeakHour ? pricingFactors.timeMultiplier : 1;
    const weekendFactor = isWeekend ? 1.1 : 1;

    // Factor de eventos cercanos
    const nearbyEventFactor = nearbyEvents.reduce((factor, event) => {
      if (event.impact === 'high' && event.distance < 1.0) {
        return factor * pricingFactors.eventMultiplier;
      }
      return factor;
    }, 1);

    // Factor de demanda (simulado basado en zona)
    const zoneDemandFactor = space.zone_type === 'premium' ? pricingFactors.demandMultiplier : 1;

    const finalPrice = basePrice * occupancyFactor * timeFactor * weekendFactor * nearbyEventFactor * zoneDemandFactor;
    
    return Math.round(finalPrice * 100) / 100;
  };

  const levelSpaces = spaces.filter(s => s.level === level);

  if (levelSpaces.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-8">No spaces found for this level.</div>;
  }

  // Organizar espacios en una cuadrícula
  const gridSpaces = levelSpaces.sort((a, b) => {
    const aMatch = a.name.match(/([A-Z])(\d+)/);
    const bMatch = b.name.match(/([A-Z])(\d+)/);
    
    if (aMatch && bMatch) {
      const aLetter = aMatch[1];
      const aNumber = parseInt(aMatch[2]);
      const bLetter = bMatch[1];
      const bNumber = parseInt(bMatch[2]);
      
      if (aLetter === bLetter) {
        return aNumber - bNumber;
      }
      return aLetter.localeCompare(bLetter);
    }
    
    return a.name.localeCompare(b.name);
  });

  const getPriceColor = (price: number, basePrice: number) => {
    const change = ((price - basePrice) / basePrice) * 100;
    if (change > 20) return 'text-red-600 dark:text-red-400';
    if (change > 10) return 'text-orange-600 dark:text-orange-400';
    if (change < -10) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getZoneColor = (zoneType: string) => {
    switch (zoneType) {
      case 'premium': return 'border-purple-300 dark:border-purple-600';
      case 'standard': return 'border-blue-300 dark:border-blue-600';
      case 'economy': return 'border-green-300 dark:border-green-600';
      default: return 'border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Level {level} - {levelSpaces.length} Spaces
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Occupied</span>
          </div>
          {isPricingEnabled && (
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-gray-600 dark:text-gray-400">Dynamic Pricing</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-300">
        <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
          {gridSpaces.map((space) => {
            const dynamicPrice = calculateDynamicPrice(space);
            const basePrice = space.base_price || pricingFactors.basePrice;
            const priceChange = ((dynamicPrice - basePrice) / basePrice) * 100;
            
            return (
              <div
                key={space.id}
                className={`
                  aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200 relative
                  ${space.is_available 
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50' 
                    : 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                  }
                  ${getZoneColor(space.zone_type)}
                `}
                onClick={() => setSelectedSpace(space)}
                title={`${space.name} - ${space.is_available ? 'Available' : 'Occupied'} - RD$${dynamicPrice}/hr`}
              >
                <div className="text-center">
                  <div className="font-bold">{space.name}</div>
                  {isPricingEnabled && (
                    <div className="mt-1">
                      <div className={`font-bold ${getPriceColor(dynamicPrice, basePrice)}`}>
                        RD${dynamicPrice}
                      </div>
                      <div className="text-xs flex items-center justify-center">
                        {priceChange > 0 && <TrendingUp className="w-3 h-3 text-red-600" />}
                        {priceChange < 0 && <TrendingDown className="w-3 h-3 text-green-600" />}
                        <span className={`text-xs ${getPriceColor(dynamicPrice, basePrice)}`}>
                          {priceChange > 0 ? '+' : ''}{priceChange.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Indicador de zona */}
                <div className="absolute top-1 right-1">
                  <div className={`
                    w-2 h-2 rounded-full
                    ${space.zone_type === 'premium' ? 'bg-purple-500' : 
                      space.zone_type === 'standard' ? 'bg-blue-500' : 'bg-green-500'}
                  `}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de detalles del espacio */}
      {selectedSpace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedSpace.name}
              </h3>
              <button
                onClick={() => setSelectedSpace(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`font-medium ${selectedSpace.is_available ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedSpace.is_available ? 'Available' : 'Occupied'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Zone:</span>
                <span className="font-medium capitalize">{selectedSpace.zone_type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                <span className="font-medium">RD${selectedSpace.base_price || pricingFactors.basePrice}/hr</span>
              </div>
              
              {isPricingEnabled && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
                  <span className={`font-bold ${getPriceColor(calculateDynamicPrice(selectedSpace), selectedSpace.base_price || pricingFactors.basePrice)}`}>
                    RD${calculateDynamicPrice(selectedSpace)}/hr
                  </span>
                </div>
              )}
              
              {selectedSpace.features && selectedSpace.features.length > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Features:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedSpace.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Click on any space to see details
      </div>
    </div>
  );
};

export default DynamicFloorPlan; 