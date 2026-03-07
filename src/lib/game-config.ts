export const INITIAL_LIVES = 10;
export const INITIAL_COINS = 100;
export const TIMER_SECONDS = 90;
export const COINS_PER_CORRECT = 10;
export const COINS_DICA = 20;
export const COINS_FIFTY = 50;
export const COINS_PULO = 30;
export const BOSS_COINS_BONUS = 50;
export const MAX_LEVEL = 5;

export const STORAGE_KEYS = {
  playerId: "quiz_player_id",
  playerNickname: "quiz_player_nickname",
} as const;

export const LEVELS = [
  {
    id: 1,
    name: "A Floresta das Letras",
    emoji: "🌲",
    color: "success" as const,
    accent: "#22c55e",
    terrain: "Trilha de aquecimento",
    mood: "Entrada suave, mas com atenção.",
  },
  {
    id: 2,
    name: "O Deserto dos Números",
    emoji: "🏜️",
    color: "warning" as const,
    accent: "#f59e0b",
    terrain: "Calor e cálculo",
    mood: "Mais raciocínio e menos reflexo.",
  },
  {
    id: 3,
    name: "O Oceano Animal",
    emoji: "🌊",
    color: "primary" as const,
    accent: "#3b82f6",
    terrain: "Memória e curiosidade",
    mood: "Informação misturada com interpretação.",
  },
  {
    id: 4,
    name: "A Cidade Tecnológica",
    emoji: "🏙️",
    color: "secondary" as const,
    accent: "#a855f7",
    terrain: "Desafios espertos",
    mood: "Perguntas com mais pegadinhas leves.",
  },
  {
    id: 5,
    name: "O Laboratório Secreto",
    emoji: "🔬",
    color: "danger" as const,
    accent: "#ef4444",
    terrain: "Chefes e truques",
    mood: "Fase final com raciocínio e surpresa.",
  },
] as const;

export const DEFAULT_PROGRESS = {
  current_level: 1,
  current_question: 1,
  lives: INITIAL_LIVES,
  coins: INITIAL_COINS,
} as const;
