"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "react-native-paper"

interface MealItem {
  name: string
  kcal: number
}

interface MealCardProps {
  mealName: string
  totalKcal: number
  items: MealItem[]
  iconName?: string
}

const MealCard: React.FC<MealCardProps> = ({ mealName, totalKcal, items, iconName = "restaurant-outline" }) => {
  const theme = useTheme()

  // Calculate percentage of daily calories
  const getPercentage = () => {
    // Assuming 2000 calories is the daily target
    const dailyTarget = 2000
    return Math.round((totalKcal / dailyTarget) * 100)
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.dark ? "#232323" : "#FFFFFF",
          shadowColor: theme.dark ? "#000000" : "#CCCCCC",
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + "20" }]}>
            <Ionicons name={iconName} size={24} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={[styles.title, { color: theme.colors.primary, fontFamily: "Montserrat_700Bold" }]}>
              {mealName}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.secondary, opacity: 0.7 }]}>
              {getPercentage()}% of daily calories
            </Text>
          </View>
        </View>
        <View style={styles.kcalWrapper}>
          <Text style={[styles.kcal, { color: theme.colors.primary, fontFamily: "Montserrat_600SemiBold" }]}>
            {totalKcal}{" "}
          </Text>
          <Text style={[styles.kcalUnit, { color: theme.colors.primary, fontFamily: "Montserrat_400Regular" }]}>
            kcal
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.itemsContainer,
          {
            backgroundColor: theme.dark ? "#343434" : "#F8F8F8",
          },
        ]}
      >
        {items.map((item, index) => (
          <View key={index} style={[styles.item, index < items.length - 1 && styles.itemBorder]}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
                {item.name}
              </Text>

              {/* Progress indicator for item's calorie contribution */}
              <View style={[styles.itemProgress, { backgroundColor: theme.dark ? "#232323" : "#EEEEEE" }]}>
                <View
                  style={[
                    styles.itemProgressFill,
                    {
                      width: `${Math.min(100, (item.kcal / totalKcal) * 100)}%`,
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.itemKcal}>
              <Text
                style={[styles.itemKcalValue, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}
              >
                {item.kcal}{" "}
              </Text>
              <Text
                style={[
                  styles.itemKcalUnit,
                  { color: theme.colors.secondary, opacity: 0.7, fontFamily: "Montserrat_400Regular" },
                ]}
              >
                kcal
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} >
          <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>Add Food</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  kcalWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  kcal: {
    fontSize: 18,
  },
  kcalUnit: {
    fontSize: 14,
  },
  itemsContainer: {
    borderRadius: 20,
    padding: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    marginBottom: 6,
  },
  itemProgress: {
    height: 4,
    borderRadius: 2,
    width: "100%",
  },
  itemProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  itemKcal: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  itemKcalValue: {
    fontSize: 14,
  },
  itemKcalUnit: {
    fontSize: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    marginLeft: 6,
  },
})

export default MealCard
