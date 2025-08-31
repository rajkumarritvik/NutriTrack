"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { aiMealInput, type AiMealOutputType } from "@/ai/flows/ai-meal-input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Flame, Beef, Wheat, Droplets, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  mealDescription: z.string().min(10, {
    message: "Please describe your meal in at least 10 characters.",
  }),
});

export default function MealCounterPage() {
  const [nutritionData, setNutritionData] = useState<AiMealOutputType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setNutritionData(null);
    try {
      const result = await aiMealInput(values);
      setNutritionData(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with our AI. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">AI-Powered Meal Counter</h1>
          <p className="text-muted-foreground">
            Simply describe what you ate, and our AI will handle the rest. For example: "For lunch, I had a grilled chicken salad with avocado, tomatoes, and a light vinaigrette."
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="mealDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Describe Your Meal</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A bowl of oatmeal with blueberries and almonds..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze Meal
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground mt-2">Calculating nutrition facts...</p>
          </div>
        )}

        {nutritionData && (
          <Card className="mt-8 animate-fade-in shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Nutrition Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center space-y-1 rounded-lg p-4 bg-secondary">
                  <Flame className="h-8 w-8 text-accent" />
                  <span className="text-sm text-muted-foreground">Calories</span>
                  <span className="text-2xl font-bold">{nutritionData.calories}</span>
                </div>
                <div className="flex flex-col items-center space-y-1 rounded-lg p-4 bg-secondary">
                  <Beef className="h-8 w-8 text-accent" />
                  <span className="text-sm text-muted-foreground">Protein</span>
                  <span className="text-2xl font-bold">{nutritionData.protein}g</span>
                </div>
                <div className="flex flex-col items-center space-y-1 rounded-lg p-4 bg-secondary">
                  <Wheat className="h-8 w-8 text-accent" />
                  <span className="text-sm text-muted-foreground">Carbs</span>
                  <span className="text-2xl font-bold">{nutritionData.carbs}g</span>
                </div>
                <div className="flex flex-col items-center space-y-1 rounded-lg p-4 bg-secondary">
                  <Droplets className="h-8 w-8 text-accent" />
                  <span className="text-sm text-muted-foreground">Fat</span>
                  <span className="text-2xl font-bold">{nutritionData.fat}g</span>
                </div>
              </div>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Vitamins</h3>
                <p className="text-muted-foreground">{nutritionData.vitamins}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
