"use client"

import type React from "react"
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native"
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

  // Animation values for press feedback
  const scaleAnim = new Animated.Value(1)

  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    callback()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handlePress(onPrevious)} activeOpacity={0.7} style={styles.arrowButton}>
        <Ionicons name="chevron-back" size={24} color={theme.colors.secondary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress(onDatePress)} activeOpacity={0.7} style={styles.dateButton}>
        <Ionicons name="calendar-outline" size={18} color={theme.colors.secondary} style={styles.calendarIcon} />
        <Animated.Text
          style={[
            styles.date,
            {
              color: theme.colors.secondary,
              fontFamily: "Montserrat_600SemiBold",
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {date}
        </Animated.Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress(onNext)} activeOpacity={0.7} style={styles.arrowButton}>
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
    marginBottom: 30,
    width: "100%",
  },
  arrowButton: {
    padding: 8,
    borderRadius: 20,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  calendarIcon: {
    marginRight: 8,
  },
  date: {
    fontSize: 16,
  },
})

export default DateNavigator
