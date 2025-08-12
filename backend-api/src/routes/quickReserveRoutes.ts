import { Router } from 'express';
import { Database } from 'sqlite3';

const router = Router();

// Quick reserve endpoint - finds optimal space automatically
router.post('/lots/:lotId/quick-reserve', async (req, res) => {
  const { lotId } = req.params;
  const { userId, preferences = {} } = req.body;
  
  try {
    const db = req.app.locals.db as Database;
    
    // Get available spaces for the lot
    const query = `
      SELECT * FROM parking_spaces 
      WHERE lot_id = ? AND is_available = 1 
      ORDER BY 
        CASE zone_type 
          WHEN 'premium' THEN 1 
          WHEN 'standard' THEN 2 
          WHEN 'economy' THEN 3 
        END,
        base_price ASC,
        level ASC
      LIMIT 1
    `;
    
    db.get(query, [lotId], (err, space: any) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', error: err.message });
      }
      
      if (!space) {
        return res.status(404).json({ success: false, message: 'No spaces available' });
      }
      
      // Reserve the space (mark as unavailable)
      const updateQuery = 'UPDATE parking_spaces SET is_available = 0 WHERE id = ?';
      db.run(updateQuery, [space.id], function(updateErr) {
        if (updateErr) {
          return res.status(500).json({ success: false, message: 'Could not reserve space', error: updateErr.message });
        }
        
        res.json({
          success: true,
          message: 'Space reserved successfully!',
          space: {
            id: space.id,
            name: space.name,
            level: space.level,
            zone_type: space.zone_type,
            price: space.base_price,
            lot_id: space.lot_id
          }
        });
      });
    });
    
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get optimal spaces (preview without reserving)
router.get('/lots/:lotId/optimal-spaces', (req, res) => {
  const { lotId } = req.params;
  const db = req.app.locals.db as Database;
  
  const query = `
    SELECT * FROM parking_spaces 
    WHERE lot_id = ? AND is_available = 1 
    ORDER BY 
      CASE zone_type 
        WHEN 'premium' THEN 1 
        WHEN 'standard' THEN 2 
        WHEN 'economy' THEN 3 
      END,
      base_price ASC,
      level ASC
    LIMIT 3
  `;
  
  db.all(query, [lotId], (err, spaces) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
    
    res.json({
      success: true,
      optimal_spaces: spaces || []
    });
  });
});

export default router;