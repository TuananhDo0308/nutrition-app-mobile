import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../hooks/hook";
import GradientBlurBackground from "../libs/background";

const SignUp = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const theme = useTheme();

  const handleOnSubmit = () => {
    if (password === confirmPassword) {
      navigation.navigate("home");
    } else {
      alert("Passwords do not match.");
    }
  };

  return (
    <GradientBlurBackground xOffset={100} yOffset={100}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.formContainer}>
          {/* Header */}
          <View></View>
          <View>
            <View>
              <Text style={[styles.title, { color: theme.colors.primary }]}>
                Create Account
              </Text>
              <Text
                style={[styles.subtitle, { color: theme.colors.secondary }]}
              >
                Sign up to get started
              </Text>
            </View>

            {/* Name Input */}
            <TextInput
              mode="outlined"
              label="Full Name"
              value={name}
              onChangeText={setName}
              style={[styles.input, { marginTop: 30 }]}
              left={<TextInput.Icon icon="account" />}
            />

            {/* Email Input */}
            <TextInput
              mode="outlined"
              label="Enter your email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />

            {/* Password Input */}
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
            />

            {/* Confirm Password Input */}
            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={confirmPassword}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setConfirmPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
            />

            {/* Sign Up Button */}
            <Button
              mode="contained"
              onPress={handleOnSubmit}
              style={styles.button}
              labelStyle={{
                fontFamily: "Montserrat_700Bold",
                fontSize: 18,
                color: theme.colors.background,
              }}
            >
              Sign Up
            </Button>
          </View>

          {/* Footer Links */}
          <View style={styles.footer}>
            <Text style={{ color: theme.colors.tertiary }}>
              Already have an account?
            </Text>
            <Button
              onPress={() => navigation.navigate("signIn")}
              compact
              labelStyle={{ color: theme.colors.primary }}
            >
              Sign In
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
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: 320,
    alignItems: "stretch",
    justifyContent: "space-between",
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Montserrat_900Black",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: "Montserrat_500Medium",
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: "100%",
    paddingVertical: 2,
    borderRadius: 1000,
    alignItems: "center",
  },
  footer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
});

export default SignUp;
