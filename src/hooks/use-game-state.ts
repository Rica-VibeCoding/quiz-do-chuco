"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QuestionDTO } from "@/application/question/dtos/question.dto";
import { PlayerDTO } from "@/application/player/dtos/player.dto";
import {
    getQuestionsForLevelAction,
    getPlayerAction,
    saveProgressAction,
} from "@/presentation/actions/game.actions";

const TIMER_SECONDS = 90;
const COINS_PER_CORRECT = 10;
const COINS_DICA = 20;
const COINS_FIFTY = 50;
const COINS_PULO = 30;
const BOSS_COINS_BONUS = 50;

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
    isBoss: boolean;
}

export function useGameState(level: number) {
    const [state, setState] = useState<GameState>({
        player: null,
        questions: [],
        currentIdx: 0,
        lives: 10,
        coins: 100,
        timer: TIMER_SECONDS,
        loading: true,
        showHint: false,
        eliminatedOptions: [],
        feedbackType: null,
        feedbackMessage: "",
        levelComplete: false,
        isBoss: false,
    });

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const playerId = useRef<string | null>(null);

    // Load player and questions
    useEffect(() => {
        const id = localStorage.getItem("quiz_player_id");
        if (!id) return;
        playerId.current = id;

        async function init() {
            setState((s) => ({ ...s, loading: true }));

            const [playerRes, questionsRes] = await Promise.all([
                getPlayerAction(id!),
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

            // Determine starting question index based on player progress
            let startIdx = 0;
            if (playerData && playerData.current_level === level) {
                startIdx = Math.max(0, (playerData.current_question || 1) - 1);
                // Clamp to available questions
                if (startIdx >= questionsData.length) startIdx = 0;
            }

            setState((s) => ({
                ...s,
                player: playerData,
                questions: questionsData,
                currentIdx: startIdx,
                lives: playerData?.lives ?? 10,
                coins: playerData?.coins ?? 100,
                loading: false,
                isBoss: questionsData[startIdx]?.is_boss ?? false,
            }));
        }

        init();
    }, [level]);

    // Timer
    useEffect(() => {
        if (state.loading || state.levelComplete || state.feedbackType) return;

        timerRef.current = setInterval(() => {
            setState((s) => {
                if (s.timer <= 1) {
                    // Time's up - lose a life, reset timer
                    return {
                        ...s,
                        timer: TIMER_SECONDS,
                        lives: Math.max(0, s.lives - 1),
                        feedbackType: "wrong",
                        feedbackMessage: "O tempo acabou! Tente de novo!",
                    };
                }
                return { ...s, timer: s.timer - 1 };
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [state.loading, state.levelComplete, state.feedbackType]);

    const currentQuestion = state.questions[state.currentIdx] ?? null;

    const handleAnswer = useCallback(
        async (selectedOption: string) => {
            if (!currentQuestion || !playerId.current) return;

            const isCorrect =
                selectedOption.toUpperCase() ===
                currentQuestion.correct_option.toUpperCase();

            if (isCorrect) {
                const bonusCoins =
                    currentQuestion.is_boss
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
            } else {
                setState((s) => ({
                    ...s,
                    lives: Math.max(0, s.lives - 1),
                    feedbackType: "wrong",
                    feedbackMessage:
                        currentQuestion.feedback_wrong ||
                        "Opa, nao deu certo! Tente de novo!",
                }));
            }
        },
        [currentQuestion]
    );

    const dismissFeedback = useCallback(async () => {
        const wasCorrect = state.feedbackType === "correct";

        if (wasCorrect) {
            const nextIdx = state.currentIdx + 1;
            const isLastQuestion = nextIdx >= state.questions.length;

            // Save progress
            if (playerId.current) {
                try {
                    await saveProgressAction(playerId.current, {
                        current_question: isLastQuestion ? 1 : nextIdx + 1,
                        current_level: isLastQuestion ? level + 1 : level,
                        coins: state.coins,
                        lives: state.lives,
                    });
                } catch (e) {
                    console.error(e);
                }
            }

            if (isLastQuestion) {
                setState((s) => ({
                    ...s,
                    feedbackType: null,
                    feedbackMessage: "",
                    levelComplete: true,
                }));
            } else {
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
            }
        } else {
            // Wrong answer - stay on same question, reset timer
            setState((s) => ({
                ...s,
                feedbackType: null,
                feedbackMessage: "",
                timer: TIMER_SECONDS,
            }));
        }
    }, [state.feedbackType, state.currentIdx, state.questions.length, state.coins, state.lives, level]);

    const usePowerUp = useCallback(
        (type: PowerUp) => {
            if (!currentQuestion) return;

            setState((s) => {
                switch (type) {
                    case "dica": {
                        if (s.coins < COINS_DICA || s.showHint) return s;
                        return {
                            ...s,
                            coins: s.coins - COINS_DICA,
                            showHint: true,
                        };
                    }
                    case "fifty": {
                        if (s.coins < COINS_FIFTY || s.eliminatedOptions.length > 0)
                            return s;
                        const correct =
                            currentQuestion.correct_option.toUpperCase();
                        const wrongOptions = ["A", "B", "C", "D"].filter(
                            (o) => o !== correct
                        );
                        // Pick 2 random wrong options to eliminate
                        const shuffled = wrongOptions.sort(
                            () => Math.random() - 0.5
                        );
                        const toEliminate = shuffled.slice(0, 2);
                        return {
                            ...s,
                            coins: s.coins - COINS_FIFTY,
                            eliminatedOptions: toEliminate,
                        };
                    }
                    case "pulo": {
                        if (s.coins < COINS_PULO) return s;
                        const nextIdx = s.currentIdx + 1;
                        if (nextIdx >= s.questions.length) return s;
                        return {
                            ...s,
                            coins: s.coins - COINS_PULO,
                            currentIdx: nextIdx,
                            timer: TIMER_SECONDS,
                            showHint: false,
                            eliminatedOptions: [],
                            isBoss: s.questions[nextIdx]?.is_boss ?? false,
                        };
                    }
                    default:
                        return s;
                }
            });
        },
        [currentQuestion]
    );

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
        formatTimer,
        COINS_DICA,
        COINS_FIFTY,
        COINS_PULO,
    };
}
