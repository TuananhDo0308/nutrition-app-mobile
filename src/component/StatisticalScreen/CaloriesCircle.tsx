"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing } from "react-native"
import { useTheme } from "react-native-paper"
import Svg, { Circle, G, Defs, LinearGradient, Stop } from "react-native-svg"

interface CaloriesCircleProps {
  current: number
  goal: number
}

const CaloriesCircle: React.FC<CaloriesCircleProps> = ({ current, goal }) => {
  const theme = useTheme()

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current
  const textOpacityAnim = useRef(new Animated.Value(0)).current

  // Calculate the percentage of the goal achieved
  const percentage = Math.min(1, current / (goal || 1))

  // Calculate calories under goal
  const caloriesUnder = Math.max(0, goal - current)

  // Circle properties
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  useEffect(() => {
    // Animate progress when component mounts or when values change
    Animated.sequence([
      Animated.timing(progressAnim, {
        toValue: percentage,
        duration: 1500,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(textOpacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start()
  }, [current, goal, percentage])

  // Interpolate animated value for circle stroke dashoffset
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  })

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
        CALORIES UNDER
      </Text>

      <View style={styles.circleContainer}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={theme.colors.primary} />
              <Stop offset="100%" stopColor={theme.colors.primary + "80"} />
            </LinearGradient>
          </Defs>

          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.dark ? "#444444" : "#EEEEEE"}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Animated Progress Circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#gradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </G>
        </Svg>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacityAnim,
            },
          ]}
        >
          <Text
            style={[
              styles.valueText,
              {
                color: theme.colors.secondary,
                fontFamily: "Montserrat_700Bold",
              },
            ]}
          >
            {caloriesUnder.toFixed(0)}
          </Text>
          <Text
            style={[
              styles.labelText,
              {
                color: theme.colors.secondary,
                opacity: 0.6,
                fontFamily: "Montserrat_500Medium",
              },
            ]}
          >
            UNDER
          </Text>
        </Animated.View>
      </View>
    </View>
  )
}

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 160,
  },
  title: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  circleContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
  },
  valueText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  labelText: {
    fontSize: 12,
    marginTop: 4,
  },
})

export default CaloriesCircle
