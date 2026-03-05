import { PlayerRepository } from "../repositories/player.repository";
import { UpdatePlayerProgressDTO, UpdatePlayerProgressSchema, PlayerDTO } from "../dtos/player.dto";

export class UpdateProgressUseCase {
    constructor(private readonly playerRepository: PlayerRepository = new PlayerRepository()) { }

    async execute(id: string, progress: UpdatePlayerProgressDTO): Promise<PlayerDTO> {
        const parseResult = UpdatePlayerProgressSchema.safeParse(progress);
        if (!parseResult.success) {
            throw new Error("Dados de progresso inválidos.");
        }

        return this.playerRepository.updateProgress(id, parseResult.data);
    }
}
