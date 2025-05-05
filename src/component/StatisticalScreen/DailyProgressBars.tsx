"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

interface DailyProgressData {
  date: string
  calories: number
  goal: number
}

interface DailyProgressBarsProps {
  data: DailyProgressData[]
}
const DailyProgressBars: React.FC<DailyProgressBarsProps> = ({ data }) => {
  const theme = useTheme()
  const defaultDays = ["M", "Tu", "W", "Th", "F", "Sa", "S"]
  // Log data to debug
  console.log("DailyProgressBars data:", data)

  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
          WEEKLY CALORIES
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
        WEEKLY CALORIES
      </Text>

      <View style={styles.barsContainer}>
        {data.map((item, index) => {
          // Calculate percentage for height
          const percentage = item.goal !== 0 ? (item.calories / item.goal) * 100 : 0

          // Determine if this day has the highest percentage
          const isHighest = data.every(
            (otherItem, otherIndex) =>
              index === otherIndex ||
              (otherItem.goal !== 0 ? (otherItem.calories / otherItem.goal) * 100 : 0) <= percentage,
          )

          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.barBackground,
                    {
                      backgroundColor: theme.dark ? "#444444" : "#EEEEEE",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: isHighest ? theme.colors.primary : theme.colors.primary + "80",
                      height: `${percentage}%`, // Directly set height based on percentage
                    },
                  ]}
                />

                {/* Percentage indicator for the highest bar */}
                {isHighest && percentage > 0 && (
                  <View style={styles.percentageContainer}>
                    <Text style={[styles.percentageText, { color: theme.colors.primary }]}>
                      {Math.round(percentage)}%
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color: theme.colors.secondary,
                    opacity: 0.6,
                    fontFamily: "Montserrat_500Medium",
                    fontWeight: isHighest ? "600" : "400",
                  },
                ]}
              >
                {defaultDays[index]}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 160,
  },
  title: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: "center",
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    width: "100%",
    paddingHorizontal: 4,
  },
  barContainer: {
    alignItems: "center",
  },
  barWrapper: {
    width: 12,
    height: 100,
    position: "relative",
    marginBottom: 8,
  },
  barBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  barFill: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    borderRadius: 6,
  },
  percentageContainer: {
    position: "absolute",
    top: -20,
    width: 36,
    alignSelf: "center",
  },
  percentageText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
  },
  dayLabel: {
    fontSize: 12,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
  },
})

export default DailyProgressBars