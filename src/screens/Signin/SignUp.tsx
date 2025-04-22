import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, useTheme, Snackbar } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import GradientBlurBackground from "../../component/Layout/background";
import axios from "axios";
import { apiLinks } from "../../utils";

type RootStackParamList = {
  home: undefined;
  signIn: undefined;
};

const SignUp = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    setLoading(true);
    setError(null);
  
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
        }
      );
  
      // Kiểm tra response
      if (response.data.message === "Register successful.") {
        navigation.navigate("signIn");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDismissSnackBar = () => setError(null);

  return (
    <GradientBlurBackground xOffset={100} yOffset={100}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.formContainer}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            Create Account
          </Text>
          <Text
            variant="titleMedium"
            style={[styles.subtitle, { color: theme.colors.secondary }]}
          >
            Sign up to get started
          </Text>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.inputContainer}
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
            />

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
          </KeyboardAvoidingView>

          <View style={styles.footer}>
            <Text style={{ color: theme.colors.tertiary }}>
              Already have an account?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate("signIn")}
              labelStyle={{ color: theme.colors.primary }}
              disabled={loading}
            >
              Sign In
            </Button>
          </View>
        </View>

        <Snackbar
          visible={!!error}
          onDismiss={onDismissSnackBar}
          duration={3000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
      </SafeAreaView>
    </GradientBlurBackground>
  );
};

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
    fontFamily: "Montserrat_900Black",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Montserrat_500Medium",
    marginBottom: 24,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
  },
  signUpButton: {
    borderRadius: 12,
    paddingVertical: 4,
    marginBottom: 24,
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
    backgroundColor: "#FF4444",
    marginBottom: 20,
    marginHorizontal: 16,
  },
});

export default SignUp;