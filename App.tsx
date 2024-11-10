import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, View, Image } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./src/screens/SignUp";
import SignIn from "./src/screens/SignIn";
import Start from "./src/screens/start";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./src/screens/ProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="start" component={Start} options={{headerShown: false}} />
        <Stack.Screen name="signIn" component={SignIn} options={{headerShown: false}} />
        <Stack.Screen name="signUp" component={SignUp} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
    
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