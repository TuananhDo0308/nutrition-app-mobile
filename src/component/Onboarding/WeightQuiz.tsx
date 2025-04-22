"use client"

import { useRef, useState, useEffect } from "react"
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native"
import GradientBlurBackground from "../../component/Layout/background"
import { ProgressBar, useTheme } from "react-native-paper"
import * as Haptics from "expo-haptics"
import { Ionicons } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"

const { width } = Dimensions.get("window")

interface WeightQuizProps {
  initialWeight: number
  onNext: (weight: number) => void
  onBack: () => void
  progress: number
  step: number
}

const WeightQuiz: React.FC<WeightQuizProps> = ({ initialWeight, onNext, onBack, progress, step }) => {
  const theme = useTheme()
  const [weight, setWeight] = useState(initialWeight)
  const [isManualInput, setIsManualInput] = useState(false)
  const [manualWeight, setManualWeight] = useState(initialWeight.toString())

  // Animation values
  const weightScale = useRef(new Animated.Value(1)).current
  const progressValue = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const backButtonScale = useRef(new Animated.Value(1)).current
  const inputMode = useRef(new Animated.Value(0)).current

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
  }, [])

  // Update progress animation when progress changes
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: progress / 100,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const handleWeightChange = (value: number) => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    // Animate weight scale
    Animated.sequence([
      Animated.timing(weightScale, {
        toValue: 1.1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(weightScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    setWeight(value)
  }

  const handleButtonPress = () => {
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
    onNext(isManualInput ? parseInt(manualWeight, 10) : weight)
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

  const toggleInputMode = () => {
    setIsManualInput(!isManualInput)
    setManualWeight(weight.toString())
    
    // Animate between input modes
    Animated.timing(inputMode, {
      toValue: isManualInput ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  // Handle manual weight input
  const handleManualWeightChange = (text: string) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setManualWeight(text)
      
      // Update weight if valid
      if (text !== "" && parseInt(text, 10) > 0) {
        setWeight(parseInt(text, 10))
      }
    }
  }

  // Interpolate progress for animated background
  const progressInterpolate = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  })

  // Interpolate opacity for input mode transitions
  const sliderOpacity = inputMode.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })
  
  const manualInputOpacity = inputMode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  return (
    <GradientBlurBackground xOffset={70} yOffset={70}>
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
            What's your current weight?
          </Text>
        </View>


        {/* Weight display */}
        <View style={styles.weightDisplaySection}>
          <View style={[styles.weightDisplayCard, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>

              <Animated.View style={[styles.weightValueContainer, { opacity: sliderOpacity }]}>
                <Animated.Text
                  style={[
                    styles.weightValue,
                    {
                      color: theme.colors.primary,
                      fontFamily: "Montserrat_700Bold",
                      transform: [{ scale: weightScale }],
                    },
                  ]}
                >
                  {weight}
                </Animated.Text>
                <Text style={[styles.weightUnit, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
                  kg
                </Text>
              </Animated.View>
          </View>
        </View>

        {/* Slider section */}
        <Animated.View style={[styles.sliderContainer, { opacity: sliderOpacity }]}>
          <Slider
            style={styles.slider}
            minimumValue={30}
            maximumValue={200}
            step={1}
            value={weight}
            onValueChange={handleWeightChange}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.secondary + "40"}
            thumbTintColor={theme.colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" }]}>
              30kg
            </Text>
            <Text style={[styles.sliderLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" }]}>
              200kg
            </Text>
          </View>
        </Animated.View>
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
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={handleButtonPress}
              activeOpacity={0.9}
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
  toggleButton: {
    alignSelf: "center",
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toggleButtonText: {
    fontSize: 14,
  },
  weightDisplaySection: {
    alignItems: "center",
    marginTop: 30,
  },
  weightDisplayCard: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 150,
  },
  weightValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  weightValue: {
    fontSize: 48,
  },
  weightUnit: {
    fontSize: 24,
    marginLeft: 5,
  },
  manualInputContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  manualInput: {
    fontSize: 48,
    minWidth: 90,
    textAlign: "center",
  },
  sliderContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 12,
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

export default WeightQuiz
