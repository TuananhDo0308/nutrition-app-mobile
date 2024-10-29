import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text } from "react-native";
import CustomButton from "../component/customButton";
import TextTouch from "../component/textTouch";
import { useNavigation } from "@react-navigation/native";

const Start = ({ navigation }) => {


  return (
    <View style={styles.Container}>
      <View style={{ position: "absolute", top: 200, left: 50, width: 167}}>
        <Text style={{ fontSize: 30 }}>Food</Text>
        <Text style={{ fontSize: 30 }}>Logo</Text>
      </View>
      <View>
        <CustomButton
          onPress={() => navigation.navigate("signIn")}
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
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
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
