"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Loader2, Lock, Sparkles } from "lucide-react";
import { PlayerDTO } from "@/application/player/dtos/player.dto";
import { ScribbleButton } from "@/components/ui/scribble-button";
import { LEVELS, MAX_LEVEL, STORAGE_KEYS } from "@/lib/game-config";
import { getPlayerAction } from "@/presentation/actions/game.actions";

export default function MapPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEYS.playerId);
    if (!id) {
      router.replace("/");
      return;
    }
    const playerId = id;

    async function loadPlayer() {
      const res = await getPlayerAction(playerId);
      if ("data" in res && res.data) {
        setPlayer(res.data);
      } else {
        router.replace("/");
      }
      setLoading(false);
    }

    loadPlayer();
  }, [router]);

  const currentLevel = player?.current_level ?? 1;
  const completedLevels = Math.max(0, Math.min(currentLevel - 1, MAX_LEVEL));

  const treasureLabel = useMemo(() => {
    if (currentLevel > MAX_LEVEL) return "Modo campeão desbloqueado em breve";
    return `Fase ${currentLevel} pronta para jogar`;
  }, [currentLevel]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,_#fff7cc,_#ffd9b8_38%,_#f6efe4)] px-4 py-6 md:px-6">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-[-5%] top-12 h-40 w-40 rounded-full bg-white blur-3xl" />
        <div className="absolute right-[5%] top-24 h-56 w-56 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute bottom-10 left-[20%] h-40 w-40 rounded-full bg-yellow-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-6 grid gap-4 md:mb-8 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border-[4px] border-black bg-[#fff7e8] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="mb-3 flex items-center gap-3 text-zinc-900">
              <Compass className="h-8 w-8 text-orange-500" />
              <span className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">
                Mapa do Tesouro
              </span>
            </div>

            <h1 className="mb-2 text-4xl font-bold text-zinc-900 md:text-6xl">Rota do Chuco</h1>
            <p className="max-w-2xl text-lg text-zinc-700 md:text-xl">
              Cada parada tem uma fase com mais pressão, mais atenção e mais chance de
              pegadinha. O caminho continua com a sua cara, mas agora vai exigir mais
              esperteza.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-[32px] border-[4px] border-black bg-[#13213b] p-6 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-yellow-300">
              Explorador
            </p>
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">{player?.nickname}</h2>
            <div className="grid gap-2 text-base md:text-lg">
              <p>Vidas: {player?.lives ?? 10}</p>
              <p>Moedas: {player?.coins ?? 100}</p>
              <p>Fases completas: {completedLevels} / {MAX_LEVEL}</p>
              <p className="text-yellow-300">{treasureLabel}</p>
            </div>
          </motion.div>
        </header>

        <section className="relative rounded-[36px] border-[4px] border-black bg-[#f3e3be] p-5 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:p-8">
          <div className="absolute left-[13%] top-24 hidden h-[72%] w-[6px] rounded-full border-2 border-dashed border-black/50 bg-[repeating-linear-gradient(to_bottom,_#f59e0b_0,_#f59e0b_24px,_transparent_24px,_transparent_42px)] md:block" />

          <div className="grid gap-5 md:gap-7">
            {LEVELS.map((level, index) => {
              const isUnlocked = level.id <= currentLevel;
              const isCurrent = level.id === currentLevel;
              const isCompleted = level.id < currentLevel || currentLevel > MAX_LEVEL;

              return (
                <motion.article
                  key={level.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`relative rounded-[28px] border-[4px] border-black p-4 shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] md:p-5 ${
                    isUnlocked ? "bg-white" : "bg-[#efe4cb]"
                  } ${index % 2 === 1 ? "md:ml-14" : "md:mr-14"}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[4px] border-black bg-white text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        style={{ boxShadow: `4px 4px 0 0 ${level.accent}` }}
                      >
                        {isUnlocked ? level.emoji : <Lock className="h-7 w-7 text-zinc-500" />}
                      </div>

                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border-2 border-black bg-[#fff7cc] px-3 py-1 text-xs font-bold uppercase tracking-[0.24em]">
                            Fase {level.id}
                          </span>
                          {isCurrent && (
                            <span className="rounded-full border-2 border-black bg-[#dcfce7] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]">
                              Agora
                            </span>
                          )}
                          {isCompleted && (
                            <span className="rounded-full border-2 border-black bg-[#dbeafe] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]">
                              Concluída
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">
                          {level.name}
                        </h2>
                        <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-zinc-500">
                          {level.terrain}
                        </p>
                        <p className="mt-2 max-w-2xl text-base text-zinc-700 md:text-lg">
                          {level.mood}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:min-w-56">
                      <ScribbleButton
                        variant={level.color}
                        className="h-14 w-full text-lg"
                        disabled={!isUnlocked}
                        animated={isCurrent}
                        onClick={() => router.push(`/play?level=${level.id}`)}
                      >
                        {isUnlocked ? "Entrar na fase" : "Bloqueada"}
                      </ScribbleButton>

                      <div className="rounded-[20px] border-2 border-dashed border-black bg-[#fffaf0] px-4 py-3 text-sm font-bold text-zinc-700">
                        {level.id >= 4
                          ? "Mais difícil e com pegadinhas leves."
                          : "Aquecimento inteligente."}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-[28px] border-[4px] border-black bg-[#fffdf7] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-600">
              Próximo salto
            </p>
          </div>
          <p className="text-base text-zinc-700 md:text-lg">
            A próxima rodada do projeto vai aumentar a dificuldade das perguntas,
            introduzir pegadinhas boas e aproveitar a API de questões como fonte de
            conteúdo revisado.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
