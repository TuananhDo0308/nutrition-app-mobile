import type React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { Button, useTheme } from "react-native-paper"

interface WeightDataPoint {
  date: string
  value: number
}

interface WeightGraphProps {
  data: WeightDataPoint[]
}

const WeightGraph: React.FC<WeightGraphProps> = ({ data }) => {
  const theme = useTheme()

  // Extract values and labels for the chart
  const values = data.map((item) => item.value)
  const labels = data.map((item) => item.date.split(" ")[0])

  // Calculate weight change
  const weightChange = (data[0].value - data[data.length - 1].value).toFixed(1)
  const currentWeight = data[data.length - 1].value

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
          WEIGHT
        </Text>
        <View style={styles.weightInfo}>
          <Text style={[styles.currentWeight, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}>
            {currentWeight}kgs
          </Text>
          <Text style={[styles.weightChange, { color: theme.colors.primary, fontFamily: "Montserrat_500Medium" }]}>
            ↓{weightChange}kgs
          </Text>
        </View>
      </View>

      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: values,
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
            fill: theme.colors.primary,
          },
          propsForBackgroundLines: {
            stroke: theme.colors.secondary,
            strokeDasharray: "5, 5",
            strokeOpacity: 0.2,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
      />

      <Button
        mode="contained"
        onPress={() => console.log("Record weight pressed")}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        labelStyle={[styles.buttonText, { fontFamily: "Montserrat_500Medium" }]}
      >
        Record weight
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  weightInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentWeight: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  weightChange: {
    fontSize: 14,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 4,
    alignSelf: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 14,
  },
})

export default WeightGraph
