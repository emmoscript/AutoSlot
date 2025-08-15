import bcrypt from 'bcryptjs';
import { Database } from 'sqlite3';

interface SeedLot {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  levels: {
    level: number;
    spaces: {
      name: string;
      zone_type: 'premium' | 'standard' | 'economy';
      base_price: number;
      is_available: boolean;
    }[];
  }[];
}

const seedData: SeedLot[] = [
  {
    name: "Acrópolis Center",
    address: "Av. Winston Churchill, Santo Domingo",
    latitude: 18.469696652249976,
    longitude: -69.93889928441415,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "A1", zone_type: "premium", base_price: 150, is_available: true },
          { name: "A2", zone_type: "premium", base_price: 150, is_available: false },
          { name: "A3", zone_type: "premium", base_price: 150, is_available: true },
          { name: "A4", zone_type: "premium", base_price: 150, is_available: true },
          { name: "A5", zone_type: "premium", base_price: 150, is_available: false },
          { name: "B1", zone_type: "standard", base_price: 100, is_available: true },
          { name: "B2", zone_type: "standard", base_price: 100, is_available: true },
          { name: "B3", zone_type: "standard", base_price: 100, is_available: false },
          { name: "B4", zone_type: "standard", base_price: 100, is_available: true },
          { name: "B5", zone_type: "standard", base_price: 100, is_available: true },
          { name: "C1", zone_type: "economy", base_price: 75, is_available: true },
          { name: "C2", zone_type: "economy", base_price: 75, is_available: true },
          { name: "C3", zone_type: "economy", base_price: 75, is_available: false },
          { name: "C4", zone_type: "economy", base_price: 75, is_available: true },
          { name: "C5", zone_type: "economy", base_price: 75, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "A1", zone_type: "premium", base_price: 140, is_available: true },
          { name: "A2", zone_type: "premium", base_price: 140, is_available: true },
          { name: "A3", zone_type: "premium", base_price: 140, is_available: false },
          { name: "A4", zone_type: "premium", base_price: 140, is_available: true },
          { name: "A5", zone_type: "premium", base_price: 140, is_available: true },
          { name: "B1", zone_type: "standard", base_price: 95, is_available: true },
          { name: "B2", zone_type: "standard", base_price: 95, is_available: false },
          { name: "B3", zone_type: "standard", base_price: 95, is_available: true },
          { name: "B4", zone_type: "standard", base_price: 95, is_available: true },
          { name: "B5", zone_type: "standard", base_price: 95, is_available: false },
          { name: "C1", zone_type: "economy", base_price: 70, is_available: true },
          { name: "C2", zone_type: "economy", base_price: 70, is_available: true },
          { name: "C3", zone_type: "economy", base_price: 70, is_available: true },
          { name: "C4", zone_type: "economy", base_price: 70, is_available: false },
          { name: "C5", zone_type: "economy", base_price: 70, is_available: true },
        ]
      }
    ]
  },
  {
    name: "Blue Mall",
    address: "Av. Winston Churchill 95, Santo Domingo",
    latitude: 18.472753961844596,
    longitude: -69.94094768697278,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 160, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 160, is_available: false },
          { name: "P3", zone_type: "premium", base_price: 160, is_available: true },
          { name: "P4", zone_type: "premium", base_price: 160, is_available: true },
          { name: "P5", zone_type: "premium", base_price: 160, is_available: false },
          { name: "P6", zone_type: "premium", base_price: 160, is_available: true },
          { name: "S1", zone_type: "standard", base_price: 110, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 110, is_available: true },
          { name: "S3", zone_type: "standard", base_price: 110, is_available: false },
          { name: "S4", zone_type: "standard", base_price: 110, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 110, is_available: true },
          { name: "S6", zone_type: "standard", base_price: 110, is_available: false },
          { name: "E1", zone_type: "economy", base_price: 80, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 80, is_available: true },
          { name: "E3", zone_type: "economy", base_price: 80, is_available: true },
          { name: "E4", zone_type: "economy", base_price: 80, is_available: false },
          { name: "E5", zone_type: "economy", base_price: 80, is_available: true },
          { name: "E6", zone_type: "economy", base_price: 80, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 150, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 150, is_available: true },
          { name: "P3", zone_type: "premium", base_price: 150, is_available: false },
          { name: "P4", zone_type: "premium", base_price: 150, is_available: true },
          { name: "P5", zone_type: "premium", base_price: 150, is_available: true },
          { name: "P6", zone_type: "premium", base_price: 150, is_available: false },
          { name: "S1", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S3", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S4", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S6", zone_type: "standard", base_price: 105, is_available: true },
          { name: "E1", zone_type: "economy", base_price: 75, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 75, is_available: true },
          { name: "E3", zone_type: "economy", base_price: 75, is_available: false },
          { name: "E4", zone_type: "economy", base_price: 75, is_available: true },
          { name: "E5", zone_type: "economy", base_price: 75, is_available: true },
          { name: "E6", zone_type: "economy", base_price: 75, is_available: false },
        ]
      },
      {
        level: 3,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 140, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 140, is_available: true },
          { name: "P3", zone_type: "premium", base_price: 140, is_available: true },
          { name: "P4", zone_type: "premium", base_price: 140, is_available: false },
          { name: "P5", zone_type: "premium", base_price: 140, is_available: true },
          { name: "P6", zone_type: "premium", base_price: 140, is_available: true },
          { name: "S1", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S3", zone_type: "standard", base_price: 100, is_available: false },
          { name: "S4", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S6", zone_type: "standard", base_price: 100, is_available: false },
          { name: "E1", zone_type: "economy", base_price: 70, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 70, is_available: false },
          { name: "E3", zone_type: "economy", base_price: 70, is_available: true },
          { name: "E4", zone_type: "economy", base_price: 70, is_available: true },
          { name: "E5", zone_type: "economy", base_price: 70, is_available: false },
          { name: "E6", zone_type: "economy", base_price: 70, is_available: true },
        ]
      }
    ]
  },
  {
    name: "Galería 360",
    address: "Av. John F. Kennedy, Santo Domingo",
    latitude: 18.485148365348184,
    longitude: -69.93605272780678,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "A1", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A2", zone_type: "premium", base_price: 145, is_available: false },
          { name: "A3", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A4", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A5", zone_type: "premium", base_price: 145, is_available: false },
          { name: "A6", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A7", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A8", zone_type: "premium", base_price: 145, is_available: false },
          { name: "B1", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B2", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B3", zone_type: "standard", base_price: 98, is_available: false },
          { name: "B4", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B5", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B6", zone_type: "standard", base_price: 98, is_available: false },
          { name: "B7", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B8", zone_type: "standard", base_price: 98, is_available: true },
          { name: "C1", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C2", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C3", zone_type: "economy", base_price: 72, is_available: false },
          { name: "C4", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C5", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C6", zone_type: "economy", base_price: 72, is_available: false },
          { name: "C7", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C8", zone_type: "economy", base_price: 72, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "A1", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A2", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A3", zone_type: "premium", base_price: 135, is_available: false },
          { name: "A4", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A5", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A6", zone_type: "premium", base_price: 135, is_available: false },
          { name: "A7", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A8", zone_type: "premium", base_price: 135, is_available: true },
          { name: "B1", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B2", zone_type: "standard", base_price: 92, is_available: false },
          { name: "B3", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B4", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B5", zone_type: "standard", base_price: 92, is_available: false },
          { name: "B6", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B7", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B8", zone_type: "standard", base_price: 92, is_available: false },
          { name: "C1", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C2", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C3", zone_type: "economy", base_price: 68, is_available: false },
          { name: "C4", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C5", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C6", zone_type: "economy", base_price: 68, is_available: false },
          { name: "C7", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C8", zone_type: "economy", base_price: 68, is_available: true },
        ]
      }
    ]
  },
  {
    name: "Sambil Santo Domingo",
    address: "Av. John F. Kennedy, Santo Domingo",
    latitude: 18.4723,
    longitude: -69.9345,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 155, is_available: false },
          { name: "P3", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P4", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P5", zone_type: "premium", base_price: 155, is_available: false },
          { name: "P6", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P7", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P8", zone_type: "premium", base_price: 155, is_available: false },
          { name: "P9", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P10", zone_type: "premium", base_price: 155, is_available: true },
          { name: "S1", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S3", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S4", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S6", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S7", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S8", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S9", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S10", zone_type: "standard", base_price: 105, is_available: true },
          { name: "E1", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E3", zone_type: "economy", base_price: 78, is_available: false },
          { name: "E4", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E5", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E6", zone_type: "economy", base_price: 78, is_available: false },
          { name: "E7", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E8", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E9", zone_type: "economy", base_price: 78, is_available: false },
          { name: "E10", zone_type: "economy", base_price: 78, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P3", zone_type: "premium", base_price: 145, is_available: false },
          { name: "P4", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P5", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P6", zone_type: "premium", base_price: 145, is_available: false },
          { name: "P7", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P8", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P9", zone_type: "premium", base_price: 145, is_available: false },
          { name: "P10", zone_type: "premium", base_price: 145, is_available: true },
          { name: "S1", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 100, is_available: false },
          { name: "S3", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S4", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 100, is_available: false },
          { name: "S6", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S7", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S8", zone_type: "standard", base_price: 100, is_available: false },
          { name: "S9", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S10", zone_type: "standard", base_price: 100, is_available: true },
          { name: "E1", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 73, is_available: false },
          { name: "E3", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E4", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E5", zone_type: "economy", base_price: 73, is_available: false },
          { name: "E6", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E7", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E8", zone_type: "economy", base_price: 73, is_available: false },
          { name: "E9", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E10", zone_type: "economy", base_price: 73, is_available: true },
        ]
      }
    ]
  },
  {
    name: "Sambil",
    address: "Av. John F. Kennedy, Santo Domingo",
    latitude: 18.482132299972495,
    longitude: -69.91160917434281,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "S1-01", zone_type: "premium", base_price: 60, is_available: true },
          { name: "S1-02", zone_type: "premium", base_price: 60, is_available: false },
          { name: "S1-03", zone_type: "premium", base_price: 60, is_available: true },
          { name: "S1-04", zone_type: "premium", base_price: 60, is_available: true },
          { name: "S1-05", zone_type: "premium", base_price: 60, is_available: false },
          { name: "S1-06", zone_type: "premium", base_price: 60, is_available: true },
          { name: "S1-07", zone_type: "premium", base_price: 60, is_available: true },
          { name: "S1-08", zone_type: "premium", base_price: 60, is_available: true },
          { name: "S1-09", zone_type: "premium", base_price: 60, is_available: false },
          { name: "S1-10", zone_type: "premium", base_price: 60, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "S2-01", zone_type: "standard", base_price: 50, is_available: true },
          { name: "S2-02", zone_type: "standard", base_price: 50, is_available: true },
          { name: "S2-03", zone_type: "standard", base_price: 50, is_available: false },
          { name: "S2-04", zone_type: "standard", base_price: 50, is_available: true },
          { name: "S2-05", zone_type: "standard", base_price: 50, is_available: true },
          { name: "S2-06", zone_type: "standard", base_price: 50, is_available: true },
          { name: "S2-07", zone_type: "standard", base_price: 50, is_available: false },
          { name: "S2-08", zone_type: "standard", base_price: 50, is_available: true },
          { name: "S2-09", zone_type: "standard", base_price: 50, is_available: true },
          { name: "S2-10", zone_type: "standard", base_price: 50, is_available: true },
        ]
      },
      {
        level: 3,
        spaces: [
          { name: "S3-01", zone_type: "economy", base_price: 40, is_available: true },
          { name: "S3-02", zone_type: "economy", base_price: 40, is_available: true },
          { name: "S3-03", zone_type: "economy", base_price: 40, is_available: false },
          { name: "S3-04", zone_type: "economy", base_price: 40, is_available: true },
          { name: "S3-05", zone_type: "economy", base_price: 40, is_available: true },
          { name: "S3-06", zone_type: "economy", base_price: 40, is_available: true },
          { name: "S3-07", zone_type: "economy", base_price: 40, is_available: true },
          { name: "S3-08", zone_type: "economy", base_price: 40, is_available: false },
          { name: "S3-09", zone_type: "economy", base_price: 40, is_available: true },
          { name: "S3-10", zone_type: "economy", base_price: 40, is_available: true },
        ]
      }
    ]
  },
  {
    name: "Bella Vista Mall",
    address: "Av. Sarasota, Santo Domingo",
    latitude: 18.452880237461944,
    longitude: -69.94232660823761,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "BV1-01", zone_type: "premium", base_price: 55, is_available: true },
          { name: "BV1-02", zone_type: "premium", base_price: 55, is_available: true },
          { name: "BV1-03", zone_type: "premium", base_price: 55, is_available: false },
          { name: "BV1-04", zone_type: "premium", base_price: 55, is_available: true },
          { name: "BV1-05", zone_type: "premium", base_price: 55, is_available: true },
          { name: "BV1-06", zone_type: "premium", base_price: 55, is_available: true },
          { name: "BV1-07", zone_type: "premium", base_price: 55, is_available: false },
          { name: "BV1-08", zone_type: "premium", base_price: 55, is_available: true },
          { name: "BV1-09", zone_type: "premium", base_price: 55, is_available: true },
          { name: "BV1-10", zone_type: "premium", base_price: 55, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "BV2-01", zone_type: "standard", base_price: 45, is_available: true },
          { name: "BV2-02", zone_type: "standard", base_price: 45, is_available: false },
          { name: "BV2-03", zone_type: "standard", base_price: 45, is_available: true },
          { name: "BV2-04", zone_type: "standard", base_price: 45, is_available: true },
          { name: "BV2-05", zone_type: "standard", base_price: 45, is_available: true },
          { name: "BV2-06", zone_type: "standard", base_price: 45, is_available: true },
          { name: "BV2-07", zone_type: "standard", base_price: 45, is_available: true },
          { name: "BV2-08", zone_type: "standard", base_price: 45, is_available: false },
          { name: "BV2-09", zone_type: "standard", base_price: 45, is_available: true },
          { name: "BV2-10", zone_type: "standard", base_price: 45, is_available: true },
        ]
      }
    ]
  },
  {
    name: "Megacentro",
    address: "Av. John F. Kennedy, Santo Domingo",
    latitude: 18.506081733463038,
    longitude: -69.85654929563906,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "MC1-01", zone_type: "premium", base_price: 50, is_available: true },
          { name: "MC1-02", zone_type: "premium", base_price: 50, is_available: true },
          { name: "MC1-03", zone_type: "premium", base_price: 50, is_available: true },
          { name: "MC1-04", zone_type: "premium", base_price: 50, is_available: false },
          { name: "MC1-05", zone_type: "premium", base_price: 50, is_available: true },
          { name: "MC1-06", zone_type: "premium", base_price: 50, is_available: true },
          { name: "MC1-07", zone_type: "premium", base_price: 50, is_available: true },
          { name: "MC1-08", zone_type: "premium", base_price: 50, is_available: true },
          { name: "MC1-09", zone_type: "premium", base_price: 50, is_available: false },
          { name: "MC1-10", zone_type: "premium", base_price: 50, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "MC2-01", zone_type: "standard", base_price: 40, is_available: true },
          { name: "MC2-02", zone_type: "standard", base_price: 40, is_available: true },
          { name: "MC2-03", zone_type: "standard", base_price: 40, is_available: false },
          { name: "MC2-04", zone_type: "standard", base_price: 40, is_available: true },
          { name: "MC2-05", zone_type: "standard", base_price: 40, is_available: true },
          { name: "MC2-06", zone_type: "standard", base_price: 40, is_available: true },
          { name: "MC2-07", zone_type: "standard", base_price: 40, is_available: true },
          { name: "MC2-08", zone_type: "standard", base_price: 40, is_available: false },
          { name: "MC2-09", zone_type: "standard", base_price: 40, is_available: true },
          { name: "MC2-10", zone_type: "standard", base_price: 40, is_available: true },
        ]
      },
      {
        level: 3,
        spaces: [
          { name: "MC3-01", zone_type: "economy", base_price: 30, is_available: true },
          { name: "MC3-02", zone_type: "economy", base_price: 30, is_available: true },
          { name: "MC3-03", zone_type: "economy", base_price: 30, is_available: true },
          { name: "MC3-04", zone_type: "economy", base_price: 30, is_available: false },
          { name: "MC3-05", zone_type: "economy", base_price: 30, is_available: true },
          { name: "MC3-06", zone_type: "economy", base_price: 30, is_available: true },
          { name: "MC3-07", zone_type: "economy", base_price: 30, is_available: true },
          { name: "MC3-08", zone_type: "economy", base_price: 30, is_available: true },
          { name: "MC3-09", zone_type: "economy", base_price: 30, is_available: false },
          { name: "MC3-10", zone_type: "economy", base_price: 30, is_available: true },
        ]
      }
    ]
  }
];

