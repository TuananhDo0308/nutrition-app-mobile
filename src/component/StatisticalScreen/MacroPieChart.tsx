// components/MacroPieChart.tsx (Dùng PieChart từ react-native-gifted-charts)
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface MacroData {
  name: string;
  value: number;
  color: string;
}

interface MacroPieChartProps {
  data: MacroData[];
}

const MacroPieChart: React.FC<MacroPieChartProps> = ({ data }) => {
  const pieData = data.map(item => ({
    value: item.value,
    color: item.color,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          donut
          innerRadius={40}
          radius={60}
        />
      </View>
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name} {item.value}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartContainer: {
    width: "45%",
  },
  legend: {
    width: "50%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#fff",
  },
});

export default MacroPieChart;