"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Animated, Dimensions, StyleSheet, Text, View, TouchableOpacity } from "react-native"
import GradientBlurBackground from "../../component/Layout/background"
import { ProgressBar, useTheme } from "react-native-paper"
import * as Haptics from "expo-haptics"
import { Ionicons } from "@expo/vector-icons"
import { UserProfile } from "../../screens/OnboardingFlow"
import { useAppDispatch } from "../../hooks/hook"
import { setUser } from "../../slices/userSlice/userSlice"

const { width } = Dimensions.get("window")

interface OnboardingCompleteProps {
  userProfile: UserProfile
  progress: number
  step: number
}

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({ userProfile, progress, step }) => {
  const theme = useTheme()
    const dispatch = useAppDispatch()
  // Animation values
  const progressValue = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const cardScale = useRef(new Animated.Value(0.9)).current
  const iconScale = useRef(new Animated.Value(0.5)).current

  // Initialize animations
  useEffect(() => {
    // Animate fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Animate progress
    Animated.timing(progressValue, {
      toValue: progress / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start()

    // Animate card
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start()

    // Animate success icon
    Animated.spring(iconScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start()

    // Trigger success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }, [])

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    dispatch(setUser({ status: true }));   
    console.log("Navigate to main app")
  }

  // Calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    return Math.round((weight / ((height / 100) * (height / 100))) * 10) / 10
  }

  const currentBMI = calculateBMI(userProfile.weight, userProfile.height)
  const targetBMI = calculateBMI(userProfile.targetWeight, userProfile.height)

  // Interpolate progress for animated background
  const progressInterpolate = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  })

  return (
    <GradientBlurBackground>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Progress section */}
        <View style={styles.progressContainer}>

        </View>
<View>
        {/* Success icon */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.successIconContainer,
              {
                backgroundColor: theme.colors.primary,
                transform: [{ scale: iconScale }],
              },
            ]}
          >
            <Ionicons name="checkmark" size={60} color="#FFFFFF" />
          </Animated.View>
        </View>

        {/* Congratulations text */}
        <View style={styles.congratsContainer}>
          <Text style={[styles.congratsText, { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" }]}>
            Profile Complete!
          </Text>
          <Text style={[styles.subText, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
            Your personalized fitness plan is ready
          </Text>
        </View>

        {/* Profile summary card */}
        <Animated.View style={[styles.cardWrapper, { transform: [{ scale: cardScale }] }]}>
          <View style={[styles.summaryCard, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.primary, fontFamily: "Montserrat_600SemiBold" }]}>
              Your Profile Summary
            </Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}
                >
                  Height
                </Text>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}
                >
                  {userProfile.height} cm
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}
                >
                  Current Weight
                </Text>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}
                >
                  {userProfile.weight} kg
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}
                >
                  Target Weight
                </Text>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}
                >
                  {userProfile.targetWeight} kg
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}
                >
                  BMI
                </Text>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}
                >
                  {currentBMI} → {targetBMI}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}
                >
                  Gender
                </Text>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}
                >
                  {userProfile.gender ? userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1) : ""}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}
                >
                  Age
                </Text>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}
                >
                  {userProfile.age} years
                </Text>
              </View>
            </View>

            <View style={styles.activityContainer}>
              <Text
                style={[styles.summaryLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}
              >
                Activity Level
              </Text>
              <Text
                style={[styles.activityValue, { color: theme.colors.primary, fontFamily: "Montserrat_600SemiBold" }]}
              >
                {userProfile.activityLevel
                  ? userProfile.activityLevel
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")
                  : ""}
              </Text>
            </View>
          </View>
        </Animated.View>
</View>
        {/* Button section */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={handleButtonPress}
              activeOpacity={0.9}
            >
              <Text style={[styles.buttonText, { color: "#000000", fontFamily: "Montserrat_700Bold" }]}>
                Start Your Journey
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#000000" style={styles.buttonIcon} />
            </TouchableOpacity>
          </Animated.View>
        </View>

      </Animated.View>
    </GradientBlurBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingVertical: 40,  },
  progressContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  stepText: {
    fontSize: 14,
    marginBottom: 10,
  },
  progressBarContainer: {
    width: width * 0.7,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  progressBarFill: {
    position: "absolute",
    height: 8,
    borderRadius: 4,
  },
  animationContainer: {
    alignItems: "center",
    marginTop: 20,
    height: 120,
    justifyContent: "center",
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  congratsContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  congratsText: {
    fontSize: 28,
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  cardWrapper: {
    marginTop: 20,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 16,
  },
  activityContainer: {
    marginTop: 5,
  },
  activityValue: {
    fontSize: 16,
    marginTop: 4,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  decorCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(133, 241, 147, 0.1)",
    top: -50,
    right: -50,
    zIndex: -1,
  },
  decorCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: 50,
    left: -50,
    zIndex: -1,
  },
})

export default OnboardingComplete
