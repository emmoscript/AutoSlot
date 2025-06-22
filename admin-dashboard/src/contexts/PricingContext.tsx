import React, { createContext, useContext, useState, useEffect } from 'react';

interface PricingFactors {
  occupancyMultiplier: number;
  timeMultiplier: number;
  eventMultiplier: number;
  demandMultiplier: number;
  basePrice: number;
}

interface PricingContextType {
  pricingFactors: PricingFactors;
  isPricingEnabled: boolean;
  currentHour: number;
  currentDay: number;
  updatePricingFactors: (factors: Partial<PricingFactors>) => void;
  togglePricing: () => void;
  calculateDynamicPrice: (basePrice: number, occupancy: number, zoneType: string, hasNearbyEvents: boolean) => number;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

interface PricingProviderProps {
  children: React.ReactNode;
}

export const PricingProvider: React.FC<PricingProviderProps> = ({ children }) => {
  const [pricingFactors, setPricingFactors] = useState<PricingFactors>({
    occupancyMultiplier: 1.5,
    timeMultiplier: 1.2,
    eventMultiplier: 2.0,
    demandMultiplier: 1.3,
    basePrice: 5.0
  });
  
  const [isPricingEnabled, setIsPricingEnabled] = useState(true);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentDay, setCurrentDay] = useState(new Date().getDay());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentDay(now.getDay());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, []);

  const updatePricingFactors = (factors: Partial<PricingFactors>) => {
    setPricingFactors(prev => ({ ...prev, ...factors }));
  };

  const togglePricing = () => {
    setIsPricingEnabled(prev => !prev);
  };

  const calculateDynamicPrice = (
    basePrice: number, 
    occupancy: number, 
    zoneType: string, 
    hasNearbyEvents: boolean
  ) => {
    if (!isPricingEnabled) return basePrice;

    const occupancyFactor = 1 + (occupancy * (pricingFactors.occupancyMultiplier - 1));

    // Factor de tiempo (horas pico)
    const isPeakHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);
    const isWeekend = currentDay === 0 || currentDay === 6;
    const timeFactor = isPeakHour ? pricingFactors.timeMultiplier : 1;
    const weekendFactor = isWeekend ? 1.1 : 1;

    // Factor de eventos cercanos
    const nearbyEventFactor = hasNearbyEvents ? pricingFactors.eventMultiplier : 1;

    // Factor de demanda (simulado basado en zona)
    const zoneDemandFactor = zoneType === 'premium' ? pricingFactors.demandMultiplier : 1;

    const finalPrice = basePrice * occupancyFactor * timeFactor * weekendFactor * nearbyEventFactor * zoneDemandFactor;
    
    return Math.round(finalPrice * 100) / 100; // Redondear a 2 decimales
  };

  const value: PricingContextType = {
    pricingFactors,
    isPricingEnabled,
    currentHour,
    currentDay,
    updatePricingFactors,
    togglePricing,
    calculateDynamicPrice
  };

  return (
    <PricingContext.Provider value={value}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricingContext = () => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricingContext must be used within a PricingProvider');
  }
  return context;
}; 