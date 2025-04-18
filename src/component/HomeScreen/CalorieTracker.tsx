// components/CalorieTracker.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon, ProgressBar, useTheme } from "react-native-paper";

interface CalorieTrackerProps {
  caloriesLeft: number;
  progress: number;
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({
  caloriesLeft,
  progress,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: "#85F193" }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.label}>Calories</Text>
          <Text style={styles.value}>{caloriesLeft} kcal left</Text>
        </View>
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color="#FFFFFF"
            style={styles.progressBar}
          />
          <View style={styles.iconWrapper}>
            <Icon source={require("../../Icon/milkBox.png")} size={20} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 36,
    width: "100%",
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
  },
  value: {
    fontSize: 14,
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
});

export default CalorieTracker;