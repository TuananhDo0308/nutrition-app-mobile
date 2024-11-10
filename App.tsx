import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./src/screens/SignUp";
import SignIn from "./src/screens/SignIn";
import Home from "./src/screens/Home";
import { ReduxProvider } from "./src/libs/provider";
import "./global.css";
import { verifyInstallation } from 'nativewind';
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { useAppSelector } from "./src/hooks/hook";
import Start from "./src/screens/start";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./src/screens/ProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { StyleSheet } from "react-native";
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};
export default function App() {
  verifyInstallation();
  return (

    <ReduxProvider>
      <PaperProvider theme={theme}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="start" component={Start} options={{headerShown: false}} />
        <Stack.Screen name="signIn" component={SignIn} options={{headerShown: false}} />
        <Stack.Screen name="signUp" component={SignUp} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
    </ReduxProvider>
    /*
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            marginBottom: 40,
            marginHorizontal: 40,
            borderRadius: 30,
            position: "absolute",
            backgroundColor: "#444444",
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="home"
          options={{
            tabBarIcon: () => <Image source={require("./src/Icon/Home.png")} />,
          }}
          component={HomeScreen}
        />
        <Tab.Screen
          name="statistical"
          options={{
            tabBarIcon: () => (
              <Image source={require("./src/Icon/statistical.png")} />
            ),
          }}
          component={HomeScreen}
        />
        <Tab.Screen
          name="scan"
          options={{
            tabBarIcon: () => <View style={styles.scan}><Image source={require("./src/Icon/scan.png")} /></View>,
          }}
          component={ProfileScreen}
        />
        <Tab.Screen
          name="notepad"
          options={{
            tabBarIcon: () => (
              <Image source={require("./src/Icon/notepad.png")} />
            ),
          }}
          component={ProfileScreen}
        />
        <Tab.Screen
          name="profile"
          options={{
            tabBarIcon: () => (
              <Image source={require("./src/Icon/profile.png")} />
            ),
          }}
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>*/
  );
}

const styles = StyleSheet.create({
  scan: {
    position: 'absolute',
    bottom: '50%',
    backgroundColor: '#F9E287',
    padding: 10,
    borderRadius: 50,
  }
})