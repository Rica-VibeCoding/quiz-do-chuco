"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PlayerDTO } from "@/application/player/dtos/player.dto";
import { Input } from "@/components/ui/input";
import { ScribbleButton } from "@/components/ui/scribble-button";
import { DEFAULT_PROGRESS, STORAGE_KEYS } from "@/lib/game-config";
import {
  getPlayerAction,
  saveProgressAction,
  startOrResumeGameAction,
} from "@/presentation/actions/game.actions";

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingPlayer, setExistingPlayer] = useState<PlayerDTO | null>(null);
  const [checkingPlayer, setCheckingPlayer] = useState(true);

  useEffect(() => {
    async function checkExisting() {
      const id = localStorage.getItem(STORAGE_KEYS.playerId);
      const savedNickname = localStorage.getItem(STORAGE_KEYS.playerNickname);

      if (id) {
        const playerId = id;
        const res = await getPlayerAction(playerId);
        if ("data" in res && res.data) {
          setExistingPlayer(res.data);
          if (savedNickname) setNickname(savedNickname);
        }
      }

      setCheckingPlayer(false);
    }

    checkExisting();
  }, []);

  const handlePlay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || loading) return;

    setLoading(true);

    try {
      const response = await startOrResumeGameAction(nickname);

      if ("error" in response) {
        alert(response.error);
        return;
      }

      if ("data" in response && response.data) {
        localStorage.setItem(STORAGE_KEYS.playerId, response.data.id as string);
        localStorage.setItem(STORAGE_KEYS.playerNickname, response.data.nickname);
        router.push("/map");
      }
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao iniciar o jogo!");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push("/map");
  };

  const handleRestart = async () => {
    if (!existingPlayer?.id || loading) return;

    setLoading(true);

    try {
      const response = await saveProgressAction(existingPlayer.id, DEFAULT_PROGRESS);
      if ("error" in response) {
        alert(response.error);
        return;
      }

      localStorage.setItem(STORAGE_KEYS.playerId, existingPlayer.id);
      localStorage.setItem(STORAGE_KEYS.playerNickname, existingPlayer.nickname);
      setExistingPlayer(null);
      setNickname("");
      router.push("/map");
    } catch (error) {
      console.error(error);
      alert("Não foi possível reiniciar a aventura.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingPlayer) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center p-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-800" />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute left-10 top-10 rotate-[-12deg] text-6xl opacity-20">
        ⭐
      </div>
      <div className="pointer-events-none absolute bottom-20 right-10 rotate-[15deg] text-6xl opacity-20">
        🚀
      </div>
      <div className="pointer-events-none absolute right-20 top-40 rotate-[45deg] text-5xl opacity-20">
        🖍️
      </div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="z-10 w-full max-w-sm text-center"
      >
        <h1 className="mb-2 rotate-[-2deg] text-5xl font-bold text-[#ef4444] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] md:text-7xl">
          O Quiz
        </h1>
        <h2 className="mb-12 rotate-[1deg] text-4xl font-bold text-[#3b82f6] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] md:text-6xl">
          do Chuco!
        </h2>

        {existingPlayer ? (
          <div className="flex flex-col gap-4">
            <p className="text-xl font-bold text-zinc-700">Olá de volta, {existingPlayer.nickname}!</p>
            <p className="text-zinc-500">
              Fase {existingPlayer.current_level} - Pergunta {existingPlayer.current_question}
            </p>

            <ScribbleButton
              variant="success"
              animated
              onClick={handleContinue}
              className="mt-2 h-20 w-full text-3xl"
            >
              Continuar aventura!
            </ScribbleButton>

            <ScribbleButton
              variant="danger"
              onClick={handleRestart}
              className="h-14 w-full text-lg"
            >
              Recomeçar do zero
            </ScribbleButton>
          </div>
        ) : (
          <form onSubmit={handlePlay} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="nickname" className="ml-2 text-left text-xl font-bold text-zinc-800">
                Qual o seu apelido de herói?
              </label>
              <Input
                id="nickname"
                type="text"
                placeholder="Ex: chuco"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-center"
                maxLength={15}
              />
            </div>

            <ScribbleButton
              type="submit"
              variant="success"
              animated
              disabled={!nickname.trim() || loading}
              className="mt-4 h-20 w-full text-3xl"
            >
              {loading ? "CARREGANDO..." : "JOGAR!"}
            </ScribbleButton>
          </form>
        )}
      </motion.div>
    </main>
  );
}
