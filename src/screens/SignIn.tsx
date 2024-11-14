import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { setUser } from "../slices/userSlice/userSlice";
import GradientBlurBackground from "../libs/background";
import { toggleTheme } from "../slices/uiSlice/themeMode";

const SignIn = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const dispatch = useAppDispatch();
  const [userinfo, setUserInfo] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const theme = useTheme();
  const user = useAppSelector((state) => state.user?.name);

  useEffect(() => {
    if (user) {
      navigation.navigate("home");
    }
  }, [user, navigation]);

  const handleOnSubmit = () => {
    dispatch(setUser({ name: userinfo, email: password }));
  };

  return (
    <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.formContainer}>
          {/* Tiêu đề */}
          <View></View>
          <View>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              Welcome back
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>
              Login to your account
            </Text>

            {/* Email Input */}
            <TextInput
              mode="outlined"
              label="Email"
              value={userinfo}
              onChangeText={setUserInfo}
              style={[styles.input, { marginTop: 30 }]}
              left={<TextInput.Icon icon="account" />}
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
            {/* Nút "Forgot Password" */}
            <Button
              mode="text"
              compact
              onPress={() => dispatch(toggleTheme())}
              labelStyle={{ color: theme.colors.secondary }}
              style={styles.forgotButton}
            >
              Forgot password?
            </Button>

            {/* Nút "Sign In" */}
            <Button
              mode="contained"
              onPress={handleOnSubmit}
              labelStyle={{
                fontFamily: "Montserrat_700Bold",
                fontSize: 18,
                color: theme.colors.background,
              }}
            >
              Sign In
            </Button>
          </View>

          {/* Footer Links */}
          <View style={styles.footer}>
            <Text style={{ color: theme.colors.tertiary }}>
              Don't have an account?
            </Text>
            <Button
              onPress={() => navigation.navigate("signUp")}
              compact
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
  forgotButton: {
    alignSelf: "flex-end",
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

export default SignIn;
