import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { ParkingLot } from '../types';

// Custom icon for parking lots
const lotIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LotMapProps {
  lots: ParkingLot[];
}

const LotMap = ({ lots }: LotMapProps) => {
  // A simple fix for when there are no lots to avoid crashing
  const hasLots = lots && lots.length > 0;
  
  if (!hasLots) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">No parking lots to display on the map.</p>
      </div>
    );
  }

  const defaultPosition: [number, number] = [lots[0].latitude, lots[0].longitude];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-96 relative z-0">
      <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {lots.map(lot => (
          <Marker 
            key={lot.id} 
            position={[lot.latitude, lot.longitude]}
            icon={lotIcon}
          >
            <Popup>
              <div className="font-sans">
                <h4 className="font-bold text-base mb-1">{lot.name}</h4>
                <p className="text-sm text-gray-700">{lot.address}</p>
                <p className="text-sm text-blue-600 font-semibold">
                  Parking Lot
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LotMap; 