"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, Animated, Easing, TouchableOpacity } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

interface WeightDataPoint {
  date: string
  value: number
}

interface WeightGraph {
  current: number,
  change: number,
  data: WeightDataPoint[]
}
interface WeightGraphProps {

  data: WeightGraph
}


const WeightGraph: React.FC<WeightGraphProps> = ({ data }) => {
  const theme = useTheme()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  // Extract values and labels for the chart
  const values = data.data.map((item) => item.value)
  const labels = data.data.map((item) => item.date.split(" ")[0])

  // Calculate weight change
  const currentWeight = data.current

  useEffect(() => {
    // Animate when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
            WEIGHT
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondary, opacity: 0.6 }]}>Last 7 days</Text>
        </View>
        <View style={styles.weightInfo}>
          <Text style={[styles.currentWeight, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
            {currentWeight} kg
          </Text>
          <View style={styles.changeContainer}>
            <Ionicons
              name={(data.change) > 0 ? "arrow-up" : "arrow-down"}
              size={16}
              color={(data.change) > 0 ? "#FF3B30" : theme.colors.primary}
            />
            <Text
              style={[
                styles.weightChange,
                {
                  color: (data.change) > 0 ? "#FF3B30" : theme.colors.primary,
                  fontFamily: "Montserrat_500Medium",
                },
              ]}
            >
              {Math.abs(data.change)} kg
            </Text>
          </View>
        </View>
      </View>

      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: values,
              color: (opacity = 1) => theme.colors.primary,
              strokeWidth: 3,
            },
          ],
        }}
        width={Dimensions.get("window").width - 64} // Accounting for padding
        height={180}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
          backgroundGradientFrom: theme.dark ? "#2A2A2A" : "#FFFFFF",
          backgroundGradientTo: theme.dark ? "#2A2A2A" : "#FFFFFF",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(${theme.dark ? "133, 241, 147" : "122, 216, 134"}, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(${theme.dark ? "255, 255, 255" : "30, 30, 30"}, ${opacity * 0.6})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: theme.colors.primary,
            fill: theme.dark ? "#2A2A2A" : "#FFFFFF",
          },
          propsForBackgroundLines: {
            stroke: theme.colors.secondary,
            strokeDasharray: "5, 5",
            strokeOpacity: 0.2,
          },
        }}
        bezier
        style={{
          marginVertical: 16,
          borderRadius: 16,
        }}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={() => console.log("Record weight pressed")}
        activeOpacity={0.8}
      >
        <Ionicons name="add-outline" size={18} color="#000000" style={styles.buttonIcon} />
        <Text style={[styles.buttonText, { fontFamily: "Montserrat_600SemiBold" }]}>Record weight</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Montserrat_400Regular",
  },
  weightInfo: {
    alignItems: "flex-end",
  },
  currentWeight: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightChange: {
    fontSize: 14,
    marginLeft: 2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 14,
  },
})

export default WeightGraph
