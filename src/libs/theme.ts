import {
  MD3LightTheme as PaperLightTheme,
  MD3DarkTheme as PaperDarkTheme,
  configureFonts,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { useAppSelector } from "../hooks/hook";

const fontConfig = {
  default: {
    bodySmall: {
      fontFamily: "Montserrat_400Regular",
      fontWeight: "400",
      fontSize: 12,
    },
    bodyMedium: {
      fontFamily: "Montserrat_400Regular",
      fontWeight: "400",
      fontSize: 14,
    },
    bodyLarge: {
      fontFamily: "Montserrat_400Regular",
      fontWeight: "400",
      fontSize: 16,
    },
    titleSmall: {
      fontFamily: "Montserrat_500Medium",
      fontWeight: "500",
      fontSize: 14,
    },
    titleMedium: {
      fontFamily: "Montserrat_500Medium",
      fontWeight: "500",
      fontSize: 16,
    },
    titleLarge: {
      fontFamily: "Montserrat_600SemiBold",
      fontWeight: "600",
      fontSize: 22,
    },
    labelSmall: {
      fontFamily: "Montserrat_400Regular",
      fontWeight: "400",
      fontSize: 11,
    },
    labelMedium: {
      fontFamily: "Montserrat_400Regular",
      fontWeight: "400",
      fontSize: 12,
    },
    labelLarge: {
      fontFamily: "Montserrat_500Medium",
      fontWeight: "500",
      fontSize: 14,
    },
    displaySmall: {
      fontFamily: "Montserrat_700Bold",
      fontWeight: "700",
      fontSize: 36,
    },
  },
};

export const colorPalettes = {
  green: {
    light: "#7AD886", // Màu xanh lá từ màn hình Progress (sáng)
    dark: "#85F193",  // Màu xanh lá đậm hơn cho dark mode
  },
  blue: {
    light: "#75CCFE", // Màu xanh dương từ màn hình Progress (sáng)
    dark: "#75CCFE",  // Màu xanh dương đậm hơn cho dark mode
  },
  pink: {
    light: "#D185F1", // Màu tím từ màn hình Progress (sáng)
    dark: "#D185F1",  // Màu tím đậm hơn cho dark mode
  },
  purple: {
    light: "#6365EA", // Màu hồng từ màn hình Progress (sáng)
    dark: "#6365EA",  // Màu hồng đậm hơn cho dark mode
  },
};

export const createTheme = (colorKey = "green") => {
  const palette = colorPalettes[colorKey] || colorPalettes.green;

  const baseLightTheme = {
    ...PaperLightTheme,
    ...NavigationDefaultTheme,
    colors: {
      ...PaperLightTheme.colors,
      primary: palette.light,
      background: "#FFFFFF",
      secondary: "#1E1E1E",
      tertiary: "#1E1E1E",
    },
    fonts: configureFonts({ config: fontConfig }),
  };

  const baseDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,
      primary: palette.dark,
      background: "#000000",
      secondary: "#FFFFFF",
      tertiary: "#FFFFFF",
    },
    fonts: configureFonts({ config: fontConfig }),
  };

  return {
    light: baseLightTheme,
    dark: baseDarkTheme,
  };
};

export const useAppTheme = () => {
  const isDarkMode = useAppSelector((state) => state.theme?.isDarkMode);
  const themeColor = useAppSelector((state) => state.theme?.themeColor) || "green";
  const themes = createTheme(themeColor);
  return isDarkMode ? themes.dark : themes.light;
};