"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QuestionDTO } from "@/application/question/dtos/question.dto";
import { PlayerDTO } from "@/application/player/dtos/player.dto";
import {
  getQuestionsForLevelAction,
  getPlayerAction,
  saveProgressAction,
} from "@/presentation/actions/game.actions";
import {
  BOSS_COINS_BONUS,
  COINS_DICA,
  COINS_FIFTY,
  COINS_PER_CORRECT,
  COINS_PULO,
  DEFAULT_PROGRESS,
  INITIAL_COINS,
  INITIAL_LIVES,
  MAX_LEVEL,
  STORAGE_KEYS,
  TIMER_SECONDS,
} from "@/lib/game-config";

export type PowerUp = "dica" | "fifty" | "pulo";

export interface GameState {
  player: PlayerDTO | null;
  questions: QuestionDTO[];
  currentIdx: number;
  lives: number;
  coins: number;
  timer: number;
  loading: boolean;
  showHint: boolean;
  eliminatedOptions: string[];
  feedbackType: "correct" | "wrong" | null;
  feedbackMessage: string;
  levelComplete: boolean;
  gameOver: boolean;
  gameFinished: boolean;
  lockedLevel: boolean;
  actionLoading: boolean;
  isBoss: boolean;
}

const INITIAL_STATE: GameState = {
  player: null,
  questions: [],
  currentIdx: 0,
  lives: INITIAL_LIVES,
  coins: INITIAL_COINS,
  timer: TIMER_SECONDS,
  loading: true,
  showHint: false,
  eliminatedOptions: [],
  feedbackType: null,
  feedbackMessage: "",
  levelComplete: false,
  gameOver: false,
  gameFinished: false,
  lockedLevel: false,
  actionLoading: false,
  isBoss: false,
};

