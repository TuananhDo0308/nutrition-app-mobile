"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Animated, Dimensions, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from "react-native"
import GradientBlurBackground from "../../component/Layout/background"
import { ProgressBar, useTheme } from "react-native-paper"
import * as Haptics from "expo-haptics"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

interface AgeQuizProps {
  initialAge: number
  onNext: (age: number) => void
  onBack: () => void
  progress: number
  step: number
}

const AgeQuiz: React.FC<AgeQuizProps> = ({ initialAge, onNext, onBack, progress, step }) => {
  const theme = useTheme()
  const [age, setAge] = useState(initialAge)
  const [isManualInput, setIsManualInput] = useState(false)
  const [manualAge, setManualAge] = useState(initialAge.toString())

  // Animation values
  const ageScale = useRef(new Animated.Value(1)).current
  const progressValue = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const backButtonScale = useRef(new Animated.Value(1)).current
  const inputMode = useRef(new Animated.Value(0)).current

  // Generate ages from 18 to 100
  const ages = Array.from({ length: 83 }, (_, i) => i + 18)
  const flatListRef = useRef<FlatList>(null)

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

    // Scroll to initial age
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: initialAge - 18,
          animated: false,
          viewPosition: 0.5,
        })
      }
    }, 100)
  }, [])

  // Update progress animation when progress changes
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: progress / 100,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const handleAgeSelect = (selectedAge: number) => {
    if (selectedAge !== age) {
      // Trigger haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

      // Animate age scale
      Animated.sequence([
        Animated.timing(ageScale, {
          toValue: 1.1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(ageScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start()

      setAge(selectedAge)
    }
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
    onNext(isManualInput ? Number.parseInt(manualAge, 10) : age)
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
    setManualAge(age.toString())

    // Animate between input modes
    Animated.timing(inputMode, {
      toValue: isManualInput ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  // Handle manual age input
  const handleManualAgeChange = (text: string) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setManualAge(text)

      // Update age if valid
      if (text !== "" && Number.parseInt(text, 10) > 0) {
        setAge(Number.parseInt(text, 10))
      }
    }
  }

  // Interpolate progress for animated background
  const progressInterpolate = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  })

  // Interpolate opacity for input mode transitions
  const listOpacity = inputMode.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

  const manualInputOpacity = inputMode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  // Render age item
  const renderAgeItem = ({ item }: { item: number }) => {
    const isSelected = item === age
    return (
      <TouchableOpacity
        style={[styles.ageItem, isSelected && [styles.selectedAgeItem, { borderColor: theme.colors.primary }]]}
        onPress={() => handleAgeSelect(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.ageItemText,
            { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" },
            isSelected && { color: theme.colors.primary, fontFamily: "Montserrat_700Bold" },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    )
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
        {/* Question section */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionText, { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" }]}>
            How old are you?
          </Text>
        </View>

        {/* Age display */}
        <View style={styles.ageDisplaySection}>
          <View style={[styles.ageDisplayCard, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>
            {isManualInput ? (
              <Animated.View style={[styles.manualInputContainer, { opacity: manualInputOpacity }]}>
                <TextInput
                  style={[styles.manualInput, { color: theme.colors.primary, fontFamily: "Montserrat_700Bold" }]}
                  value={manualAge}
                  onChangeText={handleManualAgeChange}
                  keyboardType="number-pad"
                  maxLength={3}
                  autoFocus
                />
                <Text style={[styles.ageUnit, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
                  years
                </Text>
              </Animated.View>
            ) : (
              <Animated.View style={[styles.ageValueContainer, { opacity: listOpacity }]}>
                <Animated.Text
                  style={[
                    styles.ageValue,
                    {
                      color: theme.colors.primary,
                      fontFamily: "Montserrat_700Bold",
                      transform: [{ scale: ageScale }],
                    },
                  ]}
                >
                  {age}
                </Animated.Text>
                <Text style={[styles.ageUnit, { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" }]}>
                  years
                </Text>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Age selection list */}
        <Animated.View style={[styles.ageListContainer, { opacity: listOpacity }]}>
          <FlatList
            ref={flatListRef}
            data={ages}
            renderItem={renderAgeItem}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ageList}
            initialScrollIndex={initialAge - 18}
            getItemLayout={(data, index) => ({
              length: 70,
              offset: 70 * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const contentOffset = e.nativeEvent.contentOffset.x
              const index = Math.round(contentOffset / 70)
              if (index >= 0 && index < ages.length) {
                handleAgeSelect(ages[index])
              }
            }}
          />
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
  ageDisplaySection: {
    alignItems: "center",
    marginTop: 30,
  },
  ageDisplayCard: {
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
  ageValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  ageValue: {
    fontSize: 48,
  },
  ageUnit: {
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
  ageListContainer: {
    marginTop: 40,
    height: 100,
  },
  ageList: {
    paddingVertical: 10,
    paddingHorizontal: width / 2 - 35,
  },
  ageItem: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "transparent",
    marginHorizontal: 5,
  },
  selectedAgeItem: {
    backgroundColor: "rgba(133, 241, 147, 0.1)",
  },
  ageItemText: {
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
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

export default AgeQuiz
