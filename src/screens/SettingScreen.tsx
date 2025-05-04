"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking, Platform, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialIcons, FontAwesome5, Feather, AntDesign } from "@expo/vector-icons"
import { useAppDispatch, useAppSelector } from "../hooks/hook"
import { toggleTheme } from "../slices/uiSlice/themeMode"
import * as Haptics from "expo-haptics"
import { useTheme } from "react-native-paper"
import ThemeSelector from "../component/ThemeSelector"
import { clearUser } from "../slices/userSlice/userSlice"
import GradientBlurBackground from "../component/Layout/background"

const SettingScreen = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector((state) => state.theme?.isDarkMode)

  // State for switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [useMetric, setUseMetric] = useState(true)
  const [showCalories, setShowCalories] = useState(true)
  const [syncEnabled, setSyncEnabled] = useState(true)

  // Handle theme toggle
  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    dispatch(toggleTheme())
  }

  // Handle switch toggle with haptic feedback
  const handleToggle = (setter, value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setter(value)
  }

  // Handle logout
  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          dispatch(clearUser())
        },
      },
    ])
  }

  // Handle delete account
  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert("Delete Account", "Are you sure you want to delete your account? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => console.log("Account deleted"),
      },
    ])
  }

  // Render a section header
  const SectionHeader = ({ title }) => (
    <Text style={[styles.sectionHeader, { color: theme.colors.secondary, opacity: 0.6 }]}>{title}</Text>
  )

  // Render a setting item with icon
  const SettingItem = ({ icon, iconType, title, subtitle, onPress, rightElement }) => {
    // Render the appropriate icon based on iconType
    const renderIcon = () => {
      const iconColor = theme.colors.primary
      const iconSize = 22

      switch (iconType) {
        case "Ionicons":
          return <Ionicons name={icon} size={iconSize} color={iconColor} />
        case "MaterialIcons":
          return <MaterialIcons name={icon} size={iconSize} color={iconColor} />
        case "FontAwesome5":
          return <FontAwesome5 name={icon} size={iconSize} color={iconColor} />
        case "Feather":
          return <Feather name={icon} size={iconSize} color={iconColor} />
        case "AntDesign":
          return <AntDesign name={icon} size={iconSize} color={iconColor} />
        default:
          return <Ionicons name={icon} size={iconSize} color={iconColor} />
      }
    }

    return (
      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: theme.dark ? "#333333" : "#F0F0F0" }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingIconContainer}>{renderIcon()}</View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: theme.colors.secondary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.colors.secondary, opacity: 0.6 }]}>{subtitle}</Text>
          )}
        </View>
        <View style={styles.settingRightElement}>{rightElement}</View>
      </TouchableOpacity>
    )
  }

  // Render a switch setting
  const SwitchSetting = ({ icon, iconType, title, subtitle, value, onValueChange }) => (
    <SettingItem
      icon={icon}
      iconType={iconType}
      title={title}
      subtitle={subtitle}
      onPress={() => onValueChange(!value)}
      rightElement={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#767577", true: theme.colors.primary + "80" }}
          thumbColor={value ? theme.colors.primary : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
        />
      }
    />
  )

  return (
    <GradientBlurBackground>
    <SafeAreaView style={[styles.container]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.secondary }]}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SectionHeader title="ACCOUNT" />
        <View style={[styles.sectionContainer, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>

          <SettingItem
            icon="log-out"
            iconType="Feather"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} opacity={0.4} />}
          />
        </View>

        {/* Preferences Section */}
        <SectionHeader title="PREFERENCES" />
        <View style={[styles.sectionContainer, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>
          <SwitchSetting
            icon="moon"
            iconType="Ionicons"
            title="Dark Mode"
            subtitle="Toggle between light and dark theme"
            value={isDarkMode}
            onValueChange={handleThemeToggle}
          />



        </View>

        {/* Theme Colors Section */}
        <SectionHeader title="THEME COLORS" />
        <View style={[styles.sectionContainer, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>
          <ThemeSelector />
        </View>

        {/* Health Data Section */}

        {/* App Information */}
        <SectionHeader title="APP INFORMATION" />
        <View style={[styles.sectionContainer, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>
          <SettingItem
            icon="shield-checkmark"
            iconType="Ionicons"
            title="Privacy Policy"
            onPress={() => Linking.openURL("https://example.com/privacy")}
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} opacity={0.4} />}
          />
          <SettingItem
            icon="file-text"
            iconType="Feather"
            title="Terms of Service"
            onPress={() => Linking.openURL("https://example.com/terms")}
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} opacity={0.4} />}
          />
          <SettingItem
            icon="info-circle"
            iconType="FontAwesome5"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => console.log("About pressed")}
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} opacity={0.4} />}
          />
        </View>

        {/* Support Section */}
        <SectionHeader title="SUPPORT" />
        <View style={[styles.sectionContainer, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>
          <SettingItem
            icon="help-circle"
            iconType="Feather"
            title="Help Center"
            onPress={() => console.log("Help Center pressed")}
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} opacity={0.4} />}
          />
          <SettingItem
            icon="mail"
            iconType="Feather"
            title="Contact Us"
            subtitle="Get in touch with our support team"
            onPress={() => Linking.openURL("mailto:support@fitnessapp.com")}
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} opacity={0.4} />}
          />
          <SettingItem
            icon="star"
            iconType="Feather"
            title="Rate the App"
            onPress={() =>
              Linking.openURL(
                Platform.OS === "ios"
                  ? "https://apps.apple.com/app/id123456789"
                  : "https://play.google.com/store/apps/details?id=com.fitnessapp",
              )
            }
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} opacity={0.4} />}
          />
        </View>

        {/* Danger Zone */}
        <SectionHeader title="DANGER ZONE" />
        <View style={[styles.sectionContainer, { backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF" }]}>
          <SettingItem
            icon="trash"
            iconType="Feather"
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
            rightElement={<Ionicons name="chevron-forward" size={20} color="#FF3B30" opacity={0.8} />}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.secondary, opacity: 0.5 }]}>
            © 2025 Fitness Tracker App
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
    </GradientBlurBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Montserrat_700Bold",
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
    fontFamily: "Montserrat_600SemiBold",
  },
  sectionContainer: {
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(133, 241, 147, 0.1)",
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Montserrat_500Medium",
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: "Montserrat_400Regular",
  },
  settingRightElement: {
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    marginBottom:40,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
})

export default SettingScreen
