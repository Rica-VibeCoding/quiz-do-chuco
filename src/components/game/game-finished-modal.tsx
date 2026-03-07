"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Crown, Map, RotateCcw, Sparkles } from "lucide-react";
import { ScribbleButton } from "@/components/ui/scribble-button";

interface GameFinishedModalProps {
  actionLoading?: boolean;
  onBackToMap: () => void;
  onRestartAdventure: () => void;
}

export function GameFinishedModal({
  actionLoading = false,
  onBackToMap,
  onRestartAdventure,
}: GameFinishedModalProps) {
  useEffect(() => {
    const duration = 2600;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ["#f97316", "#ef4444", "#22c55e", "#3b82f6", "#facc15"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ["#f97316", "#ef4444", "#22c55e", "#3b82f6", "#facc15"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.45),_rgba(15,23,42,0.92))] p-4"
    >
      <motion.div
        initial={{ scale: 0.88, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
        className="w-full max-w-xl rounded-[28px] border-[4px] border-black bg-[#fff8db] p-6 text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:p-8"
      >
        <div className="mb-4 flex items-center justify-center gap-3 text-yellow-600">
          <Sparkles className="h-8 w-8" />
          <span className="text-6xl">🏆</span>
          <Crown className="h-8 w-8" />
        </div>

        <p className="mb-2 text-sm font-bold uppercase tracking-[0.24em] text-yellow-700">
          Aventura concluída
        </p>
        <h2 className="mb-3 text-4xl font-bold text-zinc-900 md:text-5xl">
          Você zerou o Quiz do Chuco
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-lg text-zinc-700">
          As cinco fases foram vencidas. Agora a próxima etapa é deixar o jogo mais
          esperto, com perguntas mais difíceis e pegadinhas boas.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <ScribbleButton
            variant="warning"
            onClick={onBackToMap}
            disabled={actionLoading}
            className="h-14 w-full gap-2 text-lg"
          >
            <Map className="h-5 w-5" />
            Ver mapa
          </ScribbleButton>

          <ScribbleButton
            variant="success"
            onClick={onRestartAdventure}
            disabled={actionLoading}
            className="h-14 w-full gap-2 text-lg"
          >
            <RotateCcw className="h-5 w-5" />
            Jogar de novo
          </ScribbleButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
