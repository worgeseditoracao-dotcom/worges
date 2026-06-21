<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:session-summary -->
# Session Summary - 21/06/2026

## Goal
Criar página individual pública de cada obra (`/obra/[slug]`) com controle de visibilidade: perfil visível apenas para autor/admin até autorização.

## Changes Made

### Nova página pública `/obra/[slug]`
- Exibe capa, título, autores, categoria, resumo, DOI, preview PDF
- Badge "Perfil privado" quando não publicado (visível ao autor/admin)
- Botão **Tornar pública** / **Ocultar do público** (autor e admin)
- Link **Editar página** para admin
- PDF restrito/livre conforme `open_access` ou permissão

### Nova API route `/api/obras/slug/[slug]`
- Busca via admin client (bypass RLS) para permitir acesso a obras não publicadas
- Retorna `pode_gerenciar` e `is_owner_or_admin` para controle no cliente
- Visitante não autenticado → 404 para obras privadas
- Autor dono da obra → 200 com `pode_gerenciar: true`
- Admin → 200 com `pode_gerenciar: true`
- Outro usuário → 404

### Nova API route `/api/minhas-obras`
- Retorna todas as obras do autor logado (via `pedidos!inner(usuario_id)`)

### Correções críticas
- **Todas as queries `perfis.select().single()` → `.maybeSingle()`** para evitar crash quando perfil não existe (19 arquivos)
- **RLS bypass**: `api/obras/slug/[slug]` e `api/obras/[id]` (PATCH) agora usam `createSupabaseAdminClient()` para fetch/update, pois RLS bloqueava autor de ver/editar obra não publicada
- **`/api/submeter`**: contagem de pedidos usa admin client (bypass RLS) para evitar códigos duplicados (`ORD-001` colidia quando autor novo não via pedidos alheios via RLS)
- **`pedidos` join**: corrigido para tratar tanto array quanto objeto (`isOneToOne: false` retorna array)
- **Catálogo API**: filtro corrigido para `eq("publicado", true)` (antes usava `or(publicado, open_access)` incorreto)

### `middleware.ts` → `proxy.ts` (Next.js 16 deprecation)
- Criado `src/proxy.ts` com função renomeada `middleware` → `proxy`
- Removido `src/middleware.ts`

### Proteção de rotas via layout (sem proxy)
- `src/app/admin/layout.tsx`: redireciona não-admin para `/minha-conta`
- `src/app/minha-conta/layout.tsx`: redireciona não autenticado para login
- `src/proxy.ts`: removido (dev server tinha problemas com proxy)

### Migration (`supabase/migrations/20260621000001_obra_slug_unique_visibility.sql`)
- `ALTER TABLE obras ADD UNIQUE (slug)` — não aplicada (`supabase login` expirou)
- `CREATE INDEX idx_obras_publicado`

### Outros
- Placeholder SVG em `/public/images/book-cover-placeholder.svg`
- `package.json`: build script atualizado para `TURBOPACK=0 next build`
- `next.config.ts`: removido `output: "standalone"` (quebrava dev server)

## Fluxo testado
1. Autor cria pedido → OK
2. Admin cria perfil da obra (privado) → OK
3. Visitante recebe 404 → OK
4. Autor vê perfil privado → OK (pode_gerenciar: true)
5. Admin vê perfil → OK
6. Outro usuário recebe 404 → OK
7. Autor publica → OK (publicado: true)
8. Visitante vê página → OK
9. Autor oculta → OK (publicado: false)
10. Visitante volta a 404 → OK
11. Catálogo reflete visibilidade → OK

## Known Issues
- `supabase login` expirou — migration de unique constraint no slug não aplicada (não bloqueante)
- `next start` não funciona com Turbopack no Next.js 16.2.9 — usar `next dev` ou `TURBOPACK=0 next build && next start`
- `next build --webpack` falha com `MinifyPlugin is not a constructor` — bug do Next.js 16
- RLS das `obras` não permite autor ver obra não publicada → contornado com admin client nas APIs
<!-- END:session-summary -->
