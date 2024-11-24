import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, Image } from "react-native";
import CustomButton from "../component/customButton";
import TextTouch from "../component/textTouch";

import { NavigationProp, useNavigation } from "@react-navigation/native";
import GradientBlurBackground from "../libs/background";
import { SafeAreaView } from "react-native-safe-area-context";

const Start = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={{ position: "absolute", top: 200, left: 50, width: 167 }}>
          <Text style={{ fontSize: 30 }}>Food</Text>
          <Text style={{ fontSize: 30 }}>Logo</Text>
        </View>
        <View style={{ position: "absolute", right: -20, top: 0 }}>
          <View>
            <Image
              style={{ position: "absolute", right: 0 }}
              source={require("../Icon/TopBack.png")}
            />
          </View>
          <View>
            <Image
              style={{ position: "absolute", top: 120, right: 0 }}
              source={require("../Icon/TopBackSmall.png")}
            />
          </View>
          <View>
            <Image
              style={{ top: 225 }}
              source={require("../Icon/TopBackCircle.png")}
            />
          </View>
        </View>
        <View>
          <CustomButton
            onPress={() => navigation.navigate("heightQuiz")}
            title={"Get Started"}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.text}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text>By counting You are accepting our</Text>
          <TextTouch
            onPress={() => alert("pressed")}
            title="Term of use & Privacy Policy"
            TextStyle={{ fontWeight: "bold" }}
          />
        </View>
        <StatusBar />
      </SafeAreaView>
    </GradientBlurBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStyle: {
    width: 300,
    height: 60,
    backgroundColor: "#FFF6D6",
    marginTop: 600,
    alignSelf: "center",
  },
  text: {
    marginTop: 8,
    fontSize: 20,
  },
});

export default Start;
