-- ============================================
-- PITBOX MARKETPLACE - Tablas nuevas
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Repuesteros (tiendas)
CREATE TABLE IF NOT EXISTS repuesteros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_tienda TEXT NOT NULL,
  descripcion TEXT,
  direccion TEXT,
  distrito TEXT,
  ciudad TEXT DEFAULT 'Lima',
  telefono TEXT,
  whatsapp TEXT,
  lat DECIMAL,
  lng DECIMAL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repuestero_id UUID REFERENCES repuesteros(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT, -- 'cables', 'frenos', 'aceite', 'llantas', 'filtros', 'otros'
  marca TEXT,
  precio DECIMAL NOT NULL,
  precio_oferta DECIMAL,
  stock INTEGER DEFAULT 1,
  es_remate BOOLEAN DEFAULT false,
  imagen_url TEXT,
  compatible_marcas TEXT,
  compatible_modelos TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Órdenes de compra
CREATE TABLE IF NOT EXISTS ordenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comprador_id UUID REFERENCES auth.users(id),
  repuestero_id UUID REFERENCES repuesteros(id),
  producto_id UUID REFERENCES productos(id),
  vehiculo_id UUID REFERENCES vehiculos(id),
  cantidad INTEGER DEFAULT 1,
  precio_unitario DECIMAL,
  precio_total DECIMAL,
  estado TEXT DEFAULT 'pendiente',
  tipo_entrega TEXT DEFAULT 'pickup',
  nombre_comprador TEXT,
  telefono_comprador TEXT,
  direccion_entrega TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Historial de compras por vehículo
CREATE TABLE IF NOT EXISTS historial_compras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehiculo_id UUID REFERENCES vehiculos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES auth.users(id),
  producto TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL,
  tienda TEXT,
  fecha_compra DATE DEFAULT CURRENT_DATE,
  proximo_cambio DATE,
  kilometraje INTEGER,
  orden_id UUID REFERENCES ordenes(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Permisos (RLS)
ALTER TABLE repuesteros ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_compras ENABLE ROW LEVEL SECURITY;

-- Repuesteros: cualquiera puede leer, solo el dueño escribe
CREATE POLICY "repuesteros_public_read" ON repuesteros FOR SELECT USING (true);
CREATE POLICY "repuesteros_owner_write" ON repuesteros FOR ALL USING (auth.uid() = usuario_id);

-- Productos: cualquiera puede leer, solo el repuestero escribe
CREATE POLICY "productos_public_read" ON productos FOR SELECT USING (activo = true);
CREATE POLICY "productos_owner_write" ON productos FOR ALL USING (
  auth.uid() = (SELECT usuario_id FROM repuesteros WHERE id = repuestero_id)
);

-- Órdenes: comprador y repuestero pueden ver las suyas
CREATE POLICY "ordenes_comprador" ON ordenes FOR SELECT USING (auth.uid() = comprador_id);
CREATE POLICY "ordenes_repuestero" ON ordenes FOR SELECT USING (
  auth.uid() = (SELECT usuario_id FROM repuesteros WHERE id = repuestero_id)
);
CREATE POLICY "ordenes_insert" ON ordenes FOR INSERT WITH CHECK (auth.uid() = comprador_id);
CREATE POLICY "ordenes_update_repuestero" ON ordenes FOR UPDATE USING (
  auth.uid() = (SELECT usuario_id FROM repuesteros WHERE id = repuestero_id)
);

-- Historial: solo el dueño
CREATE POLICY "historial_owner" ON historial_compras FOR ALL USING (auth.uid() = usuario_id);
