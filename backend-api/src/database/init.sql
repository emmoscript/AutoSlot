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

-- Tabla para usuarios (nueva)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    vehicle_plate TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
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
  user_id INTEGER,
  user_phone VARCHAR(15) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  estimated_duration INTEGER,
  total_cost REAL,
  status VARCHAR(20) DEFAULT 'active',
  license_plate VARCHAR(10),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parking_space_id) REFERENCES parking_spaces(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
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

CREATE TRIGGER update_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX idx_spaces_lot_id ON parking_spaces(lot_id);
CREATE INDEX idx_spaces_availability ON parking_spaces(is_available);
CREATE INDEX idx_reservations_space_id ON reservations(parking_space_id);
CREATE INDEX idx_reservations_user ON reservations(user_phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Datos de ejemplo
INSERT INTO parking_lots (name, address, latitude, longitude) VALUES
('Acrópolis Center', 'Av. Winston Churchill, Santo Domingo', 18.4682, -69.9392),
('Blue Mall', 'Av. Winston Churchill 95, Santo Domingo', 18.4627, -69.9405),
('Galería 360', 'Av. John F. Kennedy, Santo Domingo', 18.4873, -69.9401);

-- Usuarios de ejemplo (password: 'password123' hasheado)
INSERT INTO users (name, email, password_hash, vehicle_plate, phone, role) VALUES
('Juan Pérez', 'juan@example.com', '$2b$10$rQZ8K9mN2pL1oX3vY6wA7eR4tU5iI8oP9qW2eR3tY6uI7oP8qW9eR0tY1uI2oP', 'ABC123', '+18095551234', 'user'),
('María García', 'maria@example.com', '$2b$10$rQZ8K9mN2pL1oX3vY6wA7eR4tU5iI8oP9qW2eR3tY6uI7oP8qW9eR0tY1uI2oP', 'XYZ789', '+18095555678', 'user'),
('Admin', 'admin@autoslot.com', '$2b$10$rQZ8K9mN2pL1oX3vY6wA7eR4tU5iI8oP9qW2eR3tY6uI7oP8qW9eR0tY1uI2oP', 'ADMIN001', '+18095550000', 'admin');

-- Espacios para Acrópolis Center (Lote 1) - Nivel 1 (Premium)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(1, 'A-01', 1, 50.00, 'premium'),
(1, 'A-02', 1, 50.00, 'premium'),
(1, 'A-03', 1, 50.00, 'premium'),
(1, 'A-04', 1, 50.00, 'premium'),
(1, 'A-05', 1, 50.00, 'premium'),
(1, 'A-06', 1, 50.00, 'premium'),
(1, 'A-07', 1, 50.00, 'premium'),
(1, 'A-08', 1, 50.00, 'premium'),
(1, 'A-09', 1, 50.00, 'premium'),
(1, 'A-10', 1, 50.00, 'premium'),
(1, 'A-11', 1, 50.00, 'premium'),
(1, 'A-12', 1, 50.00, 'premium'),
(1, 'A-13', 1, 50.00, 'premium'),
(1, 'A-14', 1, 50.00, 'premium'),
(1, 'A-15', 1, 50.00, 'premium');

-- Espacios para Acrópolis Center (Lote 1) - Nivel 2 (Standard)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(1, 'B-01', 2, 40.00, 'standard'),
(1, 'B-02', 2, 40.00, 'standard'),
(1, 'B-03', 2, 40.00, 'standard'),
(1, 'B-04', 2, 40.00, 'standard'),
(1, 'B-05', 2, 40.00, 'standard'),
(1, 'B-06', 2, 40.00, 'standard'),
(1, 'B-07', 2, 40.00, 'standard'),
(1, 'B-08', 2, 40.00, 'standard'),
(1, 'B-09', 2, 40.00, 'standard'),
(1, 'B-10', 2, 40.00, 'standard'),
(1, 'B-11', 2, 40.00, 'standard'),
(1, 'B-12', 2, 40.00, 'standard'),
(1, 'B-13', 2, 40.00, 'standard'),
(1, 'B-14', 2, 40.00, 'standard'),
(1, 'B-15', 2, 40.00, 'standard'),
(1, 'B-16', 2, 40.00, 'standard'),
(1, 'B-17', 2, 40.00, 'standard'),
(1, 'B-18', 2, 40.00, 'standard'),
(1, 'B-19', 2, 40.00, 'standard'),
(1, 'B-20', 2, 40.00, 'standard');

-- Espacios para Acrópolis Center (Lote 1) - Nivel 3 (Economy)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(1, 'C-01', 3, 30.00, 'economy'),
(1, 'C-02', 3, 30.00, 'economy'),
(1, 'C-03', 3, 30.00, 'economy'),
(1, 'C-04', 3, 30.00, 'economy'),
(1, 'C-05', 3, 30.00, 'economy'),
(1, 'C-06', 3, 30.00, 'economy'),
(1, 'C-07', 3, 30.00, 'economy'),
(1, 'C-08', 3, 30.00, 'economy'),
(1, 'C-09', 3, 30.00, 'economy'),
(1, 'C-10', 3, 30.00, 'economy'),
(1, 'C-11', 3, 30.00, 'economy'),
(1, 'C-12', 3, 30.00, 'economy'),
(1, 'C-13', 3, 30.00, 'economy'),
(1, 'C-14', 3, 30.00, 'economy'),
(1, 'C-15', 3, 30.00, 'economy'),
(1, 'C-16', 3, 30.00, 'economy'),
(1, 'C-17', 3, 30.00, 'economy'),
(1, 'C-18', 3, 30.00, 'economy'),
(1, 'C-19', 3, 30.00, 'economy'),
(1, 'C-20', 3, 30.00, 'economy');

-- Espacios para Blue Mall (Lote 2) - Nivel -1 (Premium)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(2, 'P1-01', -1, 60.00, 'premium'),
(2, 'P1-02', -1, 60.00, 'premium'),
(2, 'P1-03', -1, 60.00, 'premium'),
(2, 'P1-04', -1, 60.00, 'premium'),
(2, 'P1-05', -1, 60.00, 'premium'),
(2, 'P1-06', -1, 60.00, 'premium'),
(2, 'P1-07', -1, 60.00, 'premium'),
(2, 'P1-08', -1, 60.00, 'premium'),
(2, 'P1-09', -1, 60.00, 'premium'),
(2, 'P1-10', -1, 60.00, 'premium'),
(2, 'P1-11', -1, 60.00, 'premium'),
(2, 'P1-12', -1, 60.00, 'premium'),
(2, 'P1-13', -1, 60.00, 'premium'),
(2, 'P1-14', -1, 60.00, 'premium'),
(2, 'P1-15', -1, 60.00, 'premium'),
(2, 'P1-16', -1, 60.00, 'premium'),
(2, 'P1-17', -1, 60.00, 'premium'),
(2, 'P1-18', -1, 60.00, 'premium'),
(2, 'P1-19', -1, 60.00, 'premium'),
(2, 'P1-20', -1, 60.00, 'premium');

-- Espacios para Blue Mall (Lote 2) - Nivel -2 (Economy)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(2, 'P2-01', -2, 35.00, 'economy'),
(2, 'P2-02', -2, 35.00, 'economy'),
(2, 'P2-03', -2, 35.00, 'economy'),
(2, 'P2-04', -2, 35.00, 'economy'),
(2, 'P2-05', -2, 35.00, 'economy'),
(2, 'P2-06', -2, 35.00, 'economy'),
(2, 'P2-07', -2, 35.00, 'economy'),
(2, 'P2-08', -2, 35.00, 'economy'),
(2, 'P2-09', -2, 35.00, 'economy'),
(2, 'P2-10', -2, 35.00, 'economy'),
(2, 'P2-11', -2, 35.00, 'economy'),
(2, 'P2-12', -2, 35.00, 'economy'),
(2, 'P2-13', -2, 35.00, 'economy'),
(2, 'P2-14', -2, 35.00, 'economy'),
(2, 'P2-15', -2, 35.00, 'economy'),
(2, 'P2-16', -2, 35.00, 'economy'),
(2, 'P2-17', -2, 35.00, 'economy'),
(2, 'P2-18', -2, 35.00, 'economy'),
(2, 'P2-19', -2, 35.00, 'economy'),
(2, 'P2-20', -2, 35.00, 'economy'),
(2, 'P2-21', -2, 35.00, 'economy'),
(2, 'P2-22', -2, 35.00, 'economy'),
(2, 'P2-23', -2, 35.00, 'economy'),
(2, 'P2-24', -2, 35.00, 'economy'),
(2, 'P2-25', -2, 35.00, 'economy'),
(2, 'P2-26', -2, 35.00, 'economy'),
(2, 'P2-27', -2, 35.00, 'economy'),
(2, 'P2-28', -2, 35.00, 'economy'),
(2, 'P2-29', -2, 35.00, 'economy'),
(2, 'P2-30', -2, 35.00, 'economy');

-- Espacios para Galería 360 (Lote 3) - Nivel 1 (Standard)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(3, 'N1-01', 1, 45.00, 'standard'),
(3, 'N1-02', 1, 45.00, 'standard'),
(3, 'N1-03', 1, 45.00, 'standard'),
(3, 'N1-04', 1, 45.00, 'standard'),
(3, 'N1-05', 1, 45.00, 'standard'),
(3, 'N1-06', 1, 45.00, 'standard'),
(3, 'N1-07', 1, 45.00, 'standard'),
(3, 'N1-08', 1, 45.00, 'standard'),
(3, 'N1-09', 1, 45.00, 'standard'),
(3, 'N1-10', 1, 45.00, 'standard'),
(3, 'N1-11', 1, 45.00, 'standard'),
(3, 'N1-12', 1, 45.00, 'standard'),
(3, 'N1-13', 1, 45.00, 'standard'),
(3, 'N1-14', 1, 45.00, 'standard'),
(3, 'N1-15', 1, 45.00, 'standard'),
(3, 'N1-16', 1, 45.00, 'standard'),
(3, 'N1-17', 1, 45.00, 'standard'),
(3, 'N1-18', 1, 45.00, 'standard'),
(3, 'N1-19', 1, 45.00, 'standard'),
(3, 'N1-20', 1, 45.00, 'standard'),
(3, 'N1-21', 1, 45.00, 'standard'),
(3, 'N1-22', 1, 45.00, 'standard'),
(3, 'N1-23', 1, 45.00, 'standard'),
(3, 'N1-24', 1, 45.00, 'standard'),
(3, 'N1-25', 1, 45.00, 'standard'),
(3, 'N1-26', 1, 45.00, 'standard'),
(3, 'N1-27', 1, 45.00, 'standard'),
(3, 'N1-28', 1, 45.00, 'standard'),
(3, 'N1-29', 1, 45.00, 'standard'),
(3, 'N1-30', 1, 45.00, 'standard'),
(3, 'N1-31', 1, 45.00, 'standard'),
(3, 'N1-32', 1, 45.00, 'standard'),
(3, 'N1-33', 1, 45.00, 'standard'),
(3, 'N1-34', 1, 45.00, 'standard'),
(3, 'N1-35', 1, 45.00, 'standard'),
(3, 'N1-36', 1, 45.00, 'standard'),
(3, 'N1-37', 1, 45.00, 'standard'),
(3, 'N1-38', 1, 45.00, 'standard'),
(3, 'N1-39', 1, 45.00, 'standard'),
(3, 'N1-40', 1, 45.00, 'standard'),
(3, 'N1-41', 1, 45.00, 'standard'),
(3, 'N1-42', 1, 45.00, 'standard'),
(3, 'N1-43', 1, 45.00, 'standard'),
(3, 'N1-44', 1, 45.00, 'standard'),
(3, 'N1-45', 1, 45.00, 'standard'),
(3, 'N1-46', 1, 45.00, 'standard'),
(3, 'N1-47', 1, 45.00, 'standard'),
(3, 'N1-48', 1, 45.00, 'standard'),
(3, 'N1-49', 1, 45.00, 'standard'),
(3, 'N1-50', 1, 45.00, 'standard'),
(3, 'N1-51', 1, 45.00, 'standard'),
(3, 'N1-52', 1, 45.00, 'standard'),
(3, 'N1-53', 1, 45.00, 'standard'),
(3, 'N1-54', 1, 45.00, 'standard'),
(3, 'N1-55', 1, 45.00, 'standard');

-- Espacios para Galería 360 (Lote 3) - Nivel 2 (Standard)
INSERT INTO parking_spaces (lot_id, name, level, base_price, zone_type) VALUES
(3, 'N2-01', 2, 45.00, 'standard'),
(3, 'N2-02', 2, 45.00, 'standard'),
(3, 'N2-03', 2, 45.00, 'standard'),
(3, 'N2-04', 2, 45.00, 'standard'),
(3, 'N2-05', 2, 45.00, 'standard'),
(3, 'N2-06', 2, 45.00, 'standard'),
(3, 'N2-07', 2, 45.00, 'standard'),
(3, 'N2-08', 2, 45.00, 'standard'),
(3, 'N2-09', 2, 45.00, 'standard'),
(3, 'N2-10', 2, 45.00, 'standard'),
(3, 'N2-11', 2, 45.00, 'standard'),
(3, 'N2-12', 2, 45.00, 'standard'),
(3, 'N2-13', 2, 45.00, 'standard'),
(3, 'N2-14', 2, 45.00, 'standard'),
(3, 'N2-15', 2, 45.00, 'standard'),
(3, 'N2-16', 2, 45.00, 'standard'),
(3, 'N2-17', 2, 45.00, 'standard'),
(3, 'N2-18', 2, 45.00, 'standard'),
(3, 'N2-19', 2, 45.00, 'standard'),
(3, 'N2-20', 2, 45.00, 'standard'),
(3, 'N2-21', 2, 45.00, 'standard'),
(3, 'N2-22', 2, 45.00, 'standard'),
(3, 'N2-23', 2, 45.00, 'standard'),
(3, 'N2-24', 2, 45.00, 'standard'),
(3, 'N2-25', 2, 45.00, 'standard'),
(3, 'N2-26', 2, 45.00, 'standard'),
(3, 'N2-27', 2, 45.00, 'standard'),
(3, 'N2-28', 2, 45.00, 'standard'),
(3, 'N2-29', 2, 45.00, 'standard'),
(3, 'N2-30', 2, 45.00, 'standard'),
(3, 'N2-31', 2, 45.00, 'standard'),
(3, 'N2-32', 2, 45.00, 'standard'),
(3, 'N2-33', 2, 45.00, 'standard'),
(3, 'N2-34', 2, 45.00, 'standard'),
(3, 'N2-35', 2, 45.00, 'standard'),
(3, 'N2-36', 2, 45.00, 'standard'),
(3, 'N2-37', 2, 45.00, 'standard'),
(3, 'N2-38', 2, 45.00, 'standard'),
(3, 'N2-39', 2, 45.00, 'standard'),
(3, 'N2-40', 2, 45.00, 'standard'),
(3, 'N2-41', 2, 45.00, 'standard'),
(3, 'N2-42', 2, 45.00, 'standard'),
(3, 'N2-43', 2, 45.00, 'standard'),
(3, 'N2-44', 2, 45.00, 'standard'),
(3, 'N2-45', 2, 45.00, 'standard'),
(3, 'N2-46', 2, 45.00, 'standard'),
(3, 'N2-47', 2, 45.00, 'standard'),
(3, 'N2-48', 2, 45.00, 'standard'),
(3, 'N2-49', 2, 45.00, 'standard'),
(3, 'N2-50', 2, 45.00, 'standard');

-- Datos de prueba: Reglas de Precios Dinámicos
INSERT INTO pricing_rules (zone_type, hour_start, hour_end, multiplier, day_of_week) VALUES
('standard', 7, 9, 1.5, NULL),
('premium', 7, 9, 1.3, NULL),
('standard', 17, 19, 1.5, NULL),
('premium', 17, 19, 1.3, NULL),
('standard', 22, 6, 0.8, NULL),
('premium', 10, 22, 1.2, 6),
('premium', 10, 22, 1.2, 0); 