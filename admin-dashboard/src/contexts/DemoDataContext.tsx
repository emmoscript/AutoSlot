import React, { createContext, useContext, useState } from 'react';

// Simulated parking lots data
const demoParkingLots = [
  {
    id: 1,
    name: "Acrópolis Center",
    address: "Av. Winston Churchill, Santo Domingo",
    latitude: 18.469696652249976,
    longitude: -69.93889928441415,
    total_spaces: 30,
    available_spaces: 15,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Blue Mall",
    address: "Av. Winston Churchill 95, Santo Domingo",
    latitude: 18.472753961844596,
    longitude: -69.94094768697278,
    total_spaces: 36,
    available_spaces: 20,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Galería 360",
    address: "Av. John F. Kennedy, Santo Domingo",
    latitude: 18.485148365348184,
    longitude: -69.93605272780678,
    total_spaces: 32,
    available_spaces: 18,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 4,
    name: "Sambil Santo Domingo",
    address: "Av. John F. Kennedy, Santo Domingo",
    latitude: 18.4723,
    longitude: -69.9345,
    total_spaces: 40,
    available_spaces: 25,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 5,
    name: "Bella Vista Mall",
    address: "Av. Sarasota, Santo Domingo",
    latitude: 18.452880237461944,
    longitude: -69.94232660823761,
    total_spaces: 20,
    available_spaces: 12,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  }
];

// Simulated parking spaces data
const demoParkingSpaces = [
  // Acrópolis Center spaces
  { id: 1, lot_id: 1, name: "A1", level: 1, is_available: true, base_price: 150, zone_type: "premium" },
  { id: 2, lot_id: 1, name: "A2", level: 1, is_available: false, base_price: 150, zone_type: "premium" },
  { id: 3, lot_id: 1, name: "A3", level: 1, is_available: true, base_price: 150, zone_type: "premium" },
  { id: 4, lot_id: 1, name: "B1", level: 1, is_available: true, base_price: 100, zone_type: "standard" },
  { id: 5, lot_id: 1, name: "B2", level: 1, is_available: true, base_price: 100, zone_type: "standard" },
  { id: 6, lot_id: 1, name: "C1", level: 1, is_available: true, base_price: 75, zone_type: "economy" },
  { id: 7, lot_id: 1, name: "C2", level: 1, is_available: false, base_price: 75, zone_type: "economy" },
  
  // Blue Mall spaces
  { id: 8, lot_id: 2, name: "P1", level: 1, is_available: true, base_price: 160, zone_type: "premium" },
  { id: 9, lot_id: 2, name: "P2", level: 1, is_available: false, base_price: 160, zone_type: "premium" },
  { id: 10, lot_id: 2, name: "P3", level: 1, is_available: true, base_price: 160, zone_type: "premium" },
  { id: 11, lot_id: 2, name: "S1", level: 1, is_available: true, base_price: 110, zone_type: "standard" },
  { id: 12, lot_id: 2, name: "S2", level: 1, is_available: true, base_price: 110, zone_type: "standard" },
  { id: 13, lot_id: 2, name: "E1", level: 1, is_available: true, base_price: 80, zone_type: "economy" },
  { id: 14, lot_id: 2, name: "E2", level: 1, is_available: false, base_price: 80, zone_type: "economy" },
  
  // Galería 360 spaces
  { id: 15, lot_id: 3, name: "A1", level: 1, is_available: true, base_price: 145, zone_type: "premium" },
  { id: 16, lot_id: 3, name: "A2", level: 1, is_available: false, base_price: 145, zone_type: "premium" },
  { id: 17, lot_id: 3, name: "A3", level: 1, is_available: true, base_price: 145, zone_type: "premium" },
  { id: 18, lot_id: 3, name: "B1", level: 1, is_available: true, base_price: 98, zone_type: "standard" },
  { id: 19, lot_id: 3, name: "B2", level: 1, is_available: true, base_price: 98, zone_type: "standard" },
  { id: 20, lot_id: 3, name: "C1", level: 1, is_available: true, base_price: 72, zone_type: "economy" },
  { id: 21, lot_id: 3, name: "C2", level: 1, is_available: false, base_price: 72, zone_type: "economy" },
  
  // Sambil Santo Domingo spaces
  { id: 22, lot_id: 4, name: "P1", level: 1, is_available: true, base_price: 155, zone_type: "premium" },
  { id: 23, lot_id: 4, name: "P2", level: 1, is_available: false, base_price: 155, zone_type: "premium" },
  { id: 24, lot_id: 4, name: "P3", level: 1, is_available: true, base_price: 155, zone_type: "premium" },
  { id: 25, lot_id: 4, name: "S1", level: 1, is_available: true, base_price: 105, zone_type: "standard" },
  { id: 26, lot_id: 4, name: "S2", level: 1, is_available: true, base_price: 105, zone_type: "standard" },
  { id: 27, lot_id: 4, name: "E1", level: 1, is_available: true, base_price: 78, zone_type: "economy" },
  { id: 28, lot_id: 4, name: "E2", level: 1, is_available: false, base_price: 78, zone_type: "economy" },
  
  // Bella Vista Mall spaces
  { id: 29, lot_id: 5, name: "BV1-01", level: 1, is_available: true, base_price: 55, zone_type: "premium" },
  { id: 30, lot_id: 5, name: "BV1-02", level: 1, is_available: true, base_price: 55, zone_type: "premium" },
  { id: 31, lot_id: 5, name: "BV1-03", level: 1, is_available: false, base_price: 55, zone_type: "premium" },
  { id: 32, lot_id: 5, name: "BV2-01", level: 2, is_available: true, base_price: 45, zone_type: "standard" },
  { id: 33, lot_id: 5, name: "BV2-02", level: 2, is_available: true, base_price: 45, zone_type: "standard" },
  { id: 34, lot_id: 5, name: "BV2-03", level: 2, is_available: false, base_price: 45, zone_type: "standard" }
];

