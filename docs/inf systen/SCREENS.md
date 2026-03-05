# Telas do Jogo - Quiz do Chuco

## Visão Geral Visual e Estética
**Arte/Tema:** Linhas rústicas e texturas de "caderno de desenho infantil", com letras não-regulares imitando giz de cera ou lápis de cor. Botões com formatos orgânicos, cores sólidas primárias, botões com uma borda desenhada na mão.
**Música:** Sem BGM. *Apenas SFX:* Moedinha tipo *Mario*, som fofo tipo bolha estourando ao clicar.

### 1. Tela Inicial (`/`)
- Título: "O Quiz do Chuco!" (logo estilizada com elementos dos hobbies dele).
- Componente de Input: "Qual o seu apelido de herói?"
- Botão "JOGAR" piscando devagarzinho (Framer animation: *scale up/down*).
- Verifica no DB se `chuco` ou `daniel` já tem progresso salvo, se tem, botão "Continuar Aventura", "Recomeçar do Zero".

### 2. Mapa do Tesouro (Níveis)
A progressão de 5 níveis não é uma simples barra, é um mapa de papel rasgado ou roteiro de aventuras.
- Nível 1: A Floresta das Letras
- Nível 2: O Deserto dos Números
- Nível 3: O Oceano Animal
- Nível 4: A Cidade Tecnológica (ou algo personalizado)
- Nível 5: O Laboratório Secreto
*Ao clicar na fase destravada, entra no jogo, pulando para a `current_question` correta.*

### 3. Tela de Gameplay (Core)
- **Top Bar (HUD):**
  - ❤️ Vidas (Corações pulando suavemente).
  - 🪙 Moedas (Ouro desenhado estilo pirata, contador: `95`).
  - ⏱️ Tempo (Uma ampulhetinha sorridente, esvaziando beeeeem devagar).
- **Centro:**
  - A pergunta desenhada em um quadro negro/folha de caderno grandona.
  - Imagem (Ex: Uma foto de cachorro rabiscada).
- **Rodapé das Alternativas:**
  - 4 "Cartões" coloridos. Azul, Verde, Laranja e Amarelo, que flutuam ao passar o mouse. Ao clicar, dá uma "tremidinha" e muda a cor para "Lendo resposta...".
- **Lateral (Power-ups):**
  - Custo de uso: "💡 Dica (20 Moedas)", "✂️ Pular (50 moedas)", "🦘 Pula tudo (100)".

### 4. Boss Fight (Pergunta 20 de cada fase)
- Muda o plano de fundo. 
- Um monstrinho rabiscado aparece no lado oposto ao jogador (um boneco palito representando o Chuco de capa).
- O monstro solta um balãozinho: "Meehh, eu não sei isso! Aposto que você também não sabe: [Pergunta]".
- Ao acertar, a animação do monstrinho sorrindo, virando purpurina, e o jogador ganha muuuita moeda.

### 5. Tela de Resposta Errada (Modal)
- Aparece de cabeça pra baixo um personagem tonto (como ele não sabe, o jogador tem que ensinar).
- "Opa, não deu certo! Mas tente de novo:" [feedback fofo].

### 6. Fim de Fase
- Chuva de confete e "Muito bom!! Você completou o desafio!".
- Computa o salvamento em DB. Redireciona para o `Mapa do Tesouro`.
