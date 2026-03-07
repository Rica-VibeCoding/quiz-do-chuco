"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { ScribbleButton } from "@/components/ui/scribble-button";
import { LEVELS } from "@/lib/game-config";

interface LevelCompleteModalProps {
  level: number;
}

export function LevelCompleteModal({ level }: LevelCompleteModalProps) {
  const router = useRouter();

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#22c55e", "#ef4444", "#fde047", "#a855f7"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#22c55e", "#ef4444", "#fde047", "#a855f7"],
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 12 }}
        className="relative w-full max-w-md rounded-[5px_225px_15px_255px/255px_15px_225px_15px] border-[3px] border-black bg-yellow-50 p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:border-[4px] md:p-10 md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="mb-3 text-6xl md:mb-4 md:text-8xl">🏆</div>

        <h2 className="mb-1 text-3xl font-bold text-yellow-800 md:mb-2 md:text-4xl">
          Muito bom!!
        </h2>
        <p className="mb-1 text-xl text-zinc-700 md:mb-2 md:text-2xl">
          Você completou o desafio!
        </p>
        <p className="mb-5 text-base text-zinc-500 md:mb-8 md:text-lg">
          {LEVELS.find((entry) => entry.id === level)?.name || `Fase ${level}`}
        </p>

        <ScribbleButton
          variant="success"
          onClick={() => router.push("/map")}
          className="w-full text-xl md:text-2xl"
          animated
        >
          Voltar ao mapa!
        </ScribbleButton>
      </motion.div>
    </motion.div>
  );
}
