/*
# Create orders table for A BARRACA ROSA food trailer

1. New Tables
- `orders` — stores customer orders from the food trailer
  - `id` (uuid, primary key)
  - `customer_name` (text, not null) — name of the customer
  - `items` (jsonb, not null) — array of {id, name, price, quantity, category}
  - `total` (numeric, not null) — total order value in BRL
  - `notes` (text) — optional customer observation
  - `status` (text, not null, default 'Pendente') — order status: Pendente, Em Preparo, Concluido
  - `created_at` (timestamptz, default now()) — when order was placed

2. Security
- Enable RLS on `orders`.
- This is a no-auth single-tenant app (no sign-in screen).
- Allow anon + authenticated CRUD because the data is intentionally shared/public.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  items jsonb NOT NULL,
  total numeric(10,2) NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'Pendente',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);
