"use client"

import { useEffect, useState, useRef } from "react"
import { View, StyleSheet, KeyboardAvoidingView, Platform, Animated, Easing } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Text, TextInput, Button, useTheme, Snackbar } from "react-native-paper"
import { type NavigationProp, useNavigation } from "@react-navigation/native"
import { useAppDispatch, useAppSelector } from "../../hooks/hook"
import { setUser } from "../../slices/userSlice/userSlice"
import GradientBlurBackground from "../../component/Layout/background"
import { toggleTheme } from "../../slices/uiSlice/themeMode"
import axios from "axios"
import { apiLinks } from "../../utils"
import * as Haptics from "expo-haptics"

type RootStackParamList = {
  home: undefined
  signUp: undefined
}

const SignIn = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const user = useAppSelector((state) => state.user?.name)

  const [userinfo, setUserInfo] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const formAnim = useRef(new Animated.Value(0)).current
  const buttonAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (user) {
      navigation.navigate("home")
    }
  }, [user, navigation])

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

  const handleSignIn = async () => {
    // Validation
    if (!userinfo || !password) {
      setError("Please fill in all fields")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    setLoading(true)
    setError(null)

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    try {
      // Gọi API đăng nhập
      const response = await axios.post(
        apiLinks.authentication.signIn, // Thay bằng URL thực tế
        {
          email: userinfo,
          password,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      )

      // Giả định response.data chứa token, image, status, name
      const { token, image, status, name } = response.data

      // Lưu thông tin user vào Redux store
      dispatch(
        setUser({
          name,
          email: userinfo, // Lưu email từ input vì response không có
          token,
          image,
          status,
        }),
      )

      // Provide success haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      navigation.navigate("home")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Something went wrong. Please try again.")

      // Provide error haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setLoading(false)
    }
  }

  const onDismissSnackBar = () => setError(null)

  return (
    <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.formContainer}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text style={[styles.title, { color: theme.colors.primary }]}>Welcome back</Text>
            <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>Login to your account</Text>
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
                label="Email"
                value={userinfo}
                onChangeText={setUserInfo}
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
                onPress={handleSignIn}
                style={styles.signInButton}
                labelStyle={styles.signInButtonText}
                disabled={loading || !userinfo || !password}
                loading={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Animated.View>
          </KeyboardAvoidingView>

          <Animated.View
            style={{
              alignSelf: "flex-end",
              opacity: buttonAnim,
            }}
          >
            <Button
              mode="text"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                dispatch(toggleTheme())
              }}
              style={styles.forgotButton}
              labelStyle={{ color: theme.colors.secondary }}
              disabled={loading}
            >
              Forgot password?
            </Button>
          </Animated.View>

          <Animated.View
            style={[
              styles.footer,
              {
                opacity: buttonAnim,
              },
            ]}
          >
            <Text style={{ color: theme.colors.tertiary }}>Don't have an account?</Text>
            <Button
              mode="text"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                navigation.navigate("signUp")
              }}
              labelStyle={{ color: theme.colors.primary }}
              disabled={loading}
            >
              Sign up
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
  signInButton: {
    borderRadius: 12,
    paddingVertical: 4,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  signInButtonText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
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

export default SignIn
