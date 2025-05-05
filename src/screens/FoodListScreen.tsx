"use client"
import { useState, useEffect, useCallback } from "react"
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
  Alert,
} from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { useAppTheme } from "../libs/theme"
import { SafeAreaView } from "react-native-safe-area-context"
import Svg, { Path, G } from "react-native-svg"
import { BlurView } from "expo-blur"
import GradientBlurBackground from "../component/Layout/background"
import axios from "axios"
import { useAppSelector } from "../hooks/hook"
import { Ionicons } from "@expo/vector-icons"
import { apiLinks } from "../utils"

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
  beef: "🥩",
  chicken: "🍗",
  fish: "🐟",
  cucumber: "🥒",
  carrot: "🥕",
  potato: "🥔",
  tomato: "🍅",
  lettuce: "🥬",
  broccoli: "🥦",
  apple: "🍎",
  banana: "🍌",
  orange: "🍊",
  grape: "🍇",
  watermelon: "🍉",
  bread: "🍞",
  egg: "🥚",
  cheese: "🧀",
  milk: "🥛",
  yogurt: "🥛",
  pasta: "🍝",
  pizza: "🍕",
  burger: "🍔",
  fries: "🍟",
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

const DeleteIcon = ({ color = "#fff", size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H5H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const TrashIcon = ({ color = "#fff", size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const FoodListScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const theme = useAppTheme()
  const token = useAppSelector((state) => state.user?.token)

  // Get the photo URI from route params
  // @ts-ignore
  const photoUri = route.params?.photoUri || null
  // @ts-ignore
  const initialFoodData = route.params?.foodData || []

  const [foodData, setFoodData] = useState<FoodItem[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Load food data from API if not provided in route params
  useEffect(() => {
    if (initialFoodData.length > 0) {
      setFoodData(initialFoodData)
      setIsLoading(false)
    } else if (photoUri) {
    }
  }, [photoUri, initialFoodData])


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

  // Delete a food item
  const deleteItem = (index: number) => {
    const updatedFoodData = [...foodData]
    updatedFoodData.splice(index, 1)
    setFoodData(updatedFoodData)
  }

  // Submit the food data to API
  const submitFoodData = async () => {
    console.log("submitFoodData called")
    setIsSubmitting(true)

    if (!token) {
      Alert.alert("Authentication Required", "Please log in to submit food data.")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Token:", token)
      console.log("API endpoint:", apiLinks.food.postAiList)
      console.log("Submitting food data:", foodData)
      const postData={
        
          food_masses_gram: foodData,
          token: token
        
      }
      const response = await axios.post(apiLinks.food.postAiList, postData, {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })

      console.log("Submit response:", response.data)
      setSubmitSuccess(true)
    } catch (error: any) {
      console.error("Error submitting food data:", error.response?.data || error.message)
      setSubmitSuccess(false)
      Alert.alert("Error", "Failed to submit food data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientBlurBackground>
        <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text
                style={[
                  styles.loadingText,
                  { fontFamily: theme.fonts.bodyLarge.fontFamily, color: theme.colors.secondary },
                ]}
              >
                Analyzing your food...
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              {/* Food Image Preview */}
              {photoUri && (
                <View style={styles.imagePreviewContainer}>
                  <ImageBackground source={{ uri: photoUri }} style={styles.imagePreview}>
                    <BlurView intensity={30} tint={theme.dark ? "dark" : "light"} style={styles.imageOverlay}>
                      <Text
                        style={[styles.imageText, { fontFamily: theme.fonts.titleMedium.fontFamily, color: "#fff" }]}
                      >
                        Food Image
                      </Text>
                    </BlurView>
                  </ImageBackground>
                </View>
              )}

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
              <View style={styles.sectionHeaderContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { fontFamily: theme.fonts.titleLarge.fontFamily, color: theme.colors.secondary },
                  ]}
                >
                  Detected Food Items
                </Text>
                <Text
                  style={[
                    styles.itemCount,
                    { fontFamily: theme.fonts.bodyMedium.fontFamily, color: theme.colors.secondary, opacity: 0.7 },
                  ]}
                >
                  {foodData.length} items
                </Text>
              </View>

              {foodData.length === 0 ? (
                <View style={styles.emptyState}>
                  {isLoading ? (
                    <>
                      <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
                      <Text
                        style={[
                          styles.emptyText,
                          { fontFamily: theme.fonts.bodyLarge.fontFamily, color: theme.colors.secondary },
                        ]}
                      >
                        Analyzing food items...
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.emptyText,
                        { fontFamily: theme.fonts.bodyLarge.fontFamily, color: theme.colors.secondary },
                      ]}
                    >
                      No food items detected
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.foodList}>
                  {foodData.map((item, index) => (
                    <View key={`${item.food}-${index}`} style={styles.foodCard}>
                      <BlurView intensity={60} tint={theme.dark ? "dark" : "light"} style={styles.foodCardBlur}>
                        <View style={styles.foodCardContent}>
                          <View style={[styles.foodIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
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
                                      backgroundColor: `${theme.colors.primary}20`,
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
                                  style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
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
                                <TouchableOpacity
                                  onPress={() => deleteItem(index)}
                                  style={[styles.deleteButton, { backgroundColor: `${theme.colors.error}40` }]}
                                >
                      <Ionicons name="trash" size={20} color="#000" />
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

{foodData.length > 0 && (
                <View style={styles.submitContainer}>
                  {submitSuccess === true && (
                    <View style={[styles.statusMessage, { backgroundColor: "rgba(76, 175, 80, 0.2)" }]}>
                      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      <Text
                        style={[styles.statusText, { fontFamily: theme.fonts.bodyMedium.fontFamily, color: "#4CAF50" }]}
                      >
                        Successfully submitted!
                      </Text>
                    </View>
                  )}
                  {submitSuccess === false && (
                    <View style={[styles.statusMessage, { backgroundColor: "rgba(244, 67, 54, 0.2)" }]}>
                      <Ionicons name="alert-circle" size={20} color="#F44336" />
                      <Text
                        style={[styles.statusText, { fontFamily: theme.fonts.bodyMedium.fontFamily, color: "#F44336" }]}
                      >
                        Failed to submit. Please try again.
                      </Text>
                    </View>
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
                      <>
                        <Ionicons
                          name="nutrition-outline"
                          size={20}
                          color={theme.dark ? "#000" : "#fff"}
                          style={styles.submitIcon}
                        />
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
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
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
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    height: 180,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  imageOverlay: {
    padding: 12,
  },
  imageText: {
    fontSize: 16,
  },
  summaryContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
  },
  itemCount: {
    fontSize: 14,
  },
  foodList: {
    marginBottom: 24,
  },
  foodCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodCardBlur: {
    borderRadius: 16,
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
    marginBottom: 8,
  },
  massContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  massTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  massText: {
    fontSize: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  editButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 12,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 12,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  editInput: {
    borderRadius: 12,
    padding: 8,
    width: 80,
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
  statusMessage: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    justifyContent: "center",
  },
  statusText: {
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  loadingIndicator: {
    marginBottom: 16,
  },
})

export default FoodListScreen
