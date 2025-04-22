import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import Svg, { Circle, Path } from "react-native-svg"

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

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={80} height={80} viewBox="0 0 100 100">
          {segments.map((segment, index) => (
            <Path key={index} d={createArc(segment.startAngle, segment.endAngle, 50)} fill={segment.color} />
          ))}
          <Circle cx="50" cy="50" r="30" fill={theme.dark ? "#2A2A2A" : "#FFFFFF"} />
        </Svg>
      </View>

      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text
              style={[
                styles.legendText,
                {
                  color: item.color,
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
                  color: theme.colors.secondary,
                  fontFamily: "Montserrat_600SemiBold",
                },
              ]}
            >
              {item.value}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
  },
  chartContainer: {
    width: 80,
    height: 80,
  },
  legend: {
    marginLeft: 16,
    flex: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    marginRight: 8,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default MacroPieChart
