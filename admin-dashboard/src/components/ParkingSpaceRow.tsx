import React from 'react';
import { Edit, MapPin } from 'lucide-react';
import type { ParkingSpace } from '../types';

interface ParkingSpaceRowProps {
  parkingSpace: ParkingSpace;
  onToggleAvailability: (id: number, newState: boolean) => void;
  onEdit: (space: ParkingSpace) => void;
}

export const ParkingSpaceRow: React.FC<ParkingSpaceRowProps> = ({
  parkingSpace,
  onToggleAvailability,
  onEdit
}) => {
  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'economy':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900">
            {parkingSpace.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(parkingSpace.is_available)}`}>
          {parkingSpace.is_available ? 'Available' : 'Occupied'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getZoneColor(parkingSpace.zone_type)}`}>
          {parkingSpace.zone_type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        RD$ {parkingSpace.current_price}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(parkingSpace.updated_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onToggleAvailability(parkingSpace.id, !parkingSpace.is_available)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              parkingSpace.is_available
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {parkingSpace.is_available ? 'Mark Occupied' : 'Mark Available'}
          </button>
          <button
            onClick={() => onEdit(parkingSpace)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}; 