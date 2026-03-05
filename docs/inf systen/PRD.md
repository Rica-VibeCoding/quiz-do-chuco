# Product Requirements Document (PRD) - Quiz do Chuco

## 1. Visão Geral
O "Quiz do Chuco" é um jogo web mobile educativo voltado para o Daniel ("chuco"), com idade entre 8-10 anos. O jogo tem foco no aprendizado, resiliência e imersão, sem mecânicas punitivas. O design é desenhado à mão (estilo caderno escolar/educação artística) com mecânicas inspiradas no clássico "Gênio Quiz", mas adaptado para ser uma experiência sensorialmente acessível e encorajadora (autism-friendly).

## 2. Público-Alvo e Acessibilidade
- **Público:** Crianças (8-10 anos), especificamente desenhado para o "Chuco".
- **Acessibilidade Sensorial:** Sem música de fundo contínua. Efeitos sonoros sutis, suaves e gratificantes. Interface clean sem excesso de estímulos visuais piscantes.
- **Filosofia Educativa:** O erro não é um "Game Over". Se errar, o jogador recebe uma mensagem encorajadora e tenta de novo até acertar.

## 3. Estrutura do Jogo
- **Total de Perguntas:** 100 perguntas.
- **Níveis:** 5 Níveis (Fases), cada um com 20 perguntas.
- **Progressão:** Dificuldade gradativa (Fácil ➡️ Médio ➡️ Difícil).
- **Temas:** Mistos, englobando conhecimentos gerais, animais, desenhos e perguntas personalizadas sobre a família.

## 4. Mecânicas de Gameplay
- **Formato:** Pergunta + (Imagem Opcional) + 4 Alternativas.
- **Vidas (Corações):** Sim, quantidade muito generosa. Servem mais como um recurso visual de HP (Health Points) do que uma punição.
- **Tempo:** Cronômetro bastante generoso para cada pergunta, sem causar ansiedade.
- **Economia e Ajudas:** O jogador ganha "moedinhas" ao acertar de primeira. As moedas podem ser gastas nos seguintes power-ups:
  - 🦘 **Pulo:** Pula a pergunta atual.
  - ✂️ **50/50:** Elimina 2 alternativas incorretas.
  - 💡 **Dica:** Dá uma dica de texto extra para ajudar a raciocinar.
- **Boss Fight (Chefe de Fase):** A pergunta 20 de cada fase. 
  - *Mecânica sugerida:* O "Boss" não é um inimigo mau, mas um personagem engraçado/confuso que precisa da resposta certa para "aprender". O design da tela muda (fica com cara de batalha épica, mas fofa), e a pergunta exige um pouquinho mais de raciocínio. Ao acertar, cai confete e ganha um baú de moedas.

## 5. Conteúdo e Banco de Dados
- **Banco de Dados:** Supabase (`supabase_pessoal`).
- **Autenticação:** Apenas in-game (inserir apelido "chuco" ou semelhante). O progresso é salvo nesse perfil.
- **Gestão de Perguntas:** As perguntas residem no banco de dados. Faremos um dump da Tryvia API (PT-BR) e depois filtraremos/editaremos no banco, adicionando as perguntas personalizadas.

## 6. Stack Tecnológica
- **Frontend:** Next.js (App Router), React 19.
- **Estilização e Animação:** Tailwind CSS + Framer Motion (transições suaves, botões responsivos).
- **Backend/DB:** Supabase + Vercel.
