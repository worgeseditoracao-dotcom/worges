-- ============================================================
-- MIGRATION: initial_schema
-- Tabelas do Worges — ordem corrigida para FK funcionarem
-- ============================================================

-- 1. Perfis (vinculado ao auth.users do Supabase)
CREATE TABLE perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'autor' CHECK (tipo IN ('autor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  usuario_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('ebook', 'capitulo', 'impressao')),
  plano TEXT NOT NULL,
  modalidade TEXT,
  faixa_paginas TEXT,
  valor_base DECIMAL(10,2) NOT NULL DEFAULT 0,
  orcamento_final DECIMAL(10,2) NOT NULL DEFAULT 0,
  open_access BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pedido_criado',
  data_criacao TIMESTAMPTZ DEFAULT now(),
  data_atualizacao TIMESTAMPTZ DEFAULT now()
);

-- 3. Obras no catálogo
CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  autores TEXT NOT NULL,
  resumo TEXT,
  categoria TEXT,
  capa_url TEXT,
  pdf_url TEXT,
  doi TEXT,
  open_access BOOLEAN DEFAULT false,
  publicado BOOLEAN DEFAULT false,
  data_publicacao DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Serviços adicionais
CREATE TABLE pedido_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Arquivos enviados
CREATE TABLE pedido_arquivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('word', 'pdf', 'capa', 'impressao')),
  url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Etapas editoriais
CREATE TABLE pedido_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  concluida BOOLEAN DEFAULT false,
  atual BOOLEAN DEFAULT false,
  data TIMESTAMPTZ,
  ordem INT NOT NULL DEFAULT 0
);

-- 7. Histórico / auditoria
CREATE TABLE pedido_mudancas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  usuario TEXT NOT NULL DEFAULT 'Sistema',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Criar perfil automaticamente ao cadastrar
CREATE OR REPLACE FUNCTION criar_perfil()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfis (id, nome, email, tipo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    'autor'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION criar_perfil();

-- Atualizar updated_at
CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_perfil_updated
  BEFORE UPDATE ON perfis
  FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER on_obra_updated
  BEFORE UPDATE ON obras
  FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER on_pedido_updated
  BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_data ON pedidos(data_criacao DESC);
CREATE INDEX idx_obras_slug ON obras(slug);
CREATE INDEX idx_obras_publicado ON obras(publicado);
CREATE INDEX idx_pedido_etapas_pedido ON pedido_etapas(pedido_id);
CREATE INDEX idx_pedido_mudancas_pedido ON pedido_mudancas(pedido_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Perfis
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê próprio perfil" ON perfis
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admin vê todos os perfis" ON perfis
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND tipo = 'admin')
  );

-- Pedidos
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autor vê próprios pedidos" ON pedidos
  FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY "Admin vê todos os pedidos" ON pedidos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND tipo = 'admin')
  );

CREATE POLICY "Autor cria pedido" ON pedidos
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

-- Serviços
ALTER TABLE pedido_servicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso via pedido" ON pedido_servicos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND tipo = 'admin')))
  );

-- Arquivos
ALTER TABLE pedido_arquivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso via pedido" ON pedido_arquivos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND tipo = 'admin')))
  );

-- Etapas
ALTER TABLE pedido_etapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso via pedido" ON pedido_etapas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND tipo = 'admin')))
  );

-- Mudanças
ALTER TABLE pedido_mudancas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso via pedido" ON pedido_mudancas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND tipo = 'admin')))
  );

-- Obras
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público vê obras publicadas" ON obras
  FOR SELECT USING (
    publicado = true OR open_access = true
    OR EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND tipo = 'admin')
  );

CREATE POLICY "Admin gerencia obras" ON obras
  FOR ALL USING (
    EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND tipo = 'admin')
  );
