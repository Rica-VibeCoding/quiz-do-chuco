import { createClient } from "@/lib/supabase/server";
import { PlayerDTO, UpdatePlayerProgressDTO } from "../dtos/player.dto";

export class PlayerRepository {
    async getById(id: string): Promise<PlayerDTO | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("qz_players")
            .select("*")
            .eq("id", id)
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("Error fetching player by id:", error);
            throw new Error("Erro ao buscar jogador no banco de dados.");
        }

        return data;
    }

    async getByNickname(nickname: string): Promise<PlayerDTO | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("qz_players")
            .select("*")
            .ilike("nickname", nickname)
            .single();

        if (error && error.code !== "PGRST116") { // PGRST116 is not found
            console.error("Error fetching player:", error);
            throw new Error("Erro ao buscar jogador no banco de dados.");
        }

        return data;
    }

    async create(playerData: { nickname: string }): Promise<PlayerDTO> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("qz_players")
            .insert({
                nickname: playerData.nickname,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating player:", error);
            throw new Error("Erro ao criar jogador no banco de dados.");
        }

        return data;
    }

    async updateProgress(id: string, progress: UpdatePlayerProgressDTO): Promise<PlayerDTO> {
        const supabase = await createClient();

        // Auto-update the updated_at column timestamp
        const updateData = {
            ...progress,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from("qz_players")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating player progress:", error);
            throw new Error("Erro ao atualizar progresso do jogador.");
        }

        return data;
    }
}
