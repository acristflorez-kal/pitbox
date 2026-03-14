-- ============================================================
-- PitBox — Migración: soporte de pagos Culqi en tabla ordenes
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Agregar columnas de pago a ordenes
ALTER TABLE ordenes
  ADD COLUMN IF NOT EXISTS estado_pago       TEXT DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS culqi_charge_id   TEXT,
  ADD COLUMN IF NOT EXISTS precio_total_con_comision NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS comision_pitbox   NUMERIC(10,2);

-- 2. Comentarios descriptivos
COMMENT ON COLUMN ordenes.estado_pago IS 'pendiente | pagado | fallido | reembolsado';
COMMENT ON COLUMN ordenes.culqi_charge_id IS 'ID del cargo en Culqi (ej: chr_live_xxxx)';
COMMENT ON COLUMN ordenes.precio_total_con_comision IS 'Total cobrado al comprador (producto + 5% comision PitBox)';
COMMENT ON COLUMN ordenes.comision_pitbox IS 'Monto de la comision que retiene PitBox';

-- 3. Índice para buscar rápido por estado_pago
CREATE INDEX IF NOT EXISTS idx_ordenes_estado_pago ON ordenes(estado_pago);

-- 4. (Opcional) Vista de resumen de ingresos PitBox
CREATE OR REPLACE VIEW pitbox_ingresos AS
SELECT
  DATE_TRUNC('day', created_at)::DATE AS fecha,
  COUNT(*)                             AS ordenes_pagadas,
  SUM(comision_pitbox)                 AS ingresos_pitbox,
  SUM(precio_total_con_comision)       AS volumen_total
FROM ordenes
WHERE estado_pago = 'pagado'
GROUP BY 1
ORDER BY 1 DESC;
