import { createClient } from "@/lib/supabase/server";
import { QuestionDTO } from "../dtos/question.dto";

export class QuestionRepository {
    async getByLevel(level: number): Promise<QuestionDTO[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("qz_questions")
            .select("*")
            .eq("level", level)
            .eq("status", "approved")
            .order("is_boss", { ascending: true })
            .order("difficulty_weight", { ascending: true, nullsFirst: false })
            .order("id", { ascending: true });

        if (error) {
            console.error("Error fetching questions:", error);
            throw new Error("Erro ao buscar perguntas do banco de dados.");
        }

        return data || [];
    }
}
