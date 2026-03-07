# Product Requirements Document (PRD) - Quiz do Chuco

## 1. Visão Geral
O Quiz do Chuco é um jogo web educativo voltado para uma criança de 8-10 anos, com foco em aprendizado, persistência, humor leve e progressão positiva. O tom é lúdico, desenhado à mão, com referências leves ao estilo Genio Quiz, mas sem cair em injustiça ou frustração gratuita.

## 2. Público-Alvo e Acessibilidade
- Público principal: criança jogando com acompanhamento familiar eventual
- Interface com pouco ruído visual e sem poluição sensorial
- Sem música obrigatória de fundo
- Feedback de erro encorajador, não agressivo
- Progresso salvo para retomada simples

## 3. Estrutura Atual do Jogo
- 5 fases principais
- Meta operacional atual: pelo menos 20 perguntas aprovadas por fase
- Boss no final de cada fase
- Progresso salvo por apelido/jogador
- Mapa com bloqueio e desbloqueio por avanço

## 4. Mecânicas Atuais
- Pergunta com 4 alternativas
- Vidas
- Moedas
- Timer por pergunta
- Power-ups:
  - dica
  - 50/50
  - pulo
- Retry da fase
- Reinício completo da aventura
- Fluxos de feedback:
  - acerto
  - erro
  - `Game Over`
  - `Level Complete`
  - `Fim do Jogo`

## 5. Conteúdo e Curadoria
- Fonte principal em runtime: Supabase
- Fonte externa de ingestão: The Trivia API
- Curadoria local complementar para reforçar dificuldade e conteúdo personalizado
- Perguntas externas entram como `pending_review` por padrão
- Perguntas curadas locais entram como `approved`

## 6. Direção de Produto Já Assumida
- O jogo deve ser desafiador, mas justo
- Pegadinhas devem ser leves e revisadas
- O sistema precisa suportar perguntas da família e conteúdo mais personalizado
- O banco precisa continuar separado e claro, sem voltar para tabelas genéricas de outros projetos

## 7. Próximos Objetivos de Produto
- Página de perfil/progresso
- Painel simples para revisar perguntas pendentes
- Regras mais fortes de curadoria e filtro PT-BR
- Biblioteca de pegadinhas leves e política de revisão justa
