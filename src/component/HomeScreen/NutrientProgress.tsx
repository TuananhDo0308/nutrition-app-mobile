// components/NutrientProgress.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import VerticalProgressBar from "../ui/CustomProgessBar";


interface Nutrient {
  name: string;
  value: number;
  goal: number;
  unit: string;
  progress: number;
}

interface NutrientProgressProps {
  nutrients: Nutrient[];
}
const NutrientProgress: React.FC<NutrientProgressProps> = ({ nutrients }) => {
  return (
    <View style={styles.container}>
      {nutrients.map((nutrient, index) => (
        <View key={index} style={styles.nutrient}>
          <View style={styles.progressCol}>
            <VerticalProgressBar
              progress={nutrient.progress}
              color="#85F193"
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.name}>{nutrient.name}</Text>
            <View style={styles.values}>
              <Text style={styles.value}>{nutrient.value}{nutrient.unit}</Text>
              <Text style={styles.goal}>of {nutrient.goal}{nutrient.unit}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

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
    color: "#ffffff",
    top: 10,
  },
  values: {
    marginTop: 90,
    alignItems: "center",
  },
  value: {
    fontWeight: "bold",
  },
  goal: {
    fontSize: 12,
  },
});

export default NutrientProgress;