"use server";

import { StartGameUseCase } from "@/application/player/use-cases/start-game.use-case";
import { UpdateProgressUseCase } from "@/application/player/use-cases/update-progress.use-case";
import { GetLevelQuestionsUseCase } from "@/application/question/use-cases/get-level-questions.use-case";
import { UpdatePlayerProgressDTO } from "@/application/player/dtos/player.dto";
import { PlayerRepository } from "@/application/player/repositories/player.repository";

// Utility function to encapsulate errors for the client side safely
function handleActionError(error: unknown) {
    console.error("Action error:", error);
    // Returns generic error messages back to the client as instructed in the PRD/Rules
    return { error: error instanceof Error ? error.message : "Ocorreu um erro interno. Tente novamente." };
}

export async function startOrResumeGameAction(nickname: string) {
    try {
        const useCase = new StartGameUseCase();
        const player = await useCase.execute(nickname);
        return { success: true, data: player };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function saveProgressAction(playerId: string, progress: UpdatePlayerProgressDTO) {
    try {
        const useCase = new UpdateProgressUseCase();
        const updatedPlayer = await useCase.execute(playerId, progress);
        return { success: true, data: updatedPlayer };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function getQuestionsForLevelAction(level: number) {
    try {
        const useCase = new GetLevelQuestionsUseCase();
        const questions = await useCase.execute(level);
        return { success: true, data: questions };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function getPlayerAction(playerId: string) {
    try {
        const repo = new PlayerRepository();
        const player = await repo.getById(playerId);
        if (!player) {
            return { error: "Jogador nao encontrado." };
        }
        return { success: true, data: player };
    } catch (error) {
        return handleActionError(error);
    }
}
