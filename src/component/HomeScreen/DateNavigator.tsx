// components/DateNavigator.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, useTheme } from "react-native-paper";

interface DateNavigatorProps {
  date: string;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ date }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Icon source={require("../../Icon/buttonleft.png")} size={14} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={[styles.date, { color: theme.colors.secondary }]}>
          {date}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon source={require("../../Icon/buttonright.png")} size={14} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 26,
    width: "100%",
  },
  date: {
    fontSize: 16,
  },
});

export default DateNavigator;