// Simulated reservations data
const demoReservations = [
  {
    id: 1,
    user_id: 1,
    space_id: 2,
    lot_id: 1,
    start_time: "2024-08-15T10:00:00.000Z",
    end_time: "2024-08-15T12:00:00.000Z",
    status: "active",
    total_price: 300,
    created_at: "2024-08-15T09:30:00.000Z"
  },
  {
    id: 2,
    user_id: 2,
    space_id: 9,
    lot_id: 2,
    start_time: "2024-08-15T14:00:00.000Z",
    end_time: "2024-08-15T16:00:00.000Z",
    status: "active",
    total_price: 320,
    created_at: "2024-08-15T13:30:00.000Z"
  },
  {
    id: 3,
    user_id: 3,
    space_id: 16,
    lot_id: 3,
    start_time: "2024-08-15T11:00:00.000Z",
    end_time: "2024-08-15T13:00:00.000Z",
    status: "active",
    total_price: 290,
    created_at: "2024-08-15T10:30:00.000Z"
  }
];

interface DemoDataContextType {
  parkingLots: typeof demoParkingLots;
  parkingSpaces: typeof demoParkingSpaces;
  reservations: typeof demoReservations;
  getParkingLots: () => Promise<typeof demoParkingLots>;
  getParkingSpaces: (lotId?: number) => Promise<typeof demoParkingSpaces>;
  getReservations: () => Promise<typeof demoReservations>;
  updateSpaceAvailability: (spaceId: number, isAvailable: boolean) => void;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

interface DemoDataProviderProps {
  children: React.ReactNode;
}

export const DemoDataProvider: React.FC<DemoDataProviderProps> = ({ children }) => {
  const [parkingLots, setParkingLots] = useState(demoParkingLots);
  const [parkingSpaces, setParkingSpaces] = useState(demoParkingSpaces);
  const [reservations, setReservations] = useState(demoReservations);

  const getParkingLots = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return parkingLots;
  };

  const getParkingSpaces = async (lotId?: number) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    if (lotId) {
      return parkingSpaces.filter(space => space.lot_id === lotId);
    }
    return parkingSpaces;
  };

  const getReservations = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return reservations;
  };

  const updateSpaceAvailability = (spaceId: number, isAvailable: boolean) => {
    setParkingSpaces(prev => 
      prev.map(space => 
        space.id === spaceId 
          ? { ...space, is_available: isAvailable }
          : space
      )
    );
  };

  const value: DemoDataContextType = {
    parkingLots,
    parkingSpaces,
    reservations,
    getParkingLots,
    getParkingSpaces,
    getReservations,
    updateSpaceAvailability
  };

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
};

export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (context === undefined) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
};