export function useGameState(level: number) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerId = useRef<string | null>(null);
  const stateRef = useRef<GameState>(INITIAL_STATE);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const syncProgress = useCallback(
    async (progress: {
      current_level?: number;
      current_question?: number;
      lives?: number;
      coins?: number;
    }) => {
      if (!playerId.current) return;
      const response = await saveProgressAction(playerId.current, progress);
      if ("error" in response) {
        throw new Error(response.error);
      }
    },
    []
  );

  const updateLocalProgress = useCallback(
    (progress: {
      current_level?: number;
      current_question?: number;
      lives?: number;
      coins?: number;
    }) => {
      setState((s) => ({
        ...s,
        player: s.player
          ? {
              ...s.player,
              ...progress,
            }
          : s.player,
      }));
    },
    []
  );

  useEffect(() => {
    async function init() {
      const id = localStorage.getItem(STORAGE_KEYS.playerId);
      if (!id) {
        setState({ ...INITIAL_STATE, loading: false });
        return;
      }

      playerId.current = id;
      setState({ ...INITIAL_STATE, loading: true });

      const [playerRes, questionsRes] = await Promise.all([
        getPlayerAction(id),
        getQuestionsForLevelAction(level),
      ]);

      let playerData: PlayerDTO | null = null;
      let questionsData: QuestionDTO[] = [];

      if ("data" in playerRes && playerRes.data) {
        playerData = playerRes.data;
      }
      if ("data" in questionsRes && questionsRes.data) {
        questionsData = questionsRes.data;
      }

      if (!playerData) {
        setState((s) => ({ ...s, loading: false }));
        return;
      }

      const lockedLevel = level > playerData.current_level;

      let startIdx = 0;
      if (playerData.current_level === level) {
        startIdx = Math.max(0, (playerData.current_question || 1) - 1);
        if (startIdx >= questionsData.length) startIdx = 0;
      }

      setState({
        player: playerData,
        questions: questionsData,
        currentIdx: startIdx,
        lives: playerData.lives ?? INITIAL_LIVES,
        coins: playerData.coins ?? INITIAL_COINS,
        timer: TIMER_SECONDS,
        loading: false,
        showHint: false,
        eliminatedOptions: [],
        feedbackType: null,
        feedbackMessage: "",
        levelComplete: false,
        gameOver: (playerData.lives ?? INITIAL_LIVES) <= 0,
        gameFinished: false,
        lockedLevel,
        actionLoading: false,
        isBoss: questionsData[startIdx]?.is_boss ?? false,
      });
    }

    init();
  }, [level]);

  useEffect(() => {
    if (
      state.loading ||
      state.levelComplete ||
      state.gameOver ||
      state.gameFinished ||
      state.feedbackType
    ) {
      return;
    }

    timerRef.current = setInterval(() => {
      const current = stateRef.current;

      if (current.timer > 1) {
        setState((s) => ({ ...s, timer: s.timer - 1 }));
        return;
      }

      const nextLives = Math.max(0, current.lives - 1);
      const progress = { lives: nextLives };

      setState((s) => ({
        ...s,
        timer: TIMER_SECONDS,
        lives: nextLives,
        feedbackType: nextLives === 0 ? null : "wrong",
        feedbackMessage: nextLives === 0 ? "" : "O tempo acabou! Tente de novo!",
        gameOver: nextLives === 0,
      }));

      updateLocalProgress(progress);
      void syncProgress(progress).catch((error) => console.error(error));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    state.feedbackType,
    state.gameFinished,
    state.gameOver,
    state.levelComplete,
    state.loading,
    syncProgress,
    updateLocalProgress,
  ]);

  const currentQuestion = state.questions[state.currentIdx] ?? null;

  const resetRoundState = useCallback((nextIdx?: number) => {
    setState((s) => ({
      ...s,
      currentIdx: nextIdx ?? s.currentIdx,
      timer: TIMER_SECONDS,
      showHint: false,
      eliminatedOptions: [],
      isBoss: s.questions[nextIdx ?? s.currentIdx]?.is_boss ?? false,
    }));
  }, []);

  const handleAnswer = useCallback(
    async (selectedOption: string) => {
      if (!currentQuestion || !playerId.current || state.feedbackType) return;

      const isCorrect =
        selectedOption.toUpperCase() === currentQuestion.correct_option.toUpperCase();

      if (isCorrect) {
        const bonusCoins = currentQuestion.is_boss
          ? COINS_PER_CORRECT + BOSS_COINS_BONUS
          : COINS_PER_CORRECT;

        setState((s) => ({
          ...s,
          coins: s.coins + bonusCoins,
          feedbackType: "correct",
          feedbackMessage: currentQuestion.is_boss
            ? "O monstro aprendeu! Voce e demais!"
            : "Muito bem! Acertou!",
        }));

        updateLocalProgress({ coins: state.coins + bonusCoins });
      } else {
        const nextLives = Math.max(0, state.lives - 1);

        setState((s) => ({
          ...s,
          lives: nextLives,
          feedbackType: nextLives === 0 ? null : "wrong",
          feedbackMessage:
            nextLives === 0
              ? ""
              : currentQuestion.feedback_wrong || "Opa, nao deu certo! Tente de novo!",
          gameOver: nextLives === 0,
        }));

        updateLocalProgress({ lives: nextLives });
        try {
          await syncProgress({ lives: nextLives });
        } catch (error) {
          console.error(error);
        }
      }
    },
    [
      currentQuestion,
      state.coins,
      state.feedbackType,
      state.lives,
      syncProgress,
      updateLocalProgress,
    ]
  );

  const dismissFeedback = useCallback(async () => {
    const wasCorrect = state.feedbackType === "correct";
    if (!wasCorrect) {
      setState((s) => ({
        ...s,
        feedbackType: null,
        feedbackMessage: "",
        timer: TIMER_SECONDS,
      }));
      return;
    }

    const nextIdx = state.currentIdx + 1;
    const isLastQuestion = nextIdx >= state.questions.length;
    const nextLevel = isLastQuestion ? Math.min(level + 1, MAX_LEVEL) : level;
    const progress = {
      current_question: isLastQuestion ? 1 : nextIdx + 1,
      current_level: nextLevel,
      coins: state.coins,
      lives: state.lives,
    };

    try {
      await syncProgress(progress);
      updateLocalProgress(progress);
    } catch (error) {
      console.error(error);
    }

    if (isLastQuestion && level >= MAX_LEVEL) {
      setState((s) => ({
        ...s,
        feedbackType: null,
        feedbackMessage: "",
        gameFinished: true,
      }));
      return;
    }

    if (isLastQuestion) {
      setState((s) => ({
        ...s,
        feedbackType: null,
        feedbackMessage: "",
        levelComplete: true,
      }));
      return;
    }

    setState((s) => ({
      ...s,
      currentIdx: nextIdx,
      feedbackType: null,
      feedbackMessage: "",
      timer: TIMER_SECONDS,
      showHint: false,
      eliminatedOptions: [],
      isBoss: s.questions[nextIdx]?.is_boss ?? false,
    }));
  }, [
    level,
    state.coins,
    state.currentIdx,
    state.feedbackType,
    state.lives,
    state.questions.length,
    syncProgress,
    updateLocalProgress,
  ]);

  const usePowerUp = useCallback(
    async (type: PowerUp) => {
      if (!currentQuestion || state.feedbackType || state.gameOver || state.gameFinished) {
        return;
      }

      switch (type) {
        case "dica": {
          if (state.coins < COINS_DICA || state.showHint || !currentQuestion.hint) return;
          const nextCoins = state.coins - COINS_DICA;
          setState((s) => ({
            ...s,
            coins: nextCoins,
            showHint: true,
          }));
          updateLocalProgress({ coins: nextCoins });
          try {
            await syncProgress({ coins: nextCoins });
          } catch (error) {
            console.error(error);
          }
          return;
        }
        case "fifty": {
          if (state.coins < COINS_FIFTY || state.eliminatedOptions.length > 0) return;
          const correct = currentQuestion.correct_option.toUpperCase();
          const wrongOptions = ["A", "B", "C", "D"].filter((option) => option !== correct);
          const toEliminate = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
          const nextCoins = state.coins - COINS_FIFTY;

          setState((s) => ({
            ...s,
            coins: nextCoins,
            eliminatedOptions: toEliminate,
          }));
          updateLocalProgress({ coins: nextCoins });
          try {
            await syncProgress({ coins: nextCoins });
          } catch (error) {
            console.error(error);
          }
          return;
        }
        case "pulo": {
          if (state.coins < COINS_PULO) return;
          const nextIdx = state.currentIdx + 1;
          if (nextIdx >= state.questions.length) return;
          const nextCoins = state.coins - COINS_PULO;
          const progress = {
            current_level: level,
            current_question: nextIdx + 1,
            coins: nextCoins,
            lives: state.lives,
          };

          setState((s) => ({
            ...s,
            coins: nextCoins,
            currentIdx: nextIdx,
            timer: TIMER_SECONDS,
            showHint: false,
            eliminatedOptions: [],
            isBoss: s.questions[nextIdx]?.is_boss ?? false,
          }));
          updateLocalProgress(progress);
          try {
            await syncProgress(progress);
          } catch (error) {
            console.error(error);
          }
          return;
        }
      }
    },
    [
      currentQuestion,
      level,
      state.coins,
      state.currentIdx,
      state.eliminatedOptions.length,
      state.feedbackType,
      state.gameFinished,
      state.gameOver,
      state.lives,
      state.questions.length,
      state.showHint,
      syncProgress,
      updateLocalProgress,
    ]
  );

  const restartAdventure = useCallback(async () => {
    if (!playerId.current) return;

    setState((s) => ({ ...s, actionLoading: true }));
    try {
      await syncProgress(DEFAULT_PROGRESS);
      updateLocalProgress(DEFAULT_PROGRESS);
      resetRoundState(0);
      setState((s) => ({
        ...s,
        lives: INITIAL_LIVES,
        coins: INITIAL_COINS,
        feedbackType: null,
        feedbackMessage: "",
        levelComplete: false,
        gameOver: false,
        gameFinished: false,
        actionLoading: false,
        lockedLevel: false,
      }));
    } catch (error) {
      console.error(error);
      setState((s) => ({ ...s, actionLoading: false }));
    }
  }, [resetRoundState, syncProgress, updateLocalProgress]);

  const retryLevel = useCallback(async () => {
    if (!playerId.current) return;

    setState((s) => ({ ...s, actionLoading: true }));
    const progress = {
      current_level: level,
      current_question: 1,
      lives: INITIAL_LIVES,
      coins: state.coins,
    };

    try {
      await syncProgress(progress);
      updateLocalProgress(progress);
      setState((s) => ({
        ...s,
        currentIdx: 0,
        lives: INITIAL_LIVES,
        timer: TIMER_SECONDS,
        showHint: false,
        eliminatedOptions: [],
        feedbackType: null,
        feedbackMessage: "",
        gameOver: false,
        actionLoading: false,
        isBoss: s.questions[0]?.is_boss ?? false,
      }));
    } catch (error) {
      console.error(error);
      setState((s) => ({ ...s, actionLoading: false }));
    }
  }, [level, state.coins, syncProgress, updateLocalProgress]);

  const formatTimer = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }, []);

  return {
    ...state,
    currentQuestion,
    handleAnswer,
    dismissFeedback,
    usePowerUp,
    retryLevel,
    restartAdventure,
    formatTimer,
    COINS_DICA,
    COINS_FIFTY,
    COINS_PULO,
  };
}
