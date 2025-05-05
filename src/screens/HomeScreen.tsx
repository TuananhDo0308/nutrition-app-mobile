"use client"

import { useState, useEffect, useCallback } from "react"
import { ScrollView, StyleSheet, View, Text, RefreshControl, Animated } from "react-native"
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
import SkeletonLoader from "../component/HomeScreen/skeleton"
import axios from "axios"
import { format, isToday } from "date-fns"
import { apiLinks } from "../utils"
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import { useAppSelector } from "../hooks/hook"

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
  const [refreshing, setRefreshing] = useState(false)

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0]
  const slideAnim = useState(new Animated.Value(20))[0]

  // Format date for API requests
  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
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
      const dailyPlanResponse = await axios.get(apiLinks.food.dailyPlan(year, month, day), {
        headers: {
          Authorization: authToken,
        },
      })

      // Fetch food items data
      const foodItemsResponse = await axios.get(apiLinks.food.dailyPlanFood(year, month, day), {
        headers: {
          Authorization: authToken,
        },
      })

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
          targetCalories: 2000, // Default target
          targetCarbs: 250,
          targetFats: 70,
          targetProteins: 150,
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

      // Animate content when data is loaded
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please try again.")

      // Set default values on error
      setDailyPlanData({
        id: "",
        totalCalories: 0,
        totalCarbs: 0,
        totalFats: 0,
        totalProteins: 0,
        targetCalories: 2000,
        targetCarbs: 250,
        targetFats: 70,
        targetProteins: 150,
        date: selectedDate.toISOString().split("T")[0],
      })

      setFoodItemsData({
        breakfast: { totalCalories: 0, items: [] },
        lunch: { totalCalories: 0, items: [] },
        dinner: { totalCalories: 0, items: [] },
      })
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [selectedDate, authToken, fadeAnim, slideAnim])

  // Fetch data on component mount and when selected date changes
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Reset animations
    fadeAnim.setValue(0)
    slideAnim.setValue(20)
    fetchData()
  }, [fetchData, fadeAnim, slideAnim])

  // Handle date navigation
  const handlePreviousDay = () => {
    const prevDate = new Date(selectedDate)
    prevDate.setDate(prevDate.getDate() - 1)
    setSelectedDate(prevDate)

    // Reset animations for new data
    fadeAnim.setValue(0)
    slideAnim.setValue(20)
  }

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate)
    nextDate.setDate(nextDate.getDate() + 1)
    setSelectedDate(nextDate)

    // Reset animations for new data
    fadeAnim.setValue(0)
    slideAnim.setValue(20)
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
          items: mealData.items.map((item: FoodItem) => ({
            name: item.name,
            kcal: item.calories,
          })),
        }
      }
    })

    return result
  }

  // Render skeleton loading state
  const renderSkeletonLoading = () => {
    return (
      <View style={styles.skeletonContainer}>
        {/* Skeleton for UserGreeting */}
        <View style={styles.skeletonHeader}>
          <SkeletonLoader width={60} height={60} borderRadius={30} />
          <View style={{ marginTop: 16 }}>
            <SkeletonLoader width={120} height={20} style={{ marginBottom: 8 }} />
            <SkeletonLoader width={200} height={32} />
          </View>
        </View>

        {/* Skeleton for CalorieTracker */}
        <SkeletonLoader width="100%" height={120} borderRadius={24} style={{ marginBottom: 36 }} />

        {/* Skeleton for NutrientProgress */}
        <View style={styles.skeletonNutrients}>
          <SkeletonLoader width={80} height={160} borderRadius={20} />
          <SkeletonLoader width={80} height={160} borderRadius={20} />
          <SkeletonLoader width={80} height={160} borderRadius={20} />
        </View>

        {/* Skeleton for DateNavigator */}
        <View style={styles.skeletonDate}>
          <SkeletonLoader width={40} height={40} borderRadius={20} />
          <SkeletonLoader width={150} height={40} borderRadius={20} />
          <SkeletonLoader width={40} height={40} borderRadius={20} />
        </View>

        {/* Skeleton for MealCards */}
        <SkeletonLoader width="100%" height={180} borderRadius={24} style={{ marginBottom: 20 }} />
        <SkeletonLoader width="100%" height={180} borderRadius={24} style={{ marginBottom: 20 }} />
      </View>
    )
  }

  // Render error state
  const renderError = () => {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.secondary }]}>{error}</Text>
        <TouchableOpacity onPress={fetchData} style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.retryText, { color: "#FFFFFF" }]}>Try Again</Text>
        </TouchableOpacity>
      </View>
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
        {isLoading && !refreshing ? (
          renderSkeletonLoading()
        ) : error ? (
          renderError()
        ) : (
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
            <Animated.View
              style={[
                styles.container,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
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

              {/* Empty state if no meals */}
              {Object.values(mealsData).every((meal) => meal.items.length === 0) && (
                <View style={styles.emptyState}>
                  <Ionicons name="restaurant-outline" size={48} color={theme.colors.secondary} />
                  <Text style={[styles.emptyStateText, { color: theme.colors.secondary }]}>
                    No meals recorded for this day
                  </Text>
                  <TouchableOpacity style={[styles.addMealButton, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.addMealButtonText}>Add Your First Meal</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </ScrollView>
        )}
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
  skeletonContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: "5%",
  },
  skeletonHeader: {
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 24,
  },
  skeletonNutrients: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 16,
    marginBottom: 30,
  },
  skeletonDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
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
    marginVertical: 16,
    fontFamily: "Montserrat_500Medium",
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryText: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
    fontFamily: "Montserrat_500Medium",
  },
  addMealButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 16,
  },
  addMealButtonText: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
  },
})

export default HomeScreen
