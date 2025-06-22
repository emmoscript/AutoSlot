import React, { useState } from 'react';
import type { PaymentTerminal, ParkingSpace, ParkingLotWithSpaces } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Car,
  Receipt,
  Terminal,
  Activity,
  Settings,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';
import { useSimulationContext } from '../contexts/SimulationContext';
import { usePricingContext } from '../contexts/PricingContext';
import { useSensorContext } from '../contexts/SensorContext';
import PricingChart from './PricingChart';

interface PaymentDashboardProps {
  className?: string;
}

const PaymentDashboard: React.FC<PaymentDashboardProps> = ({ className }) => {
  const { transactions, activeVehicles } = useSimulationContext();
  const { lots } = useSensorContext();
  const { 
    pricingFactors, 
    isPricingEnabled, 
    currentHour, 
    currentDay, 
    updatePricingFactors, 
    togglePricing 
  } = usePricingContext();
  
  const [activeTab, setActiveTab] = useState<'transactions' | 'terminals' | 'pricing'>('transactions');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showPricingChart, setShowPricingChart] = useState(false);
  
  const [terminals] = useState<PaymentTerminal[]>([
    // Terminales existentes
    {
      id: 1,
      lot_id: 1,
      name: 'Terminal Principal',
      location: 'Entrada Principal',
      terminal_type: 'card',
      status: 'active',
      last_transaction: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      lot_id: 1,
      name: 'Terminal Móvil',
      location: 'Salida Norte',
      terminal_type: 'mobile',
      status: 'active',
      last_transaction: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    },
    // Nuevos terminales
    {
      id: 3,
      lot_id: 1,
      name: 'Terminal QR',
      location: 'Nivel 1',
      terminal_type: 'qr',
      status: 'active',
      last_transaction: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      lot_id: 1,
      name: 'Terminal Efectivo',
      location: 'Salida Sur',
      terminal_type: 'cash',
      status: 'active',
      last_transaction: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
      lot_id: 1,
      name: 'Terminal Premium',
      location: 'Nivel 2',
      terminal_type: 'card',
      status: 'active',
      last_transaction: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 6,
      lot_id: 1,
      name: 'Terminal Móvil 2',
      location: 'Entrada Este',
      terminal_type: 'mobile',
      status: 'maintenance',
      last_transaction: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    }
  ]);

  // Simular eventos cercanos
  const [nearbyEvents] = useState([
    { name: 'Concierto Central Park', distance: 0.5, attendees: 5000, impact: 'high' },
    { name: 'Feria Gastronómica', distance: 1.2, attendees: 2000, impact: 'medium' },
    { name: 'Maratón Ciudad', distance: 2.0, attendees: 10000, impact: 'high' }
  ]);

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total_cost || 0), 0);
  const averageTransaction = transactions.length > 0 ? totalRevenue / transactions.length : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'mobile':
        return <Activity className="w-4 h-4" />;
      case 'qr':
        return <Receipt className="w-4 h-4" />;
      case 'cash':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDynamicPrice = (basePrice: number, space: ParkingSpace, lot: ParkingLotWithSpaces) => {
    if (!isPricingEnabled) return basePrice;

    const occupancy = lot.spaces.filter((s: ParkingSpace) => !s.is_available).length / lot.spaces.length;
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
    <div className={`space-y-6 ${className}`}>
      {/* Header con Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-50">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {transactions.length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Transacción</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-50">{formatCurrency(averageTransaction)}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Simulación en tiempo real
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehículos Activos</CardTitle>
            <Car className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-50">{activeVehicles.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              En estacionamiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminales Activas</CardTitle>
            <Terminal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-50">
              {terminals.filter(t => t.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              De {terminals.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Navegación */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant={activeTab === 'transactions' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('transactions')}
          className="flex items-center space-x-2 dark:text-white"
        >
          <Receipt className="w-4 h-4" />
          <span>Transacciones</span>
        </Button>
        <Button
          variant={activeTab === 'terminals' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('terminals')}
          className="flex items-center space-x-2 dark:text-white"
        >
          <Terminal className="w-4 h-4" />
          <span>Terminales</span>
        </Button>
        <Button
          variant={activeTab === 'pricing' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('pricing')}
          className="flex items-center space-x-2 dark:text-white"
        >
          <DollarSign className="w-4 h-4" />
          <span>Precios Dinámicos</span>
        </Button>
      </div>

      {/* Contenido de Tabs */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transacciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 20).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon('card')}
                        <div>
                          <p className="font-medium dark:text-gray-50">Ticket #{transaction.id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.license_plate} • {Math.round((transaction.actual_duration || 0)/60)}h
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold dark:text-gray-50">{formatCurrency(transaction.total_cost || 0)}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status === 'completed' ? 'Completado' : 'Otro'}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(transaction.end_time || '')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'terminals' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Terminales de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {terminals.map((terminal) => (
                  <div key={terminal.id} className="p-4 border rounded-lg dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium dark:text-gray-50">{terminal.name}</h3>
                      <Badge className={getStatusColor(terminal.status)}>
                        {terminal.status === 'active' ? 'Activo' : 
                         terminal.status === 'inactive' ? 'Inactivo' : 'Mantenimiento'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{terminal.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(terminal.terminal_type)}
                        <span className="capitalize">{terminal.terminal_type}</span>
                      </div>
                      {terminal.last_transaction && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Última: {formatDateTime(terminal.last_transaction)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Estado Actual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Ocupación</p>
                  <p className={`text-2xl font-bold ${getOccupancyColor()}`}>
                    {occupancyRate.toFixed(1)}%
                  </p>
                </div>
                {getPriceTrend() === 'up' && <TrendingUp className="w-6 h-6 text-red-600" />}
                {getPriceTrend() === 'down' && <TrendingUp className="w-6 h-6 text-green-600" />}
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

          {/* Control de Precios Dinámicos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Control de Precios Dinámicos
                </CardTitle>
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
            </CardHeader>
            <CardContent>
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

              {/* Eventos Cercanos y Análisis */}
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

              {/* Vista Previa de Precios */}
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard; 