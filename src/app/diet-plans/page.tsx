"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestDietPlan, type SuggestDietPlanOutput } from "@/ai/flows/diet-plan-suggestions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Zap } from "lucide-react";

const goals = ["Weight Loss", "Muscle Gain", "Balanced Diet", "General Health"];
const preferences = ["None", "Vegetarian", "Vegan", "Gluten-Free", "Keto"];
const activityLevels = ["Sedentary (little to no exercise)", "Lightly Active (light exercise/sports 1-3 days/week)", "Moderately Active (moderate exercise/sports 3-5 days/week)", "Very Active (hard exercise/sports 6-7 days a week)", "Extra Active (very hard exercise/sports & a physical job)"];

const formSchema = z.object({
  goal: z.string().min(1, "Please select a goal."),
  foodPreferences: z.string().min(1, "Please select your food preferences."),
  activityLevel: z.string().min(1, "Please select your activity level."),
});

export default function DietPlansPage() {
  const [dietPlan, setDietPlan] = useState<SuggestDietPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: "",
      foodPreferences: "",
      activityLevel: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDietPlan(null);
    try {
      const result = await suggestDietPlan(values);
      setDietPlan(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Could not generate a diet plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Personalized Diet Plans</h1>
          <p className="text-muted-foreground">
            Tell us about your goals, and our AI will create a tailored diet plan just for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <CardDescription>Fill out the form to generate your plan.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="goal" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your goal" /></SelectTrigger></FormControl>
                        <SelectContent>{goals.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="foodPreferences" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Preferences</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your preference" /></SelectTrigger></FormControl>
                        <SelectContent>{preferences.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="activityLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Activity Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your activity level" /></SelectTrigger></FormControl>
                        <SelectContent>{activityLevels.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Plan</>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-4">
            {isLoading && (
              <Card className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground mt-4">Creating your personalized plan...</p>
              </Card>
            )}
            {!isLoading && !dietPlan && (
                <Card className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-center p-6 bg-secondary/50 border-dashed">
                    <Zap className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Your Plan Awaits</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Your AI-generated diet plan will appear here.</p>
                </Card>
            )}
            {dietPlan && (
              <Card className="flex-1 animate-fade-in shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{dietPlan.dietPlanName}</CardTitle>
                  <CardDescription>{dietPlan.dietPlanDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Sample Meal Plan:</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{dietPlan.sampleMealPlan}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
