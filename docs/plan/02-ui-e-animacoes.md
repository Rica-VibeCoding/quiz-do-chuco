# Plano O2 - Interface e Animações Core (Quiz do Chuco)

## Objetivos
1. Criar o layout global baseado na estética "caderno escolar infantil".
2. Implementar Tela Inicial com campo de apelido e botão animado ("JOGAR").
3. Implementar esqueleto da Tela de Gameplay (HUD, pergunta e alternativas vibrantes).

## Estética e UI:
- **Tipografia:** Fonte infantil orgânica (ex: `Fredoka`, `Nunito` ou `Comic Neue`).
- **Backgrounds:** Padrão "papel" com grid pontilhado ou linhas de caderno.
- **Cores Solids Primárias:** Vermelho vivo, azul vibrante, amarelo, verde (cores de giz/canetinha).
- **Formatos:** Botões com bordas desenhadas (`border-dashed`, `border-[3px]`, ou border radius irregular `rounded-[255px_15px_225px_15px/15px_225px_15px_255px]`).
- **Animações (Framer Motion):**
  - Botão Play "pulsando" suavemente.
  - Cartões de alternativas flutuam e tremem ao toque.
  - HUD hearts pulando (heartbeat).

## Tarefas (Checklist):
- [ ] Atualizar `src/app/globals.css` com variáveis de cor, utilitários para as bordas "rabiscadas" e fundo escolar.
- [ ] Atualizar `src/app/layout.tsx` para importar fonte divertida (Google Fonts).
- [ ] Criar componentes base UI: `ScribbleButton`, `HeartHUD`, `CoinCounter`.
- [ ] Criar `src/app/page.tsx` (Tela Inicial).
- [ ] Criar `src/app/play/page.tsx` (Tela Base Gameplay).
