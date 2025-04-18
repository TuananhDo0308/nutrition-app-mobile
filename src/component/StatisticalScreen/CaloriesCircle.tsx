// components/CaloriesCircle.tsx (Dùng PieChart từ react-native-gifted-charts)
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface CaloriesCircleProps {
  current: number;
  goal: number;
}

const CaloriesCircle: React.FC<CaloriesCircleProps> = ({ current, goal }) => {
  const progress = current / goal;
  const remaining = 1 - progress;

  const pieData = [
    { value: progress * 100, color: "#85F193" },
    { value: remaining * 100, color: "#343434" },
  ];

  return (
    <View style={styles.container}>
      <PieChart
        data={pieData}
        donut
        innerRadius={50}
        radius={60}
        centerLabelComponent={() => (
          <View style={styles.centerLabel}>
            <Text style={styles.current}>{current}</Text>
            <Text style={styles.goal}>/{goal}</Text>
            <Text style={styles.label}>UNDER</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "45%",
  },
  centerLabel: {
    alignItems: "center",
  },
  current: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  goal: {
    fontSize: 14,
    color: "#999",
  },
  label: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
});

export default CaloriesCircle;