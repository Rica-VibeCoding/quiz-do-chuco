"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ScribbleButton } from "@/components/ui/scribble-button";
import { getPlayerAction } from "@/presentation/actions/game.actions";
import { PlayerDTO } from "@/application/player/dtos/player.dto";
import { Loader2 } from "lucide-react";

const LEVELS = [
    { id: 1, name: "A Floresta das Letras", emoji: "🌲", color: "success" as const },
    { id: 2, name: "O Deserto dos Numeros", emoji: "🏜️", color: "warning" as const },
    { id: 3, name: "O Oceano Animal", emoji: "🌊", color: "primary" as const },
    { id: 4, name: "A Cidade Tecnologica", emoji: "🏙️", color: "secondary" as const },
    { id: 5, name: "O Laboratorio Secreto", emoji: "🔬", color: "danger" as const },
];

export default function MapPage() {
    const router = useRouter();
    const [player, setPlayer] = useState<PlayerDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem("quiz_player_id");
        if (!id) {
            router.push("/");
            return;
        }

        async function loadPlayer() {
            const res = await getPlayerAction(id!);
            if ("data" in res && res.data) {
                setPlayer(res.data);
            } else {
                router.push("/");
            }
            setLoading(false);
        }

        loadPlayer();
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-zinc-500" />
            </div>
        );
    }

    const currentLevel = player?.current_level ?? 1;

    return (
        <main className="flex min-h-screen flex-col items-center p-6">
            <motion.h1
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-5xl font-bold text-zinc-800 mb-2 mt-8 rotate-[-1deg]"
            >
                Mapa do Tesouro
            </motion.h1>
            <p className="text-xl text-zinc-500 mb-10">
                Escolha sua aventura, {player?.nickname}!
            </p>

            <div className="flex flex-col gap-6 w-full max-w-md">
                {LEVELS.map((level, i) => {
                    const isUnlocked = level.id <= currentLevel;
                    const isCurrent = level.id === currentLevel;

                    return (
                        <motion.div
                            key={level.id}
                            initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ScribbleButton
                                variant={isUnlocked ? level.color : "primary"}
                                className={`w-full text-left h-auto py-5 px-6 text-xl flex items-center gap-4 ${!isUnlocked ? "opacity-40 grayscale" : ""}`}
                                disabled={!isUnlocked}
                                animated={isCurrent}
                                onClick={() => router.push(`/play?level=${level.id}`)}
                            >
                                <span className="text-4xl">{isUnlocked ? level.emoji : "🔒"}</span>
                                <div className="flex flex-col">
                                    <span className="font-bold">Fase {level.id}</span>
                                    <span className="text-base opacity-80">{level.name}</span>
                                </div>
                            </ScribbleButton>
                        </motion.div>
                    );
                })}
            </div>

            {/* Player stats */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 flex gap-6 text-xl font-bold text-zinc-600"
            >
                <span>❤️ {player?.lives ?? 10}</span>
                <span>🪙 {player?.coins ?? 100}</span>
            </motion.div>
        </main>
    );
}
