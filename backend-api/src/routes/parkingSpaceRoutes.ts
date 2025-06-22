import { Router } from 'express';
import { parkingSpaceService } from '../services/parkingSpaceService';

const router = Router();

// GET /api/spaces/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const space = await parkingSpaceService.getSpaceById(id);
    if (space) {
      res.json(space);
    } else {
      res.status(404).json({ message: 'Space not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// GET /api/spaces/:id/price
router.get('/:id/price', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const price = await parkingSpaceService.calculateCurrentPrice(id);
    res.json({ current_price: price });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// PATCH /api/spaces/:id/availability
router.patch('/:id/availability', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { is_available } = req.body;
    await parkingSpaceService.updateAvailability(id, is_available);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// POST /api/spaces/reset
router.post('/reset', async (req, res) => {
  try {
    await parkingSpaceService.resetAllSpaces();
    res.status(200).json({ message: 'All spaces have been reset to available' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset spaces' });
  }
});

export default router; 