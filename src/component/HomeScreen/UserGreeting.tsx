"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Text, StyleSheet, View, Image, Animated, Easing } from "react-native"
import { useAppSelector } from "../../hooks/hook"
import { useTheme } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"

interface UserGreetingProps {
  name: string
  avatarUrl?: string
}

const UserGreeting: React.FC<UserGreetingProps> = ({ name, avatarUrl }) => {
  const theme = useTheme()
  const userAvatar = useAppSelector((state) => state.user?.image)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  // Determine greeting based on time of day
  const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return "Good Morning"
    } else if (hour < 15) {
      return "Good Afternoon"
    } else if (hour < 18) {
      return "Good Evening"
    } else {
      return "Good Night"
    }
  }

  // Default avatar if none provided
  const defaultAvatar = "https://via.placeholder.com/50.png?text=User"

  useEffect(() => {
    // Animate greeting when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.avatarBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image source={{ uri: avatarUrl || userAvatar || defaultAvatar }} style={styles.avatar} />
        </LinearGradient>
      </View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.greeting, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
          {getGreeting()}
        </Text>
        <Text style={[styles.name, { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" }]}>{name}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "white",
  },
  textContainer: {
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 8,
  },
})

export default UserGreeting
