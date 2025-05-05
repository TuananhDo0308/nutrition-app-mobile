"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing } from "react-native"
import { useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

interface HeaderProps {
  calories: number
}

const Header: React.FC<HeaderProps> = ({ calories }) => {
  const theme = useTheme()

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animate when component mounts
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.caloriesContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Ionicons name="flame" size={24} color={theme.colors.primary} style={styles.icon} />
        <View style={styles.calories}>
          <Text style={[styles.caloriesValue, { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" }]}>
            {calories}
          </Text>
          <Text style={[styles.caloriesUnit, { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" }]}>
            kcal
          </Text>
        </View>
      </Animated.View>
      <Animated.Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.secondary,
            opacity: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          },
        ]}
      >
        Daily Average
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
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
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: "Montserrat_500Medium",
  },
})

export default Header
