"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { ScribbleButton } from "@/components/ui/scribble-button";
import { Heart, Coins, Hourglass, Loader2, Lightbulb, Scissors, Rabbit } from "lucide-react";
import { useGameState } from "@/hooks/use-game-state";
import { FeedbackModal } from "@/components/game/feedback-modal";
import { LevelCompleteModal } from "@/components/game/level-complete-modal";

function PlayContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const level = Number(searchParams.get("level")) || 1;

    const game = useGameState(level);

    // Redirect if no player
    if (!game.loading && !game.player) {
        router.push("/");
        return null;
    }

    if (game.loading) {
        return (
            <div className="flex h-dvh items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (game.questions.length === 0) {
        return (
            <div className="flex h-dvh items-center justify-center">
                <p className="text-2xl font-bold">Nenhuma pergunta encontrada :/</p>
            </div>
        );
    }

    const q = game.currentQuestion;
    if (!q) return null;

    const optionColors = ["primary", "success", "warning", "danger"] as const;
    const optionKeys = ["A", "B", "C", "D"] as const;
    const optionFields = ["option_a", "option_b", "option_c", "option_d"] as const;

    const timerDanger = game.timer <= 15;

    return (
        <main className={`flex h-dvh flex-col items-center px-3 py-2 md:p-4 font-sans text-zinc-800 transition-colors duration-500 overflow-y-auto ${game.isBoss ? "bg-gradient-to-b from-purple-100 to-red-100" : ""}`}>

            {/* HUD - compact on mobile */}
            <header className="flex w-full max-w-3xl items-center justify-between mb-2 md:mb-6 mt-1 md:mt-4 shrink-0">
                {/* Lives */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1.5 bg-white border-2 md:border-[3px] border-black rounded-full px-2.5 py-1 md:px-4 md:py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Heart className="w-5 h-5 md:w-7 md:h-7 fill-red-500 text-red-600" />
                    <span className="text-base md:text-xl font-bold">{game.lives}</span>
                </motion.div>

                {/* Timer */}
                <div className={`flex items-center gap-1.5 bg-white border-2 md:border-[3px] border-black rounded-full px-2.5 py-1 md:px-4 md:py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${timerDanger ? "border-red-500" : ""}`}>
                    <Hourglass className={`w-5 h-5 md:w-7 md:h-7 ${timerDanger ? "text-red-500 animate-pulse" : "text-blue-500 animate-pulse"}`} />
                    <span className={`text-base md:text-xl font-bold ${timerDanger ? "text-red-600" : ""}`}>
                        {game.formatTimer(game.timer)}
                    </span>
                </div>

                {/* Coins */}
                <motion.div
                    whileHover={{ rotate: 10 }}
                    className="flex items-center gap-1.5 bg-white border-2 md:border-[3px] border-black rounded-full px-2.5 py-1 md:px-4 md:py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Coins className="w-5 h-5 md:w-7 md:h-7 fill-yellow-400 text-yellow-500" />
                    <span className="text-base md:text-xl font-bold">{game.coins}</span>
                </motion.div>
            </header>

            {/* Progress indicator */}
            <div className="w-full max-w-3xl mb-1.5 md:mb-4 flex items-center justify-between text-xs md:text-sm text-zinc-500 font-bold shrink-0">
                <span>Fase {level}</span>
                <span>Pergunta {game.currentIdx + 1} / {game.questions.length}</span>
            </div>

            {/* Boss Fight banner */}
            {game.isBoss && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full max-w-3xl mb-2 md:mb-4 bg-purple-200 border-2 md:border-[3px] border-black rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-2 md:p-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0"
                >
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl md:text-4xl">👾</span>
                        <div>
                            <p className="text-base md:text-xl font-bold text-purple-800">Boss Fight!</p>
                            <p className="text-xs md:text-sm text-purple-600 hidden sm:block">
                                &quot;Meehh, eu nao sei isso! Aposto que voce tambem nao sabe!&quot;
                            </p>
                        </div>
                        <span className="text-2xl md:text-4xl">🦸</span>
                    </div>
                </motion.div>
            )}

            {/* Question + Answers + Power-ups - flex-1 to fill remaining space */}
            <div className="flex flex-col w-full max-w-3xl items-center gap-2 md:gap-6 flex-1 min-h-0">
                {/* Question card */}
                <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`w-full p-4 md:p-12 border-[3px] md:border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-[5px_225px_15px_255px/255px_15px_225px_15px] relative shrink-0 ${game.isBoss ? "bg-purple-900 text-white" : "bg-[#1e293b] text-white"}`}
                >
                    <h2 className="text-lg md:text-4xl font-bold text-center leading-snug">
                        {q.text}
                    </h2>

                    {q.img_url && (
                        <div className="mt-2 flex justify-center">
                            <img
                                src={q.img_url}
                                alt="Ilustracao da pergunta"
                                className="max-h-24 md:max-h-48 rounded-lg border-2 border-white/30"
                            />
                        </div>
                    )}
                </motion.div>

                {/* Hint display */}
                {game.showHint && q.hint && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="w-full bg-yellow-100 border-2 md:border-[3px] border-black rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-2 md:p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0"
                    >
                        <span className="text-lg mr-1">💡</span>
                        <span className="text-sm md:text-lg font-bold text-yellow-800">{q.hint}</span>
                    </motion.div>
                )}

                {/* Alternatives - 2 columns always on mobile to save vertical space */}
                <div className="grid grid-cols-2 gap-2 md:gap-6 w-full flex-1 min-h-0">
                    {optionKeys.map((key, i) => {
                        const isEliminated = game.eliminatedOptions.includes(key);
                        const text = q[optionFields[i]];

                        return (
                            <ScribbleButton
                                key={key}
                                variant={optionColors[i]}
                                className={`w-full h-full min-h-[3.5rem] md:min-h-[7rem] text-sm md:text-2xl leading-tight ${isEliminated ? "line-through opacity-30 pointer-events-none" : ""}`}
                                disabled={isEliminated || game.feedbackType !== null}
                                onClick={() => game.handleAnswer(key)}
                            >
                                {text}
                            </ScribbleButton>
                        );
                    })}
                </div>

                {/* Power-ups - compact row */}
                <div className="flex gap-2 md:gap-3 mb-2 md:mb-8 justify-center shrink-0 w-full">
                    <button
                        onClick={() => game.usePowerUp("dica")}
                        disabled={game.coins < game.COINS_DICA || game.showHint || !q.hint}
                        className="flex items-center gap-1 md:gap-2 bg-yellow-100 border-2 border-black rounded-full px-2.5 py-1.5 md:px-4 md:py-2 font-bold text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-200 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <Lightbulb className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Dica</span> {game.COINS_DICA}🪙
                    </button>
                    <button
                        onClick={() => game.usePowerUp("fifty")}
                        disabled={game.coins < game.COINS_FIFTY || game.eliminatedOptions.length > 0}
                        className="flex items-center gap-1 md:gap-2 bg-blue-100 border-2 border-black rounded-full px-2.5 py-1.5 md:px-4 md:py-2 font-bold text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-200 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <Scissors className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">50/50</span> {game.COINS_FIFTY}🪙
                    </button>
                    <button
                        onClick={() => game.usePowerUp("pulo")}
                        disabled={game.coins < game.COINS_PULO || game.currentIdx + 1 >= game.questions.length}
                        className="flex items-center gap-1 md:gap-2 bg-green-100 border-2 border-black rounded-full px-2.5 py-1.5 md:px-4 md:py-2 font-bold text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-200 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <Rabbit className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Pular</span> {game.COINS_PULO}🪙
                    </button>
                </div>
            </div>

            {/* Feedback Modal */}
            <FeedbackModal
                type={game.feedbackType}
                message={game.feedbackMessage}
                onDismiss={game.dismissFeedback}
            />

            {/* Level Complete */}
            {game.levelComplete && <LevelCompleteModal level={level} />}
        </main>
    );
}

export default function PlayPage() {
    return (
        <Suspense fallback={
            <div className="flex h-dvh items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-zinc-500" />
            </div>
        }>
            <PlayContent />
        </Suspense>
    );
}
