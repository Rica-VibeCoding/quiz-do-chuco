"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ScribbleButton } from "@/components/ui/scribble-button";
import { motion } from "framer-motion";
import { startOrResumeGameAction, getPlayerAction } from "@/presentation/actions/game.actions";
import { PlayerDTO } from "@/application/player/dtos/player.dto";

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingPlayer, setExistingPlayer] = useState<PlayerDTO | null>(null);
  const [checkingPlayer, setCheckingPlayer] = useState(true);

  // Check if there's an existing player in localStorage
  useEffect(() => {
    async function checkExisting() {
      const id = localStorage.getItem("quiz_player_id");
      const savedNickname = localStorage.getItem("quiz_player_nickname");
      if (id) {
        const res = await getPlayerAction(id);
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

      if ('error' in response) {
        alert(response.error);
        return;
      }

      if ('data' in response && response.data) {
        localStorage.setItem("quiz_player_id", response.data.id as string);
        localStorage.setItem("quiz_player_nickname", response.data.nickname);
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
    // Clear existing player from localStorage to start fresh
    localStorage.removeItem("quiz_player_id");
    localStorage.removeItem("quiz_player_nickname");
    setExistingPlayer(null);
    setNickname("");
  };

  if (checkingPlayer) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Scribbles */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 pointer-events-none rotate-[-12deg]">⭐</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 pointer-events-none rotate-[15deg]">🚀</div>
      <div className="absolute top-40 right-20 text-5xl opacity-20 pointer-events-none rotate-[45deg]">🖍️</div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-center z-10 w-full max-w-sm"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-[#ef4444] mb-2 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
          O Quiz
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold text-[#3b82f6] mb-12 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[1deg]">
          do Chuco!
        </h2>

        {existingPlayer ? (
          <div className="flex flex-col gap-4">
            <p className="text-xl font-bold text-zinc-700">
              Ola de volta, {existingPlayer.nickname}!
            </p>
            <p className="text-zinc-500">
              Fase {existingPlayer.current_level} - Pergunta {existingPlayer.current_question}
            </p>

            <ScribbleButton
              variant="success"
              animated
              onClick={handleContinue}
              className="w-full mt-2 text-3xl h-20"
            >
              Continuar Aventura!
            </ScribbleButton>

            <ScribbleButton
              variant="danger"
              onClick={handleRestart}
              className="w-full text-lg h-14"
            >
              Recomecar do Zero
            </ScribbleButton>
          </div>
        ) : (
          <form onSubmit={handlePlay} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="nickname" className="text-xl font-bold text-zinc-800 text-left ml-2">
                Qual o seu apelido de heroi?
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
              className="w-full mt-4 text-3xl h-20"
            >
              {loading ? "CARREGANDO..." : "JOGAR!"}
            </ScribbleButton>
          </form>
        )}
      </motion.div>
    </main>
  );
}
