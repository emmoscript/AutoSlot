import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FloorPlan from '../components/FloorPlan';
import SpaceDetailTable from '../components/SpaceDetailTable';
import { useSensorContext } from '../contexts/SensorContext';

const LotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { lots, loading, lastEventLocation } = useSensorContext();
  
  const lotId = id ? parseInt(id, 10) : null;

  const lot = useMemo(() => {
    if (!lotId || !lots.length) return null;
    return lots.find(l => l.id === lotId) || null;
  }, [lotId, lots]);

  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  // Efecto para establecer el nivel inicial o cuando el lote cambia
  useEffect(() => {
    if (lot?.spaces && lot.spaces.length > 0 && activeLevel === null) {
      const firstLevel = Math.min(...lot.spaces.map(s => s.level));
      setActiveLevel(firstLevel);
    }
  }, [lot, activeLevel]);

  // Efecto para cambiar al nivel del último evento
  useEffect(() => {
    if (lastEventLocation && lastEventLocation.lotId === lotId) {
      setActiveLevel(lastEventLocation.level);
    }
  }, [lastEventLocation, lotId]);

  const levels = useMemo(() => {
    if (!lot?.spaces) return [];
    const uniqueLevels = [...new Set(lot.spaces.map(s => s.level))];
    return uniqueLevels.sort((a, b) => a - b);
  }, [lot]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Parking Lot Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The lot you are looking for does not exist or could not be loaded.</p>
        <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-8">
        <Link to="/" className="inline-flex items-center mb-6 text-blue-600 hover:underline dark:text-blue-400">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Lots
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{lot.name}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">{lot.address}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Floor Plan</h2>
          
          {levels.length > 0 ? (
            <>
              <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setActiveLevel(level)}
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                        ${activeLevel === level
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}
                      `}
                    >
                      Level {level}
                    </button>
                  ))}
                </nav>
              </div>
              
              {activeLevel !== null && lot.spaces && (
                <FloorPlan spaces={lot.spaces} level={activeLevel} />
              )}
            </>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-500 py-8">This lot has no spaces configured yet.</p>
          )}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Spaces Details</h2>
            {lot.spaces && <SpaceDetailTable spaces={lot.spaces} />}
        </div>
      </div>
    </div>
  );
};

export default LotDetail; 