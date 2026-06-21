-- Corrigir trigger: adicionar SET search_path e tratar raw_user_meta_data
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS criar_perfil;

CREATE OR REPLACE FUNCTION criar_perfil()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO perfis (id, nome, email, tipo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email, 'Usuário'),
    NEW.email,
    'autor'
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Se falhar, tenta com dados mínimos
  BEGIN
    INSERT INTO perfis (id, nome, email, tipo)
    VALUES (NEW.id, 'Usuário', NEW.email, 'autor');
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignora erro para não travar a criação do usuário
  END;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION criar_perfil();
