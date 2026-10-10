-- Registro de abertura das propostas comerciais (/proposta/*).
--
-- Uma linha cada vez que alguém digita a senha certa. Serve pra saber se o
-- cliente abriu a proposta, quando e de onde. Quem já entrou fica com o cookie
-- por 60 dias, então uma nova visita no mesmo aparelho não gera linha nova.
--
-- Log de eventos, como `proposta_aceites`: nada aqui é atualizado nem apagado
-- pela aplicação.

create table if not exists public.proposta_aberturas (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  destinatario text,
  ip           text,
  user_agent   text,
  aberto_em    timestamptz not null default now()
);

create index if not exists proposta_aberturas_slug_idx
  on public.proposta_aberturas (slug, aberto_em desc);

alter table public.proposta_aberturas enable row level security;
-- Sem policies, igual à tabela de aceites: escrita só pelo servidor.
