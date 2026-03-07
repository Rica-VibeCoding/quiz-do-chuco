import { z } from "zod";

export const QuestionSchema = z.object({
    id: z.number().int().optional(),
    level: z.number().int(),
    difficulty: z.string(),
    difficulty_weight: z.number().int().optional(),
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
    is_trick: z.boolean().default(false),
    explanation: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    external_id: z.string().nullable().optional(),
    status: z.string().optional(),
});

export type QuestionDTO = z.infer<typeof QuestionSchema>;
