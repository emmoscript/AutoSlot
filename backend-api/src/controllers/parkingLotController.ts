import { Request, Response } from 'express';
import { ParkingLotService } from '../services/parkingLotService';
import { Database } from 'sqlite3';

export class ParkingLotController {
  private parkingLotService: ParkingLotService;

  constructor(db: Database) {
    this.parkingLotService = new ParkingLotService(db);
  }

  async getAllLots(req: Request, res: Response): Promise<void> {
    try {
      const lots = await this.parkingLotService.getAllLots();
      res.status(200).json(lots);
    } catch (error) {
      console.error('Error fetching lots:', error);
      res.status(500).json({ message: 'Error fetching parking lots' });
    }
  }

  async createLot(req: Request, res: Response): Promise<void> {
    try {
      const { name, address, latitude, longitude } = req.body;
      
      // Validación básica
      if (!name || !address || latitude === undefined || longitude === undefined) {
        res.status(400).json({ message: 'Missing required fields: name, address, latitude, longitude' });
        return;
      }

      const newLot = await this.parkingLotService.createLot({
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });

      res.status(201).json(newLot);
    } catch (error) {
      console.error('Error creating lot:', error);
      res.status(500).json({ message: 'Error creating parking lot' });
    }
  }

  async getLotDetails(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const lot = await this.parkingLotService.getLotById(id);

      if (!lot) {
        res.status(404).json({ message: 'Parking lot not found' });
        return;
      }

      const spaces = await this.parkingLotService.getSpacesByLotId(id);
      
      // Aquí podrías calcular el precio actual de cada espacio si fuera necesario
      // Por ahora, lo dejamos simple.

      res.status(200).json({ ...lot, spaces });

    } catch (error) {
      console.error(`Error fetching details for lot ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error fetching parking lot details' });
    }
  }
} 