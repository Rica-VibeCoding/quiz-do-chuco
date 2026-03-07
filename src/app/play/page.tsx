"use client";

import { Suspense, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Coins, Heart, Hourglass, Lightbulb, Loader2, Rabbit, Scissors } from "lucide-react";
import { FeedbackModal } from "@/components/game/feedback-modal";
import { GameFinishedModal } from "@/components/game/game-finished-modal";
import { GameOverModal } from "@/components/game/game-over-modal";
import { LevelCompleteModal } from "@/components/game/level-complete-modal";
import { ScribbleButton } from "@/components/ui/scribble-button";
import { useGameState } from "@/hooks/use-game-state";

function PlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const level = Number(searchParams.get("level")) || 1;
  const game = useGameState(level);

  useEffect(() => {
    if (!game.loading && !game.player) {
      router.replace("/");
      return;
    }

    if (!game.loading && game.lockedLevel) {
      router.replace("/map");
    }
  }, [game.loading, game.lockedLevel, game.player, router]);

  if (game.loading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!game.player || game.lockedLevel) {
    return null;
  }

  if (game.questions.length === 0) {
    return (
      <div className="flex h-dvh items-center justify-center px-6 text-center">
        <p className="text-2xl font-bold">Nenhuma pergunta encontrada para esta fase.</p>
      </div>
    );
  }

  const q = game.currentQuestion;
  if (!q) return null;

  const optionColors = ["primary", "success", "warning", "danger"] as const;
  const optionKeys = ["A", "B", "C", "D"] as const;
  const optionFields = ["option_a", "option_b", "option_c", "option_d"] as const;
  const timerDanger = game.timer <= 15;

  const handleRestartAdventure = async () => {
    await game.restartAdventure();
    router.push("/map");
  };

  const handleRetryLevel = async () => {
    await game.retryLevel();
  };

  return (
    <main
      className={`relative flex min-h-dvh flex-col items-center overflow-hidden px-3 py-2 text-zinc-900 md:p-4 ${
        game.isBoss
          ? "bg-[radial-gradient(circle_at_top,_#fde68a,_#fca5a5_45%,_#c084fc)]"
          : "bg-[radial-gradient(circle_at_top,_#fef3c7,_#dbeafe_42%,_#bfdbfe)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <div className="absolute left-[-5%] top-12 h-24 w-24 rounded-full bg-white/60 blur-xl" />
        <div className="absolute right-[8%] top-24 h-36 w-36 rounded-full bg-white/40 blur-xl" />
        <div className="absolute bottom-20 left-[10%] h-28 w-28 rounded-full bg-white/40 blur-xl" />
      </div>

      <header className="z-10 mb-2 mt-1 flex w-full max-w-4xl items-center justify-between md:mb-6 md:mt-4">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:border-[3px] md:px-4 md:py-2"
        >
          <Heart className="h-5 w-5 fill-red-500 text-red-600 md:h-7 md:w-7" />
          <span className="text-base font-bold md:text-xl">{game.lives}</span>
        </motion.div>

        <div
          className={`flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:border-[3px] md:px-4 md:py-2 ${
            timerDanger ? "border-red-500" : ""
          }`}
        >
          <Hourglass
            className={`h-5 w-5 md:h-7 md:w-7 ${
              timerDanger ? "animate-pulse text-red-500" : "animate-pulse text-blue-500"
            }`}
          />
          <span className={`text-base font-bold md:text-xl ${timerDanger ? "text-red-600" : ""}`}>
            {game.formatTimer(game.timer)}
          </span>
        </div>

        <motion.div
          whileHover={{ rotate: 10 }}
          className="flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:border-[3px] md:px-4 md:py-2"
        >
          <Coins className="h-5 w-5 fill-yellow-400 text-yellow-500 md:h-7 md:w-7" />
          <span className="text-base font-bold md:text-xl">{game.coins}</span>
        </motion.div>
      </header>

      <div className="z-10 mb-2 flex w-full max-w-4xl items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 md:mb-4 md:text-sm">
        <span>Fase {level}</span>
        <span>
          Pergunta {game.currentIdx + 1} / {game.questions.length}
        </span>
      </div>

      {game.isBoss && (
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="z-10 mb-3 w-full max-w-4xl rounded-[28px] border-[3px] border-black bg-[#3b0764]/90 p-3 text-center text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:mb-4 md:p-5"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl md:text-5xl">👾</span>
            <div>
              <p className="text-base font-bold md:text-2xl">Boss Fight</p>
              <p className="text-xs text-purple-100 md:text-sm">
                &quot;Meehh, eu não sei isso. Aposto que você também não sabe.&quot;
              </p>
            </div>
            <span className="text-3xl md:text-5xl">🦸</span>
          </div>
        </motion.div>
      )}

      <div className="z-10 flex w-full max-w-4xl flex-1 flex-col gap-3 md:gap-5">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[30px] border-[4px] border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-10 ${
            game.isBoss ? "bg-[#1f1147] text-white" : "bg-[#14213d] text-white"
          }`}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="rounded-full border-2 border-white/40 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white/90">
              {q.category}
            </span>
            {q.difficulty && (
              <span className="rounded-full border-2 border-white/40 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white/90">
                {q.difficulty}
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold leading-snug md:text-4xl">{q.text}</h2>

          {q.img_url && (
            <div className="mt-4 flex justify-center">
              <Image
                src={q.img_url}
                alt="Ilustração da pergunta"
                width={640}
                height={360}
                unoptimized
                className="max-h-28 w-auto rounded-2xl border-2 border-white/30 object-cover md:max-h-56"
              />
            </div>
          )}
        </motion.div>

        {game.showHint && q.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-[24px] border-[3px] border-black bg-[#fef3c7] p-3 text-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] md:p-4"
          >
            <span className="mr-2 text-lg">💡</span>
            <span className="text-sm font-bold text-yellow-900 md:text-lg">{q.hint}</span>
          </motion.div>
        )}

        <div className="grid flex-1 grid-cols-2 gap-3 md:gap-5">
          {optionKeys.map((key, i) => {
            const isEliminated = game.eliminatedOptions.includes(key);
            const text = q[optionFields[i]];

            return (
              <ScribbleButton
                key={key}
                variant={optionColors[i]}
                className={`min-h-[5rem] w-full text-sm leading-tight md:min-h-[8rem] md:text-2xl ${
                  isEliminated ? "pointer-events-none opacity-30 line-through" : ""
                }`}
                disabled={isEliminated || game.feedbackType !== null || game.gameOver}
                onClick={() => game.handleAnswer(key)}
              >
                {text}
              </ScribbleButton>
            );
          })}
        </div>

        <div className="mb-2 grid w-full grid-cols-3 gap-2 md:mb-6 md:gap-3">
          <button
            onClick={() => game.usePowerUp("dica")}
            disabled={game.coins < game.COINS_DICA || game.showHint || !q.hint}
            className="flex items-center justify-center gap-1 rounded-full border-2 border-black bg-yellow-100 px-2 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-40 md:gap-2 md:px-4 md:text-sm"
          >
            <Lightbulb className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Dica</span> {game.COINS_DICA} 🪙
          </button>
          <button
            onClick={() => game.usePowerUp("fifty")}
            disabled={game.coins < game.COINS_FIFTY || game.eliminatedOptions.length > 0}
            className="flex items-center justify-center gap-1 rounded-full border-2 border-black bg-blue-100 px-2 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-40 md:gap-2 md:px-4 md:text-sm"
          >
            <Scissors className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">50/50</span> {game.COINS_FIFTY} 🪙
          </button>
          <button
            onClick={() => game.usePowerUp("pulo")}
            disabled={game.coins < game.COINS_PULO || game.currentIdx + 1 >= game.questions.length}
            className="flex items-center justify-center gap-1 rounded-full border-2 border-black bg-green-100 px-2 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-40 md:gap-2 md:px-4 md:text-sm"
          >
            <Rabbit className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Pular</span> {game.COINS_PULO} 🪙
          </button>
        </div>
      </div>

      <FeedbackModal
        type={game.feedbackType}
        message={game.feedbackMessage}
        onDismiss={game.dismissFeedback}
      />

      {game.levelComplete && <LevelCompleteModal level={level} />}

      {game.gameOver && (
        <GameOverModal
          actionLoading={game.actionLoading}
          onRetryLevel={handleRetryLevel}
          onRestartAdventure={handleRestartAdventure}
          onBackToMap={() => router.push("/map")}
        />
      )}

      {game.gameFinished && (
        <GameFinishedModal
          actionLoading={game.actionLoading}
          onBackToMap={() => router.push("/map")}
          onRestartAdventure={handleRestartAdventure}
        />
      )}
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}
