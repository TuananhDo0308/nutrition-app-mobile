"use client"

import { useState } from "react"
import { View, StyleSheet, TouchableOpacity, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Text } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAppTheme } from "../libs/theme"
import GradientBlurBackground from "../component/Layout/background"
import { BlurView } from "expo-blur"
import Svg, { Path } from "react-native-svg"
import FoodInputTab from "../component/FoodInputTab"
import RecipeListTab from "../component/RecipeListTab"

// Custom SVG Icons
const ArrowLeftIcon = ({ color = "#fff", size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const CombinedFoodScreen = () => {
  const navigation = useNavigation()
  const theme = useAppTheme()
  const [activeTab, setActiveTab] = useState<"input" | "recipes">("input")

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientBlurBackground>
        <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
    
            <Text
              style={[
                styles.headerTitle,
                { fontFamily: theme.fonts.titleLarge.fontFamily, color: theme.colors.secondary },
              ]}
            >
              {activeTab === "input" ? "Food Input" : "Recipe Suggestions"}
            </Text>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <BlurView intensity={60} tint={theme.dark ? "dark" : "light"} style={styles.tabBlur}>
              <View style={styles.tabButtons}>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === "input" && { backgroundColor: theme.colors.primary }]}
                  onPress={() => setActiveTab("input")}
                >
                  <Ionicons
                    name="add-circle"
                    size={20}
                    color={activeTab === "input" ? (theme.dark ? "#000" : "#fff") : theme.colors.secondary}
                  />
                  <Text
                    style={[
                      styles.tabButtonText,
                      {
                        fontFamily: theme.fonts.labelMedium.fontFamily,
                        color: activeTab === "input" ? (theme.dark ? "#000" : "#fff") : theme.colors.secondary,
                      },
                    ]}
                  >
                    Food Input
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabButton, activeTab === "recipes" && { backgroundColor: theme.colors.primary }]}
                  onPress={() => setActiveTab("recipes")}
                >
                  <Ionicons
                    name="restaurant"
                    size={20}
                    color={activeTab === "recipes" ? (theme.dark ? "#000" : "#fff") : theme.colors.secondary}
                  />
                  <Text
                    style={[
                      styles.tabButtonText,
                      {
                        fontFamily: theme.fonts.labelMedium.fontFamily,
                        color: activeTab === "recipes" ? (theme.dark ? "#000" : "#fff") : theme.colors.secondary,
                      },
                    ]}
                  >
                    Recipes
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>{activeTab === "input" ? <FoodInputTab /> : <RecipeListTab />}</View>
        </SafeAreaView>
      </GradientBlurBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Montserrat_700Bold",
  },
  tabContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  tabBlur: {
    borderRadius: 12,
  },
  tabButtons: {
    flexDirection: "row",
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tabContent: {
    flex: 1,
  },
})

export default CombinedFoodScreen
