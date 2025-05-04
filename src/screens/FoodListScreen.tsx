"use client"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { useAppTheme } from "../libs/theme"
import { SafeAreaView } from "react-native-safe-area-context"
import Svg, { Path, G } from "react-native-svg"
import { BlurView } from "expo-blur"
import GradientBlurBackground from "../component/Layout/background"

// Get screen dimensions
const { width } = Dimensions.get("window")

// Define the food item type
type FoodItem = {
  food: string
  mass: number
}

// Food icons mapping
const foodIcons: Record<string, string> = {
  rice: "🍚",
  pork: "🥩",
  cucumber: "🥒",
  carrot: "🥕",
  // Add more food icons as needed
  default: "🍽️",
}

// Custom SVG Icons
const ArrowLeftIcon = ({ color = "#fff", size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const CheckIcon = ({ color = "#fff", size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

const EditIcon = ({ color = "#fff", size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G>
      <Path
        d="M16 3L21 8L8 21H3V16L16 3Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M14 6L18 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </G>
  </Svg>
)

const FoodListScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const theme = useAppTheme()

  // Get the food data and photo URI from route params
  // @ts-ignore - Ignoring type checking for route params
  const initialFoodData = route.params?.foodData || []
  // @ts-ignore
  const photoUri = route.params?.photoUri || null

  const [foodData, setFoodData] = useState<FoodItem[]>(initialFoodData)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null)

  // Calculate total mass
  const totalMass = foodData.reduce((sum: number, item: FoodItem) => sum + item.mass, 0)

  // Function to get icon for a food item
  const getFoodIcon = (foodName: string) => {
    return foodIcons[foodName.toLowerCase()] || foodIcons.default
  }

  // Start editing a food item's mass
  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditValue(foodData[index].mass.toString())
  }

  // Save edited mass value
  const saveEdit = () => {
    if (editingIndex !== null) {
      const newValue = Number.parseInt(editValue, 10) || 0
      const updatedFoodData = [...foodData]
      updatedFoodData[editingIndex] = {
        ...updatedFoodData[editingIndex],
        mass: newValue,
      }
      setFoodData(updatedFoodData)
      setEditingIndex(null)
    }
  }

  // Submit the food data to API
  const submitFoodData = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock API call
      console.log("Submitting food data:", foodData)

      // In a real app, you would make an actual API call here
      // const response = await fetch('https://your-api-endpoint.com/food-data', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ food_masses_gram: foodData }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to submit food data');
      // }

      setSubmitSuccess(true)

      // Show success message briefly before navigating back
      setTimeout(() => {
        navigation.goBack()
      }, 1500)
    } catch (error) {
      console.error("Error submitting food data:", error)
      setSubmitSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <GradientBlurBackground>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <ImageBackground source={{ uri: photoUri || "/placeholder.svg" }} style={styles.backgroundImage}>
        {/* Semi-transparent overlay */}

        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ArrowLeftIcon color={theme.colors.secondary} size={24} />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitle,
                { fontFamily: theme.fonts.titleLarge.fontFamily, color: theme.colors.secondary },
              ]}
            >
              Food Analysis
            </Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Summary Card */}
            <View style={styles.summaryContainer}>
              <BlurView intensity={80} tint={theme.dark ? "dark" : "light"} style={styles.blurContainer}>
                <Text
                  style={[
                    styles.summaryTitle,
                    { fontFamily: theme.fonts.titleMedium.fontFamily, color: theme.colors.secondary },
                  ]}
                >
                  Total Food Mass
                </Text>
                <Text
                  style={[
                    styles.totalMass,
                    { fontFamily: theme.fonts.displaySmall.fontFamily, color: theme.colors.secondary },
                  ]}
                >
                  {totalMass} grams
                </Text>
              </BlurView>
            </View>

            {/* Food List */}
            <Text
              style={[
                styles.sectionTitle,
                { fontFamily: theme.fonts.titleLarge.fontFamily, color: theme.colors.secondary },
              ]}
            >
              Detected Food Items
            </Text>

            {foodData.length === 0 ? (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    styles.emptyText,
                    { fontFamily: theme.fonts.bodyLarge.fontFamily, color: theme.colors.secondary },
                  ]}
                >
                  No food items detected
                </Text>
              </View>
            ) : (
              <View style={styles.foodList}>
                {foodData.map((item, index) => (
                  <View key={`${item.food}-${index}`} style={styles.foodCard}>
                    <BlurView intensity={60} tint={theme.dark ? "dark" : "light"} style={styles.foodCardBlur}>
                      <View style={styles.foodCardContent}>
                        <View style={[styles.foodIconContainer, { backgroundColor: `${theme.colors.primary}40` }]}>
                          <Text style={styles.foodIcon}>{getFoodIcon(item.food)}</Text>
                        </View>
                        <View style={styles.foodInfo}>
                          <Text
                            style={[
                              styles.foodName,
                              { fontFamily: theme.fonts.titleMedium.fontFamily, color: theme.colors.secondary },
                            ]}
                          >
                            {item.food.charAt(0).toUpperCase() + item.food.slice(1)}
                          </Text>
                          {editingIndex === index ? (
                            <View style={styles.editContainer}>
                              <TextInput
                                style={[
                                  styles.editInput,
                                  {
                                    backgroundColor: `${theme.colors.primary}40`,
                                    color: theme.colors.secondary,
                                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                                  },
                                ]}
                                value={editValue}
                                onChangeText={setEditValue}
                                keyboardType="numeric"
                                autoFocus
                                placeholderTextColor={`${theme.colors.secondary}80`}
                              />
                              <Text
                                style={[
                                  styles.unitText,
                                  { fontFamily: theme.fonts.bodyMedium.fontFamily, color: theme.colors.secondary },
                                ]}
                              >
                                g
                              </Text>
                              <TouchableOpacity
                                onPress={saveEdit}
                                style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                              >
                                <CheckIcon size={18} color={theme.dark ? "#000" : "#fff"} />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View style={styles.massContainer}>
                              <Text
                                style={[
                                  styles.massText,
                                  { fontFamily: theme.fonts.bodyLarge.fontFamily, color: theme.colors.secondary },
                                ]}
                              >
                                {item.mass} g
                              </Text>
                              <TouchableOpacity
                                onPress={() => startEditing(index)}
                                style={[styles.editButton, { backgroundColor: `${theme.colors.primary}40` }]}
                              >
                                <EditIcon size={14} color={theme.colors.secondary} />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    </BlurView>
                  </View>
                ))}
              </View>
            )}

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              {submitSuccess === true && (
                <Text style={[styles.successText, { fontFamily: theme.fonts.bodyMedium.fontFamily }]}>
                  Successfully submitted!
                </Text>
              )}
              {submitSuccess === false && (
                <Text style={[styles.errorText, { fontFamily: theme.fonts.bodyMedium.fontFamily }]}>
                  Failed to submit. Please try again.
                </Text>
              )}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: theme.colors.primary },
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={submitFoodData}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={theme.dark ? "#000" : "#fff"} size="small" />
                ) : (
                  <Text
                    style={[
                      styles.submitButtonText,
                      {
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        color: theme.dark ? "#000" : "#fff",
                      },
                    ]}
                  >
                    Submit Food Data
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
      </GradientBlurBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  blurContainer: {
    padding: 20,
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  totalMass: {
    fontSize: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  foodList: {
    marginBottom: 24,
  },
  foodCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  foodCardBlur: {
    borderRadius: 12,
  },
  foodCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  foodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  foodIcon: {
    fontSize: 28,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    marginBottom: 4,
  },
  massContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  massText: {
    fontSize: 16,
    opacity: 0.8,
  },
  editButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 12,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  editInput: {
    borderRadius: 8,
    padding: 8,
    width: 60,
    marginRight: 8,
  },
  unitText: {
    marginRight: 12,
    opacity: 0.8,
  },
  saveButton: {
    padding: 8,
    borderRadius: 12,
  },
  submitContainer: {
    alignItems: "center",
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: width * 0.8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  successText: {
    color: "#4CAF50",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  errorText: {
    color: "#F44336",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
  },
})

export default FoodListScreen
