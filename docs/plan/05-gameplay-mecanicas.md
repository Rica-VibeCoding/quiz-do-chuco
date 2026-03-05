# Plano 05 - Gameplay: Mecanicas Core e Telas Faltantes

## Contexto
- Planos 01-04 concluidos (setup, UI base, backend Supabase, 100 perguntas no banco).
- Ler documentacao existente antes de comecar:
  - `docs/inf systen/PRD.md` (regras do jogo, mecanicas, filosofia)
  - `docs/inf systen/SCREENS.md` (telas, visual, HUD, boss fight)
  - `docs/inf systen/DATABASE.md` (schema das tabelas)
- MCP Supabase a usar: `supabase_geral`

## O que ja existe
- Tela inicial (`src/app/page.tsx`): input de nickname + botao JOGAR
- Tela gameplay (`src/app/play/page.tsx`): HUD estatico, pergunta + 4 alternativas, usa `alert()` para feedback
- Backend completo: DTOs, Repositories, Use Cases, Server Actions em `src/presentation/actions/game.actions.ts`
- Componentes: `ScribbleButton`, shadcn (button, card, dialog, progress, input)
- Estetica: fonte Comic Neue, fundo caderno escolar, bordas rabiscadas

## O que falta implementar

### 1. Tela Mapa do Tesouro (`/map`)
Conforme descrito em SCREENS.md secao 2. Cinco niveis com nomes tematicos, desbloqueio baseado no `current_level` do jogador.

### 2. HUD Dinamico
Substituir valores fixos do HUD (vidas=10, moedas=95, tempo=01:30) por dados reais do jogador. Implementar cronometro regressivo (90s, generoso conforme PRD).

### 3. Power-ups
Conforme PRD secao 4: Dica (mostra campo `hint`), 50/50 (elimina 2 erradas), Pulo (pula pergunta). Cada um custa moedas.

### 4. Feedback de Acerto/Erro
Substituir `alert()` por animacoes e modais conforme SCREENS.md secoes 5 (erro) e gameplay. Usar `feedback_wrong` da pergunta. Erro nao avanca, tenta de novo.

### 5. Boss Fight
Conforme SCREENS.md secao 4. Pergunta com `is_boss=true` (pergunta 20 de cada fase) tem visual diferenciado.

### 6. Fim de Fase
Conforme SCREENS.md secao 6. Confete, salvar progresso, voltar ao mapa.

### 7. Fluxo de Navegacao
`/` -> `/map` -> `/play?level=X`. Tela inicial deve oferecer "Continuar Aventura" se jogador ja existe.

### 8. Game State
Criar hook/estado que gerencia vidas, moedas, pergunta atual, timer no cliente. Sincronizar com banco via Server Actions existentes.
