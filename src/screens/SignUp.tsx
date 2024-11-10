import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Pressable,
  Image,
} from "react-native";
import CustomButton from "../component/customButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import TextTouch from "../component/textTouch";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const SignUp = () => {

  const navigation: NavigationProp<RootStackParamList> = useNavigation();


  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswoedVisible, setIsPasswordVisible] = useState(false);
  const handleOnSubmit = () => {
    alert(user);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? -100 : 0} // Thêm `keyboardVerticalOffset` cho Android
      >
        <View style={styles.innerContainer}>
        <View style={{ position: "absolute", right: 0, top: -50 }}>
            <Image
              style={{ right: -20 }}
              source={require("../Icon/TopBack.png")}
            />
            <Image
              style={{ position: "absolute", right: 0, top: 120 }}
              source={require("../Icon/TopBackSmall.png")}
            />
          </View>
          <View style={{ position: "absolute", left: -30, bottom: -30 }}>
            <Image style={{position: 'absolute', bottom: 0}} source={require("../Icon/BottomBack.png")} />
            <Image
              style={{ position: "absolute", bottom: 0 }}
              source={require("../Icon/BottomBackSmall.png")}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.titleContainer}>
              <Text
                style={{ fontSize: 25, fontWeight: "bold", color: "#62C998" }}
              >
                Register
              </Text>
              <Text style={{ fontSize: 20 }}>Create your own account</Text>
            </View>

            <View style={styles.inputSection}>
              <FontAwesome
                style={styles.icon}
                name="user-circle-o"
                size={20}
                color="black"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                value={user}
                onChangeText={setUser}
              />
            </View>

            <View style={styles.inputSection}>
              <Fontisto
                style={[styles.icon, { marginLeft: 17, marginRight: 17 }]}
                name="locked"
                size={20}
                color="black"
              />
              <TextInput
                style={styles.textInput}
                placeholder="******"
                secureTextEntry={!isPasswoedVisible}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setIsPasswordVisible(!isPasswoedVisible)}>
                <FontAwesome5
                  style={styles.icon}
                  name={isPasswoedVisible ? "eye-slash" : "eye"}
                  size={20}
                  color="black"
                />
              </Pressable>
            </View>

            <CustomButton onPress={handleOnSubmit} title={"Sign up"} />
          </View>
        </View>

        {/* Giữ nội dung này cố định ở dưới */}
        <View style={styles.titleBottom}>
          <Text style={{ color: "#000" }}>Have an account already?</Text>
          <TextTouch
            title=" Login"
            onPress={() => navigation.navigate("signIn")}
            TextStyle={{ color: "#62C998" }}
          />
        </View>

        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 70,
  },

  titleContainer: {
    width: 300,
    marginBottom: 13,
  },

  inputContainer: {
    alignItems: "center",
  },

  icon: {
    margin: 7,
    marginLeft: 15,
    marginRight: 15,
  },

  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    width: 300,
    height: 45,
    marginBottom: 7,
    marginTop: 7,
  },

  textInput: {
    flex: 1,
  },

  titleBottom: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
  },
});

export default SignUp;
