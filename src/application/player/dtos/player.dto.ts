import { z } from "zod";

export const PlayerSchema = z.object({
    id: z.string().uuid().optional(),
    nickname: z.string().min(2, "O apelido deve ter pelo menos 2 caracteres").max(20, "O apelido deve ter no máximo 20 caracteres"),
    current_level: z.number().int().min(1).default(1),
    current_question: z.number().int().min(1).default(1),
    coins: z.number().int().min(0).default(100),
    lives: z.number().int().min(0).default(10),
    updated_at: z.string().optional(),
});

export type PlayerDTO = z.infer<typeof PlayerSchema>;

export const UpdatePlayerProgressSchema = z.object({
    current_level: z.number().int().min(1).optional(),
    current_question: z.number().int().min(1).optional(),
    coins: z.number().int().min(0).optional(),
    lives: z.number().int().min(0).optional(),
});

export type UpdatePlayerProgressDTO = z.infer<typeof UpdatePlayerProgressSchema>;
