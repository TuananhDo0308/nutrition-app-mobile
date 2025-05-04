"use client"

import { useRef } from "react"
import { Animated, TouchableWithoutFeedback, StyleSheet } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Haptics from "expo-haptics"
import { useTheme } from "react-native-paper"
import Svg, { Circle, Path } from "react-native-svg"

const CustomCenterIcon = ({ navigation }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const theme = useTheme()

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start()
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      openCamera()
    })
  }

  // Open the device camera and handle the photo
  const openCamera = async () => {
    // Request permission to use the camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      alert("Permission Denied")
      return
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      const photoUri = result.assets[0].uri
      console.log("Photo URI:", photoUri)
      uploadPhoto(photoUri) // Gọi hàm upload ảnh
    }
  }

  // Upload photo to API and get food list
  const uploadPhoto = async (uri: string) => {
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        // Mock API response
        const mockResponse = {
          food_masses_gram: [
            { food: "rice", mass: 258 },
            { food: "pork", mass: 258 },
            { food: "cucumber", mass: 1109 },
            { food: "carrot", mass: 25 },
          ],
        }

        console.log("Food list from API:", mockResponse.food_masses_gram)

        // Navigate to FoodList screen with the data
        if (navigation) {
          navigation.navigate("FoodList", {
            foodData: mockResponse.food_masses_gram,
          })
        }
      }, 1500) // Simulate network delay
    } catch (error) {
      console.error("Error uploading photo:", error)
      alert("Upload Failed")
    }
  }

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.centerIconContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Svg width={51} height={51} viewBox="0 0 51 51" fill="none">
          <Circle
            cx="25.5"
            cy="25.5"
            r="25"
            fill={theme.dark ? "#2E2E2E" : "#F5F5F5"}
            stroke={theme.colors.primary}
            strokeWidth={2}
          />
          <Path
            d="M19.2667 22.4051V20.3128C19.2667 20.0353 19.3769 19.7692 19.5731 19.573C19.7693 19.3768 20.0354 19.2666 20.3128 19.2666H22.4051M19.2667 29.7281V31.8204C19.2667 32.0979 19.3769 32.364 19.5731 32.5602C19.7693 32.7564 20.0354 32.8666 20.3128 32.8666H22.4051M32.8667 22.4051V20.3128C32.8667 20.0353 32.7564 19.7692 32.5603 19.573C32.3641 19.3768 32.098 19.2666 31.8205 19.2666H29.7282M32.8667 29.7281V31.8204C32.8667 32.0979 32.7564 32.364 32.5603 32.5602C32.3641 32.7564 32.098 32.8666 31.8205 32.8666H29.7282"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default CustomCenterIcon

const styles = StyleSheet.create({
  centerIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
})
