import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import SignIn from "./src/screens/Signin/SignIn";
import SignUp from "./src/screens/Signin/SignUp";
import HomeTabs from "./src/component/Layout/Navigation"
import Start from "./src/screens/Signin/Welcome";
import FoodListScreen from "./src/screens/FoodListScreen";

import { ReduxProvider } from "./src/libs/provider";
import { useFonts } from "expo-font";
import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import { useAppSelector } from "./src/hooks/hook";
import { AppRegistry } from "react-native";
import OnboardingFlow from "./src/screens/OnboardingFlow";
import { useAppTheme } from "./src/libs/theme";

const Stack = createNativeStackNavigator();


const AppContent = () => {
  const theme = useAppTheme(); // get the themed font + colors
  const user = useAppSelector((state) => state.user);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user?.token ? (
            !user.status ? (
              <Stack.Screen name="QuizStack" component={OnboardingFlow} />
            ) : (
              <>
                <Stack.Screen name="HomeTabs" component={HomeTabs} />
                <Stack.Screen name="FoodList" component={FoodListScreen} options={{ title: "Food List" }} />
              </>
            )
          ) : (
            <>
              <Stack.Screen name="start" component={Start} />
              <Stack.Screen name="signIn" component={SignIn} />
              <Stack.Screen name="signUp" component={SignUp} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const App = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ReduxProvider>
      <AppContent />
    </ReduxProvider>
  );
};

export default App;
AppRegistry.registerComponent('main', () => App);
