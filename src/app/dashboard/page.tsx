"use client"

import { useContext } from "react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, Cell, Line, LineChart, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Flame, Target, Weight, Zap } from "lucide-react"
import { DashboardContext } from "@/context/dashboard-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const barChartConfig = {
  calories: { label: "Calories", color: "hsl(var(--chart-1))" },
  goal: { label: "Goal", color: "hsl(var(--border))" },
} satisfies ChartConfig;

const pieChartConfig = {
    grams: { label: "Grams" },
    protein: { label: "Protein", color: "hsl(var(--chart-1))" },
    carbs: { label: "Carbs", color: "hsl(var(--chart-2))" },
    fat: { label: "Fat", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;


export default function DashboardPage() {
  const { dashboardData } = useContext(DashboardContext);

  const {
    dailyCalories,
    macros,
    weightProgress,
    stats,
  } = dashboardData;

  const macrosData = [
    { name: 'Protein', value: macros.protein, fill: 'var(--color-protein)' },
    { name: 'Carbs', value: macros.carbs, fill: 'var(--color-carbs)' },
    { name: 'Fat', value: macros.fat, fill: 'var(--color-fat)' },
  ];

  const noMealsTracked = stats.avgCalories === 0;

  return (
    <div className="container py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Your Dashboard</h1>
        <p className="text-muted-foreground">An overview of your week's progress and nutrition.</p>
      </div>

      {noMealsTracked && (
         <Alert className="mb-8">
          <Zap className="h-4 w-4" />
          <AlertTitle>Welcome to your Dashboard!</AlertTitle>
          <AlertDescription>
            You haven't tracked any meals yet. Go to the <a href="/meal-counter" className="font-semibold underline">Meal Counter</a> page to get started.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Daily Calories</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.avgCalories.toFixed(0)} kcal</div>
                <p className="text-xs text-muted-foreground">{stats.goalComparison.toFixed(2)}% vs goal</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weight Progress</CardTitle>
                <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.currentWeight} lbs</div>
                <p className="text-xs text-muted-foreground">{stats.weightChange} lbs change</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.daysGoalMet}/7 Days Met</div>
                <p className="text-xs text-muted-foreground">You're on the right track!</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Weekly Calorie Intake</CardTitle>
            <CardDescription>Calories consumed vs. your daily goal of 2000 kcal.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <BarChart data={dailyCalories} accessibilityLayer>
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
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                  <Pie data={macrosData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} >
                    {macrosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 mt-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Weight Tracking</CardTitle>
                <CardDescription>Your weight progress over the last few weeks.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{weight: {label: "Weight", color: "hsl(var(--chart-1))"}}} className="h-[250px] w-full">
                    <LineChart data={weightProgress} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="week" tickFormatter={(value) => `Week ${value}`} />
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} allowDecimals={false} unit=" lbs" />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} dot={{r: 4}} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

    </div>
  )
}
