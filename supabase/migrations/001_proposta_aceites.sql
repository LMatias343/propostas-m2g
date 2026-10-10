-- 094 · Registro de aceite das propostas comerciais (/proposta/*).
--
-- Antes de ir pro checkout, o cliente abre o termo e marca que concorda com o
-- escopo, o prazo e o investimento. Esta tabela é a prova disso: data, IP e as
-- condições comerciais que estavam na tela naquele momento.
--
-- Os valores são gravados junto de propósito, e não só a versão do termo. Se
-- daqui a um ano alguém perguntar "o que exatamente ele aceitou", a resposta
-- está na própria linha, sem depender de arqueologia no git.
--
-- Log de eventos, não estado: clicou duas vezes, são duas linhas. Nada aqui é
-- atualizado nem apagado pela aplicação.

create table if not exists public.proposta_aceites (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null,
  destinatario      text not null,
  termo_versao      text not null,
  valor_implantacao text,
  valor_mensal      text,
  prazo             text,
  -- text e não inet: header malformado não pode derrubar o insert e perder o
  -- registro. O que chega é o primeiro salto do x-forwarded-for.
  ip                text,
  user_agent        text,
  referer           text,
  aceito_em         timestamptz not null default now()
);

create index if not exists proposta_aceites_slug_idx
  on public.proposta_aceites (slug, aceito_em desc);

alter table public.proposta_aceites enable row level security;
-- Sem policies = nenhum acesso pra anon/authenticated. A escrita é server-side
-- via service_role, depois de conferir o cookie da proposta. A leitura é pelo
-- painel do Supabase.
