-- Fix RLS recursion: criar função SECURITY DEFINER para evitar loop infinito
-- quando policies consultam a tabela perfis (que tem RLS ativado)

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfis
    WHERE id = auth.uid() AND tipo = 'admin'
  );
$$;

-- Reaplicar policies usando is_admin() em vez de subquery direta
DROP POLICY IF EXISTS "Admin vê todos os perfis" ON perfis;
DROP POLICY IF EXISTS "Admin vê todos os pedidos" ON pedidos;
DROP POLICY IF EXISTS "Acesso via pedido" ON pedido_servicos;
DROP POLICY IF EXISTS "Acesso via pedido" ON pedido_arquivos;
DROP POLICY IF EXISTS "Acesso via pedido" ON pedido_etapas;
DROP POLICY IF EXISTS "Acesso via pedido" ON pedido_mudancas;
DROP POLICY IF EXISTS "Admin gerencia obras" ON obras;
DROP POLICY IF EXISTS "Público vê obras publicadas" ON obras;

-- Perfis
CREATE POLICY "Admin vê todos os perfis" ON perfis
  FOR SELECT USING (is_admin());

-- Pedidos
CREATE POLICY "Admin vê todos os pedidos" ON pedidos
  FOR ALL USING (is_admin());

-- Serviços
CREATE POLICY "Acesso via pedido" ON pedido_servicos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND (usuario_id = auth.uid() OR is_admin()))
  );

-- Arquivos
CREATE POLICY "Acesso via pedido" ON pedido_arquivos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND (usuario_id = auth.uid() OR is_admin()))
  );

-- Etapas
CREATE POLICY "Acesso via pedido" ON pedido_etapas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND (usuario_id = auth.uid() OR is_admin()))
  );

-- Mudanças
CREATE POLICY "Acesso via pedido" ON pedido_mudancas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND (usuario_id = auth.uid() OR is_admin()))
  );

-- Obras
CREATE POLICY "Público vê obras publicadas" ON obras
  FOR SELECT USING (
    publicado = true OR open_access = true OR is_admin()
  );

CREATE POLICY "Admin gerencia obras" ON obras
  FOR ALL USING (is_admin());
