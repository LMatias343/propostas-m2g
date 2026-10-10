# Proposta Base

Ponto de partida pra publicar propostas comerciais que abrem no navegador com senha,
mostram o escopo em vídeo e registram o aceite antes de mandar o cliente pro checkout.

Você clona, escreve a proposta e publica. Tudo que é estrutura já está aqui.

---

## O que já vem pronto

| | |
|---|---|
| **Senha por WhatsApp** | O link só abre com o número de quem recebeu. Sem a senha, o conteúdo nem sai do servidor. |
| **Termo de aceite** | Antes do checkout abre um documento com escopo, prazo e valores. O botão de pagar só libera depois que ele marca que concorda. |
| **Registro do aceite** | Data, IP, navegador e as condições que estavam na tela, gravados no banco. Opcional. |
| **Contrato em PDF** | O cliente sai da página com o documento no computador dele. |
| **Placeholders de vídeo** | Cada demonstração aparece como moldura tracejada com o briefing do que gravar. A página fica publicável antes de existir vídeo. |
| **Link direto pro pagamento** | `?ir=pagamento` abre a proposta já rolada na seção de investimento. |
| **Tempo de leitura** | Calculado do próprio conteúdo, aparece antes da senha. |

---

## Instalação

Você precisa do [Node.js](https://nodejs.org) versão 20 ou maior. Pra conferir se já tem:

```bash
node --version
```

Depois, dentro da pasta do projeto:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra <http://localhost:3000>. A proposta de exemplo está em
<http://localhost:3000/proposta/cliente-exemplo> e a senha dela é **11988887777**.

---

## Criando a sua primeira proposta

### 1. Duplique a pasta de exemplo

Troque `maria-souza` pelo nome do seu cliente, sempre em minúsculo e com hífen:

```bash
cp -r app/proposta/cliente-exemplo app/proposta/maria-souza
```

### 2. Troque o slug em dois lugares

Em `app/proposta/maria-souza/page.tsx`, a primeira linha depois dos comentários:

```ts
const SLUG = "maria-souza";
```

E em `app/proposta/maria-souza/aceite/route.ts`:

```ts
return gravarAceite("maria-souza");
```

### 3. Cadastre os valores

Em `app/proposta/_lib/propostas.ts`, adicione o bloco dela:

```ts
"maria-souza": {
  destinatario: "Maria Souza · Souza Advocacia",
  emitidoEm: "20 de março de 2026",
  termoVersao: "2026-03-20",
  implantacao: "R$ 12.000,00",
  parcelado: "ou até 12x R$ 1.194,85 no cartão",
  mensal: "R$ 2.500 / mês",
  prazo: "4 semanas",
},
```

Estes valores são a fonte da verdade: a página monta o termo a partir deles e o
aceite grava exatamente eles. Não existe caminho pro texto da tela divergir do
que ficou registrado.

### 4. Ponha a senha no `.env.local`

A senha é o WhatsApp dela. O nome da variável sai do slug em maiúsculo, com `_` no
lugar do `-`:

```bash
PROPOSTA_SENHA_MARIA_SOUZA=11987654321
```

Salve e reinicie o `npm run dev`.

### 5. Escreva a proposta

Abra `app/proposta/maria-souza/page.tsx` e troque o conteúdo das constantes do topo.
Cada uma tem um comentário dizendo pra que serve.

> **A ordem que funciona:** escreva a proposta inteira em um arquivo de texto e
> aprove ANTES de mexer no código. Editar copy dentro do código é lento, e você
> acaba decidindo o texto por causa do layout, que é a ordem errada.

---

## Publicando na Vercel

1. Suba o projeto pro GitHub. **Deixe o repositório privado.**
2. Entre em [vercel.com](https://vercel.com) com a conta do GitHub e clique em **Add New → Project**.
3. Escolha o repositório e clique em **Deploy**.
4. Terminado, vá em **Settings → Environment Variables** e adicione as mesmas
   variáveis do seu `.env.local`, uma por uma.
5. Vá em **Deployments**, nos três pontinhos do último deploy, e clique em **Redeploy**.
   Variável nova só entra em deploy novo.

O link que você manda pro cliente é:

```
https://seuprojeto.vercel.app/proposta/maria-souza?ir=pagamento
```

---

## Gravando o registro de aceite (opcional)

Sem isso, tudo funciona: o termo abre, o cliente aceita e vai pro checkout. Você só
não fica com o registro de quem aceitou, quando e de qual IP.

1. Crie um projeto grátis em [supabase.com](https://supabase.com).
2. Abra **SQL Editor**, cole o conteúdo de `supabase/migrations/001_proposta_aceites.sql`
   e clique em **Run**.
3. Vá em **Settings → API** e copie dois valores pro seu `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> ⚠️ A `service_role` ignora todas as regras de segurança do banco. Ela só pode viver
> no servidor. Nunca ponha esse valor numa variável que comece com `NEXT_PUBLIC_`,
> porque tudo com esse prefixo vai parar no navegador do visitante.

Pra ver os aceites: Supabase → **Table Editor** → `proposta_aceites`.

---

## Colocando os vídeos

Os espaços tracejados são de propósito. Cada um traz o briefing do que aquele vídeo
precisa mostrar, e a página funciona sem eles.

Quando o vídeo existir, ponha o arquivo em `public/proposta/{slug}/` e complete o
bloco `media` do entregável:

```ts
media: {
  id: "B1",
  aspect: "16:9",
  brief: "Navegação pela central: home com os setores, abrindo o quadro.",
  src: "/proposta/maria-souza/b01.mp4",
  poster: "/proposta/maria-souza/b01.jpg",
},
```

Uma regra que vale seguir: **o vídeo mostra, a página fala.** Não repita no vídeo o
texto que já está escrito na página. Se a página diz "o agente classifica o lead", o
vídeo mostra o lead sendo classificado, sem legenda explicando de novo.

---

## Estrutura

```
app/
  page.tsx                        índice interno das suas propostas
  proposta/
    _components/                  peças compartilhadas (não precisa editar)
      proposal-ui.tsx             seções, cards, listas, placeholder de vídeo
      gate.tsx                    a tela de senha
      aceite.tsx                  o termo e o botão de compra
    _lib/                         regras compartilhadas (não precisa editar)
      gate.ts                     confere a senha, lê do .env
      propostas.ts                ⬅ VOCÊ EDITA: valores de cada proposta
      aceite-servidor.ts          grava o aceite no banco
      contrato-pdf.ts             monta o PDF do contrato
    cliente-exemplo/              ⬅ VOCÊ DUPLICA esta pasta
      page.tsx                    a proposta em si
      aceite/route.ts             endpoint que registra o aceite
public/proposta/{slug}/           os vídeos de cada proposta
supabase/migrations/              a tabela do registro de aceite
```

---

## Perguntas que aparecem

**A senha pode ser outra coisa que não o WhatsApp?**
Pode ser qualquer sequência de números, CPF por exemplo. O campo aceita com máscara
ou sem, porque limpa os dois lados antes de comparar.

**O cliente perde o acesso depois?**
Não. O cookie dura 60 dias e vale só pra proposta dele.

**Dá pra ter mais de um plano na mesma proposta?**
Dá. Declare `opcoes` no `propostas.ts` com um bloco de valores por caminho. O aceite
grava o que ele escolheu, e o preço sempre sai do servidor, nunca do navegador.

**Mudei o preço depois de mandar o link. Rasga o aceite antigo?**
Não. Suba a `termoVersao` junto com o preço. Os aceites já gravados guardam as
condições da época, que é justamente o motivo de o valor ficar na linha do banco.

**O Google acha a proposta do meu cliente?**
Não. O site inteiro sai do índice e a página não monta sem a senha.
