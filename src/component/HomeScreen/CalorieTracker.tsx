import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { ProgressBar, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

interface CalorieTrackerProps {
  caloriesLeft: number
  progress: number
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ caloriesLeft, progress }) => {
  const theme = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.label, { color: theme.dark ? "#000000" : "#FFFFFF" }]}>Calories</Text>
          <Text style={[styles.value, { color: theme.dark ? "#000000" : "#FFFFFF" }]}>{caloriesLeft} kcal left</Text>
        </View>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} color={theme.dark ? "#000000" : "#FFFFFF"} style={styles.progressBar} />
          <View style={styles.iconWrapper}>
            <Ionicons name="flame-outline" size={24} color={theme.colors.primary} />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 36,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    width: "90%",
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  value: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  progressContainer: {
    justifyContent: "center",
  },
  progressBar: {
    height: 45,
    borderRadius: 15,
  },
  iconWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    width: 48,
    borderRadius: 15,
    backgroundColor: "#F4F4F4",
  },
})

export default CalorieTracker
