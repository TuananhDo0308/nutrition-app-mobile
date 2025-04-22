import type React from "react"
import { View, StyleSheet } from "react-native"

interface VerticalProgressBarProps {
  progress: number
  color: string
  height?: number
  width?: number
  borderRadius?: number
  backgroundColor?: string
}

const VerticalProgressBar: React.FC<VerticalProgressBarProps> = ({
  progress,
  color,
  height = 160,
  width = 91,
  borderRadius = 15,
  backgroundColor = "rgba(0, 0, 0,1)",
}) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1)

  // Calculate the height of the filled portion
  const fillHeight = height * clampedProgress

  return (
    <View style={[styles.container, { height, width, borderRadius, backgroundColor }]}>
      <View
        style={[
          styles.fill,
          {
            height: fillHeight,
            backgroundColor: color,
            borderRadius,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  fill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
})

export default VerticalProgressBar
