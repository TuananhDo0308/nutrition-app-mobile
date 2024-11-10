import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./src/screens/SignUp";
import SignIn from "./src/screens/SignIn";
import Start from "./src/screens/start";;
import Home from "./src/screens/Home";
import { ReduxProvider } from "./src/libs/provider";
const Stack = createNativeStackNavigator();
import "./global.css";
import { verifyInstallation } from 'nativewind';
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { useAppSelector } from "./src/hooks/hook";

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
          <Stack.Screen
            name="start"
            component={Start}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="home"
            component={Home}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
        
      </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
