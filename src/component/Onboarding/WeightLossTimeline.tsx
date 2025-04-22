"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native"
import GradientBlurBackground from "../../component/Layout/background"
import { ProgressBar, useTheme } from "react-native-paper"
import * as Haptics from "expo-haptics"
import { Ionicons } from "@expo/vector-icons"
import { useAppSelector } from "../../hooks/hook"
import axios from "axios"
import Slider from "@react-native-community/slider"
import { apiLinks } from "../../utils"

const { width } = Dimensions.get("window")

interface WeightLossTimelineProps {
  userProfile: {
    age: number
    gender: "male" | "female" | "other"
    height: number
    weight: number
    targetWeight: number
    r: number
  }
  onComplete: () => void
  onBack: () => void
  progress: number
  step: number
}

type TimeUnit = "days" | "weeks" | "months"
type PlanType = "natural" | "fast" | "custom"

interface TimelineData {
  naturalDays: string
  fastDays: string
  naturalValue: number
  fastValue: number
  unit: TimeUnit
}

const WeightLossTimeline: React.FC<WeightLossTimelineProps> = ({
  userProfile,
  onComplete,
  onBack,
  progress,
  step,
}) => {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<TimeUnit>("days")
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("natural")
  const [selectedDays, setSelectedDays] = useState<number>(0)
  const [sliderValue, setSliderValue] = useState<number>(0)
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false)

  // Get auth token from Redux store
  const authToken = useAppSelector((state) => state.user?.token)

  // Animation values
  const progressValue = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const backButtonScale = useRef(new Animated.Value(1)).current
  const cardOpacity = useRef(new Animated.Value(1)).current // Animation for cards
  const sliderOpacity = useRef(new Animated.Value(0)).current // Animation for slider
  const timeScale = useRef(new Animated.Value(1)).current // Animation for time value

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

    // Fetch timeline data
    fetchTimelineData()
  }, [])

  // Update progress animation when progress changes
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: progress / 100,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [progress])

  // Update selected days when timeline data changes or plan changes
  useEffect(() => {
    if (timelineData) {
      const days = selectedPlan === "natural" ? timelineData.naturalValue : timelineData.fastValue
      setSelectedDays(days)
      setSliderValue(days)
    }
  }, [timelineData, selectedPlan])

  // Handle animation for cards and slider when isCustomMode changes
  useEffect(() => {
    if (isCustomMode) {
      // Hide cards, show slider
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(sliderOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Show cards, hide slider
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(sliderOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isCustomMode])

  // Convert days to selected unit
  const convertToUnit = (days: number, unit: TimeUnit): number => {
    switch (unit) {
      case "weeks":
        return Math.ceil(days / 7)
      case "months":
        return Math.ceil(days / 30)
      default:
        return days
    }
  }

  // Format unit label (singular or plural)
  const formatUnitLabel = (value: number, unit: TimeUnit): string => {
    if (value === 1) {
      return unit.slice(0, -1) // Remove 's' for singular
    }
    return unit
  }

  // Fetch timeline data from API
  const fetchTimelineData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        apiLinks.questions.base_information,
        {
          age: userProfile.age,
          gender: userProfile.gender,
          height: userProfile.height,
          weight: userProfile.weight,
          r: userProfile.r,
          targetWeight: userProfile.targetWeight,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      )

      if (response.data && response.data.data) {
        const naturalDays = response.data.data[0]
        const fastDays = response.data.data[1]

        const naturalValue = Number.parseInt(naturalDays.split(" ")[0])
        const fastValue = Number.parseInt(fastDays.split(" ")[0])

        setTimelineData({
          naturalDays,
          fastDays,
          naturalValue,
          fastValue,
          unit: "days",
        })
      } else {
        setError("Invalid response format from server")
      }
    } catch (err) {
      console.error("API Error:", err)
      setError("Failed to fetch weight loss timeline. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Submit selected time to API
  const submitSelectedTime = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      await axios.post(
        apiLinks.questions.time,
        {},
        {
          params: {
            time: selectedDays,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      )

      // If successful, proceed to next step
      onComplete()
    } catch (err) {
      console.error("API Error:", err)
      setError("Failed to save your timeline. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Handle unit selection
  const handleUnitSelect = (unit: TimeUnit) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedUnit(unit)
  }

  // Handle plan selection
  const handlePlanSelect = (plan: PlanType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelectedPlan(plan)
    setIsCustomMode(false)
    setSliderValue(plan === "natural" ? timelineData!.naturalValue : timelineData!.fastValue)
    setSelectedDays(plan === "natural" ? timelineData!.naturalValue : timelineData!.fastValue)
  }

  // Handle custom mode toggle
  const handleCustomToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsCustomMode(true)
    setSelectedPlan("custom")
  }

  // Handle suggested timeline toggle (go back to cards)
  const handleSuggestedToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsCustomMode(false)
    // Restore the previously selected plan (natural or fast)
    const restoredPlan = selectedPlan === "custom" ? "natural" : selectedPlan
    setSelectedPlan(restoredPlan)
    setSliderValue(restoredPlan === "natural" ? timelineData!.naturalValue : timelineData!.fastValue)
    setSelectedDays(restoredPlan === "natural" ? timelineData!.naturalValue : timelineData!.fastValue)
  }

  // Handle slider change
  const handleSliderChange = (value: number) => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    // Animate time value
    Animated.sequence([
      Animated.timing(timeScale, {
        toValue: 1.1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(timeScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    // Update both slider value and selected days in real-time
    setSliderValue(value)
    setSelectedDays(Math.round(value))
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

    // Submit selected time to API
    submitSelectedTime()
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

  // Render unit selector button
  const UnitButton = ({ unit, label }: { unit: TimeUnit; label: string }) => (
    <TouchableOpacity
      style={[styles.unitButton, selectedUnit === unit && { backgroundColor: theme.colors.primary }]}
      onPress={() => handleUnitSelect(unit)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.unitButtonText,
          {
            color: selectedUnit === unit ? "#000000" : theme.colors.secondary,
            fontFamily: "Montserrat_600SemiBold",
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )

  // Get min and max values for slider
  const getSliderRange = () => {
    if (!timelineData) return { min: 0, max: 100 }

    // Set min to half of the fast value and max to 1.5x the natural value
    const min = Math.max(30, Math.floor(timelineData.fastValue))
    const max = Math.ceil(timelineData.naturalValue )

    return { min, max }
  }

  return (
    <GradientBlurBackground>
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
        {/* Title section */}
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" }]}>
            Your Weight Loss Timeline
          </Text>
     
        </View>

        {/* Unit selector */}
        <View style={styles.unitSelectorContainer}>
          <View style={styles.unitButtonsContainer}>
            <UnitButton unit="days" label="Days" />
            <UnitButton unit="weeks" label="Weeks" />
            <UnitButton unit="months" label="Months" />
          </View>
        </View>

        {/* Timeline content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
              Calculating your timeline...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={50} color={theme.colors.primary} />
            <Text style={[styles.errorText, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
              {error}
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
              onPress={fetchTimelineData}
            >
              <Text style={[styles.retryButtonText, { color: "#000000", fontFamily: "Montserrat_600SemiBold" }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : timelineData ? (
          <View style={styles.timelineContainer}>
            {/* Plan selection cards */}
              {isCustomMode ? null : (
                  <Animated.View style={[styles.planCardsWrapper, { opacity: cardOpacity }]}>

                  <View style={styles.planCardsContainer}>
                    {/* Natural Plan Card */}
                    <TouchableOpacity
                      style={[
                        styles.planCard,
                        { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" },
                        selectedPlan === "natural" && { borderColor: theme.colors.primary, borderWidth: 2 },
                      ]}
                      onPress={() => handlePlanSelect("natural")}
                      activeOpacity={0.9}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
                          Natural Plan
                        </Text>
                      </View>
                      <View style={styles.cardContent}>
                        <View style={styles.timeValue}>
                          <Text style={[styles.timeNumber, { color: theme.colors.primary, fontFamily: "Montserrat_700Bold" }]}>
                            {convertToUnit(timelineData.naturalValue, selectedUnit)}
                          </Text>
                          <Text style={[styles.timeUnit, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
                            {formatUnitLabel(convertToUnit(timelineData.naturalValue, selectedUnit), selectedUnit)}
                          </Text>
                        </View>
                        <Text style={[styles.cardDescription, { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" }]}>
                          A steady and sustainable weight loss pace for long-term results.
                        </Text>
                      </View>
                      {selectedPlan === "natural" && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Fast Plan Card */}
                    <TouchableOpacity
                      style={[
                        styles.planCard,
                        { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" },
                        selectedPlan === "fast" && { borderColor: theme.colors.primary, borderWidth: 2 },
                      ]}
                      onPress={() => handlePlanSelect("fast")}
                      activeOpacity={0.9}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
                          Fast Plan
                        </Text>
                      </View>
                      <View style={styles.cardContent}>
                        <View style={styles.timeValue}>
                          <Text style={[styles.timeNumber, { color: theme.colors.primary, fontFamily: "Montserrat_700Bold" }]}>
                            {convertToUnit(timelineData.fastValue, selectedUnit)}
                          </Text>
                          <Text style={[styles.timeUnit, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
                            {formatUnitLabel(convertToUnit(timelineData.fastValue, selectedUnit), selectedUnit)}
                          </Text>
                        </View>
                        <Text style={[styles.cardDescription, { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" }]}>
                          A more aggressive approach for faster results with more effort.
                        </Text>
                      </View>
                      {selectedPlan === "fast" && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Custom button */}
                  <TouchableOpacity
                    style={[styles.customButton, { borderColor: theme.colors.primary }]}
                    onPress={handleCustomToggle}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="settings" size={20} color={theme.colors.primary} style={styles.buttonIcon} />
                    <Text style={[styles.customButtonText, { color: theme.colors.primary, fontFamily: "Montserrat_600SemiBold" }]}>
                      Custom Timeline
                    </Text>
                  </TouchableOpacity>
                 </Animated.View>

              )}

            {/* Custom timeline slider */}
            <Animated.View
              style={[
                styles.sliderContainer,
                {
                  opacity: sliderOpacity,
                  transform: [
                    { translateY: sliderOpacity.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                  ],
                  display: isCustomMode ? "flex" : "none", // Ensure proper hiding
                },
              ]}
            >
              <Text
                style={[styles.sliderTitle, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}
              >
                Customize Your Timeline
              </Text>
              <View style={styles.sliderValueContainer}>
                <Animated.Text
                  style={[
                    styles.sliderValueText,
                    {
                      color: theme.colors.primary,
                      fontFamily: "Montserrat_700Bold",
                      transform: [{ scale: timeScale }],
                    },
                  ]}
                >
                  {convertToUnit(selectedDays, selectedUnit)}{" "}
                  {formatUnitLabel(convertToUnit(selectedDays, selectedUnit), selectedUnit)}
                </Animated.Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={getSliderRange().min}
                maximumValue={getSliderRange().max}
                step={1}
                value={sliderValue}
                onValueChange={handleSliderChange}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.secondary + "40"}
                thumbTintColor={theme.colors.primary}
              />
              <View style={styles.sliderLabels}>
                <Text
                  style={[styles.sliderLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" }]}
                >
                  Faster ({convertToUnit(getSliderRange().min, selectedUnit)}{" "}
                  {formatUnitLabel(convertToUnit(getSliderRange().min, selectedUnit), selectedUnit)})
                </Text>
                <Text
                  style={[styles.sliderLabel, { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" }]}
                >
                  Slower ({convertToUnit(getSliderRange().max, selectedUnit)}{" "}
                  {formatUnitLabel(convertToUnit(getSliderRange().max, selectedUnit), selectedUnit)})
                </Text>
              </View>
              <Text
                style={[
                  styles.sliderDescription,
                  { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" },
                ]}
              >
                Adjust the slider to set your preferred weight loss timeline
              </Text>

              {/* Suggested Timeline button */}
              <TouchableOpacity
                style={[styles.suggestedButton, { borderColor: theme.colors.primary }]}
                onPress={handleSuggestedToggle}
                activeOpacity={0.9}
              >
                <Ionicons name="list" size={20} color={theme.colors.primary} style={styles.buttonIcon} />
                <Text style={[styles.suggestedButtonText, { color: theme.colors.primary, fontFamily: "Montserrat_600SemiBold" }]}>
                  Suggested Timeline
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={[styles.disclaimer, { color: theme.colors.secondary, fontFamily: "Montserrat_400Regular" }]}>
              These estimates are based on your profile data and may vary based on individual factors.
            </Text>
          </View>
        ) : null}
</View>
        {/* Button section */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
            <TouchableOpacity
              style={[styles.backButton, { borderColor: theme.colors.primary }]}
              onPress={handleBackPress}
              activeOpacity={0.9}
              disabled={isSubmitting}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.primary} style={styles.buttonIcon} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }, isSubmitting && { opacity: 0.7 }]}
              onPress={handleButtonPress}
              activeOpacity={0.9}
              disabled={isSubmitting || isLoading || !!error}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <>
                  <Text style={[styles.buttonText, { color: "#000000", fontFamily: "Montserrat_700Bold" }]}>
                    Start Your Journey
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#000000" style={styles.buttonIcon} />
                </>
              )}
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
  titleContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  unitSelectorContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  unitButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  unitButtonText: {
    fontSize: 14,
  },
  timelineContainer: {
    marginTop: 20,
  },
  planCardsWrapper: {
  },
  planCardsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  planCard: {
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal:10,
    overflow: "hidden",
    position: "relative",
  },
  selectedIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  cardHeader: {
    paddingTop: 15,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
  },
  cardContent: {
    padding: 10,
  
    alignItems: "center",
  },
  timeValue: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  timeNumber: {
    fontSize: 30,
  },
  timeUnit: {
    fontSize: 20,
    marginLeft: 5,
  },
  cardDescription: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.8,
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 2,
    marginVertical: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  customButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  suggestedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 2,
    marginTop: 15,
    marginVertical: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestedButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  sliderContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: Platform.OS === "ios" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sliderTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  sliderValueContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  sliderValueText: {
    fontSize: 36,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  sliderLabel: {
    fontSize: 12,
  },
  sliderDescription: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.7,
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.6,
    marginTop: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,

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
    marginRight: 5,

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

export default WeightLossTimeline