import { Platform, StyleSheet, TouchableOpacity, View } from "react-native"
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



// Custom TabBar Background component that handles platform differences
const TabBarBackground = ({ isDarkMode }:any) => {
  const blurType = isDarkMode ? "dark" : "light"

  // On Android, use a semi-transparent background instead of blur
  if (Platform.OS === "android") {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.85)",
          },
        ]}
      />
    )
  }

  // On iOS and web, use BlurView
  return <BlurView style={StyleSheet.absoluteFill} intensity={20} tint={blurType} />
}

const HomeTabs = () => {
  const theme = useTheme()
  const isDarkMode = useAppSelector((state) => state.theme?.isDarkMode)

  // Custom tab bar button with haptic feedback
  const TabBarButton = ({ onPress, children, accessibilityState }: any) => {

    const handlePress = () => {
      // Trigger light haptic feedback when tab is pressed
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onPress()
    }

    return (
      <TouchableOpacity style={styles.tabButton} onPress={handlePress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    )
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "Home") {
            return <Octicons name="home" size={size} color={focused ? theme.colors.primary : "#818080"} />
          } else if (route.name === "Statistic") {
            return <FontAwesome6 name="chart-line" size={size} color={focused ? theme.colors.primary : "#818080"} />
          } else if (route.name === "Menu") {
            return <Feather name="book" size={size} color={focused ? theme.colors.primary : "#818080"} />
          } else if (route.name === "Setting") {
            return <AntDesign name="setting" size={size} color={focused ? theme.colors.primary : "#818080"} />
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
          // Add shadow for Android
          ...Platform.select({
            android: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
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
  },
  tabBarStyle: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
  },
})
