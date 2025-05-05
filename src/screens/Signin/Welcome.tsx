"use client"

import { useRef, useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, Animated, Easing } from "react-native"
import { useTheme } from "react-native-paper"
import CustomButton from "../../component/ui/customButton"
import TextTouch from "../../component/ui/textTouch"
import { type NavigationProp, useNavigation } from "@react-navigation/native"
import GradientBlurBackground from "../../component/Layout/background"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Haptics from "expo-haptics"

type RootStackParamList = {
  signIn: undefined
}

const Start = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const theme = useTheme()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const buttonAnim = useRef(new Animated.Value(0)).current

  // Animate elements when component mounts
  useEffect(() => {
    // Staggered animations for better visual flow
    Animated.sequence([
      // First animate the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]),

      // Then animate the welcome text
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),

      // Finally animate the button
      Animated.spring(buttonAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start()
  }, [])

  const handleGetStarted = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // Animate button press
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start(() => {
      navigation.navigate("signIn")
    })
  }

  return (
    <GradientBlurBackground xOffset={50} yOffset={50}>
      <SafeAreaView style={styles.safeArea}>
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.logoText, { color: theme.colors.primary }]}>Food</Text>
          <Text style={[styles.logoText, { color: theme.colors.primary }]}>Delight</Text>
        </Animated.View>

        {/* Welcome Message */}
        <Animated.View
          style={[
            styles.welcomeContainer,
            {
              opacity: scaleAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.welcomeText, { color: theme.colors.secondary }]}>Discover Delicious Meals</Text>
          <Text style={[styles.subtitleText, { color: theme.colors.tertiary }]}>Your culinary journey starts here</Text>
        </Animated.View>

        {/* Button */}
        <Animated.View
          style={{
            width: "100%",
            alignItems: "center",
            opacity: buttonAnim,
            transform: [
              { scale: buttonAnim },
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          }}
        >
          <CustomButton
            onPress={handleGetStarted}
            title="Get Started"
            buttonStyle={[
              styles.buttonStyle,
              {
                backgroundColor: theme.colors.primary,
                shadowColor: theme.colors.primary,
              },
            ]}
            textStyle={[
              styles.buttonText,
              {
                color: theme.dark ? "#000" : "#FFF",
              },
            ]}
          />
        </Animated.View>

        {/* Terms Footer */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: buttonAnim,
            },
          ]}
        >
          <Text style={[styles.footerText, { color: theme.colors.tertiary }]}>By continuing you accept our</Text>
          <TextTouch
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              alert("Terms & Privacy Policy pressed")
            }}
            title="Terms of Use & Privacy Policy"
            TextStyle={[styles.termsText, { color: theme.colors.primary }]}
          />
        </Animated.View>

        <StatusBar style={theme.dark ? "light" : "dark"} />
      </SafeAreaView>
    </GradientBlurBackground>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
  },
  logoContainer: {
    position: "absolute",
    top: "15%",
    left: "10%",
  },
  logoText: {
    fontSize: 36,
    fontFamily: "Montserrat_900Black",
    fontWeight: "bold",
    lineHeight: 40,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 18,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonStyle: {
    width: "80%",
    maxWidth: 320,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    marginBottom: 40,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 4,
  },
  termsText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    textDecorationLine: "underline",
  },
})

export default Start
