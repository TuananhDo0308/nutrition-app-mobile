import React, { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { setUser } from "../../slices/userSlice/userSlice";
import GradientBlurBackground from "../../component/Layout/background";
import { toggleTheme } from "../../slices/uiSlice/themeMode";

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

  useEffect(() => {
    if (user) {
      navigation.navigate("home");
    }
  }, [user, navigation]);

  const handleSignIn = () => {
    if (!userinfo || !password) return;
    dispatch(setUser({ name: userinfo, email: password }));
  };

  return (
    <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.formContainer}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            Welcome back
          </Text>
          <Text
            variant="titleMedium"
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
            />

            <Button
              mode="contained"
              onPress={handleSignIn}
              style={styles.signInButton}
              labelStyle={styles.signInButtonText}
              disabled={!userinfo || !password}
            >
              Sign In
            </Button>
          </KeyboardAvoidingView>

          <Button
            mode="text"
            onPress={() => dispatch(toggleTheme())}
            style={styles.forgotButton}
            labelStyle={{ color: theme.colors.secondary }}
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
            >
              Sign up
            </Button>
          </View>
        </View>
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
});

export default SignIn;