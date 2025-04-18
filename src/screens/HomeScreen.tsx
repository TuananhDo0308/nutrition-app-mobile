// HomeScreen.tsx
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useAppSelector } from "../hooks/hook";
import { RootState } from "../store/store";
import GradientBlurBackground from "../component/Layout/background";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import UserGreeting from "../component/HomeScreen/UserGreeting";
import CalorieTracker from "../component/HomeScreen/CalorieTracker";
import NutrientProgress from "../component/HomeScreen/NutrientProgress";
import DateNavigator from "../component/HomeScreen/DateNavigator";
import MealCard from "../component/HomeScreen/MealCard";


// Dữ liệu giả
const mockData = {
  calories: {
    left: 1400,
    progress: 0.5,
  },
  nutrients: [
    { name: "Protein", value: 100, goal: 200, unit: "g", progress: 0.5 },
    { name: "Carbs", value: 200, goal: 200, unit: "g", progress: 1 },
    { name: "Fat", value: 32, goal: 32, unit: "g", progress: 1 },
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
  },
};

const HomeScreen = () => {
  const user = useAppSelector((state: RootState) => state.user);
  const heightBar = useBottomTabBarHeight();

  return (
    <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: heightBar }}
        >
          <View style={styles.container}>
            <UserGreeting name={user?.name || "Guest"} />
            <CalorieTracker
              caloriesLeft={mockData.calories.left}
              progress={mockData.calories.progress}
            />
            <NutrientProgress nutrients={mockData.nutrients} />
            <DateNavigator date={mockData.date} />
            <MealCard
              mealName="Breakfast"
              totalKcal={mockData.meals.breakfast.totalKcal}
              items={mockData.meals.breakfast.items}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBlurBackground>
  );
};

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
});

export default HomeScreen;