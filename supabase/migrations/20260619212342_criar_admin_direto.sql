-- Garantir que o admin está configurado corretamente
UPDATE perfis
SET tipo = 'admin', nome = 'Admin Worges'
WHERE email = 'pryscilaborges98@gmail.com';
