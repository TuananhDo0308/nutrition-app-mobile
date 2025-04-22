import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import VerticalProgressBar from "../ui/CustomProgessBar"
import { useTheme } from "react-native-paper"

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

  return (
    <View style={styles.container}>
      {nutrients.map((nutrient, index) => (
        <View key={index} style={styles.nutrient}>
          <View style={styles.progressCol}>
            <VerticalProgressBar backgroundColor={theme.dark ?  "#232323":"#F4F4F4"} progress={nutrient.progress} color={theme.colors.primary} />
          </View>
          <View style={styles.textWrapper}>
            <Text style={[styles.name, { color: theme.dark ? "#FFFFFF" : "#000000" }]}>{nutrient.name}</Text>
            <View style={styles.values}>
              <Text style={[styles.value, { color: theme.colors.secondary }]}>
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
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20,
    height: 160,
    width: "100%",
    marginBottom: 26,
  },
  nutrient: {
    alignItems: "center",
  },
  progressCol: {
    width: 91,
    height: 160,
    overflow: "hidden",
  },
  progressBar: {
    height: 160,
    borderRadius: 15,
  },
  textWrapper: {
    position: "absolute",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontFamily: "Montserrat_700Bold",
    top: 10,
  },
  values: {
    marginTop: 90,
    alignItems: "center",
  },
  value: {
    fontWeight: "bold",
    fontFamily: "Montserrat_700Bold",
  },
  goal: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
})

export default NutrientProgress