// Function to seed database with a provided database instance
export async function seedDatabaseWithDb(db: Database) {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clear existing data in the correct order (respecting foreign key constraints)
    console.log('🗑️  Clearing existing data...');
    await db.run('DELETE FROM parking_spaces');
    await db.run('DELETE FROM reservations');
    await db.run('DELETE FROM parking_lots');
    await db.run('DELETE FROM users WHERE email != "admin@autoslot.com"');
    
    console.log('🗑️  Cleared existing data');
    
    // Create admin user automatically
    console.log('👤 Creating admin user...');
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Check if admin user exists
    const adminExists = await db.get("SELECT id FROM users WHERE email = 'admin@autoslot.com'");
    
    if (adminExists) {
      // Update existing admin user
      await db.run(
        "UPDATE users SET password_hash = ?, role = 'admin', is_active = 1 WHERE email = 'admin@autoslot.com'",
        [passwordHash]
      );
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new admin user
      await db.run(
        "INSERT INTO users (name, email, password_hash, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          'Admin User',
          'admin@autoslot.com',
          passwordHash,
          'admin',
          1,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      );
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('🔐 Admin credentials: admin@autoslot.com / admin123');
    
    // Insert lots first using promises to properly handle the lastID
    const lotIds: { [key: string]: number } = {};
    
    for (const lotData of seedData) {
      // Insert lot using a promise to get the lastID
      const lotId = await new Promise<number>((resolve, reject) => {
        db.run(
        'INSERT INTO parking_lots (name, address, latitude, longitude, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          [lotData.name, lotData.address, lotData.latitude, lotData.longitude, new Date().toISOString(), new Date().toISOString()],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.lastID);
            }
          }
        );
      });
      
      lotIds[lotData.name] = lotId;
      console.log(`✅ Created lot: ${lotData.name} (ID: ${lotId})`);
    }
    
    // Now insert spaces for each lot
    for (const lotData of seedData) {
      const lotId = lotIds[lotData.name];
      if (!lotId) {
        console.error(`❌ Could not find lot ID for: ${lotData.name}`);
        continue;
      }
      
      // Insert spaces for each level
      for (const levelData of lotData.levels) {
        for (const spaceData of levelData.spaces) {
          await db.run(
            'INSERT INTO parking_spaces (lot_id, name, level, is_available, base_price, zone_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              lotId,
              spaceData.name,
              levelData.level,
              spaceData.is_available ? 1 : 0,
              spaceData.base_price,
              spaceData.zone_type,
              new Date().toISOString(),
              new Date().toISOString()
            ]
          );
        }
        console.log(`  📍 Added ${levelData.spaces.length} spaces for Level ${levelData.level} in ${lotData.name}`);
      }
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${seedData.length} lots with multiple levels and spaces`);
    console.log('👤 Admin user ready: admin@autoslot.com / admin123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  console.log('❌ This file should not be executed directly. Use the API endpoint instead.');
      process.exit(1);
} 