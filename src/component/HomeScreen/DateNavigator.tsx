import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import * as Haptics from "expo-haptics"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "react-native-paper"

interface DateNavigatorProps {
  date: string
  onPrevious?: () => void
  onNext?: () => void
  onDatePress?: () => void
}

const DateNavigator: React.FC<DateNavigatorProps> = ({
  date,
  onPrevious = () => {},
  onNext = () => {},
  onDatePress = () => {},
}) => {
  const theme = useTheme()

  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    callback()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handlePress(onPrevious)} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={24} color={theme.colors.secondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress(onDatePress)} activeOpacity={0.7}>
        <Text style={[styles.date, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
          {date}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress(onNext)} activeOpacity={0.7}>
        <Ionicons name="chevron-forward" size={24} color={theme.colors.secondary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 26,
    width: "100%",
  },
  date: {
    fontSize: 16,
  },
})

export default DateNavigator
