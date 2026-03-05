import { PlayerRepository } from "../repositories/player.repository";
import { PlayerDTO } from "../dtos/player.dto";

export class StartGameUseCase {
    constructor(private readonly playerRepository: PlayerRepository = new PlayerRepository()) { }

    async execute(nickname: string): Promise<PlayerDTO> {
        const formattedNickname = nickname.trim();
        if (formattedNickname.length < 2) {
            throw new Error("O apelido deve ter pelo menos 2 letras");
        }

        let player = await this.playerRepository.getByNickname(formattedNickname);

        if (!player) {
            player = await this.playerRepository.create({ nickname: formattedNickname });
        }

        return player;
    }
}
