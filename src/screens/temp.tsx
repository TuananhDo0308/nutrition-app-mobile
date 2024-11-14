import React, { useRef } from "react";
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import Home from "./Home";
import ProfileScreen from "./ProfileScreen";
import { useAppSelector } from "../hooks/hook";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import RoundedSquareIcon from "../Icon/CameraIcon/2";
import CameraIcon from "../Icon/CameraIcon/1";
import SolidRoundedSquareIcon from "../Icon/CameraIcon/3";
import Notepad from "./NotePadScreen";
const Tab = createBottomTabNavigator();
import CustomIcon from "../Icon/CameraIcon/Group";
import { useNavigation } from "@react-navigation/native";
import CustomCenterIcon from "../component/customCameraButton";
import HomeScreen from "./HomeScreen";


const HomeTabs = () => {
  const isDarkMode = useAppSelector((state) => state.theme?.isDarkMode);
  const blurType = isDarkMode ? "dark" : "light";
  const activeColor = isDarkMode ?  "white":"black";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "Home") {
            return <Octicons name="home" size={size} color={color} />;
          } else if (route.name === "Statistic") {
            return <FontAwesome6 name="chart-line" size={size} color={color} />;
          } else if (route.name === "Menu") {
            return <Feather name="book" size={size} color={color} />;
          } else if (route.name === "Setting") {
            return <AntDesign name="setting" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: "#818080",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: 90,
          paddingTop: 20,
        },
        headerShown: false,
        tabBarBackground: () => (
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={20}
            tint={blurType}
          />
        ),
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
        component={Home}
        options={{
          tabBarLabel: "", // Hide tab label
        }}
      />
      <Tab.Screen
        name="Center"
        component={Home} // Central component can navigate to Home or any other component you want
        options={{
          tabBarIcon: () => <CustomCenterIcon />,
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Menu"
        component={ProfileScreen}
        options={{
          tabBarLabel: "", // Hide tab label
        }}
      />
      <Tab.Screen
        name="Setting"
        component={ProfileScreen}
        options={{
          tabBarLabel: "", // Hide tab label
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;

const styles = StyleSheet.create({
  centerIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarStyle: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
  },
});
