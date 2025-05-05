"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"
import { useTheme } from "react-native-paper"

interface SkeletonLoaderProps {
  width: number | string
  height: number | string
  borderRadius?: number
  style?: object
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ width, height, borderRadius = 8, style = {} }) => {
  const theme = useTheme()
  const shimmerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    )

    shimmerAnimation.start()

    return () => {
      shimmerAnimation.stop()
    }
  }, [])

  const shimmerColors = theme.dark ? ["#333333", "#444444", "#333333"] : ["#EEEEEE", "#DDDDDD", "#EEEEEE"]

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  })

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.dark ? "#333333" : "#EEEEEE",
          ...style,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
            backgroundColor: theme.dark ? "#444444" : "#DDDDDD",
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
})

export default SkeletonLoader
