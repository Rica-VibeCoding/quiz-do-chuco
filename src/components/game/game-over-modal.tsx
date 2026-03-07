"use client";

import { motion } from "framer-motion";
import { Map, RotateCcw, Skull } from "lucide-react";
import { ScribbleButton } from "@/components/ui/scribble-button";

interface GameOverModalProps {
  actionLoading?: boolean;
  onRetryLevel: () => void;
  onRestartAdventure: () => void;
  onBackToMap: () => void;
}

export function GameOverModal({
  actionLoading = false,
  onRetryLevel,
  onRestartAdventure,
  onBackToMap,
}: GameOverModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.35),_rgba(0,0,0,0.82))] p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="w-full max-w-lg rounded-[24px] border-[4px] border-black bg-[#fff4e8] p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8"
      >
        <div className="mb-5 flex items-center justify-center gap-3 text-red-600">
          <Skull className="h-10 w-10" />
          <span className="text-5xl">💥</span>
          <Skull className="h-10 w-10" />
        </div>

        <p className="mb-2 text-sm font-bold uppercase tracking-[0.24em] text-red-600">
          Fôlego zerado
        </p>
        <h2 className="mb-3 text-4xl font-bold text-zinc-900 md:text-5xl">Hora de respirar</h2>
        <p className="mx-auto mb-6 max-w-md text-lg text-zinc-700">
          Essa fase apertou mais do que devia. Você pode tentar de novo, voltar ao mapa
          ou recomeçar a aventura inteira.
        </p>

        <div className="grid gap-3">
          <ScribbleButton
            variant="success"
            onClick={onRetryLevel}
            disabled={actionLoading}
            className="h-16 w-full gap-2 text-xl"
          >
            <RotateCcw className="h-5 w-5" />
            Tentar esta fase de novo
          </ScribbleButton>

          <ScribbleButton
            variant="warning"
            onClick={onBackToMap}
            disabled={actionLoading}
            className="h-14 w-full gap-2 text-lg"
          >
            <Map className="h-5 w-5" />
            Voltar ao mapa
          </ScribbleButton>

          <ScribbleButton
            variant="danger"
            onClick={onRestartAdventure}
            disabled={actionLoading}
            className="h-14 w-full text-lg"
          >
            Recomeçar tudo
          </ScribbleButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
