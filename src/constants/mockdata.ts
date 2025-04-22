// Mock data for the fitness app
export const mockData = {
    user: {
      name: "Alex",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    },
  
    calories: {
      left: 1400,
      consumed: 500,
      goal: 1900,
      progress: 0.26,
    },
  
    nutrients: [
      { name: "Protein", value: 100, goal: 200, unit: "g", progress: 0.5 },
      { name: "Carbs", value: 200, goal: 200, unit: "g", progress: 1 },
      { name: "Fat", value: 32, goal: 65, unit: "g", progress: 0.49 },
    ],
  
    date: "Today, Jul 26",
  
    meals: {
      breakfast: {
        totalKcal: 550,
        items: [
          { name: "Egg, Chicken", kcal: 440 },
          { name: "Coffee", kcal: 100 },
        ],
      },
      lunch: {
        totalKcal: 720,
        items: [
          { name: "Grilled Chicken Salad", kcal: 450 },
          { name: "Whole Grain Bread", kcal: 120 },
          { name: "Apple", kcal: 95 },
          { name: "Green Tea", kcal: 5 },
        ],
      },
      dinner: {
        totalKcal: 630,
        items: [
          { name: "Salmon Fillet", kcal: 350 },
          { name: "Brown Rice", kcal: 180 },
          { name: "Steamed Vegetables", kcal: 100 },
        ],
      },
      snacks: {
        totalKcal: 250,
        items: [
          { name: "Greek Yogurt", kcal: 150 },
          { name: "Mixed Nuts", kcal: 100 },
        ],
      },
    },
  
    weeklyProgress: {
      calories: [
        { day: "Mon", consumed: 1800, goal: 1900 },
        { day: "Tue", consumed: 1750, goal: 1900 },
        { day: "Wed", consumed: 1900, goal: 1900 },
        { day: "Thu", consumed: 1650, goal: 1900 },
        { day: "Fri", consumed: 2000, goal: 1900 },
        { day: "Sat", consumed: 1800, goal: 1900 },
        { day: "Sun", consumed: 1500, goal: 1900 },
      ],
      weight: [
        { date: "Mon", value: 75.5 },
        { date: "Tue", value: 75.3 },
        { date: "Wed", value: 75.2 },
        { date: "Thu", value: 75.0 },
        { date: "Fri", value: 74.8 },
        { date: "Sat", value: 74.7 },
        { date: "Sun", value: 74.5 },
      ],
    },
  
    waterIntake: {
      current: 5,
      goal: 8,
      unit: "glasses",
      progress: 0.625,
    },
  
    exerciseStats: {
      caloriesBurned: 320,
      duration: 45, // minutes
      steps: 8500,
    },
  }
  
  // Update the mealIcons object to use Ionicons names
  export const mealIcons = {
    breakfast: "cafe-outline",
    lunch: "restaurant-outline",
    dinner: "pizza-outline",
    snacks: "nutrition-outline",
  }
  
  // Theme color options for the app
  export const themeColorOptions = [
    { name: "green", light: "#7AD886", dark: "#85F193" },
    { name: "blue", light: "#64B5F6", dark: "#90CAF9" },
    { name: "purple", light: "#9C27B0", dark: "#BA68C8" },
    { name: "pink", light: "#EC407A", dark: "#F48FB1" },
    { name: "orange", light: "#FF9800", dark: "#FFAB40" },
    { name: "teal", light: "#26A69A", dark: "#4DB6AC" },
  ]
  