# Plano 7 - Integracao com The Trivia API

## Escolha
A API adotada para ingestao externa de perguntas foi a **The Trivia API**.

Motivos:
- formato pronto para quiz
- filtro por dificuldade
- foco em multiplas escolhas
- boa base para curadoria local

## Estrategia
Nao consumimos a API diretamente na tela do jogo.

Fluxo adotado:
1. buscar perguntas externas
2. normalizar para o schema `qz_questions`
3. deduplicar por `external_id` e `text`
4. complementar com perguntas curadas locais
5. gravar no Supabase

## Arquivos
- Script principal: `src/scripts/sync-trivia.mjs`
- Curadoria local: `src/scripts/curated-hard-questions.mjs`
- Variaveis: `.env.example`

## Variaveis de ambiente
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TRIVIA_API_BASE_URL`
- `TRIVIA_API_KEY` (opcional)

## Comandos
Preview sem inserir:

```bash
npm run trivia:dry-run
```

Importacao real:

```bash
npm run trivia:sync
```

Importacao real com aprovacao automatica da API:

```bash
npm run trivia:sync -- --approve-api
```

## Estado Atual
- O banco principal do quiz foi migrado para o projeto Supabase `pessoal`.
- O jogo continua usando o banco como fonte principal.
- O script importa perguntas da API como `pending_review` por padrao.
- As perguntas curadas locais continuam entrando como `approved`.
- A importacao marca `source`, `difficulty`, `difficulty_weight`, `external_id` e `status`.
- Se a API mudar ou falhar, a curadoria local continua utilizavel.

## Pendencias Reais
- Traduzir ou filtrar melhor o conteudo externo para PT-BR quando necessario.
- Criar uma interface simples para revisar perguntas `pending_review`.
- Definir criterios para promover perguntas externas direto para `approved`.
