"use client"

import { useRef, useState, useEffect } from "react"
import { Animated, TouchableWithoutFeedback, StyleSheet, View, ActivityIndicator, Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as MediaLibrary from "expo-media-library" // Để xử lý URI dạng ph:// trên iOS
import * as ImageManipulator from "expo-image-manipulator" // Để chuyển đổi ảnh sang JPEG
import * as Haptics from "expo-haptics"
import { useTheme } from "react-native-paper"
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg"
import axios from "axios"
import { useAppSelector } from "../../hooks/hook"
import { apiLinks } from "../../utils"

const CustomCenterIcon = ({ navigation }: any) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const token = useAppSelector((state) => state.user?.token)

  // Start pulse animation when component mounts
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )

    pulseAnimation.start()

    return () => {
      pulseAnimation.stop()
    }
  }, [])

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start()

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start()

    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      openCamera()
    })
  }

  // Open the device camera and handle the photo
  const openCamera = async () => {
    // Request camera permission
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
    if (cameraStatus !== "granted") {
      alert("Permission Denied", "Camera access is required to take pictures.")
      return
    }

    // Request media library permission (needed for allowsEditing on iOS)
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync()
    if (mediaStatus !== "granted") {
      alert("Permission Denied", "Media library access is required to save and edit photos.")
      return
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      let photoUri = result.assets[0].uri
      console.log("Original Photo URI:", photoUri)

      // On iOS, if URI starts with ph://, convert to file://
      if (Platform.OS === "ios" && photoUri.startsWith("ph://")) {
        const asset = await MediaLibrary.createAssetAsync(photoUri)
        photoUri = asset.uri
        console.log("Converted Photo URI (ph:// to file://):", photoUri)
      }

      // Convert the image to JPEG
      const convertedUri = await convertToJpeg(photoUri)
      console.log("Converted JPEG URI:", convertedUri)

      uploadPhoto(convertedUri, photoUri) // Pass both converted URI and original URI
    }
  }

  // Convert image to JPEG using expo-image-manipulator
  const convertToJpeg = async (uri: string) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [], // No resizing or other manipulations
        {
          compress: 0.8, // Compress to reduce file size (0 to 1)
          format: ImageManipulator.SaveFormat.JPEG, // Convert to JPEG
        },
      )
      return manipulatedImage.uri
    } catch (error) {
      console.error("Error converting image to JPEG:", error)
      throw new Error("Failed to convert image to JPEG")
    }
  }

  // Upload photo to API and get food list
  const uploadPhoto = async (convertedUri: string, originalUri: string) => {
    try {
      setLoading(true)

      // Start loading animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start()

      // Create FormData for image upload
      const formData = new FormData()
      formData.append("image", {
        uri: convertedUri, // Use the converted JPEG URI
        type: "image/jpeg", // Ensure type is JPEG
        name: "photo.jpg", // File name for backend
      } as any)

      // Debug FormData content (Note: FormData can't be logged directly, this is a workaround)
      console.log("FormData content:", {
        uri: convertedUri,
        type: "image/jpeg",
        name: "photo.jpg",
      })

      // Make the actual API call
      const response = await axios.post(apiLinks.food.postAi, formData, {
        headers: {
          Accept: "*/*",
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })

      console.log("Food list from API:", response.data)

      // Provide success haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      // Navigate to FoodList screen with the data and original photo URI
      if (navigation) {
        navigation.navigate("FoodList", {
          foodData: response.data.food_masses_gram,
          photoUri: originalUri, // Pass the original URI for display if needed
        })
      }
    } catch (error: any) {
      console.error("Error uploading photo:", error)
      console.error("Error details:", error.response?.data || error.message)
      alert("Upload Failed", "There was an error uploading the photo. Please try again.")

      // Provide error haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setLoading(false)
      // Stop rotation animation
      rotateAnim.setValue(0)
    }
  }

  // Calculate rotation for animation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={loading}>
      <View style={styles.centerIconContainer}>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: loading ? pulseAnim : scaleAnim }, { rotate: spin }],
              opacity: loading ? 0.7 : 1,
            },
          ]}
        >
          <Svg width={60} height={60} viewBox="0 0 60 60" fill="none">
            <Defs>
              <LinearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={theme.colors.primary} />
                <Stop offset="100%" stopColor={`${theme.colors.primary}80`} />
              </LinearGradient>
            </Defs>
            <Circle
              cx="30"
              cy="30"
              r="28"
              fill={theme.dark ? "#2E2E2E" : "#F5F5F5"}
              stroke="url(#buttonGradient)"
              strokeWidth={3}
            />
            <Path
              d="M22 26V23.5C22 23.1022 22.158 22.7206 22.4393 22.4393C22.7206 22.158 23.1022 22 23.5 22H26M22 35V37.5C22 37.8978 22.158 38.2794 22.4393 38.5607C22.7206 38.842 23.1022 39 23.5 39H26M39 26V23.5C39 23.1022 38.842 22.7206 38.5607 22.4393C38.2794 22.158 37.8978 22 37.5 22H35M39 35V37.5C39 37.8978 38.842 38.2794 38.5607 38.5607C38.2794 38.842 37.8978 39 37.5 39H35"
              stroke="url(#buttonGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default CustomCenterIcon

const styles = StyleSheet.create({
  centerIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: 70,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingIndicator: {
    position: "absolute",
    zIndex: 1,
  },
})
