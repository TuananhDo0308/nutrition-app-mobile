"use client"

import { ScrollView, StyleSheet, View, ActivityIndicator, Text, RefreshControl } from "react-native"
import { useState, useEffect, useCallback } from "react"
import { useAppSelector } from "../hooks/hook"
import GradientBlurBackground from "../component/Layout/background"
import { SafeAreaView } from "react-native-safe-area-context"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useTheme } from "react-native-paper"
import { mealIcons } from "../constants/mockdata"
import UserGreeting from "../component/HomeScreen/UserGreeting"
import CalorieTracker from "../component/HomeScreen/CalorieTracker"
import NutrientProgress from "../component/HomeScreen/NutrientProgress"
import DateNavigator from "../component/HomeScreen/DateNavigator"
import MealCard from "../component/HomeScreen/MealCard"
import axios from "axios"
import { format, isToday } from "date-fns"
import { apiLinks } from "../utils"

// Define interfaces for API responses
interface DailyPlanData {
  id: string
  totalCalories: number
  totalCarbs: number
  totalFats: number
  totalProteins: number
  targetCalories: number
  targetCarbs: number
  targetFats: number
  targetProteins: number
  date: string
}

interface FoodItem {
  name: string
  calories: number
}

interface MealData {
  totalCalories: number
  items: FoodItem[]
}

interface FoodItemsData {
  breakfast: MealData
  lunch: MealData
  dinner: MealData
  snacks?: MealData
}

