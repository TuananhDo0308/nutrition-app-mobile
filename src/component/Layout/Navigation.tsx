"use client"

import { Platform, StyleSheet, TouchableOpacity, View, Animated, Easing } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { BlurView } from "expo-blur"
import Home from "../../screens/Home"
import { useAppSelector } from "../../hooks/hook"
import Octicons from "@expo/vector-icons/Octicons"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import Feather from "@expo/vector-icons/Feather"
import AntDesign from "@expo/vector-icons/AntDesign"
const Tab = createBottomTabNavigator()
import CustomCenterIcon from "../ui/customCameraButton"
import HomeScreen from "../../screens/HomeScreen"
import StatisticalScreen from "../../screens/StatisticalScreen"
import FoodListScreen from "../../screens/FoodInput"
import * as Haptics from "expo-haptics"
import SettingScreen from "../../screens/SettingScreen"
import { useTheme } from "react-native-paper"
import { useRef, useEffect } from "react"

// Custom TabBar Background component that handles platform differences
const TabBarBackground = ({ isDarkMode }: any) => {
  const blurType = isDarkMode ? "dark" : "light"

  // On Android, use a semi-transparent background instead of blur
  if (Platform.OS === "android") {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.85)",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
          },
        ]}
      />
    )
  }

  // On iOS and web, use BlurView
  return (
    <BlurView
      style={[
        StyleSheet.absoluteFill,
        {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        },
      ]}
      intensity={20}
      tint={blurType}
    />
  )
}

const HomeTabs = () => {
  const theme = useTheme()
  const isDarkMode = useAppSelector((state) => state.theme?.isDarkMode)

  // Animation for tab bar appearance
  const tabBarAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animate tab bar appearance when component mounts
    Animated.timing(tabBarAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start()
  }, [])

  // Custom tab bar button with haptic feedback and animation
  const TabBarButton = ({ onPress, children, accessibilityState }: any) => {
    const focused = accessibilityState?.selected
    const scaleAnim = useRef(new Animated.Value(1)).current
    const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.7)).current

    useEffect(() => {
      // Animate when focus state changes
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: focused ? 1.1 : 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: focused ? 1 : 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }, [focused])

    const handlePress = () => {
      // Trigger light haptic feedback when tab is pressed
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

      // Animate button press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: focused ? 1.1 : 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start()

      onPress()
    }

    return (
      <TouchableOpacity style={styles.tabButton} onPress={handlePress} activeOpacity={0.7}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          {children}
        </Animated.View>
        {focused && (
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                backgroundColor: theme.colors.primary,
                opacity: opacityAnim,
              },
            ]}
          />
        )}
      </TouchableOpacity>
    )
  }

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: tabBarAnim,
        transform: [
          {
            translateY: tabBarAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
        ],
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            const iconColor = focused ? theme.colors.primary : "#818080"
            const iconSize = focused ? size + 2 : size

            if (route.name === "Home") {
              return <Octicons name="home" size={iconSize} color={iconColor} />
            } else if (route.name === "Statistic") {
              return <FontAwesome6 name="chart-line" size={iconSize} color={iconColor} />
            } else if (route.name === "Menu") {
              return <Feather name="book" size={iconSize} color={iconColor} />
            } else if (route.name === "Setting") {
              return <AntDesign name="setting" size={iconSize} color={iconColor} />
            }
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: "#818080",
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            height: 90,
            paddingTop: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            // Add shadow for Android
            ...Platform.select({
              android: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
              },
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
            }),
          },
          headerShown: false,
          tabBarBackground: () => <TabBarBackground isDarkMode={isDarkMode} />,
          tabBarButton: (props) => <TabBarButton {...props} />,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "", // Hide tab label
          }}
        />
        <Tab.Screen
          name="Statistic"
          component={StatisticalScreen}
          options={{
            tabBarLabel: "", // Hide tab label
          }}
        />
        <Tab.Screen
          name="Center"
          component={Home} // This is a placeholder, the actual component doesn't matter
          options={({ navigation }) => ({
            tabBarIcon: () => <CustomCenterIcon navigation={navigation} />,
            tabBarLabel: "",
          })}
        />
        <Tab.Screen
          name="Menu"
          component={FoodListScreen}
          options={{
            tabBarLabel: "", // Hide tab label
          }}
        />
        <Tab.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            tabBarLabel: "", // Hide tab label
          }}
        />
      </Tab.Navigator>
    </Animated.View>
  )
}

export default HomeTabs

const styles = StyleSheet.create({
  centerIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  tabBarStyle: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
  },
  tabIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
})
