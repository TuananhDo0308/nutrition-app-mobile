import type React from "react"
import { Text, StyleSheet, View, Image } from "react-native"
import { useAppSelector } from "../../hooks/hook"
import { useTheme } from "react-native-paper"

interface UserGreetingProps {
  name: string
  avatarUrl?: string // Optional avatar URL
}

const UserGreeting: React.FC<UserGreetingProps> = ({ name, avatarUrl }) => {
  const theme = useTheme()
  const userAvatar = useAppSelector((state) => state.user?.image)

  // Determine greeting based on time of day
  const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return "Morning"
    } else if (hour < 15) {
      return "Afternoon"
    } else if (hour < 18) {
      return "Evening"
    } else {
      return "Night"
    }
  }

  // Default avatar if none provided
  const defaultAvatar = "https://via.placeholder.com/50.png?text=User" // Placeholder image

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: avatarUrl || userAvatar || defaultAvatar }}
        style={[styles.avatar, { borderColor: theme.colors.primary }]}
      />
      <Text style={[styles.text, { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" }]}>
        {getGreeting()}, {name}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25, // Circular shape
    borderWidth: 2,
    marginBottom: 8, // Space between avatar and text
  },
  text: {
    fontWeight: "bold",
    fontSize: 35,
    marginBottom: 36,
  },
})

export default UserGreeting
