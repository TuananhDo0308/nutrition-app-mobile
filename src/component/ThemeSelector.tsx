import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import * as Haptics from "expo-haptics"
import { useAppDispatch, useAppSelector } from "../hooks/hook"
import { setThemeColor } from "../slices/themeSlice"
import { colorPalettes } from "../libs/theme"

interface ThemeSelectorProps {
  title?: string
  subtitle?: string
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  title = "Theme Color",
  subtitle = "Choose your preferred app color theme",
}) => {
  const dispatch = useAppDispatch()
  const currentThemeColor = useAppSelector((state) => state.theme?.themeColor) || "green"
  const isDarkMode = useAppSelector((state) => state.theme?.isDarkMode)

  const handleColorSelect = (colorKey: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    dispatch(setThemeColor(colorKey))
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorList}>
        {Object.entries(colorPalettes).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.colorItem,
              { backgroundColor: isDarkMode ? value.dark : value.light },
              currentThemeColor === key && styles.selectedColor,
            ]}
            onPress={() => handleColorSelect(key)}
            activeOpacity={0.7}
          >
            {currentThemeColor === key && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "Montserrat_600SemiBold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.7,
    fontFamily: "Montserrat_400Regular",
  },
  colorList: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  colorItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
})

export default ThemeSelector
