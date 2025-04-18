// components/DailyProgressBars.tsx (Giữ nguyên, đã dùng VerticalProgressBar)
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import VerticalProgressBar from "../ui/CustomProgessBar";

interface DailyProgressData {
  day: string;
  calories: number;
  goal: number;
}

interface DailyProgressBarsProps {
  data: DailyProgressData[];
}

const DailyProgressBars: React.FC<DailyProgressBarsProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <VerticalProgressBar
            progress={Math.round((item.calories / item.goal) * 100) / 100
            }
            color="#85F193"
            style={styles.progressBar}
          />
          <Text style={styles.dayLabel}>{item.day}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  barContainer: {
    alignItems: "center",
  },
  progressBar: {
    width: 16,
    height: 100,
  },
  dayLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});

export default DailyProgressBars;