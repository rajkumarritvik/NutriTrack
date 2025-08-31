'use server';

/**
 * @fileOverview A flow for processing user-inputted meals and providing nutritional information.
 *
 * - aiMealInput - A function that takes a meal description and returns nutritional information.
 * - AiMealInputType - The input type for the aiMealInput function.
 * - AiMealOutputType - The return type for the aiMealInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMealInputTypeSchema = z.object({
  mealDescription: z.string().describe('A description of the meal the user ate.'),
});

export type AiMealInputType = z.infer<typeof AiMealInputTypeSchema>;

const AiMealOutputTypeSchema = z.object({
  calories: z.number().describe('The total number of calories in the meal.'),
  protein: z.number().describe('The amount of protein in grams.'),
  carbs: z.number().describe('The amount of carbohydrates in grams.'),
  fat: z.number().describe('The amount of fat in grams.'),
  vitamins: z.string().describe('A list of the vitamins present in the meal.'),
});

export type AiMealOutputType = z.infer<typeof AiMealOutputTypeSchema>;

export async function aiMealInput(input: AiMealInputType): Promise<AiMealOutputType> {
  return aiMealInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMealInputPrompt',
  input: {schema: AiMealInputTypeSchema},
  output: {schema: AiMealOutputTypeSchema},
  prompt: `You are a nutrition expert. A user will describe a meal they ate, and you will provide the total calories and nutrition facts (protein, carbs, fat, vitamins).  Be as accurate as possible.

Meal Description: {{{mealDescription}}}`,
});

const aiMealInputFlow = ai.defineFlow(
  {
    name: 'aiMealInputFlow',
    inputSchema: AiMealInputTypeSchema,
    outputSchema: AiMealOutputTypeSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
