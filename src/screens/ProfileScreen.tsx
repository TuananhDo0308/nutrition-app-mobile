import React from "react";
import { StyleSheet, FlatList, Text, View } from "react-native";
import GradientBlurBackground from "../libs/background";
import { SafeAreaView } from "react-native-safe-area-context";

const fakeData = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}: This is a sample text entry.`);

const ProfileScreen = () => {
  return (
    <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <FlatList
          data={fakeData}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.contentContainer}
        />
      </SafeAreaView>
    </GradientBlurBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemContainer: {
    backgroundColor: "#85F193", // Màu nền cho mỗi mục
    padding: 16,
    marginVertical: 8,
    borderRadius: 8, // Bo góc cho nền
  },
  text: {
    fontSize: 16,
    color: "#00796B", // Màu văn bản
  },
});
