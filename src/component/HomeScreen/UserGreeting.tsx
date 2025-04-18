// components/UserGreeting.tsx
import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface UserGreetingProps {
  name: string;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ name }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
    <Text style={[styles.text, { color: theme.colors.secondary }]}>
      Morning, {name}
    </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 35,
    marginBottom: 36,
  },
  container: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default UserGreeting;