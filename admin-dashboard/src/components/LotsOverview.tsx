import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Car, Eye } from 'lucide-react';
import { Button } from './ui/button';
import LotMap from './LotMap';
import AddLotModal from './AddLotModal';
import { useSensorContext } from '../contexts/SensorContext';
import { parkingLotApi } from '../services/api';
import type { ParkingLot, ParkingLotWithSpaces } from '../types';
import toast from 'react-hot-toast';

const LotsOverview: React.FC = () => {
  const { lots, loading, refreshLots } = useSensorContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddLot = async (lotData: Omit<ParkingLot, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await parkingLotApi.create(lotData);
      await refreshLots();
      setIsAddModalOpen(false);
      toast.success('Parking lot created successfully!');
    } catch (error) {
      console.error('Error creating lot:', error);
      toast.error('Failed to create parking lot');
    }
  };

  const getTotalSpaces = (lot: ParkingLotWithSpaces) => {
    return lot.spaces?.length || 0;
  };

  const getAvailableSpaces = (lot: ParkingLotWithSpaces) => {
    return lot.spaces?.filter((space) => space.is_available).length || 0;
  };

  const getOccupancyRate = (lot: ParkingLotWithSpaces) => {
    const total = getTotalSpaces(lot);
    if (total === 0) return 0;
    const occupied = total - getAvailableSpaces(lot);
    return Math.round((occupied / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Parking Lots Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor your parking lots</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lot</span>
        </Button>
      </div>

      {/* Map Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Parking Lots Map
        </h3>
        <LotMap lots={lots} />
      </div>

      {/* Lots Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Parking Lots</h3>
        </div>
        
        {lots.length === 0 ? (
          <div className="p-8 text-center">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No parking lots yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first parking lot</p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Lot
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lot Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Spaces
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Occupancy Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {lots.map((lot) => (
                  <tr key={lot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{lot.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">{lot.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{getTotalSpaces(lot)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{getAvailableSpaces(lot)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getOccupancyRate(lot)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{getOccupancyRate(lot)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/lot/${lot.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lot Modal */}
      <AddLotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddLot}
      />
    </div>
  );
};

export default LotsOverview; 