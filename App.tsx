import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './src/screens/SignUp';
import { Header } from 'react-native/Libraries/NewAppScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={SignUp} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    width: 300,
    marginBottom: 13,
  },

  title: {
    fontSize: 25,
  },

  titleColor: {
    color: '#62C998',
    fontWeight: 'bold',
  },

  inputContainer: {
    marginTop: 208,
  },

  icon: {
    margin: 7,
    marginLeft: 15,
    marginRight: 15,
  },

  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    width: 300,
    height: 45,
    marginBottom: 7,
    marginTop: 7,
  },

  textInput: {
    flex: 1,
  },
  
  titleBottom: {
    marginBottom: 15,
    alignItems: 'center',
  }
});
