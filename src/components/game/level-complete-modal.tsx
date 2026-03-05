"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ScribbleButton } from "@/components/ui/scribble-button";
import confetti from "canvas-confetti";

interface LevelCompleteModalProps {
    level: number;
}

const LEVEL_NAMES: Record<number, string> = {
    1: "A Floresta das Letras",
    2: "O Deserto dos Numeros",
    3: "O Oceano Animal",
    4: "A Cidade Tecnologica",
    5: "O Laboratorio Secreto",
};

export function LevelCompleteModal({ level }: LevelCompleteModalProps) {
    const router = useRouter();

    useEffect(() => {
        // Fire confetti
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
                className="relative w-full max-w-md p-10 bg-yellow-50 border-[4px] border-black text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-[5px_225px_15px_255px/255px_15px_225px_15px]"
            >
                <div className="text-8xl mb-4">🏆</div>

                <h2 className="text-4xl font-bold text-yellow-800 mb-2">
                    Muito bom!!
                </h2>
                <p className="text-2xl text-zinc-700 mb-2">
                    Voce completou o desafio!
                </p>
                <p className="text-lg text-zinc-500 mb-8">
                    {LEVEL_NAMES[level] || `Fase ${level}`}
                </p>

                <ScribbleButton
                    variant="success"
                    onClick={() => router.push("/map")}
                    className="text-2xl w-full"
                    animated
                >
                    Voltar ao Mapa!
                </ScribbleButton>
            </motion.div>
        </motion.div>
    );
}
