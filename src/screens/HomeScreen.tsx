import { ScrollView, StyleSheet, View } from "react-native"
import { useAppSelector } from "../hooks/hook"
import GradientBlurBackground from "../component/Layout/background"
import { SafeAreaView } from "react-native-safe-area-context"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useTheme } from "react-native-paper"
import { mealIcons, mockData } from "../constants/mockdata"
import UserGreeting from "../component/HomeScreen/UserGreeting"
import CalorieTracker from "../component/HomeScreen/CalorieTracker"
import NutrientProgress from "../component/HomeScreen/NutrientProgress"
import DateNavigator from "../component/HomeScreen/DateNavigator"
import MealCard from "../component/HomeScreen/MealCard"


const HomeScreen = () => {
  const user = useAppSelector((state) => state.user) || mockData.user
  const heightBar = useBottomTabBarHeight()
  const theme = useTheme()

  // Map meal types to their respective icons
  const getMealIcon = (mealType: string): string => {
    return mealIcons[mealType] || "restaurant-outline"
  }

  return (
    <GradientBlurBackground>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: "transparent" }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: heightBar + 20 }}
        >
          <View style={styles.container}>
            <UserGreeting name={user?.name || "Guest"} avatarUrl={user?.image} />

            <CalorieTracker caloriesLeft={mockData.calories.left} progress={mockData.calories.progress} />

            <NutrientProgress nutrients={mockData.nutrients} />

            <DateNavigator date={mockData.date} />

            {/* Render all meal cards */}
            {Object.entries(mockData.meals).map(([mealType, mealData]) => (
              <MealCard
                key={mealType}
                mealName={mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                totalKcal={mealData.totalKcal}
                items={mealData.items}
                iconName={getMealIcon(mealType)}
              />
            ))}
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
})

export default HomeScreen
