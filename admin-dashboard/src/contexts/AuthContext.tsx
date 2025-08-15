import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as Api from '../services/api';

const apiClient = Api.apiClient;
type ApiUser = Api.User;

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert API user to local user format
const mapApiUserToLocalUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    username: apiUser.email.split('@')[0], // Use email prefix as username
    email: apiUser.email,
    role: apiUser.role as 'admin' | 'user',
    name: apiUser.name,
    avatar: undefined,
  };
};

// Demo admin user for fallback
const demoAdminUser: User = {
  id: 1,
  username: 'admin',
  email: 'admin@autoslot.com',
  role: 'admin',
  name: 'Admin Demo',
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedUser = localStorage.getItem('autoslot_user');
      const token = localStorage.getItem('autoslot_admin_token');
      const demoMode = localStorage.getItem('autoslot_demo_mode') === 'true';
      
      if (demoMode) {
        // Demo mode - use simulated user
        setUser(demoAdminUser);
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      }
      
      if (savedUser && token) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await apiClient.getCurrentUser();
          const localUser = mapApiUserToLocalUser(currentUser);
          setUser(localUser);
          setIsDemoMode(false);
          localStorage.setItem('autoslot_user', JSON.stringify(localUser));
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear invalid session
          localStorage.removeItem('autoslot_user');
          localStorage.removeItem('autoslot_admin_token');
          apiClient.clearToken();
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Assume username is email (common practice)
      const email = username.includes('@') ? username : `${username}@autoslot.com`;
      
      console.log(`🔐 Attempting login for: ${email}`);
      
      // Check if using demo credentials
      if (email === 'admin@autoslot.com' && password === 'admin123') {
        console.log('🎯 Demo credentials detected, trying backend first...');
        
        try {
          // Try real backend first
          const response = await apiClient.login(email, password);
          
          if (response.success && response.user) {
            // Check if user is admin
            if (response.user.role !== 'admin') {
              toast.error('Acceso denegado: Se requieren permisos de administrador');
              setIsLoading(false);
              return false;
            }
            
            const localUser = mapApiUserToLocalUser(response.user);
            setUser(localUser);
            setIsDemoMode(false);
            localStorage.setItem('autoslot_user', JSON.stringify(localUser));
            localStorage.removeItem('autoslot_demo_mode');
            toast.success(`¡Bienvenido, ${response.user.name}! (Modo Real)`);
            setIsLoading(false);
            return true;
          }
        } catch (backendError) {
          console.log('⚠️ Backend unavailable, switching to demo mode...');
          
          // Backend failed, use demo mode
          setUser(demoAdminUser);
          setIsDemoMode(true);
          localStorage.setItem('autoslot_user', JSON.stringify(demoAdminUser));
          localStorage.setItem('autoslot_demo_mode', 'true');
          toast.success(`¡Bienvenido al Demo, ${demoAdminUser.name}! (Modo Simulado)`);
          toast('El backend no está disponible. Usando datos simulados.');
          setIsLoading(false);
          return true;
        }
      } else {
        // Non-demo credentials, try backend only
        const response = await apiClient.login(email, password);
        
        if (response.success && response.user) {
          // Check if user is admin
          if (response.user.role !== 'admin') {
            toast.error('Acceso denegado: Se requieren permisos de administrador');
            setIsLoading(false);
            return false;
          }
          
          const localUser = mapApiUserToLocalUser(response.user);
          setUser(localUser);
          setIsDemoMode(false);
          localStorage.setItem('autoslot_user', JSON.stringify(localUser));
          localStorage.removeItem('autoslot_demo_mode');
          toast.success(`¡Bienvenido, ${response.user.name}!`);
          setIsLoading(false);
          return true;
        } else {
          toast.error('Credenciales incorrectas');
          setIsLoading(false);
          return false;
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Error al iniciar sesión';
      
      if (errorMessage.toLowerCase().includes('invalid credentials')) {
        toast.error('Credenciales incorrectas');
      } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
        // Network error - offer demo mode for demo credentials
        if (username.includes('admin@autoslot.com') || (username === 'admin' && password === 'admin123')) {
          console.log('🌐 Network error with demo credentials, switching to demo mode...');
          setUser(demoAdminUser);
          setIsDemoMode(true);
          localStorage.setItem('autoslot_user', JSON.stringify(demoAdminUser));
          localStorage.setItem('autoslot_demo_mode', 'true');
          toast.success(`¡Bienvenido al Demo, ${demoAdminUser.name}! (Modo Simulado)`);
          toast('El backend no está disponible. Usando datos simulados.');
          setIsLoading(false);
          return true;
        } else {
          toast.error('Error de conexión. Verifica tu red.');
        }
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
      
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      if (!isDemoMode) {
        await apiClient.logout();
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      setUser(null);
      setIsDemoMode(false);
      localStorage.removeItem('autoslot_user');
      localStorage.removeItem('autoslot_admin_token');
      localStorage.removeItem('autoslot_demo_mode');
      toast.success('Sesión cerrada correctamente');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('autoslot_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isDemoMode,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 