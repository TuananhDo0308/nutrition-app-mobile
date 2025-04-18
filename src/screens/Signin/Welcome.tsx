import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, Image } from "react-native";
import { useTheme } from "react-native-paper";
import CustomButton from "../../component/ui/customButton";
import TextTouch from "../../component/ui/textTouch";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import GradientBlurBackground from "../../component/Layout/background";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  signIn: undefined;
};

const Start = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();

  return (
    <GradientBlurBackground xOffset={50} yOffset={50}>
      <SafeAreaView style={styles.safeArea}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Text style={[styles.logoText, { color: theme.colors.primary }]}>
            Food
          </Text>
          <Text style={[styles.logoText, { color: theme.colors.primary }]}>
            Delight
          </Text>
        </View>


        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: theme.colors.secondary }]}>
            Discover Delicious Meals
          </Text>
          <Text style={[styles.subtitleText, { color: theme.colors.tertiary }]}>
            Your culinary journey starts here
          </Text>
        </View>

        {/* Button */}
        <CustomButton
          onPress={() => navigation.navigate("signIn")}
          title="Get Started"
          buttonStyle={styles.buttonStyle}
          textStyle={styles.buttonText}
        />

        {/* Terms Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.tertiary }]}>
            By continuing you accept our
          </Text>
          <TextTouch
            onPress={() => alert("Terms & Privacy Policy pressed")}
            title="Terms of Use & Privacy Policy"
            TextStyle={[styles.termsText, { color: theme.colors.primary }]}
            

          />
        </View>

        <StatusBar style="light" />
      </SafeAreaView>
    </GradientBlurBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: "15%",
    left: "10%",
  },
  logoText: {
    fontSize: 36,
    fontFamily: "Montserrat_900Black",
    fontWeight: "bold",
    lineHeight: 40,
  },
  imageContainer: {
    position: "absolute",
    right: -20,
    top: 0,
  },
  topImage: {
    width: 150,
    height: 150,
    position: "absolute",
    right: 0,
  },
  smallImage: {
    width: 80,
    height: 80,
    position: "absolute",
    top: 120,
    right: 0,
  },
  circleImage: {
    width: 200,
    height: 200,
    position: "absolute",
    top: 225,
    right: 0,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
  buttonStyle: {
    width: "80%",
    maxWidth: 320,
    backgroundColor: "#FFF6D6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    color: "#333",
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  termsText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    textDecorationLine: "underline",
  },
});

export default Start; 