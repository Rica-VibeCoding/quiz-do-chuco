import { QuestionRepository } from "../repositories/question.repository";
import { QuestionDTO } from "../dtos/question.dto";

export class GetLevelQuestionsUseCase {
    constructor(private readonly questionRepository: QuestionRepository = new QuestionRepository()) { }

    async execute(level: number): Promise<QuestionDTO[]> {
        if (level < 1) {
            throw new Error("O nível da fase fornecido é inválido.");
        }
        return this.questionRepository.getByLevel(level);
    }
}
