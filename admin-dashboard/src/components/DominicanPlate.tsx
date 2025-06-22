import React from 'react';

interface DominicanPlateProps {
  plate: string;
}

const DominicanPlate: React.FC<DominicanPlateProps> = ({ plate }) => {
  const getPlateColors = (plateNumber: string) => {
    const prefix = plateNumber.match(/^[A-Z]+/)?.[0] || '';
    
    // Placas de transporte público o especiales (amarillas)
    if (['B', 'D', 'T', 'P', 'R', 'S'].includes(prefix)) {
      return 'bg-yellow-400 text-black';
    }
    
    // Placas de prueba o temporales (verdes)
    if (['X', 'DD'].includes(prefix)) {
      return 'bg-green-500 text-white';
    }
    
    // Placas diplomáticas, militares, etc. (azules)
    if (['VC', 'WD', 'OI', 'OE', 'OF', 'OM', 'OP'].includes(prefix)) {
        return 'bg-blue-600 text-white';
    }

    // Placas normales (blancas)
    return 'bg-white text-black';
  };

  const plateColors = getPlateColors(plate);
  const letterPart = plate.match(/^[A-Z]+/)?.[0] || '';
  const numberPart = plate.match(/\d+$/)?.[0] || '';

  return (
    <div 
      className={`w-28 h-14 rounded-md flex items-center justify-center font-mono font-bold border-2 border-gray-700 shadow-md transform-gpu transition-transform hover:scale-105 ${plateColors}`}
      style={{ boxShadow: 'inset 0 0 5px rgba(0,0,0,0.4)' }}
    >
      <div className="flex flex-col items-center">
        <span className="text-[10px] tracking-wider">REP. DOMINICANA</span>
        <div className="text-2xl tracking-widest">
            <span>{letterPart}</span>
            <span className="ml-1">{numberPart}</span>
        </div>
      </div>
    </div>
  );
};

export default DominicanPlate; 