import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Car, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoLoginCountdown, setAutoLoginCountdown] = useState(3);
  
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Auto-login countdown
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const timer = setInterval(() => {
        setAutoLoginCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-login will be handled by AuthContext
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [authLoading, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  // Show loading screen during auto-login
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AutoSlot
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sistema de Gestión de Estacionamientos
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Iniciando sesión automáticamente...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Redirigiendo al dashboard en {autoLoginCountdown} segundos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AutoSlot
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistema de Gestión de Estacionamientos
          </p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Información de acceso */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                🚀 Modo Demo Activado
              </h3>
              <div className="text-sm text-green-700 dark:text-green-300">
                <p>Este es un <strong>demo automático</strong>. El sistema iniciará sesión automáticamente.</p>
                <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded border border-green-300 dark:border-green-600">
                  <p className="font-medium text-green-800 dark:text-green-200 mb-1">Credenciales de demo:</p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <strong>Email:</strong> admin@autoslot.com<br/>
                    <strong>Contraseña:</strong> admin123
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión Manual'
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sistema de gestión de estacionamientos inteligentes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 