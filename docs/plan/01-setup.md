# Plano 01: Setup do Projeto e Banco de Dados (Supabase)

## Objetivo
Inicializar o repositório Next.js com as ferramentas necessárias (Tailwind, shadcn, Framer Motion) e configurar o schema inicial no Supabase (pessoal) para armazenar os jogadores e as perguntas do "Quiz do Chuco".

## Tarefas (Checklist)

### 1. Inicialização do Projeto
- [ ] Criar projeto Next.js 16 (App Router) + React 19 no diretório raiz do projeto.
- [ ] Configurar ESLint e TypeScript (`strict mode`).
- [ ] Adicionar Tailwind CSS.
- [ ] Instalar dependências base:
  - `framer-motion` (para animações de jogo)
  - `lucide-react` (ícones fofos)
  - `supabase-js` (cliente DB)
  - `zod` (validação de dados de jogador)

### 2. Configuração Shadcn/UI
- [ ] Inicializar shadcn com estilo default.
- [ ] Adicionar componentes essenciais: `button`, `card`, `dialog` (para modais de erro e dicas), `progress` (para a barra de tempo/boss health).

### 3. Banco de Dados (MCP Supabase)
- [ ] Criar tabela `qz_players` (id, nickname, current_level, current_question, coins, lives, updated_at).
- [ ] Criar tabela `qz_questions` (id, text, options, correct, category, feedback, is_boss, etc.).
- [ ] Configurar RLS (Row Level Security) básico, permitindo leitura pública das perguntas e update baseado no nickname do jogador (se não tivermos auth forte, podemos usar RLS aberto ou protegido por API Key no server side action do Next).

### 4. Setup do Supabase no Next.js
- [ ] Configurar variáveis de ambiente (`.env.local`) com as chaves do `supabase_pessoal`.
- [ ] Criar cliente Supabase unificado na pasta `application/db/supabase.ts`.
- [ ] Testar conexão buscando uma pergunta de teste.

## Próximos Passos (Após o Plano 01)
- Plano 02: Script de Scraping da API Tryvia e Inserção no Supabase.
- Plano 03: Desenvolvimento da Tela de Login e Mapa do Tesouro.
- Plano 04: Motor do Jogo (Gameplay, Framer Motion, Lógica de Acerto/Erro).
