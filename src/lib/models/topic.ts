import { z } from 'zod'

export const topicModel = z.object({
    id: z.string(),
    name: z.string().trim().min(1),
    owner: z.string(),
    lastModified: z.number().positive()
})

export type TopicModel = z.infer<typeof topicModel>;