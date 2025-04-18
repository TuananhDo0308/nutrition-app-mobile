import { transform } from "@babel/core";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import GradientBlurBackground from "../../component/Layout/background";
import { Button, ProgressBar, useTheme } from "react-native-paper";
import { useAppDispatch } from "../../hooks/hook";
import { toggleTheme } from "../../slices/uiSlice/themeMode";


const { width, height } = Dimensions.get("window");
const ITEM_SIZE = width * 0.1;
const ITem_SPACING = (width - ITEM_SIZE) / 2;


const HeightQuiz = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [weightInfo, setWeightInfo] = useState(0);
  const data = Array.from({ length: 300 }, (_, i) => i);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newWeight = Math.round(offsetX / ITEM_SIZE);
    setWeightInfo(newWeight);
  };
  return (
    <GradientBlurBackground>
      {/* Container */}
      <View style={{flex: 1 }}>
        <View style={{ marginTop: 100, alignItems: 'center' }}>
        <ProgressBar progress={0.1} color={"blue"} style={{ width: 200 }}/>
        </View>
        {/* Text */}
        <View style={{ alignItems: 'center', marginVertical: 50 }}>
          <Text style={{ fontSize: 25, color: theme.colors.secondary, fontWeight: 'bold' }}>What's your current</Text>
          <Text style={{ fontSize: 25, color: theme.colors.secondary, fontWeight: 'bold' }}>weight right now ?</Text>
        </View>
        {/* Container FlatList */}
        <View style={{ marginVertical: 100 }}>
          {/* display number */}
          <View
            style={{
              marginLeft: ITEM_SIZE * 3 - 50,
              width: 100,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.colors.secondary, fontSize: 30 }}>{weightInfo}kg</Text>
          </View>
          {/* Horizontal ruler */}
          <Animated.FlatList
            data={data}
            keyExtractor={(item) => item.toString()}
            style={{ height: 100 }}
            horizontal
            onScroll={handleScroll}
            /*onMomentumScrollEnd={ev => {
              const index = Math.round(ev.nativeEvent.contentOffset.x / ITEM_SIZE);
              setWeightInfo(data[index]);
            }}*/
            bounces={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_SIZE}
            decelerationRate={"fast"}
            renderItem={({ item }) => {
              return (
                <View style={{ justifyContent: "center", width: ITEM_SIZE }}>
                  <Animated.View
                    style={[styles.line, item % 5 == 0 && { height: 70 } ]}
                  />
                </View>
              );
            }}
          />
        </View>
        {/* Button container */}
        <View style={{ padding: 50 }}>
          <Button
              mode="contained"
              onPress={() => dispatch(toggleTheme())}
              labelStyle={{
                fontFamily: "Montserrat_700Bold",
                fontSize: 18,
                color: theme.colors.background,
              }}
            >
              Continue
          </Button>
        </View>
      </View>
    </GradientBlurBackground>
  );
};

const styles = StyleSheet.create({
  line: {
    width: 2,
    height: 40,
    backgroundColor: "#000",
  },
});

export default HeightQuiz;
