import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from 'react-native-paper';
import { useAppSelector } from '../../hooks/hook';

interface GradientBlurBackgroundProps {
  children?: React.ReactNode;
  xOffset?: number;
  yOffset?: number;
}

const GradientBlurBackground: React.FC<GradientBlurBackgroundProps> = ({
  children,
  xOffset = 150,
  yOffset = -100,
}) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.theme?.isDarkMode);

  // Xác định màu nền và blur type dựa trên chế độ dark/light mode
  const backgroundColor = theme.colors.background;
  const blurType = isDarkMode ? 'dark' : 'light';
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <>
      {/* Thanh trạng thái tự đổi màu dựa trên chế độ dark/light */}
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />

        <KeyboardAvoidingView
          style={[styles.container, { backgroundColor }]}
        >
          <Image
            source={require('../../Icon/temp.png')}
            style={[
              styles.image,
              {
                transform: [{ translateX: xOffset }, { translateY: yOffset }],
              },
            ]}
          />

          {/* Sử dụng BlurView từ expo-blur */}
          <View style={styles.contentContainer}>
            <BlurView
              style={StyleSheet.absoluteFill}
              intensity={100}
              tint={blurType}
            />
            <View
            style={
              {
                flex:1
              }
            }
            >

            {children}

            </View>
          </View>
        </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
    
  },
  contentContainer: {
    flex:1,
    ...StyleSheet.absoluteFillObject, // Makes contentContainer cover the entire screen
  },
});

export default GradientBlurBackground;
