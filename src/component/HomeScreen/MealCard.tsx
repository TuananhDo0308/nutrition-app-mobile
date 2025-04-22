import type React from "react"
import { View, Text, StyleSheet } from "react-native"
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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.dark ? "#232323" : "#F5F5F5",
          shadowColor: theme.dark ? "#000000" : "#CCCCCC",
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + "20" }]}>
            <Ionicons name={iconName} size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.primary, fontFamily: "Montserrat_700Bold" }]}>
            {mealName}
          </Text>
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
            backgroundColor: theme.dark ? "#343434" : "#FFFFFF",
          },
        ]}
      >
        {items.map((item, index) => (
          <View key={index} style={[styles.item, index < items.length - 1 && styles.itemBorder]}>
            <Text style={[styles.itemName, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
              {item.name}
            </Text>
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 17,
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  title: {
    fontWeight: "bold",
  },
  kcalWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  kcal: {
    fontSize: 16,
  },
  kcalUnit: {
    fontSize: 12,
  },
  itemsContainer: {
    borderRadius: 16,
    padding: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  itemName: {
    flex: 1,
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
})

export default MealCard
