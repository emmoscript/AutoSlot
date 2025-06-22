import React, { useState } from 'react';
import { Car, Play, Pause, RotateCcw, Zap, X, Settings, SlidersHorizontal, ToggleLeft, ToggleRight, Touchpad } from 'lucide-react';
import { useSensorContext } from '../contexts/SensorContext';
import type { ParkingSpace } from '../types';

export const SensorSidebar: React.FC = () => {
  const { 
    lots, 
    loading, 
    isAutoMode, 
    simulateSensorEvent, 
    startAutoMode, 
    stopAutoMode, 
    resetAllSpaces 
  } = useSensorContext();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [isManualMode, setIsManualMode] = useState(true);
  
  const [simulationConfig, setSimulationConfig] = useState({
    intervalSeconds: 5,
    eventsPerInterval: 1,
    lotId: null as number | null,
  });

  const handleStartAutoMode = () => {
    setIsManualMode(false);
    startAutoMode(
      simulationConfig.intervalSeconds, 
      simulationConfig.eventsPerInterval,
      simulationConfig.lotId
    );
  };
  
  const handleStopAutoMode = () => {
    stopAutoMode();
    setIsManualMode(true);
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSimulationConfig(prev => ({ 
      ...prev, 
      [name]: name === 'lotId' ? (value ? Number(value) : null) : Number(value) 
    }));
  };

  const handleSpaceClick = (space: ParkingSpace) => {
    if (isManualMode) {
      setSelectedSpace(space);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        title="Open Sensor Simulator"
      >
        <Settings className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-start">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-96 max-w-full bg-white dark:bg-gray-800 shadow-2xl overflow-hidden transition-all duration-300 flex flex-col">
            <div className="bg-gray-800 dark:bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                <h3 className="text-lg font-semibold">Sensor Simulator</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
         {loading ? (
                <div className="p-6 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">Simulation Mode</h4>
                      <button onClick={() => setIsManualMode(!isManualMode)} className="flex items-center space-x-2 text-sm">
                        <span className={`${!isManualMode ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}>Auto</span>
                        {isManualMode ? <ToggleLeft className="w-10 h-10 text-gray-400" /> : <ToggleRight className="w-10 h-10 text-blue-500" />}
                        <span className={`${isManualMode ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}>Manual</span>
                      </button>
                    </div>

                    {!isManualMode && (
                      <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200">Auto Controls</h5>
                          <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                          >
                            <SlidersHorizontal className={`w-5 h-5 transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} />
                          </button>
                        </div>
                        {showSettings && (
                          <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Target Lot
                              </label>
                              <select
                                name="lotId"
                                value={simulationConfig.lotId || ''}
                                onChange={handleConfigChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              >
                                <option value="">All Lots</option>
                                {lots.map(lot => (
                                  <option key={lot.id} value={lot.id}>{lot.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Simulation Speed
                              </label>
                              <input
                                type="range" name="intervalSeconds" min="1" max="10"
                                value={simulationConfig.intervalSeconds} onChange={handleConfigChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                              />
                              <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                Every {simulationConfig.intervalSeconds}s
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Events per Interval
                              </label>
                              <input
                                type="range" name="eventsPerInterval" min="1" max="5"
                                value={simulationConfig.eventsPerInterval} onChange={handleConfigChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                              />
                               <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                {simulationConfig.eventsPerInterval} event(s)
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={isAutoMode ? handleStopAutoMode : handleStartAutoMode}
                            className={`w-full flex-1 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors duration-200 ${
                              isAutoMode 
                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            {isAutoMode ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                            {isAutoMode ? 'Stop Auto' : 'Start Auto'}
                          </button>
                          <button
                            onClick={resetAllSpaces}
                            title="Set all spaces to available"
                            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3 transition-opacity ${!isManualMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                     <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                       <Touchpad className="w-4 h-4 mr-2" />
                       Manual Simulation
                     </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[50vh] overflow-y-auto pt-2">
                        {lots.flatMap(lot => lot.spaces).map(space => (
                          <div
                            key={space.id}
                            className={`p-2 rounded-md text-center text-xs font-medium cursor-pointer transition-all duration-200 ${
                              space.is_available 
                                ? 'bg-green-100 dark:bg-green-800/60 text-green-800 dark:text-green-200 hover:ring-2 hover:ring-green-400' 
                                : 'bg-red-100 dark:bg-red-800/60 text-red-800 dark:text-red-200 hover:ring-2 hover:ring-red-400'
                            }`}
                            onClick={() => handleSpaceClick(space)}
                            title={`Simulate for ${space.name}`}
                          >
                            <div className="font-bold">{space.name}</div>
                            <div className="text-xs opacity-75">{lots.find(l => l.id === space.lot_id)?.name.substring(0,3)} L{space.level}</div>
                          </div>
                        ))}
                      </div>
                   </div>
                </>
         )}
            </div>
          </div>
        </div>
      )}

      {selectedSpace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm mx-4 transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Simulate for <span className="text-blue-500">{selectedSpace.name}</span>
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: <span className={`font-medium ${selectedSpace.is_available ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedSpace.is_available ? 'Available' : 'Occupied'}
                </span>
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  simulateSensorEvent(selectedSpace.id, 'vehicle_entered');
                  setSelectedSpace(null);
                }}
                disabled={!selectedSpace.is_available}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center transition-colors duration-200"
              >
                <Car className="w-4 h-4 mr-2" />
                Vehicle Enters
              </button>
              <button
                onClick={() => {
                  simulateSensorEvent(selectedSpace.id, 'vehicle_exited');
                  setSelectedSpace(null);
                }}
                disabled={selectedSpace.is_available}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center transition-colors duration-200"
              >
                <Car className="w-4 h-4 mr-2" />
                Vehicle Exits
              </button>
            </div>
            
            <button
              onClick={() => setSelectedSpace(null)}
              className="w-full mt-4 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 