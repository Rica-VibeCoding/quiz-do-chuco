# Contexto Atual do Projeto

## Resumo Executivo
O Quiz do Chuco saiu do estado inicial de MVP e hoje tem fluxo jogável de ponta a ponta, banco consolidado no projeto Supabase `pessoal` e deploy em produção a partir de `main`.

O projeto já não depende mais do antigo banco "geral" para o runtime do quiz. A aplicação foi alinhada para usar as tabelas `qz_players` e `qz_questions` no projeto correto.

## Stack e Runtime
- Frontend: Next.js App Router + React 19
- Estilo e animação: Tailwind CSS + Framer Motion
- Banco e persistência: Supabase
- Deploy: Vercel
- Fonte principal de perguntas em runtime: banco de dados

## Banco Oficial do Quiz
- Projeto Supabase: `pessoal`
- URL pública usada pelo app: `https://qxhmkenttvmkhgotkxzt.supabase.co`
- Tabelas centrais:
  - `public.qz_players`
  - `public.qz_questions`

## Migrations Relevantes
- [`20260306120000_expand_question_metadata.sql`](../../supabase/migrations/20260306120000_expand_question_metadata.sql)
- [`20260306133000_ensure_quiz_core_tables.sql`](../../supabase/migrations/20260306133000_ensure_quiz_core_tables.sql)
- [`20260307003000_rebalance_quiz_boss_curve.sql`](../../supabase/migrations/20260307003000_rebalance_quiz_boss_curve.sql)

## Estrutura Atual de Perguntas
O jogo lê perguntas por fase a partir de `qz_questions`, filtrando apenas `status = 'approved'`.

Ordenação atual:
1. `is_boss` ascendente
2. `difficulty_weight` ascendente
3. `id` ascendente

Isso cria uma curva básica dentro da fase:
- aquecimento
- intermediária
- pressão
- boss no final

Implementação principal:
- [`question.repository.ts`](../../src/application/question/repositories/question.repository.ts)

## Conteúdo Hoje no Banco Principal
- fase 1: 20 aprovadas
- fase 2: 20 aprovadas
- fase 3: 20 aprovadas
- fase 4: 25 aprovadas
- fase 5: 26 aprovadas

Regras atuais:
- fases 4 e 5 terminam com um único boss
- lote legado foi aproveitado para completar volume
- lote curado foi mantido para reforçar dificuldade nas fases altas

## Ingestão Externa
A API escolhida foi The Trivia API.

Arquivos principais:
- [`sync-trivia.mjs`](../../src/scripts/sync-trivia.mjs)
- [`curated-hard-questions.mjs`](../../src/scripts/curated-hard-questions.mjs)

Regras atuais de ingestão:
- perguntas da API entram como `pending_review` por padrão
- `--approve-api` libera aprovação automática quando desejado
- perguntas curadas locais entram como `approved`
- ingestão marca `source`, `external_id`, `difficulty`, `difficulty_weight` e `status`

## Fluxo Funcional Já Validado
- home com retomada de jogador existente
- reinício real da aventura
- mapa com fases desbloqueadas por progresso
- gameplay com timer
- vidas e moedas persistidas
- power-ups de dica, 50/50 e pulo
- retry de fase
- `Game Over`
- `Level Complete`
- `Fim do Jogo`

Arquivos centrais:
- [`page.tsx`](../../src/app/page.tsx)
- [`map/page.tsx`](../../src/app/map/page.tsx)
- [`play/page.tsx`](../../src/app/play/page.tsx)
- [`use-game-state.ts`](../../src/hooks/use-game-state.ts)
- [`game-config.ts`](../../src/lib/game-config.ts)

## UI e Texto
As telas principais foram limpas e padronizadas para PT-BR no código da interface e nos scripts de conteúdo curado.

Observação importante:
- durante a validação com Playwright, alguns snapshots YAML mostraram mojibake
- a renderização real no DOM apareceu correta
- o problema observado era da serialização da ferramenta, não da UI em si

## Produção
- Repositório: `Rica-VibeCoding/quiz-do-chuco`
- Branch principal: `main`
- Deploy ativo em Vercel

Correção relevante de produção já aplicada:
- o build que falhava em `2f78574` por `string | null` foi corrigido em `62daa0a`

## Pendências Reais da Próxima Rodada
- página de perfil/progresso
- painel simples para revisar `pending_review`
- regras melhores de curadoria e filtro PT-BR
- biblioteca formal de pegadinhas leves
- validação para evitar pegadinha injusta
- marcação de perguntas da família, premium e descarte
- explicações curtas para futuro modo de aprendizado

## Riscos e Observações
- o conteúdo das fases 1 a 3 ainda depende bastante do lote legado
- a curva de dificuldade existe, mas ainda é simples e baseada em ordenação
- ainda não existe UI de revisão editorial para perguntas externas
- o banco oficial precisa continuar sendo o projeto `pessoal`; trocar isso sem migração reabre o problema anterior
