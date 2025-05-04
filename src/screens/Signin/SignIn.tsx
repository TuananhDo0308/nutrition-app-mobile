import React, { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, useTheme, Snackbar } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { setUser } from "../../slices/userSlice/userSlice";
import GradientBlurBackground from "../../component/Layout/background";
import { toggleTheme } from "../../slices/uiSlice/themeMode";
import axios from "axios";
import { apiLinks } from "../../utils";

type RootStackParamList = {
  home: undefined;
  signUp: undefined;
};

const SignIn = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const user = useAppSelector((state) => state.user?.name);

  const [userinfo, setUserInfo] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigation.navigate("home");
    }
  }, [user, navigation]);

  const handleSignIn = async () => {
    // Validation
    if (!userinfo || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

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
        }
      );

      // Giả định response.data chứa token, image, status, name
      const { token, image, status, name } = response.data;

      // Lưu thông tin user vào Redux store
      dispatch(
        setUser({
          name,
          email: userinfo, // Lưu email từ input vì response không có
          token,
          image,
          status,
        })
      );

      navigation.navigate("home");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDismissSnackBar = () => setError(null);

  return (
    <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.formContainer}>
          <Text
            style={[styles.title, { color: theme.colors.primary }]}
          >
            Welcome back
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.secondary }]}
          >
            Login to your account
          </Text>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.inputContainer}
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
          </KeyboardAvoidingView>

          <Button
            mode="text"
            onPress={() => dispatch(toggleTheme())} // Thay bằng hàm reset password nếu cần
            style={styles.forgotButton}
            labelStyle={{ color: theme.colors.secondary }}
            disabled={loading}
          >
            Forgot password?
          </Button>

          <View style={styles.footer}>
            <Text style={{ color: theme.colors.tertiary }}>
              Don't have an account?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate("signUp")}
              labelStyle={{ color: theme.colors.primary }}
              disabled={loading}
            >
              Sign up
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
  signInButton: {
    borderRadius: 12,
    paddingVertical: 4,
    marginBottom: 24,
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
    backgroundColor: "#FF4444",
    marginBottom: 20,
    marginHorizontal: 16,
  },
});

export default SignIn;