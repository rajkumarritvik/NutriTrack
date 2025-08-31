"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { type AiMealOutputType } from '@/ai/flows/ai-meal-input';

// Define types
interface DailyCalories {
  day: string;
  calories: number;
  goal: number;
}

interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

interface WeightProgress {
  week: number;
  weight: number;
}

interface Stats {
    avgCalories: number;
    goalComparison: number;
    currentWeight: number;
    weightChange: number;
    daysGoalMet: number;
}

interface DashboardData {
  dailyCalories: DailyCalories[];
  macros: Macros;
  weightProgress: WeightProgress[];
  stats: Stats;
}

interface DashboardContextType {
  dashboardData: DashboardData;
  addMeal: (meal: AiMealOutputType) => void;
  setInitialWeight: (weight: number) => void;
}

const CALORIE_GOAL = 2000;

// Initial state
const getInitialState = (): DashboardData => ({
  dailyCalories: [
    { day: "Sun", calories: 0, goal: CALORIE_GOAL },
    { day: "Mon", calories: 0, goal: CALORIE_GOAL },
    { day: "Tue", calories: 0, goal: CALORIE_GOAL },
    { day: "Wed", calories: 0, goal: CALORIE_GOAL },
    { day: "Thu", calories: 0, goal: CALORIE_GOAL },
    { day: "Fri", calories: 0, goal: CALORIE_GOAL },
    { day: "Sat", calories: 0, goal: CALORIE_GOAL },
  ],
  macros: { protein: 0, carbs: 0, fat: 0 },
  weightProgress: [],
  stats: {
      avgCalories: 0,
      goalComparison: 0,
      currentWeight: 0,
      weightChange: 0,
      daysGoalMet: 0,
  }
});

// Create context
export const DashboardContext = createContext<DashboardContextType>({
  dashboardData: getInitialState(),
  addMeal: () => {},
  setInitialWeight: () => {},
});


// Create provider
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>(getInitialState());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('dashboardData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Basic validation to ensure data shape is correct
        if (parsedData.dailyCalories && parsedData.macros && parsedData.weightProgress) {
             setDashboardData(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard data from local storage", error);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    if (isInitialized) {
        try {
            const newStats = calculateStats(dashboardData);
            const dataWithStats = {...dashboardData, stats: newStats};
            localStorage.setItem('dashboardData', JSON.stringify(dataWithStats));
            // update state without re-triggering effect
            if (JSON.stringify(dashboardData.stats) !== JSON.stringify(newStats)) {
                 setDashboardData(dataWithStats);
            }
        } catch (error) {
            console.error("Failed to save dashboard data to local storage", error);
        }
    }
  }, [dashboardData, isInitialized]);
  
  const calculateStats = (data: DashboardData): Stats => {
      const trackedDays = data.dailyCalories.filter(d => d.calories > 0);
      const avgCalories = trackedDays.length > 0 ? trackedDays.reduce((acc, day) => acc + day.calories, 0) / trackedDays.length : 0;
      const goalComparison = CALORIE_GOAL > 0 ? ((avgCalories - CALORIE_GOAL) / CALORIE_GOAL) * 100 : 0;

      const currentWeight = data.weightProgress.length > 0 ? data.weightProgress[data.weightProgress.length - 1].weight : 0;
      const initialWeight = data.weightProgress.length > 0 ? data.weightProgress[0].weight : 0;
      const weightChange = currentWeight - initialWeight;

      const daysGoalMet = data.dailyCalories.filter(d => d.calories > 0 && d.calories <= d.goal).length;

      return {
          avgCalories,
          goalComparison,
          currentWeight,
          weightChange,
          daysGoalMet
      }
  }


  const addMeal = (meal: AiMealOutputType) => {
    setDashboardData(prevData => {
      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday...
      
      const newDailyCalories = [...prevData.dailyCalories];
      newDailyCalories[today].calories += meal.calories;

      const newMacros = {
        protein: prevData.macros.protein + meal.protein,
        carbs: prevData.macros.carbs + meal.carbs,
        fat: prevData.macros.fat + meal.fat,
      };

      return {
        ...prevData,
        dailyCalories: newDailyCalories,
        macros: newMacros,
      };
    });
  };

  const setInitialWeight = (weight: number) => {
      setDashboardData(prevData => {
          const newWeightProgress = [{ week: 1, weight }];
          return {
              ...prevData,
              weightProgress: newWeightProgress
          }
      })
  }

  return (
    <DashboardContext.Provider value={{ dashboardData, addMeal, setInitialWeight }}>
      {children}
    </DashboardContext.Provider>
  );
};
