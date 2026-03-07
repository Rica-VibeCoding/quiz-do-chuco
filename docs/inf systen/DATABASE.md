# Database Schema - Quiz do Chuco

## Visão Geral
- Projeto oficial do quiz: Supabase `pessoal`
- Prefixo das tabelas: `qz_`
- Runtime do jogo: lê perguntas do banco, não de arquivo local

## 1. qz_players
Armazena o perfil do jogador e o progresso atual da aventura.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid (PK) | Gerado automaticamente. |
| `nickname` | text | Apelido do jogador. |
| `current_level` | int | Fase atual, padrão `1`. |
| `current_question` | int | Posição atual dentro da fase, padrão `1`. |
| `coins` | int | Saldo de moedas para power-ups, padrão `100`. |
| `lives` | int | Quantidade de vidas, padrão `10`. |
| `created_at` | timestamptz | Data de criação. |
| `updated_at` | timestamptz | Último salvamento do progresso. |

## 2. qz_questions
Tabela principal de conteúdo do jogo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | bigint (PK) | Identificador sequencial. |
| `level` | int | Fase da pergunta. |
| `difficulty` | text | Ex: `easy`, `medium`, `hard`, `boss`. |
| `difficulty_weight` | int | Peso usado para ordenar a curva dentro da fase. |
| `category` | text | Categoria temática da pergunta. |
| `text` | text | Enunciado principal. |
| `img_url` | text | URL opcional de imagem. |
| `option_a` | text | Alternativa A. |
| `option_b` | text | Alternativa B. |
| `option_c` | text | Alternativa C. |
| `option_d` | text | Alternativa D. |
| `correct_option` | char(1) | Letra da resposta correta. |
| `hint` | text | Dica usada pelo power-up. |
| `feedback_wrong` | text | Feedback em caso de erro. |
| `is_boss` | boolean | Marca a pergunta final de boss da fase. |
| `is_trick` | boolean | Marca pegadinhas leves ou questões mais capciosas. |
| `explanation` | text | Explicação curta da resposta, para uso futuro. |
| `source` | text | Origem da pergunta, ex: `legacy_seed`, `curated_local`, `the_trivia_api`. |
| `external_id` | text | ID externo para deduplicação. |
| `status` | text | Ex: `approved`, `pending_review`, `rejected`. |
| `created_at` | timestamptz | Data de criação. |
| `updated_at` | timestamptz | Data de atualização. |

## Regras Atuais de Runtime
- O jogo consulta apenas perguntas com `status = 'approved'`.
- A ordenação dentro da fase é:
  1. `is_boss` asc
  2. `difficulty_weight` asc
  3. `id` asc
- Isso garante boss no fim da fase e dificuldade crescente básica.

## Ingestão e Curadoria
- Fonte externa adotada: The Trivia API
- Script principal: [`src/scripts/sync-trivia.mjs`](../../src/scripts/sync-trivia.mjs)
- Curadoria local complementar: [`src/scripts/curated-hard-questions.mjs`](../../src/scripts/curated-hard-questions.mjs)

Regras atuais:
- API entra como `pending_review` por padrão
- Perguntas curadas locais entram como `approved`
- O banco `pessoal` é a fonte de verdade do quiz
