import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import Svg, { Circle, G } from "react-native-svg"

interface CaloriesCircleProps {
  current: number
  goal: number
}

const CaloriesCircle: React.FC<CaloriesCircleProps> = ({ current, goal }) => {
  const theme = useTheme()

  // Calculate the percentage of the goal achieved
  const percentage = current / goal

  // Circle properties
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference * (1 - percentage)

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.dark ? "#444444" : "#EEEEEE"}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.primary}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.valueText,
            {
              color: theme.colors.secondary,
              fontFamily: "Montserrat_700Bold",
            },
          ]}
        >
          0.000
        </Text>
        <Text
          style={[
            styles.labelText,
            {
              color: theme.colors.secondary,
              opacity: 0.6,
              fontFamily: "Montserrat_500Medium",
            },
          ]}
        >
          UNDER
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
  },
  valueText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  labelText: {
    fontSize: 12,
    marginTop: 4,
  },
})

export default CaloriesCircle
