import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Eye, DollarSign, Camera, Car } from 'lucide-react';

import LotsOverview from '../components/LotsOverview';
import PaymentDashboard from '../components/PaymentDashboard';
import LPRSimulator from '../components/LPRSimulator';
import { SensorSidebar } from '../components/SensorSidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import { SimulationProvider } from '../contexts/SimulationContext';
import UserProfile from '../components/UserProfile';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <SensorSidebar />
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AutoSlot Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your parking lots in real-time</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="p-6">
          {/* Main navigation tabs */}
          <div className="mb-6 flex space-x-2 border-b border-gray-200 dark:border-gray-700">
            <Button
              variant={activeSection === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('overview')}
              className="flex items-center space-x-2 dark:text-white"
            >
              <Eye className="w-4 h-4" />
              <span>Vista General</span>
            </Button>
            <Button
              variant={activeSection === 'payments' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('payments')}
              className="flex items-center space-x-2 dark:text-white"
            >
              <DollarSign className="w-4 h-4" />
              <span>Pagos & Facturación</span>
            </Button>
            <Button
              variant={activeSection === 'lpr' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('lpr')}
              className="flex items-center space-x-2 dark:text-white"
            >
              <Camera className="w-4 h-4" />
              <span>Reconocimiento LPR</span>
            </Button>
          </div>

          <SimulationProvider>
            {activeSection === 'overview' && (
              <LotsOverview />
            )}

            {activeSection === 'payments' && (
              <PaymentDashboard />
            )}

            {activeSection === 'lpr' && (
              <LPRSimulator />
            )}
          </SimulationProvider>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;