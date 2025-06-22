import React from 'react';
import { usePricingContext } from '../contexts/PricingContext';

interface PricingChartProps {
  basePrice: number;
  occupancy: number;
  zoneType: string;
  hasNearbyEvents: boolean;
}

const PricingChart: React.FC<PricingChartProps> = ({ 
  basePrice, 
  occupancy, 
  zoneType, 
  hasNearbyEvents 
}) => {
  const { calculateDynamicPrice } = usePricingContext();

  // Generar datos para las últimas 24 horas
  const generateHourlyData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const hour = (now.getHours() - i + 24) % 24;
      const day = (now.getDay() - Math.floor(i / 24) + 7) % 7;
      
      // Simular ocupación variable
      const simulatedOccupancy = Math.max(0.1, Math.min(0.95, occupancy + (Math.random() - 0.5) * 0.3));
      
      // Calcular precio para esta hora
      const price = calculateDynamicPrice(basePrice, simulatedOccupancy, zoneType, hasNearbyEvents);
      
      data.push({
        hour,
        price,
        occupancy: simulatedOccupancy,
        isPeakHour: (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19),
        isWeekend: day === 0 || day === 6
      });
    }
    
    return data;
  };

  const hourlyData = generateHourlyData();
  const maxPrice = Math.max(...hourlyData.map(d => d.price));
  const minPrice = Math.min(...hourlyData.map(d => d.price));
  const priceRange = maxPrice - minPrice;

  const getBarColor = (dataPoint: any) => {
    const change = ((dataPoint.price - basePrice) / basePrice) * 100;
    if (change > 20) return 'bg-red-500';
    if (change > 10) return 'bg-orange-500';
    if (change < -10) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const calculateBarHeight = (price: number) => {
    if (priceRange === 0) return 20; // Altura mínima si no hay variación
    const height = ((price - minPrice) / priceRange) * 200;
    return Math.max(20, height); // Altura mínima de 20px
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Precios Dinámicos - Últimas 24 Horas
      </h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Precio Base: RD${basePrice}</span>
          <span>Rango: RD${minPrice.toFixed(2)} - RD${maxPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="h-64 flex items-end justify-between gap-1 mb-4 border-b border-gray-200 dark:border-gray-600">
        {hourlyData.map((dataPoint, index) => (
          <div key={index} className="flex flex-col items-center flex-1 min-w-0">
            <div className="relative group w-full">
              <div
                className={`w-full ${getBarColor(dataPoint)} rounded-t transition-all duration-200 hover:opacity-80 min-h-[20px]`}
                style={{
                  height: `${calculateBarHeight(dataPoint.price)}px`
                }}
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                <div>Hora: {dataPoint.hour}:00</div>
                <div>Precio: RD${dataPoint.price.toFixed(2)}</div>
                <div>Ocupación: {(dataPoint.occupancy * 100).toFixed(0)}%</div>
                {dataPoint.isPeakHour && <div className="text-yellow-400">Hora Pico</div>}
                {dataPoint.isWeekend && <div className="text-purple-400">Fin de Semana</div>}
              </div>
            </div>
            
            {/* Etiqueta de hora */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate w-full text-center">
              {dataPoint.hour === 0 ? '00' : dataPoint.hour}
            </div>
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Precio Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Precio Elevado (+10-20%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Precio Alto (+20%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Precio Reducido (-10%+)</span>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            RD${hourlyData[hourlyData.length - 1].price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Precio Actual</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {hourlyData.filter(d => d.isPeakHour).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Horas Pico</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            RD${(hourlyData.reduce((sum, d) => sum + d.price, 0) / hourlyData.length).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Precio Promedio</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {((hourlyData[hourlyData.length - 1].price - basePrice) / basePrice * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Cambio vs Base</div>
        </div>
      </div>
    </div>
  );
};

export default PricingChart; 