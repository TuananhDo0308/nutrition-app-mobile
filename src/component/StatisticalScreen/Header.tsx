// components/Header.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface HeaderProps {
  calories: number;
  currentWeight: number;
  weightChange: number;
}

const Header: React.FC<HeaderProps> = ({ calories, currentWeight, weightChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.calories}>
        <Text style={styles.caloriesValue}>{calories}</Text>
        <Text style={styles.caloriesUnit}>kcal</Text>
      </View>
      <Text style={styles.currentWeightLabel}>current weight</Text>
      <View style={styles.weightContainer}>
        <Text style={styles.label}>WEIGHT</Text>
        <View style={styles.weightInfo}>
          <Text style={styles.currentWeight}>{currentWeight}kgs</Text>
          <Text style={styles.weightChange}>↑{weightChange}kgs</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
  calories: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  caloriesUnit: {
    fontSize: 24,
    color: "#fff",
    marginLeft: 4,
  },
  currentWeightLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  weightContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  weightInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentWeight: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  weightChange: {
    fontSize: 14,
    color: "#85F193",
  },
});

export default Header;