# Telas do Jogo - Quiz do Chuco

## Visão Geral Visual
Direção atual:
- cara de jogo infantil ilustrado à mão
- blocos grandes, bordas pretas marcadas e cores quentes
- sem excesso de brilho ou estímulo agressivo
- animações leves com Framer Motion

## 1. Tela Inicial (`/`)
Estado atual:
- campo para apelido
- retomada de jogador existente
- reinício real da aventura
- entrada para o mapa quando o jogador existe ou é criado

Arquivo principal:
- [`src/app/page.tsx`](../../src/app/page.tsx)

## 2. Mapa (`/map`)
Estado atual:
- mapa visual com identidade própria
- 5 fases visíveis
- fase atual destacada
- fases futuras bloqueadas
- resumo do explorador com vidas, moedas e progresso

Fases atuais:
- Fase 1: A Floresta das Letras
- Fase 2: O Deserto dos Números
- Fase 3: O Oceano Animal
- Fase 4: A Cidade Tecnológica
- Fase 5: O Laboratório Secreto

Arquivo principal:
- [`src/app/map/page.tsx`](../../src/app/map/page.tsx)

## 3. Gameplay (`/play?level=n`)
Estado atual:
- HUD com vidas, moedas e tempo
- enunciado principal
- alternativas
- power-ups
- boss nas perguntas finais das fases altas
- bloqueio de acesso quando a fase ainda não está liberada

Arquivos principais:
- [`src/app/play/page.tsx`](../../src/app/play/page.tsx)
- [`src/hooks/use-game-state.ts`](../../src/hooks/use-game-state.ts)

## 4. Feedbacks e Modais
Estado atual validado:
- modal de acerto
- modal de erro
- `Game Over`
- `Level Complete`
- `Fim do Jogo`

Arquivos:
- [`src/components/game/feedback-modal.tsx`](../../src/components/game/feedback-modal.tsx)
- [`src/components/game/game-over-modal.tsx`](../../src/components/game/game-over-modal.tsx)
- [`src/components/game/level-complete-modal.tsx`](../../src/components/game/level-complete-modal.tsx)
- [`src/components/game/game-finished-modal.tsx`](../../src/components/game/game-finished-modal.tsx)

## 5. Telas Ainda Pendentes
- página de perfil/progresso
- painel simples para revisão de perguntas pendentes
- possíveis telas futuras de administração/curadoria
