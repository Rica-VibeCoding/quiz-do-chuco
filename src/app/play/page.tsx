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
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (game.questions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center">
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
        <main className={`flex min-h-screen flex-col items-center p-4 font-sans text-zinc-800 transition-colors duration-500 ${game.isBoss ? "bg-gradient-to-b from-purple-100 to-red-100" : ""}`}>

            {/* HUD */}
            <header className="flex w-full max-w-3xl items-center justify-between mb-6 mt-4">
                {/* Lives */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-2 bg-white border-[3px] border-black rounded-full px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Heart className="w-7 h-7 fill-red-500 text-red-600" />
                    <span className="text-xl font-bold">{game.lives}</span>
                </motion.div>

                {/* Timer */}
                <div className={`flex items-center gap-2 bg-white border-[3px] border-black rounded-full px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${timerDanger ? "border-red-500" : ""}`}>
                    <Hourglass className={`w-7 h-7 ${timerDanger ? "text-red-500 animate-pulse" : "text-blue-500 animate-pulse"}`} />
                    <span className={`text-xl font-bold ${timerDanger ? "text-red-600" : ""}`}>
                        {game.formatTimer(game.timer)}
                    </span>
                </div>

                {/* Coins */}
                <motion.div
                    whileHover={{ rotate: 10 }}
                    className="flex items-center gap-2 bg-white border-[3px] border-black rounded-full px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Coins className="w-7 h-7 fill-yellow-400 text-yellow-500" />
                    <span className="text-xl font-bold">{game.coins}</span>
                </motion.div>
            </header>

            {/* Progress indicator */}
            <div className="w-full max-w-3xl mb-4 flex items-center justify-between text-sm text-zinc-500 font-bold">
                <span>Fase {level}</span>
                <span>Pergunta {game.currentIdx + 1} / {game.questions.length}</span>
            </div>

            {/* Boss Fight banner */}
            {game.isBoss && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full max-w-3xl mb-4 bg-purple-200 border-[3px] border-black rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl">👾</span>
                        <div>
                            <p className="text-xl font-bold text-purple-800">Boss Fight!</p>
                            <p className="text-sm text-purple-600">
                                &quot;Meehh, eu nao sei isso! Aposto que voce tambem nao sabe!&quot;
                            </p>
                        </div>
                        <span className="text-4xl">🦸</span>
                    </div>
                </motion.div>
            )}

            {/* Question */}
            <div className="flex flex-col w-full max-w-3xl items-center gap-6">
                <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`w-full p-8 md:p-12 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-[5px_225px_15px_255px/255px_15px_225px_15px] relative ${game.isBoss ? "bg-purple-900 text-white" : "bg-[#1e293b] text-white"}`}
                >
                    <div className="absolute top-2 left-4 text-zinc-500 opacity-50 rotate-[-5deg]">
                        {game.isBoss ? "⚔️" : "✏️"}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-center leading-snug">
                        {q.text}
                    </h2>

                    {/* Image if available */}
                    {q.img_url && (
                        <div className="mt-4 flex justify-center">
                            <img
                                src={q.img_url}
                                alt="Ilustracao da pergunta"
                                className="max-h-48 rounded-lg border-2 border-white/30"
                            />
                        </div>
                    )}
                </motion.div>

                {/* Hint display */}
                {game.showHint && q.hint && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="w-full bg-yellow-100 border-[3px] border-black rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <span className="text-2xl mr-2">💡</span>
                        <span className="text-lg font-bold text-yellow-800">{q.hint}</span>
                    </motion.div>
                )}

                {/* Alternatives */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
                    {optionKeys.map((key, i) => {
                        const isEliminated = game.eliminatedOptions.includes(key);
                        const text = q[optionFields[i]];

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: isEliminated ? 0.3 : 1 }}
                                animate={{ opacity: isEliminated ? 0.2 : 1 }}
                            >
                                <ScribbleButton
                                    variant={optionColors[i]}
                                    className={`w-full h-24 md:h-28 text-xl md:text-2xl ${isEliminated ? "line-through opacity-30 pointer-events-none" : ""}`}
                                    disabled={isEliminated || game.feedbackType !== null}
                                    onClick={() => game.handleAnswer(key)}
                                >
                                    {text}
                                </ScribbleButton>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Power-ups */}
                <div className="flex flex-wrap gap-3 mt-2 mb-8 justify-center">
                    <button
                        onClick={() => game.usePowerUp("dica")}
                        disabled={game.coins < game.COINS_DICA || game.showHint || !q.hint}
                        className="flex items-center gap-2 bg-yellow-100 border-2 border-black rounded-full px-4 py-2 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-200 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <Lightbulb className="w-5 h-5" />
                        Dica ({game.COINS_DICA} 🪙)
                    </button>
                    <button
                        onClick={() => game.usePowerUp("fifty")}
                        disabled={game.coins < game.COINS_FIFTY || game.eliminatedOptions.length > 0}
                        className="flex items-center gap-2 bg-blue-100 border-2 border-black rounded-full px-4 py-2 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-200 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <Scissors className="w-5 h-5" />
                        50/50 ({game.COINS_FIFTY} 🪙)
                    </button>
                    <button
                        onClick={() => game.usePowerUp("pulo")}
                        disabled={game.coins < game.COINS_PULO || game.currentIdx + 1 >= game.questions.length}
                        className="flex items-center gap-2 bg-green-100 border-2 border-black rounded-full px-4 py-2 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-200 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <Rabbit className="w-5 h-5" />
                        Pular ({game.COINS_PULO} 🪙)
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
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-zinc-500" />
            </div>
        }>
            <PlayContent />
        </Suspense>
    );
}
