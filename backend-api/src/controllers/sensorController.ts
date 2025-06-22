import { Request, Response } from 'express';
import { parkingSpaceService } from '../services/parkingSpaceService';
import { parkingLotService } from '../services/parkingLotService';
import { ParkingSpace } from '../types';

export const sensorController = {
  // Simular un evento de sensor específico
  async simulateSensorEvent(req: Request, res: Response): Promise<void> {
    try {
      const { space_id, event_type } = req.body;
      
      if (!space_id || !event_type) {
        res.status(400).json({ 
          message: 'Missing required fields: space_id, event_type' 
        });
        return;
      }

      if (!['vehicle_entered', 'vehicle_exited'].includes(event_type)) {
        res.status(400).json({ 
          message: 'Invalid event_type. Must be "vehicle_entered" or "vehicle_exited"' 
        });
        return;
      }

      // Obtener el espacio actual
      const space = await parkingSpaceService.getSpaceById(space_id);
      if (!space) {
        res.status(404).json({ message: 'Parking space not found' });
        return;
      }

      // Determinar el nuevo estado basado en el evento
      const newAvailability = event_type === 'vehicle_entered' ? false : true;
      
      // Actualizar la disponibilidad
      await parkingSpaceService.updateAvailability(space_id, newAvailability);
      
      // Obtener el espacio actualizado
      const updatedSpace = await parkingSpaceService.getSpaceById(space_id);
      
      res.status(200).json({
        message: `Sensor event processed: ${event_type}`,
        space: updatedSpace,
        event: {
          space_id,
          event_type,
          timestamp: new Date().toISOString(),
          new_availability: newAvailability
        }
      });

    } catch (error) {
      console.error('Error simulating sensor event:', error);
      res.status(500).json({ message: 'Error processing sensor event' });
    }
  },

  // Obtener el estado actual de todos los sensores
  async getSensorStatus(req: Request, res: Response): Promise<void> {
    try {
      const lots = await parkingLotService.getAllLots();
      const sensorStatus = [];

      for (const lot of lots) {
        const spaces = await parkingLotService.getSpacesByLotId(lot.id);
        sensorStatus.push({
          lot_id: lot.id,
          lot_name: lot.name,
          total_spaces: spaces.length,
          available_spaces: spaces.filter(s => s.is_available).length,
          occupied_spaces: spaces.filter(s => !s.is_available).length,
          spaces: spaces.map(space => ({
            id: space.id,
            name: space.name,
            level: space.level,
            is_available: space.is_available,
            last_updated: space.updated_at
          }))
        });
      }

      res.status(200).json(sensorStatus);

    } catch (error) {
      console.error('Error getting sensor status:', error);
      res.status(500).json({ message: 'Error fetching sensor status' });
    }
  },

  // Simular eventos aleatorios para demostración
  async simulateRandomEvents(req: Request, res: Response): Promise<void> {
    try {
      const { count = 1, lotId = null } = req.body; // Aceptar lotId
      
      let spacesToSimulate: ParkingSpace[] = [];
      const lots = await parkingLotService.getAllLots();

      if (lotId) {
        const selectedLot = lots.find(l => l.id === lotId);
        if (selectedLot) {
          spacesToSimulate = selectedLot.spaces;
        }
      } else {
        spacesToSimulate = lots.flatMap(l => l.spaces);
      }

      if (spacesToSimulate.length === 0) {
        res.status(404).json({ message: 'No suitable parking spaces found for simulation.' });
        return;
      }

      const events = [];
      
      for (let i = 0; i < count; i++) {
        // Seleccionar un espacio aleatorio del conjunto filtrado
        const randomSpace = spacesToSimulate[Math.floor(Math.random() * spacesToSimulate.length)];
        
        // Determinar un tipo de evento que tenga sentido
        const eventType = randomSpace.is_available ? 'vehicle_entered' : 'vehicle_exited';
        const newAvailability = !randomSpace.is_available;
        
        // Actualizar el estado en la BD
        await parkingSpaceService.updateAvailability(randomSpace.id, newAvailability);
          
        // Añadir el evento a la respuesta
        events.push({
          space_id: randomSpace.id,
          space_name: randomSpace.name,
          lot_id: randomSpace.lot_id,
          level: randomSpace.level,
          lot_name: lots.find(l => l.id === randomSpace.lot_id)?.name,
          event_type: eventType,
          new_availability: newAvailability
        });
        
        // Actualizar el estado del espacio en la lista local para la siguiente iteración
        randomSpace.is_available = newAvailability;
      }

      res.status(200).json({
        message: `Simulated ${events.length} random sensor events`,
        events
      });

    } catch (error) {
      console.error('Error simulating random events:', error);
      res.status(500).json({ message: 'Error simulating random events' });
    }
  }
}; 