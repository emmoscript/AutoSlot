import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Calendar, MapPin, Settings, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useSensorContext } from '../contexts/SensorContext';
import { usePricingContext } from '../contexts/PricingContext';
import PricingChart from './PricingChart';

interface DynamicPricingPanelProps {
  lotId?: number;
}

const DynamicPricingPanel: React.FC<DynamicPricingPanelProps> = ({ lotId }) => {
  const { lots } = useSensorContext();
  const { 
    pricingFactors, 
    isPricingEnabled, 
    currentHour, 
    currentDay, 
    updatePricingFactors, 
    togglePricing 
  } = usePricingContext();

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showPricingChart, setShowPricingChart] = useState(false);

  // Simular eventos cercanos
  const [nearbyEvents] = useState([
    { name: 'Concierto Central Park', distance: 0.5, attendees: 5000, impact: 'high' },
    { name: 'Feria Gastronómica', distance: 1.2, attendees: 2000, impact: 'medium' },
    { name: 'Maratón Ciudad', distance: 2.0, attendees: 10000, impact: 'high' }
  ]);

  const calculateDynamicPrice = (basePrice: number, space: any, lot: any) => {
    if (!isPricingEnabled) return basePrice;

    const occupancy = lot.spaces.filter((s: any) => !s.is_available).length / lot.spaces.length;
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
    
    return Math.round(finalPrice * 100) / 100; // Redondear a 2 decimales
  };

  const getCurrentLot = () => {
    if (lotId) {
      return lots.find(lot => lot.id === lotId);
    }
    return lots[0]; // Default al primer lote
  };

  const currentLot = getCurrentLot();
  const totalSpaces = currentLot?.spaces.length || 0;
  const occupiedSpaces = currentLot?.spaces.filter(s => !s.is_available).length || 0;
  const occupancyRate = totalSpaces > 0 ? (occupiedSpaces / totalSpaces) * 100 : 0;

  const getPriceTrend = () => {
    if (occupancyRate > 80) return 'up';
    if (occupancyRate < 30) return 'down';
    return 'stable';
  };

  const getOccupancyColor = () => {
    if (occupancyRate > 80) return 'text-red-600';
    if (occupancyRate > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          Precios Dinámicos
        </h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPricingEnabled}
              onChange={togglePricing}
              className="w-4 h-4 text-green-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Activo
            </span>
          </label>
        </div>
      </div>

      {/* Estado Actual - Siempre visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300">Ocupación</p>
              <p className={`text-2xl font-bold ${getOccupancyColor()}`}>
                {occupancyRate.toFixed(1)}%
              </p>
            </div>
            {getPriceTrend() === 'up' && <TrendingUp className="w-6 h-6 text-red-600" />}
            {getPriceTrend() === 'down' && <TrendingDown className="w-6 h-6 text-green-600" />}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-green-600 dark:text-green-300">Hora Actual</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentHour}:00
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300">Día</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][currentDay]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de Factores - Dropdown */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración Avanzada
          </h3>
          {showAdvancedSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showAdvancedSettings && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Multiplicador por Ocupación
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={pricingFactors.occupancyMultiplier}
                  onChange={(e) => updatePricingFactors({
                    occupancyMultiplier: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">{pricingFactors.occupancyMultiplier}x</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Multiplicador por Hora Pico
                </label>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.1"
                  value={pricingFactors.timeMultiplier}
                  onChange={(e) => updatePricingFactors({
                    timeMultiplier: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">{pricingFactors.timeMultiplier}x</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Multiplicador por Eventos
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={pricingFactors.eventMultiplier}
                  onChange={(e) => updatePricingFactors({
                    eventMultiplier: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">{pricingFactors.eventMultiplier}x</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Multiplicador por Demanda
                </label>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.1"
                  value={pricingFactors.demandMultiplier}
                  onChange={(e) => updatePricingFactors({
                    demandMultiplier: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">{pricingFactors.demandMultiplier}x</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Precio Base (RD$/hora)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  step="0.5"
                  value={pricingFactors.basePrice}
                  onChange={(e) => updatePricingFactors({
                    basePrice: parseFloat(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Eventos Cercanos - Dropdown */}
      <div className="mb-6">
        <button
          onClick={() => setShowPricingChart(!showPricingChart)}
          className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Eventos Cercanos y Análisis
          </h3>
          {showPricingChart ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showPricingChart && (
          <div className="mt-4 space-y-4">
            {/* Eventos Cercanos */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Eventos Cercanos</h4>
              <div className="space-y-2">
                {nearbyEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{event.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {event.distance}km • {event.attendees.toLocaleString()} asistentes
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.impact === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {event.impact === 'high' ? 'Alto Impacto' : 'Medio Impacto'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico de Precios Dinámicos */}
            {currentLot && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <PricingChart
                  basePrice={pricingFactors.basePrice}
                  occupancy={occupancyRate / 100}
                  zoneType="standard"
                  hasNearbyEvents={nearbyEvents.some(event => event.impact === 'high' && event.distance < 1.0)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vista Previa de Precios - Siempre visible */}
      {currentLot && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vista Previa de Precios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentLot.spaces.slice(0, 6).map((space) => {
              const dynamicPrice = calculateDynamicPrice(pricingFactors.basePrice, space, currentLot);
              const priceChange = ((dynamicPrice - pricingFactors.basePrice) / pricingFactors.basePrice) * 100;
              
              return (
                <div key={space.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{space.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      space.zone_type === 'premium' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : space.zone_type === 'standard'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {space.zone_type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        RD${dynamicPrice}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">por hora</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        priceChange > 0 ? 'text-red-600' : priceChange < 0 ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        vs base
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicPricingPanel; 