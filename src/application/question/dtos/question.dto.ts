import { z } from "zod";

export const QuestionSchema = z.object({
    id: z.number().int().optional(),
    level: z.number().int(),
    difficulty: z.string(),
    category: z.string(),
    text: z.string(),
    img_url: z.string().nullable().optional(),
    option_a: z.string(),
    option_b: z.string(),
    option_c: z.string(),
    option_d: z.string(),
    correct_option: z.string().length(1),
    hint: z.string().nullable().optional(),
    feedback_wrong: z.string().nullable().optional(),
    is_boss: z.boolean().default(false),
});

export type QuestionDTO = z.infer<typeof QuestionSchema>;
