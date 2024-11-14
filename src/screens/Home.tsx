import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearUser } from "../slices/userSlice/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import GradientBlurBackground from "../libs/background";
import { SafeAreaView } from "react-native-safe-area-context";
import { toggleTheme } from "../slices/uiSlice/themeMode";

const Home = () => {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const handleLogout = () => {
    dispatch(clearUser());
  };
  useEffect(() => {
    if (!user) {
      navigation.navigate("signIn");
    }
  }, [user, navigation]);

  return (
    <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <Text style={styles.text}>Welcome, {user?.name}!</Text>
        <Text style={styles.text}>Email: {user?.email}</Text>
        <Button title="Logout" onPress={handleLogout} />       
       <Button title="ChangeMode" onPress={()=>dispatch(toggleTheme())} />

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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Home;
