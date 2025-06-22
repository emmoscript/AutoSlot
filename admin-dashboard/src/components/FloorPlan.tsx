import React from 'react';
import type { ParkingSpace } from '../types';

interface FloorPlanProps {
  spaces: ParkingSpace[];
  level: number;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ spaces, level }) => {
  const levelSpaces = spaces.filter(s => s.level === level);

  if (levelSpaces.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-8">No spaces found for this level.</div>;
  }

  // Organizar espacios en una cuadrícula
  const gridSpaces = levelSpaces.sort((a, b) => {
    // Extraer números de los nombres (A1, B2, etc.)
    const aMatch = a.name.match(/([A-Z])(\d+)/);
    const bMatch = b.name.match(/([A-Z])(\d+)/);
    
    if (aMatch && bMatch) {
      const aLetter = aMatch[1];
      const aNumber = parseInt(aMatch[2]);
      const bLetter = bMatch[1];
      const bNumber = parseInt(bMatch[2]);
      
      if (aLetter === bLetter) {
        return aNumber - bNumber;
      }
      return aLetter.localeCompare(bLetter);
    }
    
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Level {level} - {levelSpaces.length} Spaces
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Occupied</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-300">
        <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
          {gridSpaces.map((space) => (
            <div
              key={space.id}
              className={`
                aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200
                ${space.is_available 
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50' 
                  : 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                }
              `}
              title={`${space.name} - ${space.is_available ? 'Available' : 'Occupied'}`}
            >
              {space.name}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Click on any space to see details
      </div>
    </div>
  );
};

export default FloorPlan; 