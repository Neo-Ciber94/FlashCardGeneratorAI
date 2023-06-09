import { z } from 'zod';

export const flashCardModel = z.object({
    id: z.string(),
    title: z.string().trim().min(1),
    topicId: z.string(),
    content: z.string(),
    color: z.string(),
    owner: z.string(),
    lastModified: z.number().positive()
})

export type FlashCardModel = z.infer<typeof flashCardModel>;