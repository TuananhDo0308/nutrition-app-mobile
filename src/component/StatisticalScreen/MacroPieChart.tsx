"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing } from "react-native"
import { useTheme } from "react-native-paper"
import Svg, { Circle, Path, G } from "react-native-svg"

interface MacroData {
  name: string
  value: number
  color: string
}

interface MacroPieChartProps {
  data: MacroData[]
}

const MacroPieChart: React.FC<MacroPieChartProps> = ({ data }) => {
  const theme = useTheme()
const  color=  [  "#85F193" , "#FFD700" , "#4682B4" ,]
  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Calculate the angles for each segment
  let startAngle = 0
  const segments = data.map((item) => {
    const angle = (item.value / total) * 360
    const segment = {
      startAngle,
      endAngle: startAngle + angle,
      color: item.color,
      name: item.name,
      value: item.value,
    }
    startAngle += angle
    return segment
  })

  useEffect(() => {
    // Animate when component mounts
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Function to create SVG arc path
  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = (startAngle - 90) * (Math.PI / 180)
    const endRad = (endAngle - 90) * (Math.PI / 180)

    const x1 = radius + radius * Math.cos(startRad)
    const y1 = radius + radius * Math.sin(startRad)
    const x2 = radius + radius * Math.cos(endRad)
    const y2 = radius + radius * Math.sin(endRad)

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }

  // Calculate rotation for animation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
        MACROS
      </Text>

      <View style={styles.chartContainer}>
        <Animated.View
          style={{
            transform: [{ rotate: spin }, { scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <Svg width={100} height={100} viewBox="0 0 100 100">
            <G>
              {segments.map((segment, index) => (
                <Path key={index} d={createArc(segment.startAngle, segment.endAngle, 50)} fill={color[index]} />
              ))}
              <Circle cx="50" cy="50" r="30" fill={theme.dark ? "#2A2A2A" : "#FFFFFF"} />
            </G>
          </Svg>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.legend,
          {
            opacity: opacityAnim,
            transform: [
              {
                translateY: opacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: color[index] }]} />
            <Text
              style={[
                styles.legendText,
                {
                  color: theme.colors.secondary,
                  fontFamily: "Montserrat_500Medium",
                },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.legendValue,
                {
                  color: color[index],
                  fontFamily: "Montserrat_600SemiBold",
                },
              ]}
            >
              {item.value}%
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    width: "40%",
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  chartContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  colorBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    flex: 1,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default MacroPieChart
