"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import {
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Easing,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Text, ActivityIndicator, TextInput, Button, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"
import { useFocusEffect } from "@react-navigation/native"
import { apiLinks } from "../utils"
import { useAppSelector } from "../hooks/hook"
import GradientBlurBackground from "../component/Layout/background"
import Svg, { Circle, Path, Text as SvgText, Defs, LinearGradient, Stop } from "react-native-svg"
import * as Haptics from "expo-haptics"

const { width, height } = Dimensions.get("window")

interface FoodItem {
  fdcId: number
  description: string
  foodNutrients: {
    nutrientId: number
    nutrientName: string
    value: number
    unitName: string
  }[]
}

interface ApiResponse {
  foods: FoodItem[]
  totalPages: number
  currentPage: number
}

interface FoodLogData {
  name: string
  grams: number
  calories: number
  carbs: number
  fat: number
  protein: number
}

// Custom SVG Icons
const CloseIcon = ({ color = "#000", size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

const EditIcon = ({ color = "#000", size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const FoodInputScreen = () => {
  const theme = useTheme()
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [gramsInput, setGramsInput] = useState("100")
  const [submitting, setSubmitting] = useState(false)
  const token = useAppSelector((state) => state.user?.token)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const drawerAnim = useRef(new Animated.Value(height)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  // Colors for the pie chart
  const chartColors = {
    carbs: theme.dark ? "#8B5CF6" : "#A78BFA", // Purple
    protein: theme.dark ? "#60A5FA" : "#93C5FD", // Blue
    fat: theme.dark ? "#F59E0B" : "#FBBF24", // Amber
  }

  // Animate content when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Determine time-based query
  const getTimeBasedQuery = (): string => {
    const hour = new Date().getHours()
    if (hour < 10) return "breakfast"
    else if (hour < 14) return "lunch"
    else if (hour < 18) return "snack"
    else return "dinner"
  }

  // Fetch foods from API
  const fetchFoods = async (newQuery: string, pageNum = 1, reset = false) => {
    if (isLoadingMore && !reset) return

    if (reset) setLoading(true)
    else setIsLoadingMore(true)

    setError(null)

    try {
      const params: any = {
        query: newQuery,
        pageSize: 20,
        pageNumber: pageNum,
        sortBy: "dataType.keyword",
        sortOrder: "asc",
        api_key: "gP07Q5U7ULsiXCXLbCGVqk4c2Y6Yx39nMWJiuJxx",
        dataType: "Survey (FNDDS)",
      }

      const response = await axios.get<ApiResponse>("https://api.nal.usda.gov/fdc/v1/foods/search", {
        params,
        headers: { accept: "application/json" },
      })

      if (response.data.foods.length === 0 && pageNum === 1) {
        showSnackbar("No foods found. Try a different search term.")
      }
      setFoods((prev) => (reset ? response.data.foods : [...prev, ...response.data.foods]))
      setTotalPages(response.data.totalPages)
      setPage(pageNum + 1)
    } catch (err: any) {
      console.error(err)
      showSnackbar(err.response?.data?.message || "Failed to fetch food data. Please try again.")
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }

  // Show snackbar with message
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarVisible(true)
  }

  // Initial API call
  useFocusEffect(
    useCallback(() => {
      const initialQuery = getTimeBasedQuery()
      setSearchQuery("")
      fetchFoods(initialQuery, 1, true)
      return () => {}
    }, []),
  )

  // Handle search
  const handleSearch = () => {
    const query = searchQuery.trim() || getTimeBasedQuery()
    Keyboard.dismiss()
    fetchFoods(query, 1, true)

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  // Load more data
  const loadMore = () => {
    if (page <= totalPages && !isLoadingMore && !loading) {
      const query = searchQuery.trim() || getTimeBasedQuery()
      fetchFoods(query, page)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    const initialQuery = getTimeBasedQuery()
    fetchFoods(initialQuery, 1, true)

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  // Get Energy info (prefer KCAL)
  const getEnergyInfo = (nutrients: FoodItem["foodNutrients"], grams = 100) => {
    const energyNutrient =
      nutrients.find((nutrient) => nutrient.nutrientName === "Energy" && nutrient.unitName === "KCAL") ||
      nutrients.find((nutrient) => nutrient.nutrientName === "Energy")

    const baseAmount = energyNutrient ? Math.round(energyNutrient.value) : 0
    const scaledAmount = Math.round((baseAmount * grams) / 100)

    return { amount: scaledAmount, unit: energyNutrient?.unitName || "KCAL" }
  }

  // Get macronutrients
  const getMacroNutrients = (nutrients: FoodItem["foodNutrients"], grams = 100) => {
    const protein = nutrients.find((n) => n.nutrientName === "Protein")
    const carbs = nutrients.find((n) => n.nutrientName === "Carbohydrate, by difference")
    const fat = nutrients.find((n) => n.nutrientName === "Total lipid (fat)")
    const vitaminC = nutrients.find((n) => n.nutrientName === "Vitamin C, total ascorbic acid")
    const calcium = nutrients.find((n) => n.nutrientName === "Calcium, Ca")
    const fiber = nutrients.find((n) => n.nutrientName === "Fiber, total dietary")
    const water = nutrients.find((n) => n.nutrientName === "Water")

    const scale = grams / 100

    return {
      protein: protein ? Math.round(protein.value * scale) : 0,
      carbs: carbs ? Math.round(carbs.value * scale) : 0,
      fat: fat ? Math.round(fat.value * scale) : 0,
      vitaminC: vitaminC ? Math.round(vitaminC.value * scale * 10) / 10 : 0,
      calcium: calcium ? Math.round(calcium.value * scale) : 0,
      fiber: fiber ? Math.round(fiber.value * scale * 10) / 10 : 0,
      water: water ? Math.round(water.value * scale) : 0,
    }
  }

  // Calculate nutrition info based on selected food and grams
  const calculateNutrition = useMemo(() => {
    if (!selectedFood) return null

    const grams = Number.parseFloat(gramsInput) || 100
    const { amount: calories } = getEnergyInfo(selectedFood.foodNutrients, grams)
    const macros = getMacroNutrients(selectedFood.foodNutrients, grams)

    const totalMacros = macros.carbs + macros.protein + macros.fat
    const carbsPercentage = totalMacros > 0 ? Math.round((macros.carbs / totalMacros) * 100) : 0
    const proteinPercentage = totalMacros > 0 ? Math.round((macros.protein / totalMacros) * 100) : 0
    const fatPercentage = totalMacros > 0 ? Math.round((macros.fat / totalMacros) * 100) : 0

    return {
      calories,
      ...macros,
      carbsPercentage,
      proteinPercentage,
      fatPercentage,
    }
  }, [selectedFood, gramsInput])

  // Open drawer
  const openDrawer = (food: FoodItem) => {
    setSelectedFood(food)
    setGramsInput("100")
    setDrawerVisible(true)

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // Animate drawer opening
    Animated.spring(drawerAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start()

    // Animate pie chart
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start()
  }

  // Close drawer
  const closeDrawer = () => {
    // Animate drawer closing
    Animated.timing(drawerAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      setDrawerVisible(false)
      setSelectedFood(null)
      setGramsInput("100")

      // Reset animations
      scaleAnim.setValue(0.95)
      rotateAnim.setValue(0)
    })

    Keyboard.dismiss()

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  // Handle submit food log
  const handleSubmit = async () => {
    if (!selectedFood || !calculateNutrition) return

    const grams = Number.parseFloat(gramsInput)
    if (isNaN(grams) || grams <= 0) {
      showSnackbar("Please enter a valid weight in grams (greater than 0).")
      return
    }

    setSubmitting(true)

    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    try {
      const nutrition = calculateNutrition

      const foodLogData: FoodLogData[] = [
        {
          name: selectedFood.description,
          grams,
          calories: nutrition.calories,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
          protein: nutrition.protein,
        },
      ]

      await axios.post(apiLinks.food.input_manual, foodLogData, {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: token,
        },
      })

      showSnackbar("Food added successfully!")
      closeDrawer()
    } catch (err: any) {
      console.error(err)
      showSnackbar(err.response?.data?.message || "Failed to add food. Please try again.")

      // Provide error haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setSubmitting(false)
    }
  }

  // Render food item
  const renderFoodItem = ({ item, index }: { item: FoodItem; index: number }) => {
    const { amount, unit } = getEnergyInfo(item.foodNutrients)
    const macros = getMacroNutrients(item.foodNutrients)

    // Calculate animation delay based on index for staggered animation
    const animationDelay = index * 50

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.itemContainer,
            {
              backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
              shadowColor: theme.dark ? "#000000" : "#CCCCCC",
            },
          ]}
          onPress={() => openDrawer(item)}
          activeOpacity={0.7}
        >
          <View style={styles.foodInfoContainer}>
            <Text
              style={[styles.foodName, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
            <View style={styles.macrosContainer}>
              <View style={[styles.macroItem, { backgroundColor: `${chartColors.protein}30` }]}>
                <Text style={[styles.macroText, { color: theme.colors.secondary }]}>P: {macros.protein}g</Text>
              </View>
              <View style={[styles.macroItem, { backgroundColor: `${chartColors.carbs}30` }]}>
                <Text style={[styles.macroText, { color: theme.colors.secondary }]}>C: {macros.carbs}g</Text>
              </View>
              <View style={[styles.macroItem, { backgroundColor: `${chartColors.fat}30` }]}>
                <Text style={[styles.macroText, { color: theme.colors.secondary }]}>F: {macros.fat}g</Text>
              </View>
            </View>
          </View>
          <View style={styles.caloriesContainer}>
            <Text style={[styles.caloriesValue, { color: theme.colors.primary, fontFamily: "Montserrat_700Bold" }]}>
              {amount}
            </Text>
            <Text
              style={[
                styles.caloriesUnit,
                { color: theme.colors.secondary, opacity: 0.7, fontFamily: "Montserrat_400Regular" },
              ]}
            >
              {unit}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  // List empty component
  const renderEmptyList = () => {
    if (loading) return null

    return (
      <Animated.View
        style={[
          styles.emptyContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Ionicons name="search-outline" size={64} color={theme.colors.secondary} style={{ opacity: 0.3 }} />
        <Text
          style={[
            styles.emptyText,
            { color: theme.colors.secondary, opacity: 0.7, fontFamily: "Montserrat_500Medium" },
          ]}
        >
          No foods found
        </Text>
        <Text
          style={[
            styles.emptySubtext,
            { color: theme.colors.secondary, opacity: 0.5, fontFamily: "Montserrat_400Regular" },
          ]}
        >
          Try a different search term
        </Text>
      </Animated.View>
    )
  }

  // Render nutrition pie chart
  const renderPieChart = () => {
    if (!calculateNutrition) return null

    const { carbsPercentage, proteinPercentage, fatPercentage } = calculateNutrition
    const radius = 60
    const strokeWidth = 15
    const innerRadius = radius - strokeWidth
    const center = radius + strokeWidth / 2
    const circumference = 2 * Math.PI * innerRadius

    const carbsOffset = (circumference * (100 - carbsPercentage)) / 100
    const proteinOffset = (circumference * (100 - proteinPercentage)) / 100
    const fatOffset = (circumference * (100 - fatPercentage)) / 100

    // Calculate rotation for animation
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    })

    return (
      <View style={styles.chartContainer}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          }}
        >
          <Svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth}>
            <Defs>
              <LinearGradient id="carbsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={chartColors.carbs} />
                <Stop offset="100%" stopColor={`${chartColors.carbs}80`} />
              </LinearGradient>
              <LinearGradient id="proteinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={chartColors.protein} />
                <Stop offset="100%" stopColor={`${chartColors.protein}80`} />
              </LinearGradient>
              <LinearGradient id="fatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={chartColors.fat} />
                <Stop offset="100%" stopColor={`${chartColors.fat}80`} />
              </LinearGradient>
            </Defs>

            <Circle
              cx={center}
              cy={center}
              r={innerRadius}
              stroke="url(#carbsGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={carbsOffset}
              fill="transparent"
              strokeLinecap="round"
              transform={`rotate(-90, ${center}, ${center})`}
            />
            <Circle
              cx={center}
              cy={center}
              r={innerRadius}
              stroke="url(#proteinGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={proteinOffset}
              fill="transparent"
              strokeLinecap="round"
              transform={`rotate(${(carbsPercentage / 100) * 360 - 90}, ${center}, ${center})`}
            />
            <Circle
              cx={center}
              cy={center}
              r={innerRadius}
              stroke="url(#fatGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={fatOffset}
              fill="transparent"
              strokeLinecap="round"
              transform={`rotate(${((carbsPercentage + proteinPercentage) / 100) * 360 - 90}, ${center}, ${center})`}
            />

            <Circle cx={center} cy={center} r={innerRadius - 10} fill={theme.dark ? "#2A2A2A" : "#FFFFFF"} />

            <SvgText
              x={center}
              y={center - 10}
              textAnchor="middle"
              fill={theme.colors.secondary}
              fontSize={16}
              fontFamily="Montserrat_600SemiBold"
            >
              {calculateNutrition.calories}
            </SvgText>
            <SvgText
              x={center}
              y={center + 15}
              textAnchor="middle"
              fill={theme.colors.secondary}
              fontSize={14}
              fontFamily="Montserrat_400Regular"
            >
              kcal
            </SvgText>
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            styles.percentagesContainer,
            {
              opacity: scaleAnim,
              transform: [
                {
                  translateY: scaleAnim.interpolate({
                    inputRange: [0.95, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.percentageText, { color: chartColors.carbs }]}>{carbsPercentage}%</Text>
          <Text style={[styles.percentageText, { color: chartColors.protein }]}>{proteinPercentage}%</Text>
          <Text style={[styles.percentageText, { color: chartColors.fat }]}>{fatPercentage}%</Text>
        </Animated.View>
      </View>
    )
  }

  return (
    <GradientBlurBackground>
      <SafeAreaView style={[styles.safeArea]}>
        <View style={styles.container}>
          <Animated.Text
            style={[
              styles.title,
              {
                color: theme.colors.secondary,
                fontFamily: "Montserrat_700Bold",
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            Add Food
          </Animated.Text>

          {/* Search bar */}
          <Animated.View
            style={[
              styles.searchContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TextInput
              mode="outlined"
              placeholder="Search foods..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              style={styles.searchInput}
              returnKeyType="search"
              outlineColor={theme.dark ? "#444444" : "#DDDDDD"}
              activeOutlineColor={theme.colors.primary}
              textColor={theme.colors.secondary}
              placeholderTextColor={theme.colors.secondary + "80"}
              right={
                searchQuery ? (
                  <TextInput.Icon icon="close" onPress={clearSearch} color={theme.colors.secondary} />
                ) : (
                  <TextInput.Icon icon="magnify" color={theme.colors.secondary} />
                )
              }
            />
          </Animated.View>

          {loading ? (
            <Animated.View
              style={[
                styles.loadingContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text
                style={[
                  styles.loadingText,
                  { color: theme.colors.secondary, opacity: 0.7, fontFamily: "Montserrat_500Medium" },
                ]}
              >
                Finding foods...
              </Text>
            </Animated.View>
          ) : (
            <FlatList
              data={foods}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.fdcId.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={renderEmptyList}
              ListFooterComponent={
                isLoadingMore ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} style={styles.footerLoader} />
                ) : page <= totalPages && foods.length > 0 ? (
                  <Button
                    mode="text"
                    onPress={loadMore}
                    style={styles.loadMoreButton}
                    labelStyle={[
                      styles.loadMoreButtonText,
                      { color: theme.colors.primary, fontFamily: "Montserrat_500Medium" },
                    ]}
                    disabled={isLoadingMore}
                  >
                    Load more foods
                  </Button>
                ) : null
              }
            />
          )}

          {/* Nutrition Drawer */}
          <Modal animationType="none" transparent={true} visible={drawerVisible} onRequestClose={closeDrawer}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeDrawer}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
              >
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                  <Animated.View
                    style={[
                      styles.drawerContainer,
                      {
                        backgroundColor: theme.dark ? "#1A1A1A" : "#FFFFFF",
                        transform: [{ translateY: drawerAnim }],
                      },
                    ]}
                  >
                    <View style={styles.drawerHandle}>
                      <View style={[styles.handle, { backgroundColor: theme.dark ? "#555" : "#DDD" }]} />
                    </View>
                    <ScrollView style={styles.drawerScrollView}>
                      <View style={styles.foodHeaderContainer}>
                        <Text
                          style={[
                            styles.selectedFoodName,
                            { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" },
                          ]}
                          numberOfLines={2}
                        >
                          {selectedFood?.description}
                        </Text>
                        <View style={styles.weightInputContainer}>
                          <TextInput
                            mode="outlined"
                            label="Weight"
                            defaultValue="100"
                            value={gramsInput}
                            onChangeText={setGramsInput}
                            keyboardType="numeric"
                            style={styles.weightInput}
                            outlineColor={theme.dark ? "#444444" : "#DDDDDD"}
                            activeOutlineColor={theme.colors.primary}
                            textColor={theme.colors.secondary}
                            right={<TextInput.Affix text="g" textStyle={{ color: theme.colors.secondary }} />}
                          />
                        </View>
                      </View>
                      <View style={styles.nutritionSection}>
                        <Text
                          style={[
                            styles.sectionTitle,
                            { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" },
                          ]}
                        >
                          Food Details
                        </Text>
                        {renderPieChart()}
                        <View style={styles.macronutrientsContainer}>
                          <View style={styles.macronutrientItem}>
                            <View style={[styles.macronutrientIndicator, { backgroundColor: chartColors.carbs }]} />
                            <Text
                              style={[
                                styles.macronutrientLabel,
                                { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" },
                              ]}
                            >
                              Carbohydrate
                            </Text>
                            <Text
                              style={[
                                styles.macronutrientValue,
                                { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" },
                              ]}
                            >
                              {calculateNutrition?.carbs}g
                            </Text>
                          </View>
                          <View style={styles.macronutrientItem}>
                            <View style={[styles.macronutrientIndicator, { backgroundColor: chartColors.protein }]} />
                            <Text
                              style={[
                                styles.macronutrientLabel,
                                { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" },
                              ]}
                            >
                              Protein
                            </Text>
                            <Text
                              style={[
                                styles.macronutrientValue,
                                { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" },
                              ]}
                            >
                              {calculateNutrition?.protein}g
                            </Text>
                          </View>
                          <View style={styles.macronutrientItem}>
                            <View style={[styles.macronutrientIndicator, { backgroundColor: chartColors.fat }]} />
                            <Text
                              style={[
                                styles.macronutrientLabel,
                                { color: theme.colors.secondary, fontFamily: "Montserrat_500Medium" },
                              ]}
                            >
                              Fat
                            </Text>
                            <Text
                              style={[
                                styles.macronutrientValue,
                                { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" },
                              ]}
                            >
                              {calculateNutrition?.fat}g
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.addButtonContainer}>
                        <TouchableOpacity
                          style={[
                            styles.addButton,
                            {
                              backgroundColor: theme.colors.primary,
                              opacity: submitting ? 0.7 : 1,
                            },
                          ]}
                          onPress={handleSubmit}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <ActivityIndicator color={theme.dark ? "#000" : "#fff"} size="small" />
                          ) : (
                            <>
                              <Ionicons
                                name="add-circle-outline"
                                size={20}
                                color={theme.dark ? "#000" : "#fff"}
                                style={styles.buttonIcon}
                              />
                              <Text
                                style={[
                                  styles.addButtonText,
                                  { color: theme.dark ? "#000" : "#fff", fontFamily: "Montserrat_600SemiBold" },
                                ]}
                              >
                                Add to Diet
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </Animated.View>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </TouchableOpacity>
          </Modal>

          {/* Custom Snackbar */}
          <CustomSnackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            message={snackbarMessage}
          />
        </View>
      </SafeAreaView>
    </GradientBlurBackground>
  )
}

// CustomSnackbar component
const CustomSnackbar = ({
  visible,
  onDismiss,
  message,
}: {
  visible: boolean
  onDismiss: () => void
  message: string
}) => {
  const theme = useTheme()
  const [opacity] = useState(new Animated.Value(0))
  const [translateY] = useState(new Animated.Value(20))

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start()

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 20,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.in(Easing.cubic),
          }),
        ]).start(() => onDismiss())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [visible, opacity, translateY, onDismiss])

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.customSnackbar,
        {
          backgroundColor: theme.dark ? "#444444" : "#333333",
          opacity: opacity,
          transform: [{ translateY }],
          borderRadius: 12,
          padding: 16,
          marginHorizontal: 16,
          marginBottom: 20,
          elevation: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
      ]}
    >
      <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 14,
          fontFamily: "Montserrat_500Medium",
          flex: 1,
        }}
      >
        {message}
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    marginVertical: 16,
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "transparent",
    borderRadius: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  foodInfoContainer: {
    flex: 1,
    marginRight: 8,
  },
  foodName: {
    fontSize: 16,
    marginBottom: 8,
  },
  macrosContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  macroText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  caloriesContainer: {
    alignItems: "center",
    marginLeft: 8,
    minWidth: 50,
  },
  caloriesValue: {
    fontSize: 18,
  },
  caloriesUnit: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 64,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  footerLoader: {
    marginVertical: 16,
  },
  loadMoreButton: {
    marginVertical: 8,
  },
  loadMoreButtonText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  drawerContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    maxHeight: height * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  drawerHandle: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  drawerScrollView: {
    paddingHorizontal: 20,
  },
  foodHeaderContainer: {
    marginBottom: 20,
  },
  selectedFoodName: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  weightInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightInput: {
    flex: 1,
    backgroundColor: "transparent",
  },
  nutritionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  percentagesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  percentageText: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  macronutrientsContainer: {
    marginTop: 20,
  },
  macronutrientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(150, 150, 150, 0.1)",
    padding: 12,
    borderRadius: 12,
  },
  macronutrientIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  macronutrientLabel: {
    flex: 1,
    fontSize: 14,
  },
  macronutrientValue: {
    fontSize: 14,
  },
  addButtonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  addButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  customSnackbar: {
    position: "absolute",
    bottom: 38,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
})

export default FoodInputScreen
