# Plano 3 - Setup do Backend, Banco de Dados e Integração (Supabase)

## Objetivo
Instanciar o banco de dados no Supabase, criar as tabelas necessárias para o jogo "Quiz do Chuco" e implementar os Repositórios/Use Cases/Server Actions para o salvamento e recuperação do progresso do jogador.

## 1. Banco de Dados (Supabase)
Tabelas a serem criadas no schema público (prefixo `qz_`):

### Tabela `qz_players`
- `id` (uuid, primary key, autoincrementado)
- `nickname` (varchar, not null)
- `current_level` (int, default 1)
- `current_question` (int, default 1)
- `coins` (int, default 100)
- `lives` (int, default 10)
- `updated_at` (timestamp, default now())

### Tabela `qz_questions`
- `id` (int, primary key, serial)
- `level` (int)
- `difficulty` (varchar)
- `category` (varchar)
- `text` (text)
- `img_url` (varchar, null)
- `option_a` (text)
- `option_b` (text)
- `option_c` (text)
- `option_d` (text)
- `correct_option` (char(1))
- `hint` (text)
- `feedback_wrong` (text)
- `is_boss` (boolean, default false)

Habilitar **RLS (Row Level Security)** nas tabelas, permitindo operações de seleção, inserção e atualização adequadas para o jogo. 
Nota: Pela simplicidade do jogo (acesso anônimo ou apenas com nickname), talvez as políticas precisem permitir acesso sem auth em roles específicos, ou criar uma política pública.

## 2. Integração no Projeto Next.js
- Instalar bibliotecas do Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- Configurar variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Criar cliente do Supabase no lado do cliente e do servidor.

## 3. Entidades e Repositórios
- Criar a entidade/dto `Player` e `Question`.
- Criar `PlayerRepository` e `QuestionRepository` seguindo o modelo Repository Pattern.
  - Função para buscar/criar jogador pelo Nickname (ou ID guardado em cookies/local storage).
  - Função para atualizar o progresso do jogador (moedas, vidas, nível atual).
  - Função para buscar as perguntas do nível atual.

## 4. Server Actions
- Criar Server Actions em `presentation/actions/` para:
  - `startOrResumeGame(nickname: string)`: Verifica se o nickname existe, se sim, recupera dados, senão, cria.
  - `saveProgress(playerId: string, state: PlayerState)`: Salva no banco os novos valores após responder.
  - `getQuestionsForLevel(level: number)`: Busca as questões do nível para enviar ao cliente.

## 5. Próximos Passos (Plano em execução)
- Executar a migração via MCP para a criação das tabelas `qz_players` e `qz_questions`.
- Criar a camada lib/supabase com utilitários.
- Construir os dtos e repositórios usando DDD simplificado.
- Integrar com a UI (Initial Screen para Login, e Gameplay para consumo de dados).
