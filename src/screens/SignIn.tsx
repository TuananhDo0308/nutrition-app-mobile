import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
 Text,
  View,
  Image,
} from "react-native";
import CustomButton from "../component/customButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";


import TextTouch from "../component/textTouch";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import CustomCheckbox from "../component/checkbox";

const SignIn = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const handleOnSubmit = () => {};

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? -100 : 0}
      >
        <View style={styles.container}>
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
          <View style={{ position: "absolute", left: 0, bottom: 0 }}>
            <Image style={{position: 'absolute', bottom: 0}} source={require("../Icon/BottomBack.png")} />
            <Image
              style={{ position: "absolute", bottom: 0 }}
              source={require("../Icon/BottomBackSmall.png")}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.titleContainer}>
              <Text style={{ fontSize: 25, fontWeight: "bold" }} className="text-blue-800">
                Welcome back
              </Text>
              <Text className="text-blue-200"  style={{ backgroundColor: theme.colors.primary }} >Login to your account</Text>
            </View>

            <View style={styles.inputSection}>
              <FontAwesome style={styles.icon} name="user-circle-o" size={20} color="black" />
              <TextInput
              
                style={styles.textInput}
                placeholder="Enter your email"
                onChangeText={setUserInfo}
              />
            </View>

            <View  style={styles.inputSection}>
              <Fontisto style={[styles.icon, { marginLeft: 17, marginRight: 17 }]} name="locked" size={20} color="black" />
              <TextInput 
                style={styles.textInput}
                placeholder="******"
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <FontAwesome5 style={styles.icon} name={isPasswordVisible ? "eye-slash" : "eye"} size={20} color="black" />
              </Pressable>
            </View>


            <CustomButton onPress={() => alert("pressed")} title={"Login"} />
          </View>

          <View style={styles.functionContainer}>
            <View style={styles.checkboxContainer}>
              <CustomCheckbox onPress={() => setRemember(!remember)} checked={remember}/>
              <Text>Remember me</Text>
            </View>
            <Text>Forget password ?</Text>
          </View>
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
    alignItems: "center",
    width: "100%",
  },

  titleContainer: {
    width: 300,
    marginBottom: 13,
  },

  inputContainer: {
    marginTop: 208,
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

  functionContainer: {
    width: 300,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  titleBottom: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default SignIn;
