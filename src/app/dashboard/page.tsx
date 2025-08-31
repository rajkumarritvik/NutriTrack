"use client"

import { Bar, BarChart, CartesianGrid, Pie, PieChart, Cell, Line, LineChart, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Flame, Target, Weight } from "lucide-react"

const dailyCaloriesData = [
  { day: "Mon", calories: 1800, goal: 2000 },
  { day: "Tue", calories: 2100, goal: 2000 },
  { day: "Wed", calories: 1950, goal: 2000 },
  { day: "Thu", calories: 2200, goal: 2000 },
  { day: "Fri", calories: 2300, goal: 2000 },
  { day: "Sat", calories: 1750, goal: 2000 },
  { day: "Sun", calories: 2050, goal: 2000 },
];

const macrosData = [
  { name: 'Protein', value: 150, fill: 'var(--color-protein)' },
  { name: 'Carbs', value: 250, fill: 'var(--color-carbs)' },
  { name: 'Fat', value: 70, fill: 'var(--color-fat)' },
];

const weightProgressData = [
  { week: '1', weight: 180 },
  { week: '2', weight: 179 },
  { week: '3', weight: 179.5 },
  { week: '4', weight: 178 },
  { week: '5', weight: 177 },
  { week: '6', weight: 176 },
];

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
  return (
    <div className="container py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Your Dashboard</h1>
        <p className="text-muted-foreground">An overview of your week's progress and nutrition.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Daily Calories</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1993 kcal</div>
                <p className="text-xs text-muted-foreground">-0.35% vs goal</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weight Progress</CardTitle>
                <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">176 lbs</div>
                <p className="text-xs text-muted-foreground">-4 lbs over last 6 weeks</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">4/7 Days Met</div>
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
              <BarChart data={dailyCaloriesData} accessibilityLayer>
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
                  <Pie data={macrosData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
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
                    <LineChart data={weightProgressData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="week" tickFormatter={(value) => `Week ${value}`} />
                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} allowDecimals={false} />
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
