"use client"

import { useState, useRef, useEffect } from "react"
import { StyleSheet, Animated, Dimensions, BackHandler, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import * as Haptics from "expo-haptics"
import { useTheme } from "react-native-paper"
import HeightQuiz from "../component/Onboarding/HeightQuiz"
import WeightQuiz from "../component/Onboarding/WeightQuiz"
import GenderQuiz from "../component/Onboarding/GenderQuiz"
import AgeQuiz from "../component/Onboarding/AgeQuiz"
import ActivityLevelQuiz from "../component/Onboarding/ActivityLevelQuiz"
import TargetWeightQuiz from "../component/Onboarding/TargetWeightQuiz"
import WeightLossTimeline from "../component/Onboarding/WeightLossTimeline"
import OnboardingComplete from "../component/Onboarding/OnboardingComplete"

const { width } = Dimensions.get("window")

// Define user profile type
export interface UserProfile {
  height: number
  weight: number
  gender: "male" | "female" | "other" | null
  age: number
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active" | null
  r: number
  targetWeight: number
}

const OnboardingFlow = () => {
  const theme = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const slideAnim = useRef(new Animated.Value(0)).current

  // Initialize user profile with default values
  const [userProfile, setUserProfile] = useState<UserProfile>({
    height: 170,
    weight: 70,
    gender: null,
    age: 30,
    activityLevel: null,
    r: 1.2, // Default activity multiplier
    targetWeight: 65,
  })

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (currentStep > 0) {
        handlePrevStep()
        return true
      }
      return false
    })

    return () => backHandler.remove()
  }, [currentStep])

  // Animation for slide transition
  const animateSlide = (direction: "next" | "prev") => {
    const toValue = direction === "next" ? -width : width

    // Reset position for animation
    slideAnim.setValue(0)

    // Animate slide
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  // Handle next step
  const handleNextStep = (updatedData: Partial<UserProfile> = {}) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // Update user profile with new data
    setUserProfile((prev) => ({
      ...prev,
      ...updatedData,
    }))

    // Animate and move to next step
    animateSlide("next")
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
    }, 250)
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

      // Animate and move to previous step
      animateSlide("prev")
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1)
      }, 250)
    }
  }

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / 7) * 100

  // Render current step
  const renderStep = () => {


    switch (currentStep) {
      case 0:
        return (
          <Animated.View style={[styles.stepContainer]}>
            <HeightQuiz
              initialHeight={userProfile.height}
              onNext={(height) => handleNextStep({ height })}
              progress={progressPercentage}
              step={1}
            />
          </Animated.View>
        )
      case 1:
        return (
          <Animated.View style={[styles.stepContainer]}>
            <WeightQuiz
              initialWeight={userProfile.weight}
              onNext={(weight) => handleNextStep({ weight })}
              onBack={handlePrevStep}
              progress={progressPercentage}
              step={2}
            />
          </Animated.View>
        )
      case 2:
        return (
          <Animated.View style={[styles.stepContainer,]}>
            <GenderQuiz
              initialGender={userProfile.gender}
              onNext={(gender) => handleNextStep({ gender })}
              onBack={handlePrevStep}
              progress={progressPercentage}
              step={3}
            />
          </Animated.View>
        )
      case 3:
        return (
          <Animated.View style={[styles.stepContainer]}>
            <AgeQuiz
              initialAge={userProfile.age}
              onNext={(age) => handleNextStep({ age })}
              onBack={handlePrevStep}
              progress={progressPercentage}
              step={4}
            />
          </Animated.View>
        )
      case 4:
        return (
          <Animated.View style={[styles.stepContainer]}>
            <ActivityLevelQuiz
              initialActivityLevel={userProfile.activityLevel}
              onNext={(activityLevel) => {
                // Find the r value for the selected activity level
                const activityOptions = [
                  { id: "sedentary", r: 1.2 },
                  { id: "light", r: 1.375 },
                  { id: "moderate", r: 1.55 },
                  { id: "active", r: 1.725 },
                  { id: "very_active", r: 1.9 },
                ]

                const selectedOption = activityOptions.find((option) => option.id === activityLevel)
                const r = selectedOption ? selectedOption.r : 1.2

                handleNextStep({ activityLevel, r })
              }}
              onBack={handlePrevStep}
              progress={progressPercentage}
              step={5}
            />
          </Animated.View>
        )
      case 5:
        return (
          <Animated.View style={[styles.stepContainer]}>
            <TargetWeightQuiz
              initialTargetWeight={userProfile.targetWeight}
              currentWeight={userProfile.weight}
              height={userProfile.height}
              onNext={(targetWeight) => handleNextStep({ targetWeight })}
              onBack={handlePrevStep}
              progress={progressPercentage}
              step={6}
            />
          </Animated.View>
        )
      case 6:
        return (
          <Animated.View style={[styles.stepContainer]}>
            <WeightLossTimeline
              userProfile={userProfile}
              onComplete={() => handleNextStep()}
              onBack={handlePrevStep}
              progress={progressPercentage}
              step={7}
            />
          </Animated.View>
        )
      case 7:
        return (
          <Animated.View style={[styles.stepContainer]}>
            <OnboardingComplete userProfile={userProfile} progress={progressPercentage} step={8} />
          </Animated.View>
        )
      default:
        return null
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>{renderStep()}</View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    width: "100%",
  },
})

export default OnboardingFlow
