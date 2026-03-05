# Plano 4 - Scraping e População Inicial do Banco de Dados

## Objetivo
Criar e executar um script em Node.js (ou via Next.js API/Action de Admin) para buscar um lote de perguntas (via API sugerida, como OpenTDB traduzida ou fonte similar em PT-BR), formatá-las para os nossos DTOs, e inseri-las no banco de dados Supabase (`qz_questions`).

## 1. Fonte de Dados
Busca de perguntas estilo "Quiz/Trivia" voltadas ou adaptáveis para crianças (Nível 1 a 5).
Como especificado no PRD: Faremos um dump da internet, adaptando os campos.

- **URL Base / Fonte**: OpenTDB formatado, ou array estático pré-preparado para acelerar caso a API não tenha formato PT-BR decente para crianças. Alternativa: Usar LLM para gerar um JSON com 100 perguntas agora e inserir direto!

## 2. Abordagem de Inserção
1. **Estrutura Esperada (Schema qz_questions)**:
   - `level` (1 a 5)
   - `difficulty` (easy, medium, hard, boss)
   - `category` (Conhecimentos Gerais, Animais, etc)
   - `text` (A Pergunta)
   - `option_a`, `option_b`, `option_c`, `option_d`
   - `correct_option` (A, B, C ou D)
   - `hint` (Dica fofa)
   - `feedback_wrong` (Mensagem de erro encorajadora)
   - `is_boss` (True para a pergunta número 20 de cada fase)

2. **Criação do Script**:
   Criaremos um arquivo `src/scripts/seed-questions.ts` (ou um endpoint escondido) consumindo a nossa connection do supabase vinda de `lib/` para realizar o insert múltiplo (`insert([...])`).

3. **Geração do Conteúdo**:
   Como estamos desenvolvendo para o "Chuco" (8-10 anos, espectro/adaptado), as perguntas devem ser curtas e diretas. Para agilizar, podemos embutir um lote fixo (JSON) com pelo menos as 20 primeiras questões do **Nível 1** para validar a gameplay totalmente.

## Próximos Passos
1. Gerar/Buscar o arquivo JSON com 20 perguntas no tema "Conhecimentos e Animais" em PT-BR.
2. Criar o script de Seed.
3. Rodar o script usando `ts-node` ou via API do Next.js.
4. Testar a interface de jogo para ver se elas renderizam.
