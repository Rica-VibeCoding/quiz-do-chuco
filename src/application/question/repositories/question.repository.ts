import { createClient } from "@/lib/supabase/server";
import { QuestionDTO } from "../dtos/question.dto";

export class QuestionRepository {
    async getByLevel(level: number): Promise<QuestionDTO[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("qz_questions")
            .select("*")
            .eq("level", level)
            .order("id", { ascending: true }); // Or order randomly based on game requirements

        if (error) {
            console.error("Error fetching questions:", error);
            throw new Error("Erro ao buscar perguntas do banco de dados.");
        }

        return data || [];
    }
}
