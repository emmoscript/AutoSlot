# Guía de Desarrollo - AutoSlot MVP

## 🚀 Configuración del Entorno

### Prerrequisitos
- **Node.js**: v16 o superior
- **npm**: v8 o superior
- **Git**: Para control de versiones
- **Editor**: VS Code recomendado

### Extensiones VS Code Recomendadas
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 📦 Instalación

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd auto_slot
```

### 2. Instalar Dependencias del Backend
```bash
cd backend-api
npm install
```

### 3. Instalar Dependencias del Frontend
```bash
cd ../admin-dashboard
npm install
```

### 4. Configurar Base de Datos
```bash
cd ../backend-api
npm run seed
```

## 🏃‍♂️ Ejecutar el Proyecto

### Backend (Terminal 1)
```bash
cd backend-api
npm run dev
```
**URL**: http://localhost:4000

### Frontend (Terminal 2)
```bash
cd admin-dashboard
npm run dev
```
**URL**: http://localhost:5173

## 🏗️ Estructura del Proyecto

### Backend (`backend-api/`)
```
src/
├── controllers/     # Controladores de la API
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio
├── database/       # Configuración de BD
├── middleware/     # Middlewares personalizados
├── types/          # Tipos TypeScript
└── utils/          # Utilidades
```

### Frontend (`admin-dashboard/`)
```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── contexts/      # Contextos globales
├── services/      # Servicios de API
├── types/         # Tipos TypeScript
├── hooks/         # Custom hooks
└── utils/         # Utilidades
```

## 🎯 Convenciones de Código

### TypeScript
```typescript
// Interfaces para props
interface ComponentProps {
  title: string;
  onAction: (data: ActionData) => void;
  optional?: boolean;
}

// Tipos para estados
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Enums para valores constantes
enum SpaceStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied'
}
```

### React Components
```typescript
// Componente funcional con TypeScript
const MyComponent: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  optional = false 
}) => {
  const [state, setState] = useState<LoadingState>('idle');

  const handleClick = useCallback(() => {
    onAction({ type: 'click', timestamp: Date.now() });
  }, [onAction]);

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};
```

### Naming Conventions
- **Archivos**: `PascalCase.tsx` para componentes, `camelCase.ts` para utilidades
- **Componentes**: `PascalCase`
- **Funciones**: `camelCase`
- **Variables**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` con prefijo `I` (opcional)

## 🎨 Styling con TailwindCSS

### Clases Comunes
```css
/* Layout */
.container mx-auto px-4
.flex items-center justify-between
.grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Spacing */
.p-4 m-2 gap-4 space-y-4

/* Colors */
.bg-blue-500 text-white hover:bg-blue-600
.bg-green-100 text-green-800
.bg-red-100 text-red-800

/* Responsive */
.w-full md:w-1/2 lg:w-1/3
.text-sm md:text-base lg:text-lg
```

### Componentes Personalizados
```typescript
// Button component
const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

## 🔧 API Development

### Crear Nuevo Endpoint

1. **Definir Tipo** (`src/types/index.ts`)
```typescript
export interface NewFeature {
  id: number;
  name: string;
  description: string;
  created_at: string;
}
```

2. **Crear Servicio** (`src/services/newFeatureService.ts`)
```typescript
import { db } from '../database';
import type { NewFeature } from '../types';

export const newFeatureService = {
  async getAll(): Promise<NewFeature[]> {
    const [rows] = await db.execute('SELECT * FROM new_features');
    return rows as NewFeature[];
  },

  async getById(id: number): Promise<NewFeature | null> {
    const [rows] = await db.execute(
      'SELECT * FROM new_features WHERE id = ?',
      [id]
    );
    return (rows as NewFeature[])[0] || null;
  },

  async create(data: Omit<NewFeature, 'id' | 'created_at'>): Promise<NewFeature> {
    const [result] = await db.execute(
      'INSERT INTO new_features (name, description) VALUES (?, ?)',
      [data.name, data.description]
    );
    return this.getById((result as any).insertId);
  }
};
```

3. **Crear Controlador** (`src/controllers/newFeatureController.ts`)
```typescript
import { Request, Response } from 'express';
import { newFeatureService } from '../services/newFeatureService';

