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

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedUser = localStorage.getItem('autoslot_user');
      const token = localStorage.getItem('autoslot_admin_token');
      
      if (savedUser && token) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await apiClient.getCurrentUser();
          const localUser = mapApiUserToLocalUser(currentUser);
          setUser(localUser);
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
        localStorage.setItem('autoslot_user', JSON.stringify(localUser));
        toast.success(`¡Bienvenido, ${response.user.name}!`);
        setIsLoading(false);
        return true;
      } else {
        toast.error('Credenciales incorrectas');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Error al iniciar sesión';
      
      if (errorMessage.toLowerCase().includes('invalid credentials')) {
        toast.error('Credenciales incorrectas');
      } else if (errorMessage.toLowerCase().includes('network')) {
        toast.error('Error de conexión. Verifica tu red.');
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('autoslot_user');
      localStorage.removeItem('autoslot_admin_token');
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