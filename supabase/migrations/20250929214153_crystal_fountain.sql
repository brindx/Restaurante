/*
  # El Buen Sabor Café Database Schema

  1. New Tables
    - `empleados` - Employee information with roles
    - `proveedores` - Supplier information
    - `platillos` - Menu items (food and drinks)
    - `ingredientes` - Inventory management
    - `ventas` - Sales records
    - `detalle_ventas` - Sale item details

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Manager role has full access, Cashier has limited access

  3. Features
    - User profiles with roles
    - Complete inventory management
    - Sales tracking system
    - Supplier management
*/

-- Employees table
CREATE TABLE IF NOT EXISTS empleados (
  id_empleado uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  puesto VARCHAR(50) NOT NULL DEFAULT 'cajero',
  telefono VARCHAR(15),
  fecha_contratacion DATE DEFAULT CURRENT_DATE,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS proveedores (
  id_proveedor uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_empresa VARCHAR(100) NOT NULL,
  contacto VARCHAR(100),
  telefono VARCHAR(15),
  created_at timestamptz DEFAULT now()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS platillos (
  id_platillo uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(50) DEFAULT 'general',
  disponible BOOLEAN DEFAULT true,
  imagen_url TEXT,
  created_at timestamptz DEFAULT now()
);

-- Ingredients/Inventory table
CREATE TABLE IF NOT EXISTS ingredientes (
  id_ingrediente uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  stock DECIMAL(10, 2) DEFAULT 0.00,
  stock_minimo DECIMAL(10, 2) DEFAULT 5.00,
  unidad_medida VARCHAR(20) DEFAULT 'unidad',
  id_proveedor uuid REFERENCES proveedores(id_proveedor),
  created_at timestamptz DEFAULT now()
);

-- Sales table
CREATE TABLE IF NOT EXISTS ventas (
  id_venta uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_venta timestamptz DEFAULT now(),
  total_venta DECIMAL(10, 2) NOT NULL,
  id_empleado uuid REFERENCES empleados(id_empleado),
  metodo_pago VARCHAR(20) DEFAULT 'efectivo',
  created_at timestamptz DEFAULT now()
);

-- Sale details table
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id_detalle uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_venta uuid REFERENCES ventas(id_venta) ON DELETE CASCADE,
  id_platillo uuid REFERENCES platillos(id_platillo),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE platillos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_ventas ENABLE ROW LEVEL SECURITY;

-- Policies for empleados
CREATE POLICY "Gerentes can manage all employees"
  ON empleados
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e 
      WHERE e.user_id = auth.uid() AND e.puesto = 'gerente'
    )
  );

CREATE POLICY "Employees can read their own data"
  ON empleados
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for proveedores
CREATE POLICY "Gerentes can manage suppliers"
  ON proveedores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e 
      WHERE e.user_id = auth.uid() AND e.puesto = 'gerente'
    )
  );

-- Policies for platillos
CREATE POLICY "Everyone can read menu items"
  ON platillos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gerentes can manage menu items"
  ON platillos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e 
      WHERE e.user_id = auth.uid() AND e.puesto = 'gerente'
    )
  );

-- Policies for ingredientes
CREATE POLICY "Gerentes can manage inventory"
  ON ingredientes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e 
      WHERE e.user_id = auth.uid() AND e.puesto = 'gerente'
    )
  );

-- Policies for ventas
CREATE POLICY "Employees can create sales"
  ON ventas
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM empleados e 
      WHERE e.user_id = auth.uid()
    )
  );

CREATE POLICY "Employees can read sales"
  ON ventas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e 
      WHERE e.user_id = auth.uid()
    )
  );

-- Policies for detalle_ventas
CREATE POLICY "Employees can manage sale details"
  ON detalle_ventas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e 
      WHERE e.user_id = auth.uid()
    )
  );

-- Insert sample data
INSERT INTO proveedores (nombre_empresa, contacto, telefono) VALUES 
('Distribuidora La Cosecha', 'María González', '555-0101'),
('Lácteos San Pedro', 'Carlos Ruiz', '555-0102'),
('Panadería Central', 'Ana López', '555-0103');

INSERT INTO platillos (nombre, descripcion, precio, categoria, imagen_url) VALUES 
('Café Americano', 'Café negro tradicional', 25.00, 'bebidas', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg'),
('Cappuccino', 'Café con leche espumosa', 35.00, 'bebidas', 'https://images.pexels.com/photos/761854/pexels-photo-761854.jpeg'),
('Croissant', 'Croissant francés recién horneado', 30.00, 'panaderia', 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg'),
('Sandwich Club', 'Sandwich con pollo, tocino y vegetales', 65.00, 'comidas', 'https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg'),
('Ensalada César', 'Ensalada fresca con aderezo césar', 55.00, 'comidas', 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg'),
('Muffin de Chocolate', 'Muffin casero con chispas de chocolate', 28.00, 'postres', 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg');

INSERT INTO ingredientes (nombre, stock, stock_minimo, unidad_medida) VALUES 
('Café en grano', 15.5, 5.0, 'kg'),
('Leche', 25.0, 10.0, 'litros'),
('Pan de molde', 8.0, 3.0, 'paquetes'),
('Pollo', 12.0, 5.0, 'kg'),
('Lechuga', 6.0, 2.0, 'piezas');