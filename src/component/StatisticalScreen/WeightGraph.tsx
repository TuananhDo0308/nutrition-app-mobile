// components/WeightGraph.tsx (Dùng LineChart từ react-native-gifted-charts)
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";

interface WeightDataPoint {
  date: string;
  value: number;
}

interface WeightGraphProps {
  data: WeightDataPoint[];
}

const screenWidth = Dimensions.get("window").width;

const WeightGraph: React.FC<WeightGraphProps> = ({ data }) => {
  const chartData = data.map(item => ({
    value: item.value,
    label: item.date,
  }));
  const datatemp = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        height={220}
        color="#85F193"
        thickness={2}
        dataPointsColor="#85F193"
        dataPointsRadius={6}
        xAxisLabelTextStyle={styles.xAxisLabel}
        yAxisTextStyle={styles.yAxisText}
        yAxisLabelSuffix="kgs"
        backgroundColor="#343434"
        startFillColor="#85F193"
        endFillColor="#85F193"
        startOpacity={0.3}
        endOpacity={0.1}
        noOfSections={5}
        rulesColor="#999"
        xAxisColor="#999"
        yAxisColor="#999"
      />
      <LineChart data={datatemp}/>
      <Button
        mode="contained"
        onPress={() => console.log("Record weight pressed")}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Record weight
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
  xAxisLabel: {
    color: "#999",
    fontSize: 12,
  },
  yAxisText: {
    color: "#999",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#85F193",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  buttonLabel: {
    color: "#333",
    fontSize: 14,
  },
});

export default WeightGraph;