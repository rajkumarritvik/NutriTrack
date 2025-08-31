'use server';

/**
 * @fileOverview Suggests predefined diet plans based on user input and AI analysis.
 *
 * - suggestDietPlan - A function that suggests a diet plan.
 * - SuggestDietPlanInput - The input type for the suggestDietPlan function.
 * - SuggestDietPlanOutput - The return type for the suggestDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDietPlanInputSchema = z.object({
  goal: z
    .string()
    .describe(
      'The users goal for a diet plan (e.g., weight loss, muscle gain, balanced diet).'
    ),
  foodPreferences: z
    .string()
    .describe('The users food preferences (e.g., vegetarian, vegan, gluten-free).'),
  activityLevel: z
    .string()
    .describe('The users activity level (e.g., sedentary, lightly active, active).'),
});
export type SuggestDietPlanInput = z.infer<typeof SuggestDietPlanInputSchema>;

const SuggestDietPlanOutputSchema = z.object({
  dietPlanName: z.string().describe('The name of the suggested diet plan.'),
  dietPlanDescription: z.string().describe('A description of the suggested diet plan.'),
  sampleMealPlan: z.string().describe('A sample meal plan for the suggested diet.'),
});
export type SuggestDietPlanOutput = z.infer<typeof SuggestDietPlanOutputSchema>;

export async function suggestDietPlan(input: SuggestDietPlanInput): Promise<SuggestDietPlanOutput> {
  return suggestDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDietPlanPrompt',
  input: {schema: SuggestDietPlanInputSchema},
  output: {schema: SuggestDietPlanOutputSchema},
  prompt: `You are an expert nutritionist who suggests diet plans based on user input.

  Based on the users goal, food preferences and activity level, suggest a diet plan.

  Goal: {{{goal}}}
  Food Preferences: {{{foodPreferences}}}
  Activity Level: {{{activityLevel}}}
  `,
});

const suggestDietPlanFlow = ai.defineFlow(
  {
    name: 'suggestDietPlanFlow',
    inputSchema: SuggestDietPlanInputSchema,
    outputSchema: SuggestDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
