// ProgressScreen.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../component/StatisticalScreen/Header";
import WeightGraph from "../component/StatisticalScreen/WeightGraph";
import CaloriesCircle from "../component/StatisticalScreen/CaloriesCircle";
import DailyProgressBars from "../component/StatisticalScreen/DailyProgressBars";
import MacroPieChart from "../component/StatisticalScreen/MacroPieChart";


import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useDispatch } from "react-redux"
import { useTheme } from "react-native-paper";
import NutritionBars from "../component/StatisticalScreen/NutritionBars";
import GradientBlurBackground from "../component/Layout/background";

// Mock data
const mockData = {
  calories: {
    current: 1900,
    goal: 1900,
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
  macros: [
    { name: "Carbs", value: 46, color: "#85F193" },
    { name: "Protein", value: 35, color: "#FFD700" },
    { name: "Fat", value: 29, color: "#4682B4" },
  ],
  nutrition: [
    { day: "M", carbs: 40, protein: 30, fat: 30 },
    { day: "Tu", carbs: 45, protein: 35, fat: 20 },
    { day: "W", carbs: 50, protein: 30, fat: 20 },
    { day: "Th", carbs: 45, protein: 35, fat: 20 },
    { day: "F", carbs: 40, protein: 40, fat: 20 },
    { day: "Sa", carbs: 50, protein: 30, fat: 20 },
    { day: "S", carbs: 45, protein: 35, fat: 20 },
  ],
}

const StatisticalScreen = () => {
  const theme = useTheme()
  const dispatch = useDispatch()



  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: theme.colors.secondary }]}>Progress</Text>

        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Header calories={mockData.calories.current} />

          <Text style={[styles.sectionLabel, { color: theme.colors.secondary, opacity: 0.6 }]}>current weight</Text>

          <View style={[styles.card, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>
            <WeightGraph data={mockData.weight.data} />
          </View>

          <View style={styles.row}>
            <View
              style={[styles.card, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF", flex: 1, marginRight: 8 }]}
            >
              <CaloriesCircle current={0} goal={mockData.calories.goal} />
            </View>
            <View
              style={[styles.card, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF", flex: 1, marginLeft: 8 }]}
            >
              <DailyProgressBars data={mockData.dailyProgress} />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>
            <View style={styles.nutritionContainer}>
              <NutritionBars data={mockData.nutrition} />
              <MacroPieChart data={mockData.macros} />
            </View>
          </View>
        </ScrollView>

      </SafeAreaView>
      </GradientBlurBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  nutritionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default StatisticalScreen
