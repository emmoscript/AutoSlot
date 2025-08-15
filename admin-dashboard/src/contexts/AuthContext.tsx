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

  // Auto-login with hardcoded admin credentials for demo
  useEffect(() => {
    const autoLogin = async () => {
      try {
        console.log('🚀 Auto-login with admin credentials for demo...');
        
        // Hardcoded admin credentials for demo
        const adminEmail = 'admin@autoslot.com';
        const adminPassword = 'admin123';
        
        const response = await apiClient.login(adminEmail, adminPassword);
        
        if (response.success && response.user) {
          const localUser = mapApiUserToLocalUser(response.user);
          setUser(localUser);
          localStorage.setItem('autoslot_user', JSON.stringify(localUser));
          console.log('✅ Auto-login successful:', localUser.name);
          toast.success(`¡Bienvenido al Demo, ${response.user.name}!`);
        } else {
          console.error('❌ Auto-login failed');
          toast.error('Error en auto-login. Usando modo demo local.');
          
          // Fallback: create a demo admin user locally
          const demoUser: User = {
            id: 1,
            username: 'admin',
            email: 'admin@autoslot.com',
            role: 'admin',
            name: 'Admin Demo',
          };
          setUser(demoUser);
          localStorage.setItem('autoslot_user', JSON.stringify(demoUser));
        }
      } catch (error) {
        console.error('❌ Auto-login error:', error);
        toast.error('Error en auto-login. Usando modo demo local.');
        
        // Fallback: create a demo admin user locally
        const demoUser: User = {
          id: 1,
          username: 'admin',
          email: 'admin@autoslot.com',
          role: 'admin',
          name: 'Admin Demo',
        };
        setUser(demoUser);
        localStorage.setItem('autoslot_user', JSON.stringify(demoUser));
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
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
      
      // Auto-login again after logout for demo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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