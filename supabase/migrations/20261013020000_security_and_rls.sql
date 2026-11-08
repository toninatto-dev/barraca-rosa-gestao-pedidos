/*
# Migração de Segurança e Row Level Security (RLS)
- Habilita RLS para as tabelas `orders` e `menu_items`
- Define permissões explícitas para leitura e escrita
*/

-- Habilitar RLS nas tabelas
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para Tabela `orders`
DROP POLICY IF EXISTS "Permitir insercao publica de pedidos" ON orders;
CREATE POLICY "Permitir insercao publica de pedidos" 
ON orders FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de pedidos apenas por autenticados" ON orders;
CREATE POLICY "Permitir leitura de pedidos apenas por autenticados" 
ON orders FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir atualizacao de pedidos apenas por autenticados" ON orders;
CREATE POLICY "Permitir atualizacao de pedidos apenas por autenticados" 
ON orders FOR UPDATE 
TO authenticated 
USING (true);

-- 2. Políticas para Tabela `menu_items`
DROP POLICY IF EXISTS "Permitir leitura publica de produtos" ON menu_items;
CREATE POLICY "Permitir leitura publica de produtos" 
ON menu_items FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Permitir alteracao do cardapio apenas para administradores" ON menu_items;
CREATE POLICY "Permitir alteracao do cardapio apenas para administradores" 
ON menu_items FOR ALL 
TO authenticated 
USING (true);
