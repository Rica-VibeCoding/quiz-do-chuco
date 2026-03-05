# Database Schema - Quiz do Chuco

## Visão Geral
Conectividade ao Deta/Supabase.
- **Projeto:** `supabase_pessoal`
- **Prefixo de Tabelas:** `qz_`

## 1. qz_players
Armazena o perfil "chuco" e seu progresso atual.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid (PK) | Gerado automaticamente. |
| `nickname` | varchar | Ex: "chuco", "daniel". |
| `current_level` | int | Fase atual (1 a 5). Padrão = 1. |
| `current_question` | int | ID ou ordem da pergunta atual no nível. |
| `coins` | int | Saldo de moedinhas (para power-ups). Padrão = 100. |
| `lives` | int | Mão de corações disponíveis (Ex: 10). |
| `updated_at` | timestamp | Último salvamento do progresso. |

## 2. qz_questions
Tabela com as 100 perguntas pré-cadastradas/dumpadas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int (PK) | Sequencial, ex: 1 a 100. |
| `level` | int | De 1 a 5 (determina a progressão/fase). |
| `difficulty` | varchar | "easy", "medium", "hard", "boss". |
| `category` | varchar | "Animais", "Conhecimentos", "Família", etc. |
| `text` | text | A pergunta em si (ex: "Qual animal tem pescoço comprido?"). |
| `img_url` | varchar | Opcional. URL da imagem estilo rabisco escolar. |
| `option_a` | text | Primeira alternativa. |
| `option_b` | text | Segunda alternativa. |
| `option_c` | text | Terceira alternativa. |
| `option_d` | text | Quarta alternativa. |
| `correct_option` | char(1) | Letra correspondente à resposta (A, B, C, D). |
| `hint` | text | Dica do power-up "💡 Dica". |
| `feedback_wrong` | text | Mensagem fofa/educativa pro caso de erro. |
| `is_boss` | boolean | Determina se a pergunta é uma Boss Fight visualmente. |

## Script de Alimentação
O plano de implementação deve incluir a rotina de dump da API e um modo de edição via Supabase Studio (já que é pessoal).