const HomeScreen = () => {
  const user = useAppSelector((state) => state.user)
  const authToken = useAppSelector((state) => state.user?.token)
  const heightBar = useBottomTabBarHeight()
  const theme = useTheme()

  // State for selected date
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dailyPlanData, setDailyPlanData] = useState<DailyPlanData | null>(null)
  const [foodItemsData, setFoodItemsData] = useState<FoodItemsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false) // State for pull-to-refresh

  // Format date for API requests
  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // JavaScript months are 0-indexed
    const day = date.getDate()
    return { year, month, day }
  }

  // Format date for display
  const formatDateForDisplay = (date: Date) => {
    if (isToday(date)) {
      return "Today"
    }
    return format(date, "EEEE, MMM d, yyyy")
  }

  // Fetch data from APIs
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const { year, month, day } = formatDateForApi(selectedDate)

    try {
      // Fetch daily plan data
      const dailyPlanResponse = await axios.get(
        apiLinks.food.dailyPlan(year, month, day),
        {
          headers: {
            Authorization: authToken,
          },
        },
      )

      // Fetch food items data
      const foodItemsResponse = await axios.get(
        apiLinks.food.dailyPlanFood(year, month, day),
        {
          headers: {
            Authorization: authToken,
          },
        },
      )

      // Set state with fetched data
      if (dailyPlanResponse.data && dailyPlanResponse.data.data) {
        setDailyPlanData(dailyPlanResponse.data.data)
      } else {
        // Set default values if data is missing
        setDailyPlanData({
          id: "",
          totalCalories: 0,
          totalCarbs: 0,
          totalFats: 0,
          totalProteins: 0,
          targetCalories: 0,
          targetCarbs: 0,
          targetFats: 0,
          targetProteins: 0,
          date: selectedDate.toISOString().split("T")[0],
        })
      }

      if (foodItemsResponse.data && foodItemsResponse.data.data) {
        setFoodItemsData(foodItemsResponse.data.data)
      } else {
        // Set empty meal data if data is missing
        setFoodItemsData({
          breakfast: { totalCalories: 0, items: [] },
          lunch: { totalCalories: 0, items: [] },
          dinner: { totalCalories: 0, items: [] },
        })
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      console.log(apiLinks.food.dailyPlan(year, month, day))
      setError("Failed to load data. Please try again.")

      setDailyPlanData({
        id: "",
        totalCalories: 0,
        totalCarbs: 0,
        totalFats: 0,
        totalProteins: 0,
        targetCalories: 0,
        targetCarbs: 0,
        targetFats: 0,
        targetProteins: 0,
        date: selectedDate.toISOString().split("T")[0],
      })

      setFoodItemsData({
        breakfast: { totalCalories: 0, items: [] },
        lunch: { totalCalories: 0, items: [] },
        dinner: { totalCalories: 0, items: [] },
      })
    } finally {
      setIsLoading(false)
      setRefreshing(false) // Reset refreshing state after fetch
    }
  }, [selectedDate, authToken])

  // Fetch data on component mount and when selected date changes
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [fetchData])

  // Handle date navigation
  const handlePreviousDay = () => {
    const prevDate = new Date(selectedDate)
    prevDate.setDate(prevDate.getDate() - 1)
    setSelectedDate(prevDate)
  }

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate)
    nextDate.setDate(nextDate.getDate() + 1)
    setSelectedDate(nextDate)
  }

  // Calculate calories left and progress
  const calculateCaloriesLeft = () => {
    if (!dailyPlanData) return 0
    return Math.max(0, dailyPlanData.targetCalories - dailyPlanData.totalCalories)
  }

  const calculateCalorieProgress = () => {
    if (!dailyPlanData || dailyPlanData.targetCalories === 0) return 0
    return Math.min(1, dailyPlanData.totalCalories / dailyPlanData.targetCalories)
  }

  // Prepare nutrients data for NutrientProgress component
  const prepareNutrientsData = () => {
    if (!dailyPlanData) return []

    return [
      {
        name: "Protein",
        value: Math.round(dailyPlanData.totalProteins),
        goal: Math.round(dailyPlanData.targetProteins),
        unit: "g",
        progress: Math.min(1, dailyPlanData.totalProteins / (dailyPlanData.targetProteins || 1)),
      },
      {
        name: "Carbs",
        value: Math.round(dailyPlanData.totalCarbs),
        goal: Math.round(dailyPlanData.targetCarbs),
        unit: "g",
        progress: Math.min(1, dailyPlanData.totalCarbs / (dailyPlanData.targetCarbs || 1)),
      },
      {
        name: "Fat",
        value: Math.round(dailyPlanData.totalFats),
        goal: Math.round(dailyPlanData.targetFats),
        unit: "g",
        progress: Math.min(1, dailyPlanData.totalFats / (dailyPlanData.targetFats || 1)),
      },
    ]
  }

  // Map meal types to their respective icons
  const getMealIcon = (mealType: string): string => {
    return mealIcons[mealType] || "restaurant-outline"
  }

  // Convert API meal data to format expected by MealCard
  const prepareMealData = () => {
    if (!foodItemsData) return {}

    const result: Record<string, { totalKcal: number; items: { name: string; kcal: number }[] }> = {}

    // Process each meal type
    Object.entries(foodItemsData).forEach(([mealType, mealData]) => {
      if (mealData) {
        result[mealType] = {
          totalKcal: mealData.totalCalories,
          items: mealData.items.map((item:FoodItem) => ({
            name: item.name,
            kcal: item.calories,
          })),
        }
      }
    })

    return result
  }

  // Render loading state
  if (isLoading && !refreshing) {
    return (
      <GradientBlurBackground>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: "transparent" }]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.secondary }]}>Loading your nutrition data...</Text>
          </View>
        </SafeAreaView>
      </GradientBlurBackground>
    )
  }

  // Prepare data for components
  const caloriesLeft = calculateCaloriesLeft()
  const calorieProgress = calculateCalorieProgress()
  const nutrientsData = prepareNutrientsData()
  const mealsData = prepareMealData()

  return (
    <GradientBlurBackground>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: "transparent" }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: heightBar + 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        >
          <View style={styles.container}>
            <UserGreeting name={user?.name || "Guest"} avatarUrl={user?.image} />

            <CalorieTracker caloriesLeft={caloriesLeft} progress={calorieProgress} />

            <NutrientProgress nutrients={nutrientsData} />

            <DateNavigator
              date={formatDateForDisplay(selectedDate)}
              onPrevious={handlePreviousDay}
              onNext={handleNextDay}
            />

            {/* Render only meal cards with items */}
            {Object.entries(mealsData).map(([mealType, mealData]) =>
              // Only render meal card if it has items
              mealData.items.length > 0 ? (
                <MealCard
                  key={mealType}
                  mealName={mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  totalKcal={mealData.totalKcal}
                  items={mealData.items}
                  iconName={getMealIcon(mealType)}
                />
              ) : null,
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBlurBackground>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: "5%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Montserrat_500Medium",
  },
  retryText: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
})

export default HomeScreen