import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const Notepad = () => {
  // Generate an array of random text entries
  const randomContent = Array.from({ length: 50 }, (_, i) => `Random entry ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {randomContent.map((entry, index) => (
          <Text key={index} style={styles.textEntry}>
            {entry}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  textEntry: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
});

export default Notepad;
