import { MD3LightTheme as PaperLightTheme, MD3DarkTheme as PaperDarkTheme } from "react-native-paper"
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native"
import { useAppSelector } from "../hooks/hook"

const fontConfig = {
  default: {
    thin: {
      fontFamily: "Montserrat_100Thin",
      fontWeight: "100",
      letterSpacing: 0.5,
      lineHeight: 20,
      fontSize: 12,
      fontStyle: "normal",
    },
    extraLight: {
      fontFamily: "Montserrat_200ExtraLight",
      fontWeight: "200",
      letterSpacing: 0.5,
      lineHeight: 20,
      fontSize: 12,
      fontStyle: "normal",
    },
    light: {
      fontFamily: "Montserrat_300Light",
      fontWeight: "300",
      letterSpacing: 0.5,
      lineHeight: 22,
      fontSize: 14,
      fontStyle: "normal",
    },
    regular: {
      fontFamily: "Montserrat_400Regular",
      fontWeight: "400",
      letterSpacing: 0.5,
      lineHeight: 24,
      fontSize: 14,
      fontStyle: "normal",
    },
    medium: {
      fontFamily: "Montserrat_500Medium",
      fontWeight: "500",
      letterSpacing: 0.5,
      lineHeight: 26,
      fontSize: 16,
      fontStyle: "normal",
    },
    semiBold: {
      fontFamily: "Montserrat_600SemiBold",
      fontWeight: "600",
      letterSpacing: 0.5,
      lineHeight: 28,
      fontSize: 18,
      fontStyle: "normal",
    },
    bold: {
      fontFamily: "Montserrat_700Bold",
      fontWeight: "700",
      letterSpacing: 0.5,
      lineHeight: 30,
      fontSize: 18,
      fontStyle: "normal",
    },
    extraBold: {
      fontFamily: "Montserrat_800ExtraBold",
      fontWeight: "800",
      letterSpacing: 0.5,
      lineHeight: 32,
      fontSize: 20,
      fontStyle: "normal",
    },
    black: {
      fontFamily: "Montserrat_900Black",
      fontWeight: "900",
      letterSpacing: 0.5,
      lineHeight: 34,
      fontSize: 20,
      fontStyle: "normal",
    },
  },
}

// Define color palettes for different themes
export const colorPalettes = {
  green: {
    light: "#7AD886",
    dark: "#85F193",
  },
  blue: {
    light: "#00FFFF", // Neon cyan
    dark: "#00BFFF", // Neon blue
  },
  purple: {
    light: "#BF00FF", // Neon purple
    dark: "#DA70D6", // Neon orchid
  },
  pink: {
    light: "#FF1493", // Neon pink
    dark: "#FF69B4", // Neon hot pink
  },
  orange: {
    light: "#FF6600", // Neon orange
    dark: "#FF8C00", // Neon dark orange
  },
  teal: {
    light: "#00FA9A", // Neon spring green
    dark: "#00CED1", // Neon turquoise
  },
}

// Create theme with specific color palette
export const createTheme = (colorKey = "green") => {
  const palette = colorPalettes[colorKey] || colorPalettes.green

  return {
    light: {
      ...PaperLightTheme,
      ...NavigationDefaultTheme,
      colors: {
        ...PaperLightTheme.colors,
        primary: palette.light,
        background: "#FFFFFF",
        tertiary: "#1E1E1E",
        secondary: "#1E1E1E",
      },
    },
    dark: {
      ...PaperDarkTheme,
      ...NavigationDarkTheme,
      colors: {
        ...PaperDarkTheme.colors,
        primary: palette.dark,
        background: "#000000",
        secondary: "#FFFFFF",
        tertiary: "#FFFFFF",
      },
    },
  }
}

export const useAppTheme = () => {
  const isDarkMode = useAppSelector((state) => state.theme?.isDarkMode)
  const themeColor = useAppSelector((state) => state.theme?.themeColor) || "green"
  const themes = createTheme(themeColor)

  return isDarkMode ? themes.dark : themes.light
}
