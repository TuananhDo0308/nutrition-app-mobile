import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

interface HeaderProps {
  calories: number
}

const Header: React.FC<HeaderProps> = ({ calories }) => {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <View style={styles.calories}>
        <Text style={[styles.caloriesValue, { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" }]}>
          {calories}
        </Text>
        <Text style={[styles.caloriesUnit, { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" }]}>
          kcal
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
  calories: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: "bold",
  },
  caloriesUnit: {
    fontSize: 24,
    marginLeft: 4,
  },
})

export default Header
