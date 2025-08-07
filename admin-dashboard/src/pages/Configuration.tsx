import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Database, 
  Shield, 
  Bell, 
  CreditCard, 
  Car, 
  Camera,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Server,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

interface SystemConfig {
  // API Configuration
  apiUrl: string;
  apiTimeout: number;
  maxRetries: number;
  
  // Security Settings
  sessionTimeout: number;
  passwordMinLength: number;
  requireTwoFactor: boolean;
  
  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  
  // Payment Settings
  defaultCurrency: string;
  taxRate: number;
  lateFeePercentage: number;
  
  // LPR Settings
  lprEnabled: boolean;
  lprConfidenceThreshold: number;
  lprImageRetentionDays: number;
  
  // Sensor Settings
  sensorPollingInterval: number;
  sensorTimeout: number;
  autoResetSpaces: boolean;
  
  // General Settings
  maintenanceMode: boolean;
  debugMode: boolean;
  autoBackup: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  vehicle_plate?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  phone?: string;
}

const Configuration: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('system');
  
  console.log('⚙️ Configuration component loaded');
  console.log('👤 Current user:', user);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [config, setConfig] = useState<SystemConfig>({
    // API Configuration
    apiUrl: 'http://10.0.0.92:4000/api',
    apiTimeout: 30000,
    maxRetries: 3,
    
    // Security Settings
    sessionTimeout: 3600,
    passwordMinLength: 8,
    requireTwoFactor: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Payment Settings
    defaultCurrency: 'DOP',
    taxRate: 18.0,
    lateFeePercentage: 5.0,
    
    // LPR Settings
    lprEnabled: true,
    lprConfidenceThreshold: 0.8,
    lprImageRetentionDays: 30,
    
    // Sensor Settings
    sensorPollingInterval: 5000,
    sensorTimeout: 10000,
    autoResetSpaces: false,
    
    // General Settings
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userList = await apiClient.getUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar usuarios');
    }
  };

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      await apiClient.getCurrentUser();
      toast.success('Conexión exitosa con el servidor');
    } catch (error) {
      toast.error('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId: number, isActive: boolean) => {
    try {
      await apiClient.updateUser(userId, { is_active: isActive });
      await loadUsers(); // Reload users
      toast.success(`Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      toast.error('Error al actualizar usuario');
    }
  };

  const tabs = [
    { id: 'system', label: 'Sistema', icon: Settings },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'lpr', label: 'LPR', icon: Camera },
    { id: 'sensors', label: 'Sensores', icon: Car },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configuración del Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestiona la configuración general del sistema AutoSlot
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* System Configuration */}
          {activeTab === 'system' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="h-5 w-5" />
                    <span>Configuración de API</span>
                  </CardTitle>
                  <CardDescription>
                    Configuración de conexión y comunicación con el servidor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL del Servidor
                    </label>
                    <input
                      type="text"
                      value={config.apiUrl}
                      onChange={(e) => handleConfigChange('apiUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timeout (ms)
                    </label>
                    <input
                      type="number"
                      value={config.apiTimeout}
                      onChange={(e) => handleConfigChange('apiTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Máximo de Reintentos
                    </label>
                    <input
                      type="number"
                      value={config.maxRetries}
                      onChange={(e) => handleConfigChange('maxRetries', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <Button onClick={handleTestConnection} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Probar Conexión
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Configuración General</span>
                  </CardTitle>
                  <CardDescription>
                    Configuración general del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Modo Mantenimiento
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Bloquea el acceso al sistema
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.maintenanceMode}
                      onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Modo Debug
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Habilita logs detallados
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.debugMode}
                      onChange={(e) => handleConfigChange('debugMode', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Backup Automático
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Respaldo diario de datos
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.autoBackup}
                      onChange={(e) => handleConfigChange('autoBackup', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Configuration */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Configuración de Seguridad</span>
                </CardTitle>
                <CardDescription>
                  Configuración de seguridad y autenticación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timeout de Sesión (segundos)
                    </label>
                    <input
                      type="number"
                      value={config.sessionTimeout}
                      onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Longitud Mínima de Contraseña
                    </label>
                    <input
                      type="number"
                      value={config.passwordMinLength}
                      onChange={(e) => handleConfigChange('passwordMinLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Autenticación de Dos Factores
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Requiere 2FA para todos los usuarios
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.requireTwoFactor}
                    onChange={(e) => handleConfigChange('requireTwoFactor', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Gestión de Usuarios</span>
                </CardTitle>
                <CardDescription>
                  Administra usuarios del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Vehículo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.vehicle_brand && user.vehicle_model 
                                ? `${user.vehicle_brand} ${user.vehicle_model}`
                                : user.vehicle_plate || 'No registrado'
                              }
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {user.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleUserStatusToggle(user.id, !user.is_active)}
                              className={`text-sm px-3 py-1 rounded-md ${
                                user.is_active
                                  ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                  : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                              }`}
                            >
                              {user.is_active ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Configuration */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Configuración de Notificaciones</span>
                </CardTitle>
                <CardDescription>
                  Configuración de notificaciones del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notificaciones por Email
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Enviar notificaciones por correo electrónico
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.emailNotifications}
                    onChange={(e) => handleConfigChange('emailNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notificaciones Push
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Notificaciones en tiempo real
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.pushNotifications}
                    onChange={(e) => handleConfigChange('pushNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notificaciones SMS
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Enviar notificaciones por SMS
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.smsNotifications}
                    onChange={(e) => handleConfigChange('smsNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Configuration */}
          {activeTab === 'payments' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Configuración de Pagos</span>
                </CardTitle>
                <CardDescription>
                  Configuración del sistema de pagos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Moneda Predeterminada
                    </label>
                    <select
                      value={config.defaultCurrency}
                      onChange={(e) => handleConfigChange('defaultCurrency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="DOP">DOP - Peso Dominicano</option>
                      <option value="USD">USD - Dólar Estadounidense</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tasa de Impuesto (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={config.taxRate}
                      onChange={(e) => handleConfigChange('taxRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Penalización por Retraso (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={config.lateFeePercentage}
                      onChange={(e) => handleConfigChange('lateFeePercentage', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* LPR Configuration */}
          {activeTab === 'lpr' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Configuración LPR</span>
                </CardTitle>
                <CardDescription>
                  Configuración del sistema de reconocimiento de placas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sistema LPR Habilitado
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Activar reconocimiento automático de placas
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.lprEnabled}
                    onChange={(e) => handleConfigChange('lprEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Umbral de Confianza
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={config.lprConfidenceThreshold}
                      onChange={(e) => handleConfigChange('lprConfidenceThreshold', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Retención de Imágenes (días)
                    </label>
                    <input
                      type="number"
                      value={config.lprImageRetentionDays}
                      onChange={(e) => handleConfigChange('lprImageRetentionDays', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sensor Configuration */}
          {activeTab === 'sensors' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-5 w-5" />
                  <span>Configuración de Sensores</span>
                </CardTitle>
                <CardDescription>
                  Configuración del sistema de sensores IoT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Intervalo de Polling (ms)
                    </label>
                    <input
                      type="number"
                      value={config.sensorPollingInterval}
                      onChange={(e) => handleConfigChange('sensorPollingInterval', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timeout de Sensor (ms)
                    </label>
                    <input
                      type="number"
                      value={config.sensorTimeout}
                      onChange={(e) => handleConfigChange('sensorTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reset Automático de Espacios
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Liberar espacios automáticamente después de un tiempo
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.autoResetSpaces}
                    onChange={(e) => handleConfigChange('autoResetSpaces', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSaveConfig} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Configuration; 