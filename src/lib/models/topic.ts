import { z } from 'zod'

export const topicModel = z.object({
    id: z.string(),
    name: z.string().trim(),
    ownerId: z.string(),
    lastModified: z.number().positive()
})

export type TopicModel = z.infer<typeof topicModel>;

export const createTopicModel = z.object({
    name: z.string().trim().min(4)
});

export type CreateTopicModel = z.infer<typeof createTopicModel>;

export const updateTopicModel = z.object({
    id: z.string(),
    name: z.string().trim().min(4)
});

export type UpdateTopicModel = z.infer<typeof updateTopicModel>;