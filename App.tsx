import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import Start from './src/screens/start';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="start" component={Start} options={{headerShown: false}} />
        <Stack.Screen name="signIn" component={SignIn} options={{headerShown: false}} />
        <Stack.Screen name="signUp" component={SignUp} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
