"use client"

import { useState, useRef, useEffect } from "react"
import { View, StyleSheet, KeyboardAvoidingView, Platform, Animated, Easing } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Text, TextInput, Button, useTheme, Snackbar } from "react-native-paper"
import { type NavigationProp, useNavigation } from "@react-navigation/native"
import GradientBlurBackground from "../../component/Layout/background"
import axios from "axios"
import * as Haptics from "expo-haptics"

type RootStackParamList = {
  home: undefined
  signIn: undefined
}

const SignUp = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const theme = useTheme()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const formAnim = useRef(new Animated.Value(0)).current
  const buttonAnim = useRef(new Animated.Value(0)).current

  // Animate elements when component mounts
  useEffect(() => {
    // Staggered animations for better visual flow
    Animated.sequence([
      // First animate the title
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
          easing: Easing.out(Easing.cubic),
        }),
      ]),

      // Then animate the form
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
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

  const handleSignUp = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    setLoading(true)
    setError(null)

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    try {
      // Gọi API đăng ký
      const response = await axios.post(
        "https://chat.aaateammm.online/api/user/registration",
        {
          name,
          email,
          password,
          username: name, // Username được đặt bằng name theo yêu cầu
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      )

      // Kiểm tra response
      if (response.data.message === "Register successful.") {
        // Provide success haptic feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

        // Animate button before navigating
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
        ]).start(() => {
          navigation.navigate("signIn")
        })
      } else {
        setError(response.data.message || "Registration failed")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Something went wrong. Please try again.")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setLoading(false)
    }
  }

  const onDismissSnackBar = () => setError(null)

  return (
    <GradientBlurBackground xOffset={100} yOffset={100}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.formContainer}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text style={[styles.title, { color: theme.colors.primary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>Sign up to get started</Text>
          </Animated.View>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
            <Animated.View
              style={{
                opacity: formAnim,
                transform: [
                  {
                    translateY: formAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TextInput
                mode="outlined"
                label="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
                theme={{ roundness: 12 }}
                disabled={loading}
                outlineColor={theme.dark ? "#444444" : "#DDDDDD"}
                activeOutlineColor={theme.colors.primary}
              />

              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
                theme={{ roundness: 12 }}
                disabled={loading}
                outlineColor={theme.dark ? "#444444" : "#DDDDDD"}
                activeOutlineColor={theme.colors.primary}
              />

              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={isPasswordVisible ? "eye-off" : "eye"}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                }
                theme={{ roundness: 12 }}
                disabled={loading}
                outlineColor={theme.dark ? "#444444" : "#DDDDDD"}
                activeOutlineColor={theme.colors.primary}
              />

              <TextInput
                mode="outlined"
                label="Confirm Password"
                value={confirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
                onChangeText={setConfirmPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  />
                }
                theme={{ roundness: 12 }}
                disabled={loading}
                outlineColor={theme.dark ? "#444444" : "#DDDDDD"}
                activeOutlineColor={theme.colors.primary}
              />
            </Animated.View>

            <Animated.View
              style={{
                width: "100%",
                opacity: buttonAnim,
                transform: [{ scale: buttonAnim }],
              }}
            >
              <Button
                mode="contained"
                onPress={handleSignUp}
                style={styles.signUpButton}
                labelStyle={styles.signUpButtonText}
                disabled={loading || !name || !email || !password || !confirmPassword}
                loading={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Animated.View>
          </KeyboardAvoidingView>

          <Animated.View
            style={[
              styles.footer,
              {
                opacity: buttonAnim,
              },
            ]}
          >
            <Text style={{ color: theme.colors.tertiary }}>Already have an account?</Text>
            <Button
              mode="text"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                navigation.navigate("signIn")
              }}
              labelStyle={{ color: theme.colors.primary }}
              disabled={loading}
            >
              Sign In
            </Button>
          </Animated.View>
        </View>

        <Snackbar
          visible={!!error}
          onDismiss={onDismissSnackBar}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: "#FF4444" }]}
        >
          {error}
        </Snackbar>
      </SafeAreaView>
    </GradientBlurBackground>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    width: "85%",
    maxWidth: 340,
    alignSelf: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontFamily: "Montserrat_900Black",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 24,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  signUpButton: {
    borderRadius: 12,
    paddingVertical: 4,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  signUpButtonText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  snackbar: {
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 8,
  },
})

export default SignUp
