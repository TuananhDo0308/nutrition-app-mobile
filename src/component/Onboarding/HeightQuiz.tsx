"use client";

import { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import GradientBlurBackground from "../../component/Layout/background";
import { ProgressBar, useTheme } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width * 0.1;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

interface HeightQuizProps {
  initialHeight: number;
  onNext: (height: number) => void;
  progress: number;
  step: number;
}

const HeightQuiz: React.FC<HeightQuizProps> = ({
  initialHeight,
  onNext,
  progress,
  step,
}) => {
  const theme = useTheme();
  const [height, setHeight] = useState(initialHeight);
  const [isManualInput, setIsManualInput] = useState(false);
  const [manualHeight, setManualHeight] = useState(initialHeight.toString());

  const scrollX = useRef(new Animated.Value(initialHeight * ITEM_SIZE)).current;
  const lastHeight = useRef(initialHeight);

  // Animation values
  const heightScale = useRef(new Animated.Value(1)).current;
  const progressValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const inputMode = useRef(new Animated.Value(0)).current;

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
  }, []);

  // Update progress animation when progress changes
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: progress / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newHeight = Math.round(offsetX / ITEM_SIZE);

    if (newHeight !== lastHeight.current) {
      // Trigger haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Animate height scale
      Animated.sequence([
        Animated.timing(heightScale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(heightScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      lastHeight.current = newHeight;
    }

    setHeight(newHeight);
  };

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
    ]).start();

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Move to next step
    onNext(isManualInput ? parseInt(manualHeight, 10) : height);
  };

  const toggleInputMode = () => {
    setIsManualInput(!isManualInput);
    setManualHeight(height.toString());

    // Animate between input modes
    Animated.timing(inputMode, {
      toValue: isManualInput ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Handle manual height input
  const handleManualHeightChange = (text: string) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setManualHeight(text);

      // Update height if valid
      if (text !== "" && parseInt(text, 10) > 0) {
        setHeight(parseInt(text, 10));
      }
    }
  };

  // Interpolate progress for animated background
  const progressInterpolate = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  });

  // Interpolate opacity for input mode transitions
  const rulerOpacity = inputMode.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const manualInputOpacity = inputMode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
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
              How tall are you?
            </Text>
          </View>
          {/* Toggle input mode button */}

          {/* Height display */}
          <View style={styles.heightDisplaySection}>
            <View
              style={[
                styles.heightDisplayCard,
                { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" },
              ]}
            >
              {isManualInput ? (
                <Animated.View
                  style={[
                    styles.manualInputContainer,
                    { opacity: manualInputOpacity },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.manualInput,
                      {
                        color: theme.colors.primary,
                        fontFamily: "Montserrat_700Bold",
                      },
                    ]}
                    value={manualHeight}
                    onChangeText={handleManualHeightChange}
                    keyboardType="number-pad"
                    maxLength={3}
                    autoFocus
                  />
                  <Text
                    style={[
                      styles.heightUnit,
                      {
                        color: theme.colors.secondary,
                        fontFamily: "Montserrat_500Medium",
                      },
                    ]}
                  >
                    cm
                  </Text>
                </Animated.View>
              ) : (
                <Animated.View
                  style={[
                    styles.heightValueContainer,
                    { opacity: rulerOpacity },
                  ]}
                >
                  <Animated.Text
                    style={[
                      styles.heightValue,
                      {
                        color: theme.colors.primary,
                        fontFamily: "Montserrat_700Bold",
                        transform: [{ scale: heightScale }],
                      },
                    ]}
                  >
                    {height}
                  </Animated.Text>
                  <Text
                    style={[
                      styles.heightUnit,
                      {
                        color: theme.colors.secondary,
                        fontFamily: "Montserrat_500Medium",
                      },
                    ]}
                  >
                    cm
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>

          {/* Ruler section */}
          <Animated.View
            style={[styles.rulerContainer, { opacity: rulerOpacity }]}
          >
            <View style={styles.rulerLine} />
            <Animated.FlatList
              data={Array.from({ length: 300 }, (_, i) => i)}
              keyExtractor={(item) => item.toString()}
              style={styles.ruler}
              horizontal
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: true,
                  listener: handleScroll,
                }
              )}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_SIZE}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
              initialScrollIndex={initialHeight}
              getItemLayout={(data, index) => ({
                length: ITEM_SIZE,
                offset: ITEM_SIZE * index,
                index,
              })}
              renderItem={({ item }) => {
                const inputRange = [
                  (item - 1) * ITEM_SIZE,
                  item * ITEM_SIZE,
                  (item + 1) * ITEM_SIZE,
                ];

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.5, 1, 0.5],
                  extrapolate: "clamp",
                });

                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.8, 1, 0.8],
                  extrapolate: "clamp",
                });

                const height = item % 5 === 0 ? 70 : 40;

                return (
                  <View style={[styles.tickContainer, { width: ITEM_SIZE }]}>
                    <Animated.View
                      style={[
                        styles.tick,
                        {
                          height,
                          backgroundColor:
                            item % 5 === 0
                              ? theme.colors.primary
                              : theme.colors.secondary + "40",
                          opacity,
                          transform: [{ scaleY: scale }],
                        },
                      ]}
                    />
                    {item % 5 === 0 && (
                      <Animated.Text
                        style={[
                          styles.tickLabel,
                          {
                            color: theme.colors.secondary,
                            opacity,
                            transform: [{ scale }],
                            fontFamily: "Montserrat_500Medium",
                          },
                        ]}
                      >
                        {item}
                      </Animated.Text>
                    )}
                  </View>
                );
              }}
            />
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
  heightDisplaySection: {
    alignItems: "center",
    marginTop: 30,
  },
  heightDisplayCard: {
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
  heightValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  heightValue: {
    fontSize: 48,
  },
  heightUnit: {
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
  rulerContainer: {
    marginTop: 40,
    height: 120,
    alignItems: "center",
  },
  rulerLine: {
    position: "absolute",
    top: 50,
    width: width * 0.8,
    height: 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: -1,
  },
  ruler: {
    height: 120,
  },
  tickContainer: {
    alignItems: "center",
  },
  tick: {
    width: 2,
    marginTop: 20,
  },
  tickLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  buttonContainer: {
    alignItems: "center",
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
});

export default HeightQuiz;
