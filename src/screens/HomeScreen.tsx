import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppSelector } from "../hooks/hook";
import { RootState } from "../store/store";
import { Icon, MD3Colors, ProgressBar } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import GradientBlurBackground from "../libs/background";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const user = useAppSelector((state: RootState) => state.user);
  return (
    <GradientBlurBackground>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView style={{ width: "100%" }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <View style={{ width: "90%" }}>
              <View style={{ paddingBottom: 26 }}>
                <View style={{ marginBottom: 36 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 35 }}>
                    Morning, {user?.name}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#85F193",
                    alignItems: "center",
                    borderRadius: 20,
                    marginBottom: 36,
                  }}
                >
                  <View style={{ width: "90%", marginVertical: 20 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Calories</Text>
                      <Text>{} 1.400 kcal left</Text>
                    </View>
                    <View style={{ justifyContent: "center" }}>
                      <ProgressBar
                        progress={0.5}
                        color={"#FFFFFF"}
                        style={{ height: 45, borderRadius: 15 }}
                      />
                      <View
                        style={{
                          position: "absolute",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 45,
                          width: 48,
                          borderRadius: 15,
                          backgroundColor: "#F4F4F4",
                        }}
                      >
                        <Icon
                          source={require("../Icon/milkBox.png")}
                          size={20}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap:20,
                    height: 160,
                    width: "100%",
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <View style={styles.ProgressCol}>
                      <ProgressBar
                        progress={1}
                        color={"#85F193"}
                        style={styles.ProgressBar}
                      />
                    </View>
                    <View style={{ position: "absolute" }}>
                      <View style={{ top: 10 }}>
                        <Text style={{ fontWeight: "bold", color: "#ffffff" }}>
                          Protein
                        </Text>
                      </View>
                      <View style={{ marginTop: 90, alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold" }}>132g{}</Text>
                        <Text>of 200g{}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <View style={styles.ProgressCol}>
                      <ProgressBar
                        progress={1}
                        color={"#85F193"}
                        style={styles.ProgressBar}
                      />
                    </View>
                    <View
                      style={{ position: "absolute", alignItems: "center" }}
                    >
                      <View style={{ top: 10 }}>
                        <Text style={{ fontWeight: "bold", color: "#ffffff" }}>
                          Cab
                        </Text>
                      </View>
                      <View style={{ marginTop: 90, alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold" }}>200g{}</Text>
                        <Text>of 200g{}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <View style={styles.ProgressCol}>
                      <ProgressBar
                        progress={1}
                        color={"#85F193"}
                        style={styles.ProgressBar}
                      />
                    </View>
                    <View
                      style={{ position: "absolute", alignItems: "center" }}
                    >
                      <View style={{ top: 10 }}>
                        <Text style={{ fontWeight: "bold", color: "#ffffff" }}>
                          Fat
                        </Text>
                      </View>
                      <View style={{ marginTop: 90, alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold" }}>10g{}</Text>
                        <Text>of 32g{}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 26,
                  }}
                >
                  <TouchableOpacity>
                    <Icon
                      source={require("../Icon/buttonleft.png")}
                      size={14}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text> Today, Jul 26</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon
                      source={require("../Icon/buttonright.png")}
                      size={14}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  borderRadius: 20,
                  backgroundColor: "#232323",
                  padding: 17,
                  justifyContent: "space-between",
                  height: 191,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    <Icon source={require("../Icon/breakfast.png")} size={30} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginLeft: 10,
                        color: "#85F193",
                      }}
                    >
                      Breakfast
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: "#85F193" }}>{}550 </Text>
                    <Text style={{ color: "#85F193" }}>kcal</Text>
                  </View>
                </View>
                <View
                  style={{
                    borderRadius: 20,
                    backgroundColor: "#343434",
                    padding: 15,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "#ffffff" }}>egg, chicken, {}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ color: "#ffffff" }}>{}440 </Text>
                      <Text style={{ color: "#ffffff" }}>kcal</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "#ffffff" }}>Coffee {}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ color: "#ffffff" }}>{}100 </Text>
                      <Text style={{ color: "#ffffff" }}>kcal</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBlurBackground>
  );
};

const styles = StyleSheet.create({
  ProgressCol: {
    width: 91,
    height: 160,
    overflow: "hidden",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  ProgressBar: {
    height: 160,
    borderRadius: 15,
  },
  ProgressText: {
    position: "absolute",
    justifyContent: "space-between",
  },
});

export default HomeScreen;
