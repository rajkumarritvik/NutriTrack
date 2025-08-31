
'use server';

/**
 * @fileOverview A flow for saving the user's profile data.
 *
 * This is a placeholder as we don't have a database.
 * In a real application, this would interact with a database to store the profile data.
 *
 * - saveUserProfile - A function that takes profile data and "saves" it.
 * - SaveUserProfileInput - The input type for the saveUserProfile function.
 * - SaveUserProfileOutput - The return type for the saveUserProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserProfileSchema = z.object({
  weight: z.number(),
  height: z.number(),
  gender: z.string(),
  activityLevel: z.string(),
  weightUnit: z.string(),
  heightUnit: z.string(),
});

const SaveUserProfileInputSchema = z.object({
  profileData: UserProfileSchema.describe("The user's profile data to be saved."),
});

export type SaveUserProfileInput = z.infer<typeof SaveUserProfileInputSchema>;

const SaveUserProfileOutputSchema = z.object({
  success: z.boolean().describe("Whether the profile save was successful."),
  message: z.string().describe("A confirmation message."),
});

export type SaveUserProfileOutput = z.infer<typeof SaveUserProfileOutputSchema>;

export async function saveUserProfile(input: SaveUserProfileInput): Promise<SaveUserProfileOutput> {
  return saveUserProfileFlow(input);
}

const saveUserProfileFlow = ai.defineFlow(
  {
    name: 'saveUserProfileFlow',
    inputSchema: SaveUserProfileInputSchema,
    outputSchema: SaveUserProfileOutputSchema,
  },
  async (input) => {
    // In a real application, you would save `input.profileData` to a database
    // associated with the current user. For this demo, we'll just simulate success.
    console.log("Saving user profile:", input.profileData);

    // Simulate a short delay to mimic a network request.
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: "User profile saved successfully.",
    };
  }
);
