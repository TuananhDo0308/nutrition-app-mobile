"use client"

import { useRef, useState, useEffect } from "react"
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native"
import GradientBlurBackground from "../../component/Layout/background"
import { ProgressBar, useTheme } from "react-native-paper"
import * as Haptics from "expo-haptics"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

interface GenderQuizProps {
  initialGender: "male" | "female" | "other" | null
  onNext: (gender: "male" | "female" | "other") => void
  onBack: () => void
  progress: number
  step: number
}

const GenderQuiz: React.FC<GenderQuizProps> = ({ initialGender, onNext, onBack, progress, step }) => {
  const theme = useTheme()
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "other" | null>(initialGender)

  // Animation values
  const progressValue = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const backButtonScale = useRef(new Animated.Value(1)).current
  
  // Card animations
  const maleCardScale = useRef(new Animated.Value(1)).current
  const femaleCardScale = useRef(new Animated.Value(1)).current
  const otherCardScale = useRef(new Animated.Value(1)).current

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
    
    // Initial selection animation
    if (initialGender) {
      animateSelection(initialGender)
    }
  }, [])

  // Update progress animation when progress changes
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: progress / 100,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const animateSelection = (gender: "male" | "female" | "other") => {
    // Reset all cards
    Animated.parallel([
      Animated.spring(maleCardScale, {
        toValue: gender === "male" ? 1.05 : 0.95,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(femaleCardScale, {
        toValue: gender === "female" ? 1.05 : 0.95,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(otherCardScale, {
        toValue: gender === "other" ? 1.05 : 0.95,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleGenderSelect = (gender: "male" | "female" | "other") => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    
    setSelectedGender(gender)
    animateSelection(gender)
  }

  const handleButtonPress = () => {
    if (!selectedGender) return
    
    // Button press animation
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

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // Move to next step
    onNext(selectedGender)
  }

  const handleBackPress = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(backButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(backButtonScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    // Go back
    onBack()
  }

  // Interpolate progress for animated background
  const progressInterpolate = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  })

  return (
    <GradientBlurBackground xOffset={0} yOffset={0}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Progress section */}
        <View style={styles.progressContainer}>
          <Text style={[styles.stepText, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
            STEP {step} OF 7
          </Text>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressInterpolate,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
            <ProgressBar progress={progress / 100} color={theme.colors.primary} style={styles.progressBar} />
          </View>
        </View>
        <View>
        {/* Question section */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionText, { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" }]}>
            What's your gender?
          </Text>
        </View>

        {/* Gender selection cards */}
        <View style={styles.cardsContainer}>
          {/* Male card */}
          <Animated.View 
            style={[
              styles.cardWrapper, 
              { transform: [{ scale: maleCardScale }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.card,
                selectedGender === "male" && styles.selectedCard,
                {
                  backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
                  borderColor: selectedGender === "male" ? theme.colors.primary : "transparent",
                },
              ]}
              onPress={() => handleGenderSelect("male")}
              activeOpacity={0.9}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + "20" }]}>
                <Ionicons name="male" size={40} color={theme.colors.primary} />
              </View>
              <Text style={[styles.cardText, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
                Male
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Female card */}
          <Animated.View 
            style={[
              styles.cardWrapper, 
              { transform: [{ scale: femaleCardScale }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.card,
                selectedGender === "female" && styles.selectedCard,
                {
                  backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
                  borderColor: selectedGender === "female" ? theme.colors.primary : "transparent",
                },
              ]}
              onPress={() => handleGenderSelect("female")}
              activeOpacity={0.9}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + "20" }]}>
                <Ionicons name="female" size={40} color={theme.colors.primary} />
              </View>
              <Text style={[styles.cardText, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
                Female
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Other card */}
          <Animated.View 
            style={[
              styles.cardWrapper, 
              { transform: [{ scale: otherCardScale }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.card,
                selectedGender === "other" && styles.selectedCard,
                {
                  backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
                  borderColor: selectedGender === "other" ? theme.colors.primary : "transparent",
                },
              ]}
              onPress={() => handleGenderSelect("other")}
              activeOpacity={0.9}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + "20" }]}>
                <Ionicons name="person" size={40} color={theme.colors.primary} />
              </View>
              <Text style={[styles.cardText, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
                Other
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
</View>
        {/* Button section */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
            <TouchableOpacity
              style={[styles.backButton, { borderColor: theme.colors.primary }]}
              onPress={handleBackPress}
              activeOpacity={0.9}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.primary} style={styles.buttonIcon} />
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.button, 
                { 
                  backgroundColor: selectedGender ? theme.colors.primary : theme.colors.primary + "60",
                }
              ]}
              onPress={handleButtonPress}
              activeOpacity={0.9}
              disabled={!selectedGender}
            >
              <Text style={[styles.buttonText, { color: "#000000", fontFamily: "Montserrat_700Bold" }]}>Continue</Text>
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
    paddingVertical: 40,
  },
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
  questionContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  questionText: {
    fontSize: 28,
    lineHeight: 36,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
    paddingHorizontal: 10,
  },
  cardWrapper: {
    width: width * 0.28,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
  },
  selectedCard: {
    shadowOpacity: 0.2,
    elevation: 8,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
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
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    marginRight: 20,
  },
  buttonText: {
    fontSize: 18,
    marginRight:5
  },
  buttonIcon: {
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

export default GenderQuiz
