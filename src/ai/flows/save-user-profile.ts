
'use server';

/**
 * @fileOverview Saves the user's profile information.
 *
 * - saveUserProfile - A function that saves the user's profile.
 * - UserProfileInput - The input type for the saveUserProfile function.
 * - UserProfileOutput - The return type for the saveUserProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserProfileInputSchema = z.object({
  weight: z.number().describe("The user's weight."),
  height: z.number().describe("The user's height."),
  gender: z.string().describe("The user's gender."),
  activityLevel: z.string().describe("The user's activity level."),
  weightUnit: z.enum(["lbs", "kg"]).describe("The unit for weight."),
  heightUnit: z.enum(["in", "cm"]).describe("The unit for height."),
});
export type UserProfileInput = z.infer<typeof UserProfileInputSchema>;

const UserProfileOutputSchema = z.object({
  success: z.boolean().describe("Whether the profile was saved successfully."),
});
export type UserProfileOutput = z.infer<typeof UserProfileOutputSchema>;

export async function saveUserProfile(input: UserProfileInput): Promise<UserProfileOutput> {
  return saveUserProfileFlow(input);
}

// This is a placeholder flow. In a real application, you would save this to a database.
const saveUserProfileFlow = ai.defineFlow(
  {
    name: 'saveUserProfileFlow',
    inputSchema: UserProfileInputSchema,
    outputSchema: UserProfileOutputSchema,
  },
  async (input) => {
    console.log("Saving user profile:", input);
    // In a real app, you would save this to a database like Firestore.
    // For this prototype, we'll just log it and return success.
    return { success: true };
  }
);
