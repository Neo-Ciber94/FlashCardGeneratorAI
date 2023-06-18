import { z } from "zod";

export const MAX_GENERATE_FLASH_CARD_TEXT_LENGTH = 2000;

export const generateFlashCardModel = z.object({
    text: z.string().trim().min(1).max(MAX_GENERATE_FLASH_CARD_TEXT_LENGTH),
    topicId: z.string()
});

export type GenerateFlashCardModel = z.infer<typeof generateFlashCardModel>;
