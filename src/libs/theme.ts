import {
  MD3LightTheme as PaperLightTheme,
  MD3DarkTheme as PaperDarkTheme,
  configureFonts,
} from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { useAppSelector } from '../hooks/hook';

const fontConfig = {
  default: {
    thin: {
      fontFamily: 'Montserrat_100Thin',
      fontWeight: '100',
      letterSpacing: 0.5,
      lineHeight: 20,
      fontSize: 12,
      fontStyle: 'normal',
    },
    extraLight: {
      fontFamily: 'Montserrat_200ExtraLight',
      fontWeight: '200',
      letterSpacing: 0.5,
      lineHeight: 20,
      fontSize: 12,
      fontStyle: 'normal',
    },
    light: {
      fontFamily: 'Montserrat_300Light',
      fontWeight: '300',
      letterSpacing: 0.5,
      lineHeight: 22,
      fontSize: 14,
      fontStyle: 'normal',
    },
    regular: {
      fontFamily: 'Montserrat_400Regular',
      fontWeight: '400',
      letterSpacing: 0.5,
      lineHeight: 24,
      fontSize: 14,
      fontStyle: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat_500Medium',
      fontWeight: '500',
      letterSpacing: 0.5,
      lineHeight: 26,
      fontSize: 16,
      fontStyle: 'normal',
    },
    semiBold: {
      fontFamily: 'Montserrat_600SemiBold',
      fontWeight: '600',
      letterSpacing: 0.5,
      lineHeight: 28,
      fontSize: 18,
      fontStyle: 'normal',
    },
    bold: {
      fontFamily: 'Montserrat_700Bold',
      fontWeight: '700',
      letterSpacing: 0.5,
      lineHeight: 30,
      fontSize: 18,
      fontStyle: 'normal',
    },
    extraBold: {
      fontFamily: 'Montserrat_800ExtraBold',
      fontWeight: '800',
      letterSpacing: 0.5,
      lineHeight: 32,
      fontSize: 20,
      fontStyle: 'normal',
    },
    black: {
      fontFamily: 'Montserrat_900Black',
      fontWeight: '900',
      letterSpacing: 0.5,
      lineHeight: 34,
      fontSize: 20,
      fontStyle: 'normal',
    },
  },
};


export const lightTheme = {
  ...PaperLightTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperLightTheme.colors,
    primary: '#7AD886',
    background: '#FFFFFF',
    tertiary: '#1E1E1E',
    secondary: '#1E1E1E',
  },
};

export const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#85F193',
    background: '#000000',
    secondary: '#FFFFFF',
    tertiary: '#FFFFFF',
  },
};

export const useAppTheme = () => {
  const mode = useAppSelector(state => state.theme?.isDarkMode);
  const theme = mode ? darkTheme : lightTheme;
  return theme
};
