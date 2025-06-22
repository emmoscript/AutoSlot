-- Tabla para gestionar los lotes o lugares de estacionamiento
CREATE TABLE parking_lots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modificamos la tabla de espacios de estacionamiento
CREATE TABLE parking_spaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lot_id INTEGER NOT NULL,
    name TEXT NOT NULL, -- Ej: "A-01", "S2-B5"
    level INTEGER DEFAULT 1, -- Nivel o piso del estacionamiento
    is_available BOOLEAN DEFAULT TRUE,
    base_price REAL NOT NULL,
    zone_type TEXT CHECK(zone_type IN ('premium', 'standard', 'economy')) NOT NULL,
    features TEXT, -- JSON array of features like 'covered', 'ev_charging'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lot_id) REFERENCES parking_lots(id) ON DELETE CASCADE
);

-- Tabla: reservations
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parking_space_id INTEGER NOT NULL,
  user_phone VARCHAR(15) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  estimated_duration INTEGER,
  total_cost REAL,
  status VARCHAR(20) DEFAULT 'active',
  license_plate VARCHAR(10),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parking_space_id) REFERENCES parking_spaces(id)
);

-- Tabla: pricing_rules
CREATE TABLE IF NOT EXISTS pricing_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_type VARCHAR(20) NOT NULL,
  hour_start INTEGER NOT NULL,
  hour_end INTEGER NOT NULL,
  multiplier REAL DEFAULT 1.0,
  day_of_week INTEGER,
  is_active BOOLEAN DEFAULT TRUE
);

-- Triggers para actualizar 'updated_at'
CREATE TRIGGER update_parking_lots_updated_at
AFTER UPDATE ON parking_lots
FOR EACH ROW
BEGIN
    UPDATE parking_lots SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER update_parking_spaces_updated_at
AFTER UPDATE ON parking_spaces
FOR EACH ROW
BEGIN
    UPDATE parking_spaces SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX idx_spaces_lot_id ON parking_spaces(lot_id);
CREATE INDEX idx_spaces_availability ON parking_spaces(is_available);
CREATE INDEX idx_reservations_space_id ON reservations(parking_space_id);
CREATE INDEX idx_reservations_user ON reservations(user_phone);

-- Datos de ejemplo
INSERT INTO parking_lots (name, address, latitude, longitude) VALUES
('Acrópolis Center', 'Av. Winston Churchill, Santo Domingo', 18.4682, -69.9392),
('Blue Mall', 'Av. Winston Churchill 95, Santo Domingo', 18.4627, -69.9405),
('Galería 360', 'Av. John F. Kennedy, Santo Domingo', 18.4873, -69.9401);

-- Espacios para Acrópolis Center (Lote 1)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(1, 'A-01', 1, 50.00, 'premium'),
(1, 'A-02', 1, 50.00, 'premium'),
(1, 'B-01', 2, 40.00, 'standard'),
(1, 'B-02', 2, 40.00, 'standard');

-- Espacios para Blue Mall (Lote 2)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(2, 'P1-10', -1, 60.00, 'premium'),
(2, 'P1-11', -1, 60.00, 'premium'),
(2, 'P2-25', -2, 35.00, 'economy');

-- Espacios para Galería 360 (Lote 3)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(3, 'N1-50', 1, 45.00, 'standard'),
(3, 'N1-51', 1, 45.00, 'standard');

-- Datos de prueba: Reglas de Precios Dinámicos
INSERT INTO pricing_rules (zone_type, hour_start, hour_end, multiplier, day_of_week) VALUES
('standard', 7, 9, 1.5, NULL),
('premium', 7, 9, 1.3, NULL),
('standard', 17, 19, 1.5, NULL),
('premium', 17, 19, 1.3, NULL),
('standard', 22, 6, 0.8, NULL),
('premium', 10, 22, 1.2, 6),
('premium', 10, 22, 1.2, 0); 