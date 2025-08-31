"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart as RechartsPieChart, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Flame, Target, Weight, Pizza } from "lucide-react"
import type { AiMealOutputType } from "@/ai/flows/ai-meal-input"
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';

type MealEntry = AiMealOutputType & { date: string };

const barChartConfig: ChartConfig = {
  calories: { label: "Calories", color: "hsl(var(--chart-1))" },
  goal: { label: "Goal", color: "hsl(var(--border))" },
};

const pieChartConfig: ChartConfig = {
  grams: { label: "Grams" },
  protein: { label: "Protein", color: "hsl(var(--chart-1))" },
  carbs: { label: "Carbs", color: "hsl(var(--chart-2))" },
  fat: { label: "Fat", color: "hsl(var(--chart-3))" },
};

// Weight progress remains static for now as it's not part of the meal counter.
const weightProgress = [
  { week: 1, weight: 155 },
  { week: 2, weight: 154 },
  { week: 3, weight: 154 },
  { week: 4, weight: 153 },
  { week: 5, weight: 152 },
  { week: 6, weight: 151 },
];
const lastWeight = weightProgress[weightProgress.length - 1]?.weight || 0;
const weightChange = lastWeight - (weightProgress[0]?.weight || 0);


export default function DashboardPage() {
  const [mealHistory, setMealHistory] = useState<MealEntry[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("mealHistory");
    if (storedHistory) {
      setMealHistory(JSON.parse(storedHistory));
    }
  }, []);

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);

  // Calculate daily calories for the current week
  const weeklyCalories = Array.from({ length: 7 }).map((_, i) => {
      const day = addDays(startOfCurrentWeek, i);
      const calories = mealHistory
        .filter(meal => isSameDay(new Date(meal.date), day))
        .reduce((sum, meal) => sum + meal.calories, 0);
      return {
          day: format(day, 'E'),
          calories: calories,
          goal: 2000,
      };
  });
  
  const daysGoalMet = weeklyCalories.filter(d => d.calories > 0 && d.calories <= d.goal).length;

  const totalCalories = mealHistory.reduce((sum, meal) => sum + meal.calories, 0);
  const avgDailyCalories = mealHistory.length > 0 ? Math.round(totalCalories / mealHistory.length) : 0;
  
  // Calculate today's macros
  const todaysMacros = mealHistory
    .filter(meal => isSameDay(new Date(meal.date), today))
    .reduce((acc, meal) => ({
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }), { protein: 0, carbs: 0, fat: 0 });

  const macrosData = [
    { name: "Protein", value: todaysMacros.protein, fill: "var(--color-protein)" },
    { name: "Carbs", value: todaysMacros.carbs, fill: "var(--color-carbs)" },
    { name: "Fat", value: todaysMacros.fat, fill: "var(--color-fat)" },
  ];

  if (mealHistory.length === 0) {
      return (
          <div className="container py-12 text-center">
               <div className="mx-auto max-w-lg">
                    <Pizza className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl font-headline">Your Dashboard is Empty</h1>
                    <p className="mt-4 text-muted-foreground">
                        It looks like you haven't logged any meals yet. Head over to the Meal Counter to add your first meal and see your progress here!
                    </p>
               </div>
          </div>
      )
  }

  return (
    <div className="container py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Your Dashboard</h1>
        <p className="text-muted-foreground">An overview of your week's progress and nutrition.</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Meal Calories</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDailyCalories}</div>
            <p className="text-xs text-muted-foreground">Based on {mealHistory.length} meals logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weight Progress</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastWeight} lbs</div>
            <p className="text-xs text-muted-foreground">{weightChange} lbs change</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysGoalMet}/7 Days Met</div>
            <p className="text-xs text-muted-foreground">You're on the right track!</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Weekly Calorie Intake</CardTitle>
            <CardDescription>Calories consumed vs. your daily goal of 2000 kcal.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <BarChart data={weeklyCalories} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="calories" fill="var(--color-calories)" radius={4} />
                <Bar dataKey="goal" fill="var(--color-goal)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Today's Macros</CardTitle>
            <CardDescription>Breakdown of protein, carbs, and fat.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-[250px]">
              <RechartsPieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <RechartsPieChart data={macrosData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} />
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weight tracking line chart */}
      <div className="grid gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Weight Tracking</CardTitle>
            <CardDescription>Your weight progress over the last few weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ weight: { label: "Weight", color: "hsl(var(--chart-1))" } }}
              className="h-[250px] w-full"
            >
              <LineChart data={weightProgress} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickFormatter={(value) => `Week ${value}`} />
                <YAxis domain={["dataMin - 5", "dataMax + 5"]} allowDecimals={false} unit=" lbs" />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
