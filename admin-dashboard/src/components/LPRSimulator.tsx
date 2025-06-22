import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Camera, 
  Car, 
  Truck, 
  Bus,
  Activity,
  Timer,
  Bike
} from 'lucide-react';
import DominicanPlate from './DominicanPlate';
import { useSimulationContext } from '../contexts/SimulationContext';

interface LPRSimulatorProps {
  className?: string;
}

const LPRSimulator: React.FC<LPRSimulatorProps> = ({ className }) => {
  const { lprHistory, activeVehicles, isSimulating, toggleSimulation } = useSimulationContext();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entered':
        return 'bg-green-100 text-green-800';
      case 'exited':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'truck':
        return <Truck className="w-4 h-4" />;
      case 'motorcycle':
        return <Bike className="w-4 h-4" />;
      case 'bus':
        return <Bus className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const vehiclesByType = lprHistory.reduce((acc, record) => {
    acc[record.vehicle_type] = (acc[record.vehicle_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPlates = lprHistory
    .reduce((acc, record) => {
      const existing = acc.find(p => p.plate === record.license_plate);
      if (existing) {
        existing.visits++;
      } else {
        acc.push({ plate: record.license_plate, visits: 1 });
      }
      return acc;
    }, [] as Array<{ plate: string; visits: number }>)
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);


  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehículos Totales (Hoy)</CardTitle>
            <Car className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-50">{lprHistory.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Registrados en la simulación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehículos Activos</CardTitle>
            <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
            <CardTitle className="text-sm font-medium">Tasa de Reconocimiento</CardTitle>
            <Camera className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-50">97.5%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Precisión simulada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Timer className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-50">--</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              (Próximamente)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control de Simulación */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Simulador LPR</span>
            </CardTitle>
            <Button
              variant={isSimulating ? 'destructive' : 'default'}
              onClick={toggleSimulation}
              className="flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>{isSimulating ? 'Detener' : 'Iniciar'} Simulación</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Registros LPR */}
      <Card>
        <CardHeader>
          <CardTitle>Registros LPR Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lprHistory.slice(0, 10).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:border-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <DominicanPlate plate={record.license_plate} />
                  
                  <div className="flex items-center space-x-2">
                    {getVehicleIcon(record.vehicle_type)}
                    <div>
                      <p className="font-medium dark:text-gray-50">{record.license_plate}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {record.vehicle_type} • {record.camera_location}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Confianza: {(record.confidence_score * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status === 'entered' ? 'Entró' : 
                       record.status === 'exited' ? 'Salió' : 'Activo'}
                    </Badge>
                    <Badge className={getPaymentStatusColor(record.payment_status)}>
                      {record.payment_status === 'paid' ? 'Pagado' : 
                       record.payment_status === 'pending' ? 'Pendiente' : 'Sin Pagar'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(record.entry_time)}
                  </p>
                  {record.duration_minutes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Duración: {Math.floor(record.duration_minutes / 60)}h {record.duration_minutes % 60}m
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {lprHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay registros LPR aún</p>
                <p className="text-sm">Inicia la simulación para ver actividad</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics de Vehículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(vehiclesByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-50">
                    {getVehicleIcon(type)}
                    <span className="capitalize">{type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-gray-50">{count}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({((count / (lprHistory.length || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placas Más Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPlates.map((plate, index) => (
                <div key={plate.plate} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="font-mono text-sm text-gray-900 dark:text-gray-50">{plate.plate}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {plate.visits} visitas
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LPRSimulator; 