"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing } from "react-native"
import { useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import Svg, { Circle } from "react-native-svg"

interface CalorieTrackerProps {
  caloriesLeft: number
  progress: number
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ caloriesLeft, progress }) => {
  const theme = useTheme()
  const animatedProgress = useRef(new Animated.Value(0)).current

  // Calculate percentage for display
  const percentage = Math.round(progress * 100)

  useEffect(() => {
    // Animate progress when component mounts or data changes
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start()
  }, [progress])

  // Interpolate animated value for circle stroke dashoffset
  const circleCircumference = 2 * Math.PI * 45
  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circleCircumference, 0],
  })

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.content}>
        <View style={styles.circleContainer}>
          <Svg width={120} height={120} viewBox="0 0 100 100">
            {/* Background circle */}
            <Circle
              cx="50"
              cy="50"
              r="45"
              stroke={theme.dark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.3)"}
              strokeWidth="8"
              fill="transparent"
            />

            {/* Animated progress circle */}
            <AnimatedCircle
              cx="50"
              cy="50"
              r="45"
              stroke={theme.dark ? "#000000" : "#FFFFFF"}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>

          <View style={styles.circleContent}>
            <Ionicons name="flame" size={24} color={theme.dark ? "#000000" : "#FFFFFF"} />
            <Text style={[styles.percentage, { color: theme.dark ? "#000000" : "#FFFFFF" }]}>{percentage}%</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, { color: theme.dark ? "#000000" : "#FFFFFF" }]}>Calories Left</Text>
          <Text style={[styles.value, { color: theme.dark ? "#000000" : "#FFFFFF" }]}>{caloriesLeft} kcal</Text>
          <Text style={[styles.subtitle, { color: theme.dark ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)" }]}>
            Keep going, you're doing great!
          </Text>
        </View>
      </View>
    </View>
  )
}

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 24,
    marginBottom: 36,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  circleContainer: {
    position: "relative",
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  circleContent: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  percentage: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat_700Bold",
    marginTop: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Montserrat_700Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
})

export default CalorieTracker