export const newFeatureController = {
  async getAll(req: Request, res: Response) {
    try {
      const features = await newFeatureService.getAll();
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const feature = await newFeatureService.getById(id);
      
      if (!feature) {
        return res.status(404).json({ error: 'Feature not found' });
      }
      
      res.json(feature);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
```

4. **Crear Rutas** (`src/routes/newFeatureRoutes.ts`)
```typescript
import { Router } from 'express';
import { newFeatureController } from '../controllers/newFeatureController';

const router = Router();

router.get('/', newFeatureController.getAll);
router.get('/:id', newFeatureController.getById);

export default router;
```

5. **Registrar Rutas** (`src/routes/index.ts`)
```typescript
import newFeatureRoutes from './newFeatureRoutes';

// ... existing code ...

app.use('/api/new-features', newFeatureRoutes);
```

## 🎯 Frontend Development

### Crear Nuevo Componente

1. **Definir Props y Tipos**
```typescript
// types/index.ts
export interface NewComponentProps {
  title: string;
  data: DataType[];
  onAction: (id: number) => void;
  loading?: boolean;
}
```

2. **Crear Componente**
```typescript
// components/NewComponent.tsx
import React from 'react';
import type { NewComponentProps } from '../types';

const NewComponent: React.FC<NewComponentProps> = ({
  title,
  data,
  onAction,
  loading = false
}) => {
  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {data.map(item => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <span>{item.name}</span>
            <button 
              onClick={() => onAction(item.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              Action
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewComponent;
```

3. **Crear Custom Hook** (si es necesario)
```typescript
// hooks/useNewFeature.ts
import { useState, useEffect } from 'react';
import { newFeatureApi } from '../services/api';

export const useNewFeature = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await newFeatureApi.getAll();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
```

### Integrar con Contexto Global

```typescript
// contexts/SensorContext.tsx
interface SensorContextType {
  // ... existing properties ...
  newFeatureData: NewFeature[];
  updateNewFeature: (id: number, data: Partial<NewFeature>) => Promise<void>;
}

export const SensorProvider: React.FC<SensorProviderProps> = ({ children }) => {
  // ... existing state ...
  const [newFeatureData, setNewFeatureData] = useState<NewFeature[]>([]);

  const updateNewFeature = useCallback(async (id: number, data: Partial<NewFeature>) => {
    try {
      const updated = await newFeatureApi.update(id, data);
      setNewFeatureData(prev => 
        prev.map(item => item.id === id ? updated : item)
      );
    } catch (error) {
      console.error('Error updating new feature:', error);
    }
  }, []);

  const value: SensorContextType = {
    // ... existing properties ...
    newFeatureData,
    updateNewFeature
  };

  return (
    <SensorContext.Provider value={value}>
      {children}
    </SensorContext.Provider>
  );
};
```

## 🧪 Testing

### Configurar Testing
```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Crear Test de Componente
```typescript
// components/__tests__/NewComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import NewComponent from '../NewComponent';

describe('NewComponent', () => {
  const mockData = [
    { id: 1, name: 'Test Item 1' },
    { id: 2, name: 'Test Item 2' }
  ];

  const mockOnAction = jest.fn();

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  it('renders title and data correctly', () => {
    render(
      <NewComponent 
        title="Test Title" 
        data={mockData} 
        onAction={mockOnAction} 
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    render(
      <NewComponent 
        title="Test Title" 
        data={mockData} 
        onAction={mockOnAction} 
      />
    );

    const buttons = screen.getAllByText('Action');
    fireEvent.click(buttons[0]);

    expect(mockOnAction).toHaveBeenCalledWith(1);
  });

  it('shows loading state', () => {
    render(
      <NewComponent 
        title="Test Title" 
        data={mockData} 
        onAction={mockOnAction} 
        loading={true}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

## 🔍 Debugging

### Backend Debugging
```typescript
// Agregar logs detallados
console.log('Request body:', req.body);
console.log('Query params:', req.query);
console.log('Database result:', result);

// Usar debugger en VS Code
debugger;
```

### Frontend Debugging
```typescript
// React DevTools
// Instalar extensión en VS Code

// Console logs
console.log('Component state:', state);
console.log('Props received:', props);

// React DevTools Profiler
// Para analizar rendimiento
```

### Database Debugging
```bash
# Conectar a SQLite
sqlite3 autoslot.db

# Ver tablas
.tables

# Ver estructura
.schema parking_lots

# Consultar datos
SELECT * FROM parking_lots;
```

## 🚀 Deployment

### Backend (Heroku)
```bash
# Crear Procfile
echo "web: npm start" > Procfile

# Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=your_database_url

# Deploy
git push heroku main
```

### Frontend (Vercel)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📚 Recursos Adicionales

### Documentación
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### Herramientas
- [Postman](https://www.postman.com/) - Testing de API
- [Insomnia](https://insomnia.rest/) - Cliente REST
- [SQLite Browser](https://sqlitebrowser.org/) - Gestor de BD

### Comunidad
- [Stack Overflow](https://stackoverflow.com/)
- [Reactiflux Discord](https://discord.gg/reactiflux)
- [TypeScript Community](https://github.com/microsoft/TypeScript) 