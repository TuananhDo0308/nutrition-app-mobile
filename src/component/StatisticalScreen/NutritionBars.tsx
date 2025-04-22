import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

interface NutritionData {
  day: string
  carbs: number
  protein: number
  fat: number
}

interface NutritionBarsProps {
  data: NutritionData[]
}

const NutritionBars: React.FC<NutritionBarsProps> = ({ data }) => {
  const theme = useTheme()

  // Define colors for the nutrition segments
  const nutritionColors = {
    carbs: theme.colors.primary,
    protein: "#FFD700", // Yellow for protein
    fat: "#4682B4", // Blue for fat
  }

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.barGroup}>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.barSegment,
                {
                  backgroundColor: nutritionColors.fat,
                  height: `${item.fat}%`,
                },
              ]}
            />
            <View
              style={[
                styles.barSegment,
                {
                  backgroundColor: nutritionColors.protein,
                  height: `${item.protein}%`,
                },
              ]}
            />
            <View
              style={[
                styles.barSegment,
                {
                  backgroundColor: nutritionColors.carbs,
                  height: `${item.carbs}%`,
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
            {item.day}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "55%",
    height: 120,
  },
  barGroup: {
    alignItems: "center",
  },
  barContainer: {
    width: 12,
    height: 100,
    marginBottom: 8,
    justifyContent: "flex-end",
  },
  barSegment: {
    width: "100%",
    borderRadius: 0,
  },
  dayLabel: {
    fontSize: 12,
  },
})

export default NutritionBars
