// components/MealCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";

interface MealItem {
  name: string;
  kcal: number;
}

interface MealCardProps {
  mealName: string;
  totalKcal: number;
  items: MealItem[];
}

const MealCard: React.FC<MealCardProps> = ({ mealName, totalKcal, items }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <Icon source={require("../../Icon/breakfast.png")} size={30} />
          <Text style={styles.title}>{mealName}</Text>
        </View>
        <View style={styles.kcalWrapper}>
          <Text style={styles.kcal}>{totalKcal} </Text>
          <Text style={styles.kcalUnit}>kcal</Text>
        </View>
      </View>
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.itemKcal}>
              <Text style={styles.itemKcalValue}>{item.kcal} </Text>
              <Text style={styles.itemKcalUnit}>kcal</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "#232323",
    padding: 17,
    justifyContent: "space-between",
    height: 191,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  title: {
    fontWeight: "bold",
    marginLeft: 10,
    color: "#85F193",
  },
  kcalWrapper: {
    flexDirection: "row",
  },
  kcal: {
    color: "#85F193",
    fontSize: 16,
  },
  kcalUnit: {
    color: "#85F193",
  },
  itemsContainer: {
    borderRadius: 20,
    backgroundColor: "#343434",
    padding: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    color: "#ffffff",
  },
  itemKcal: {
    flexDirection: "row",
  },
  itemKcalValue: {
    color: "#ffffff",
  },
  itemKcalUnit: {
    color: "#ffffff",
  },
});

export default MealCard;