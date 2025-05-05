// ProgressScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../component/StatisticalScreen/Header";
import WeightGraph from "../component/StatisticalScreen/WeightGraph";
import CaloriesCircle from "../component/StatisticalScreen/CaloriesCircle";
import DailyProgressBars from "../component/StatisticalScreen/DailyProgressBars";
import MacroPieChart from "../component/StatisticalScreen/MacroPieChart";


import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Animated, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useDispatch } from "react-redux"
import { useTheme } from "react-native-paper"
import GradientBlurBackground from "../component/Layout/background";
import NutritionBars from "../component/StatisticalScreen/NutritionBars";
import axios from "axios";
import { apiLinks } from "../utils";
import { useAppSelector } from "../hooks/hook";

// Mock data
const mockData = {
  calories: {
    current: 12,
    goal: 1900,
  },
  dailyProgress: [
    { date: "M", calories: 0, goal: 0 },
    { date: "Tu", calories: 0, goal: 0 },
    { date: "W", calories: 1700, goal: 1900 },
    { date: "Th", calories: 1600, goal: 1900 },
    { date: "F", calories: 1400, goal: 1900 },
    { date: "Sa", calories: 1300, goal: 1900 },
    { date: "S", calories: 1200, goal: 1900 },
  ],
  weight: {
    current: 73,
    change: 0,
    data: [
      { date: "20 Feb", value: 76 },
      { date: "21 Feb", value: 75 },
      { date: "22 Feb", value: 75 },
      { date: "23 Feb", value: null },
      { date: "24 Feb", value: null },
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
  

  const theme = useTheme();
  const dispatch = useDispatch();
  const authToken = useAppSelector((state) => state.user?.token);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // State for data and loading
  const [data, setData] = useState({
    calories: { current: 0, target: 0 },
    dailyProgress: [],
    weight: { current: 0, change: 0, data: [] },
    macros: [],
    nutrition: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch data from API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(apiLinks.food.weekly, {
        headers: {
          Authorization: authToken,
        },
      });

      const apiData = response.data.data;
      setData({
        calories: apiData.calories || { current: 0, goal: 1900 },
        dailyProgress: apiData.dailyProgresses || [],
        weight: apiData.weight || { current: 0, change: 0, data: [] },
        macros: apiData.macros || [],
        nutrition: apiData.nutrtion ,
      });

      // Animate content when data is loaded
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (err: any) {
      console.error("Error fetching progress data:", err);
      setError("Failed to load progress data. Please try again.");
      setData({
        calories: { current: 0, target: 1900 },
        dailyProgress: [],
        weight: { current: 0, change: 0, data: [] },
        macros: [],
        nutrition: [],
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    fetchData();
  }, [fadeAnim, slideAnim]);
  // Handle refresh



  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientBlurBackground>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.headerText, { color: theme.colors.secondary }]}>Progress</Text>
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: theme.dark ? "#333333" : "#F0F0F0" }]}
              onPress={() => console.log("Filter pressed")}
            >
              <Ionicons name="calendar-outline" size={18} color={theme.colors.secondary} />
              <Text style={[styles.filterText, { color: theme.colors.secondary }]}>This Week</Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.secondary} />
            </TouchableOpacity>
          </Animated.View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
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
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Header calories={data.calories.current} />
            </Animated.View>

            <Animated.View
              style={[
                styles.card,
                {
                  backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <WeightGraph data={data.weight} />
            </Animated.View>

            <View style={styles.row}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
                    flex: 1,
                    marginRight: 8,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <CaloriesCircle current={data.calories.current} goal={data.calories.target} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
                    flex: 1,
                    marginLeft: 8,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <DailyProgressBars data={data.dailyProgress} />
              </Animated.View>
            </View>

            <Animated.View
              style={[
                styles.card,
                {
                  backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.nutritionContainer}>
                <NutritionBars data={data.nutrition} />
                <MacroPieChart data={data.macros} />
              </View>
            </Animated.View>

            <View style={styles.spacer} />
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
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Montserrat_700Bold",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
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
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  nutritionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spacer: {
    height: 60,
  },
})

export default StatisticalScreen

