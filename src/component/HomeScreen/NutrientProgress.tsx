"use client"

import type React from "react"
import { useEffect } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { useTheme } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"

interface Nutrient {
  name: string
  value: number
  goal: number
  unit: string
  progress: number
}

interface NutrientProgressProps {
  nutrients: Nutrient[]
}

const NutrientProgress: React.FC<NutrientProgressProps> = ({ nutrients }) => {
  const theme = useTheme()
  const animatedValues = nutrients.map(() => new Animated.Value(0))

  // Colors for each nutrient
  const nutrientColors = {
    Protein: ["#FF5E7B", "#FF8A9B"],
    Carbs: ["#54C5EB", "#84D7F3"],
    Fat: ["#FFBD59", "#FFCE82"],
  }

  useEffect(() => {
    // Animate progress bars when component mounts or data changes
    Animated.parallel(
      animatedValues.map((anim, index) =>
        Animated.timing(anim, {
          toValue: nutrients[index].progress,
          duration: 1000,
          useNativeDriver: false,
        }),
      ),
    ).start()
  }, [nutrients])

  return (
    <View style={styles.container}>
      {nutrients.map((nutrient, index) => {
        const colors = nutrientColors[nutrient.name as keyof typeof nutrientColors] || [
          theme.colors.primary,
          theme.colors.primary,
        ]

        // Calculate percentage for display
        const percentage = Math.round(nutrient.progress * 100)

        return (
          <View key={index} style={styles.nutrientColumn}>
            <View style={[styles.progressContainer, { backgroundColor: theme.dark ? "#232323" : "#F4F4F4" }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    height: animatedValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              >
                <LinearGradient colors={colors} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
              </Animated.View>

              {/* Percentage indicator */}
              <Text style={[styles.percentage, { color: theme.dark ? "#FFFFFF" : "#000000" }]}>{percentage}%</Text>
            </View>

            <View style={styles.textWrapper}>
              <Text style={[styles.name, { color: theme.dark ? "#FFFFFF" : "#000000" }]}>{nutrient.name}</Text>
              <View style={styles.values}>
                <Text style={[styles.value, { color: colors[0] }]}>
                  {nutrient.value}
                  {nutrient.unit}
                </Text>
                <Text style={[styles.goal, { color: theme.colors.secondary, opacity: 0.7 }]}>
                  of {nutrient.goal}
                  {nutrient.unit}
                </Text>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 16,
    height: 180,
    width: "100%",
    marginBottom: 70,
  },
  nutrientColumn: {
    alignItems: "center",
    flex: 1,
  },
  progressContainer: {
    width: 100,
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  percentage: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 12,
  },
  textWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  name: {
    fontWeight: "bold",
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
  },
  values: {
    marginTop: 4,
    alignItems: "center",
  },
  value: {
    fontWeight: "bold",
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
  },
  goal: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
})

export default NutrientProgress
