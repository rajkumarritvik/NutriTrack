'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/diet-plan-suggestions.ts';
import '@/ai/flows/ai-meal-input.ts';
import '@/ai/flows/update-dashboard-with-meal.ts';
import '@/ai/flows/save-user-profile.ts';
