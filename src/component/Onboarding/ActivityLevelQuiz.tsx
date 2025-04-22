"use client";

import { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import GradientBlurBackground from "../../component/Layout/background";
import { ProgressBar, useTheme } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

interface ActivityLevelQuizProps {
  initialActivityLevel: ActivityLevel | null;
  onNext: (activityLevel: ActivityLevel) => void;
  onBack: () => void;
  progress: number;
  step: number;
}

interface ActivityOption {
  id: ActivityLevel;
  title: string;
  description: string;
  icon: string;
  r:number
}

const ActivityLevelQuiz: React.FC<ActivityLevelQuizProps> = ({
  initialActivityLevel,
  onNext,
  onBack,
  progress,
  step,
}) => {
  const theme = useTheme();
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityLevel | null>(initialActivityLevel);

  // Animation values
  const progressValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const backButtonScale = useRef(new Animated.Value(1)).current;

  // Card animations
  const cardScales = {
    sedentary: useRef(new Animated.Value(1)).current,
    light: useRef(new Animated.Value(1)).current,
    moderate: useRef(new Animated.Value(1)).current,
    active: useRef(new Animated.Value(1)).current,
    very_active: useRef(new Animated.Value(1)).current,
  };

  // Activity level options
  const activityOptions: ActivityOption[] = [
    {
      id: "sedentary",
      title: "Sedentary",
      description: "Little or no exercise, desk job",
      icon: "body-outline",
        r:1.2
    },
    {
      id: "light",
      title: "Lightly Active",
      description: "Light exercise 1-3 days/week",
      icon: "walk-outline",
      r:1.375
    },
    {
      id: "moderate",
      title: "Moderately Active",
      description: "Moderate exercise 3-5 days/week",
      icon: "bicycle-outline",
      r:1.55
    },
    {
      id: "active",
      title: "Active",
      description: "Hard exercise 6-7 days/week",
      icon: "fitness-outline",
      r:1.725
    },
    {
      id: "very_active",
      title: "Very Active",
      description: "Hard daily exercise & physical job",
      icon: "barbell-outline",
      r:1.9
    },
  ];

  // Initialize animations
  useEffect(() => {
    // Animate fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate progress
    Animated.timing(progressValue, {
      toValue: progress / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Initial selection animation
    if (initialActivityLevel) {
      animateSelection(initialActivityLevel);
    }
  }, []);

  // Update progress animation when progress changes
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: progress / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animateSelection = (activity: ActivityLevel) => {
    // Reset all cards
    const animations = Object.keys(cardScales).map((key) => {
      const activityKey = key as ActivityLevel;
      return Animated.spring(cardScales[activityKey], {
        toValue: activityKey === activity ? 1.05 : 0.98,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      });
    });

    Animated.parallel(animations).start();
  };

  const handleActivitySelect = (activity: ActivityLevel) => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSelectedActivity(activity);
    animateSelection(activity);
  };

  const handleButtonPress = () => {
    if (!selectedActivity) return;

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
    ]).start();

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Move to next step
    onNext(selectedActivity);
  };

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
    ]).start();

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Go back
    onBack();
  };

  // Interpolate progress for animated background
  const progressInterpolate = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  });

  return (
    <GradientBlurBackground>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Progress section */}
        <View style={styles.progressContainer}>
          <Text
            style={[
              styles.stepText,
              {
                color: theme.colors.secondary,
                fontFamily: "Montserrat_500Medium",
              },
            ]}
          >
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
            <ProgressBar
              progress={progress / 100}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
          </View>
        </View>
        <View>
          {/* Question section */}
          <View style={styles.questionContainer}>
            <Text
              style={[
                styles.questionText,
                {
                  color: theme.colors.secondary,
                  fontFamily: "Montserrat_700Bold",
                },
              ]}
            >
              How active are you?
            </Text>
          </View>

          {/* Activity level cards */}
          <ScrollView
            style={styles.cardsScrollView}
            contentContainerStyle={styles.cardsContainer}
            showsVerticalScrollIndicator={false}
          >
            {activityOptions.map((option) => (
              <Animated.View
                key={option.id}
                style={[
                  styles.cardWrapper,
                  { transform: [{ scale: cardScales[option.id] }] },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.card,
                    selectedActivity === option.id && styles.selectedCard,
                    {
                      backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
                      borderColor:
                        selectedActivity === option.id
                          ? theme.colors.primary
                          : "transparent",
                    },
                  ]}
                  onPress={() => handleActivitySelect(option.id)}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: theme.colors.primary + "20" },
                      ]}
                    >
                      <Ionicons
                        name={option.icon as any}
                        size={30}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text
                        style={[
                          styles.cardTitle,
                          {
                            color: theme.colors.secondary,
                            fontFamily: "Montserrat_600SemiBold",
                          },
                        ]}
                      >
                        {option.title}
                      </Text>
                      <Text
                        style={[
                          styles.cardDescription,
                          {
                            color: theme.colors.secondary + "99",
                            fontFamily: "Montserrat_400Regular",
                          },
                        ]}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  {selectedActivity === option.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={theme.colors.primary}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
        {/* Button section */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
            <TouchableOpacity
              style={[styles.backButton, { borderColor: theme.colors.primary }]}
              onPress={handleBackPress}
              activeOpacity={0.9}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={theme.colors.primary}
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: selectedActivity
                    ? theme.colors.primary
                    : theme.colors.primary + "60",
                },
              ]}
              onPress={handleButtonPress}
              activeOpacity={0.9}
              disabled={!selectedActivity}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: "#000000", fontFamily: "Montserrat_700Bold" },
                ]}
              >
                Continue
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#000000"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </GradientBlurBackground>
  );
};

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
  },
  questionText: {
    fontSize: 28,
    lineHeight: 36,
  },
  cardsScrollView: {
    marginTop:10
  },
  cardsContainer: {
    paddingVertical: 10,
  },
  cardWrapper: {
    marginBottom: 15,
  },
  card: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
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
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
  },
  checkIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  buttonIcon: {},
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
});

export default ActivityLevelQuiz;
