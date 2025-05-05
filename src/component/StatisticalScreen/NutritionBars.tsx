"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

interface NutritionData {
  date: string
  carbs: number
  protein: number
  fat: number
}

interface NutritionBarsProps {
  data: NutritionData[]
}

const NutritionBars: React.FC<NutritionBarsProps> = ({ data }) => {
  const theme = useTheme()
  const defaultDays = ["M", "Tu", "W", "Th", "F", "Sa", "S"]

  // Log data to debug
  console.log("NutritionBars data:", data)

  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
          WEEKLY NUTRITION
        </Text>
        <Text style={[styles.noDataText, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
          No data available
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
        WEEKLY NUTRITION
      </Text>

      <View style={styles.barsContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barGroup}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.barSegment,
                  {
                    backgroundColor: "#4682B4", // Blue for fat
                    height: `${(item.fat / 100) * 100}%`, // Normalize to 100 as max height
                  },
                ]}
              />
              <View
                style={[
                  styles.barSegment,
                  {
                    backgroundColor: "#FFD700", // Yellow for protein
                    height: `${(item.protein / 100) * 100}%`, // Normalize to 100 as max height
                  },
                ]}
              />
              <View
                style={[
                  styles.barSegment,
                  {
                    backgroundColor: theme.colors.primary, // Carbs
                    height: `${(item.carbs / 100) * 100}%`, // Normalize to 100 as max height
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.dayLabel,
                {
                  color: theme.colors.secondary,
                  opacity: 0.6,
                  fontFamily: "Montserrat_400Regular",
                },
              ]}
            >
              {defaultDays[index]}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#4682B4" }]} />
          <Text style={[styles.legendText, { color: theme.colors.secondary }]}>Fat</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#FFD700" }]} />
          <Text style={[styles.legendText, { color: theme.colors.secondary }]}>Protein</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
          <Text style={[styles.legendText, { color: theme.colors.secondary }]}>Carbs</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "55%",
    height: 200,
  },
  title: {
    fontSize: 14,
    marginBottom: 50,
    textAlign: "center",
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
  },
  barGroup: {
    alignItems: "center",
  },
  barContainer: {
    width: 16,
    height: 100,
    marginBottom: 8,
    justifyContent: "flex-end",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  barSegment: {
    width: "100%",
    borderRadius: 0,
  },
  dayLabel: {
    fontSize: 12,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
  },
})

export default NutritionBars