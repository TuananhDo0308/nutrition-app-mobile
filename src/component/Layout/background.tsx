"use client"

import type React from "react"
import { View, StyleSheet, Image, KeyboardAvoidingView, StatusBar, type ImageSourcePropType } from "react-native"
import { BlurView } from "expo-blur"
import { useTheme } from "react-native-paper"
import { useAppSelector } from "../../hooks/hook"

// Import all theme background images
const themeBackgrounds: Record<string, ImageSourcePropType> = {
  green: require("../../Icon/backgrounds/green-bg.png"),
  blue: require("../../Icon/backgrounds/blue-bg.png"),
  purple: require("../../Icon/backgrounds/purple-bg.png"),
  pink: require("../../Icon/backgrounds/pink-bg.png"),
  // Default fallback image
  default:  require("../../Icon/backgrounds/green-bg.png"),
}

interface GradientBlurBackgroundProps {
  children?: React.ReactNode
  xOffset?: number
  yOffset?: number
}

const GradientBlurBackground: React.FC<GradientBlurBackgroundProps> = ({ children, xOffset = 150, yOffset = -100 }) => {
  const theme = useTheme()
  const isDarkMode = useAppSelector((state) => state.theme?.isDarkMode)
  const themeColor = useAppSelector((state) => state.theme?.themeColor) || "green"

  // Determine background color and blur type based on dark/light mode
  const backgroundColor = theme.colors.background
  const blurType = isDarkMode ? "dark" : "light"
  const statusBarStyle = isDarkMode ? "light-content" : "dark-content"

  // Select the appropriate background image based on theme color
  const backgroundImage = themeBackgrounds[themeColor] || themeBackgrounds.default

  return (
    <>
      {/* Status bar that changes color based on dark/light mode */}
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />

      <KeyboardAvoidingView style={[styles.container, { backgroundColor }]}>
        <Image
          source={backgroundImage}
          style={[
            styles.image,
            {
              transform: [{ translateX: xOffset }, { translateY: yOffset }],
            },
          ]}
        />

        {/* Use BlurView from expo-blur */}
        <View style={styles.contentContainer}>
          <BlurView style={StyleSheet.absoluteFill} intensity={100} tint={blurType} />
          <View style={{ flex: 1 }}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject, // Makes contentContainer cover the entire screen
  },
})

export default GradientBlurBackground
