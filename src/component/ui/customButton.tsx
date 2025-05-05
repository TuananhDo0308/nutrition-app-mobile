import type React from "react"
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"

interface CustomButtonProps {
  onPress: () => void
  title: string
  buttonStyle?: ViewStyle
  textStyle?: TextStyle
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title, buttonStyle, textStyle }) => (
  <TouchableOpacity onPress={onPress} style={StyleSheet.flatten([styles.CustomButtonContainer, buttonStyle])}>
    <Text style={StyleSheet.flatten([styles.CustomButtonText, textStyle])}>{title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  CustomButtonContainer: {
    borderRadius: 50,
    width: 300,
    height: 50,
    backgroundColor: "#62C998",
    alignItems: "center",
    justifyContent: "center", // Add this to center text vertically
    marginTop: 8,
  },
  CustomButtonText: {
    // Remove flex: 1 which was causing issues
    // Remove paddingTop which was pushing text out of view
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#FFFFFF", // Explicitly set text color
  },
})

export default CustomButton
