import * as React from "react";
import {
  Animated,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  Platform,
} from "react-native";

export type VerticalProgressBarProps = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Animated value (between 0 and 1). Use this to animate the progress bar programmatically.
   */
  animatedValue?: number;
  /**
   * Progress value (between 0 and 1). Use this for static progress.
   */
  progress?: number;
  /**
   * Color of the progress bar.
   */
  color?: string;
  /**
   * If true, shows an indeterminate animation.
   */
  indeterminate?: boolean;
  /**
   * Whether to show (true) or hide (false) the progress bar.
   */
  visible?: boolean;
  /**
   * Custom style for the filled portion of the progress bar.
   */
  fillStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * Container style.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Test ID for testing purposes.
   */
  testID?: string;
};

const INDETERMINATE_DURATION = 2000;
const INDETERMINATE_MAX_HEIGHT = 0.6;

const VerticalProgressBar = ({
  color = "#85F193", // Mặc định màu xanh của bạn
  indeterminate = false,
  progress = 0,
  visible = true,
  animatedValue,
  style,
  fillStyle,
  testID = "vertical-progress-bar",
  ...rest
}: VerticalProgressBarProps) => {
  const isWeb = Platform.OS === "web";
  const { current: timer } = React.useRef<Animated.Value>(new Animated.Value(0));
  const { current: fade } = React.useRef<Animated.Value>(new Animated.Value(0));
  const [height, setHeight] = React.useState<number>(0);
  const [prevHeight, setPrevHeight] = React.useState<number>(0);

  const indeterminateAnimation = React.useRef<Animated.CompositeAnimation | null>(null);

  const animationScale = 1; // Có thể điều chỉnh nếu cần scale animation

  React.useEffect(() => {
    if (visible) startAnimation();
    else stopAnimation();

    return () => stopAnimation(); // Cleanup khi unmount
  }, [visible]);

  React.useEffect(() => {
    if (animatedValue !== undefined && animatedValue >= 0) {
      timer.setValue(animatedValue);
    }
  }, [animatedValue, timer]);

  React.useEffect(() => {
    if (visible && prevHeight === 0 && height > 0) {
      startAnimation();
    }
  }, [prevHeight, height, visible]);

  const startAnimation = () => {
    Animated.timing(fade, {
      duration: 200 * animationScale,
      toValue: 1,
      useNativeDriver: true,
      isInteraction: false,
    }).start();

    if (typeof animatedValue !== "undefined" && animatedValue >= 0) {
      return; // Nếu dùng animatedValue thì không chạy animation mặc định
    }

    if (indeterminate) {
      if (!indeterminateAnimation.current) {
        indeterminateAnimation.current = Animated.timing(timer, {
          duration: INDETERMINATE_DURATION,
          toValue: 1,
          useNativeDriver: !isWeb,
          isInteraction: false,
        });
      }
      timer.setValue(0);
      Animated.loop(indeterminateAnimation.current).start();
    } else {
      Animated.timing(timer, {
        duration: 200 * animationScale,
        toValue: progress,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    }
  };

  const stopAnimation = () => {
    if (indeterminateAnimation.current) {
      indeterminateAnimation.current.stop();
    }
    Animated.timing(fade, {
      duration: 200 * animationScale,
      toValue: 0,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  };

  const onLayout = (event: React.LayoutChangeEvent) => {
    setPrevHeight(height);
    setHeight(event.nativeEvent.layout.height);
  };

  return (
    <View
      onLayout={onLayout}
      {...rest}
      accessible
      accessibilityRole="progressbar"
      accessibilityState={{ busy: visible }}
      accessibilityValue={indeterminate ? {} : { min: 0, max: 100, now: progress * 100 }}
      style={[styles.container, style]}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.background,
          { opacity: fade },
        ]}
      >
        {height ? (
          <Animated.View
            testID={`${testID}-fill`}
            style={[
              styles.fill,
              {
                backgroundColor: color,
                transform: [
                  {
                    translateY: timer.interpolate(
                      indeterminate
                        ? {
                            inputRange: [0, 0.5, 1],
                            outputRange: [
                              height * 0.5, // Bắt đầu từ giữa
                              height * (0.5 - INDETERMINATE_MAX_HEIGHT / 2),
                              height * -0.2, // Kết thúc ngoài tầm nhìn
                            ],
                          }
                        : {
                            inputRange: [0, 1],
                            outputRange: [height * 0.5, 0], // Từ dưới lên trên
                          }
                    ),
                  },
                  {
                    scaleY: timer.interpolate(
                      indeterminate
                        ? {
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.0001, INDETERMINATE_MAX_HEIGHT, 0.0001],
                          }
                        : {
                            inputRange: [0, 1],
                            outputRange: [0.0001, 1], // Tăng chiều cao từ 0 đến 100%
                          }
                    ),
                  },
                ],
              },
              fillStyle,
            ]}
          />
        ) : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 91, // Giữ chiều rộng như trong thiết kế của bạn
    height: 160, // Giữ chiều cao như trong thiết kế của bạn
    overflow: "hidden",
    borderRadius: 15,
    backgroundColor: "#343434", // Nền tối tương tự HomeScreen
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  fill: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0, // Bắt đầu từ dưới lên
  },
});

export default VerticalProgressBar;