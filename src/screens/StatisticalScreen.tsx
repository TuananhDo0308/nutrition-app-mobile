// ProgressScreen.tsx
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../component/StatisticalScreen/Header";
import WeightGraph from "../component/StatisticalScreen/WeightGraph";
import CaloriesCircle from "../component/StatisticalScreen/CaloriesCircle";
import DailyProgressBars from "../component/StatisticalScreen/DailyProgressBars";
import MacroPieChart from "../component/StatisticalScreen/MacroPieChart";
import GradientBlurBackground from "../component/Layout/background";


// Mock data
const mockData = {
  calories: {
    current: 1000,
    goal: 1900,
  },
  weight: {
    current: 73,
    change: 0.3,
    data: [
      { date: "20 Feb", value: 76 },
      { date: "21 Feb", value: 75 },
      { date: "22 Feb", value: 75 },
      { date: "23 Feb", value: 74.5 },
      { date: "24 Feb", value: 73 },
    ],
  },
  dailyProgress: [
    { day: "M", calories: 1500, goal: 1900 },
    { day: "Tu", calories: 1800, goal: 1900 },
    { day: "W", calories: 1700, goal: 1900 },
    { day: "Th", calories: 1600, goal: 1900 },
    { day: "F", calories: 1400, goal: 1900 },
    { day: "Sa", calories: 1300, goal: 1900 },
    { day: "S", calories: 1200, goal: 1900 },
  ],
  macros: [
    { name: "Carbs", value: 46, color: "#85F193" },
    { name: "Protein", value: 35, color: "#FFD700" },
    { name: "Fat", value: 19, color: "#4682B4" },
  ],
};

const StatisticalScreen = () => {
  return (
    <GradientBlurBackground xOffset={50} yOffset={50}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Header
            calories={mockData.calories.current}
            currentWeight={mockData.weight.current}
            weightChange={mockData.weight.change}
          />
          <WeightGraph data={mockData.weight.data} />
          <View style={styles.row}>
            <CaloriesCircle
              current={0}
              goal={mockData.calories.goal}
            />
            <DailyProgressBars data={mockData.dailyProgress} />
          </View>
          <MacroPieChart data={mockData.macros} />
        </ScrollView>
      </SafeAreaView>
    </GradientBlurBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
});

export default StatisticalScreen;