import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomIcon from "../../Icon/CameraIcon/Group";
import * as Haptics from "expo-haptics"

const CustomCenterIcon = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      openCamera();
    });
  };

  // Open the device camera
  const openCamera = async () => {
    // Request permission to use the camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required to take pictures.");
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Photo URI:", result.assets[0].uri); // Log the photo URI or use it as needed
    }
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.centerIconContainer, { transform: [{ scale: scaleAnim }] }]}>
        <CustomIcon />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CustomCenterIcon;

const styles = StyleSheet.create({
  centerIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
