"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Animated,
  Easing,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Text, useTheme, TextInput, ActivityIndicator } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAppTheme } from "../libs/theme"
import GradientBlurBackground from "../component/Layout/background"
import { BlurView } from "expo-blur"
import Svg, { Path, Circle, Text as SvgText, Defs, LinearGradient, Stop } from "react-native-svg"
import * as Haptics from "expo-haptics"
import axios from "axios"
import { useAppSelector } from "../hooks/hook"
import { apiLinks } from "../utils"
import { recipeDetailData } from "../constants/temp"

const { width, height } = Dimensions.get("window")

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

const ClockIcon = ({ color = "#000", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      fill={color}
    />
    <Path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill={color} />
  </Svg>
)

const ServingsIcon = ({ color = "#000", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 4c0-1.11.89-2 2-2s2 .89 2 2c0 .74-.4 1.38-1 1.72v14.78h-2V5.72c-.6-.34-1-.98-1-1.72zM12.5 11H11V3H9v8H7.5c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5z"
      fill={color}
    />
  </Svg>
)

interface RecipeDetailProps {
  route?: {
    params?: {
      recipeId?: string
    }
  }
}

interface Ingredient {
  name: string
  grams: string
  usda_ingredients_per_100g?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

interface FoodLogData {
  name: string
  grams: number
  calories: number
  carbs: number
  fat: number
  protein: number
}

const RecipeDetailScreen = ({ route }: RecipeDetailProps) => {
  const navigation = useNavigation()
  const theme = useAppTheme()
  const paperTheme = useTheme()
  const token = useAppSelector((state) => state.user?.token)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const drawerAnim = useRef(new Animated.Value(height)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  // State
  const [isFavorited, setIsFavorited] = useState(false)
  const [activeTab, setActiveTab] = useState<"ingredients" | "directions" | "nutrition">("ingredients")
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [gramsInput, setGramsInput] = useState("100")
  const [submitting, setSubmitting] = useState(false)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  // Get recipe data (in real app, you'd fetch based on route.params.recipeId)
  const recipe = recipeDetailData

  // Colors for the pie chart
  const chartColors = {
    carbs: paperTheme.dark ? "#8B5CF6" : "#A78BFA", // Purple
    protein: paperTheme.dark ? "#60A5FA" : "#93C5FD", // Blue
    fat: paperTheme.dark ? "#F59E0B" : "#FBBF24", // Amber
  }

  useEffect(() => {
    // Animate content when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
    ]).start()
  }, [])

  // Calculate nutrition info based on selected ingredient and grams
  const calculateNutrition = useMemo(() => {
    if (!selectedIngredient?.usda_ingredients_per_100g) return null

    const grams = Number.parseFloat(gramsInput) || 100
    const scale = grams / 100
    const nutrition = selectedIngredient.usda_ingredients_per_100g

    const calories = Math.round(nutrition.calories * scale)
    const protein = Math.round(nutrition.protein * scale)
    const carbs = Math.round(nutrition.carbs * scale)
    const fat = Math.round(nutrition.fat * scale)

    const totalMacros = carbs + protein + fat
    const carbsPercentage = totalMacros > 0 ? Math.round((carbs / totalMacros) * 100) : 0
    const proteinPercentage = totalMacros > 0 ? Math.round((protein / totalMacros) * 100) : 0
    const fatPercentage = totalMacros > 0 ? Math.round((fat / totalMacros) * 100) : 0

    return {
      calories,
      protein,
      carbs,
      fat,
      carbsPercentage,
      proteinPercentage,
      fatPercentage,
    }
  }, [selectedIngredient, gramsInput])

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    navigation.goBack()
  }

  // Show snackbar with message
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarVisible(true)
  }

  // Open ingredient drawer
  const openIngredientDrawer = (ingredient: Ingredient) => {
    if (!ingredient.usda_ingredients_per_100g) {
      showSnackbar("Nutrition data not available for this ingredient.")
      return
    }

    setSelectedIngredient(ingredient)
    setGramsInput(ingredient.grams.replace(/[^\d.]/g, "") || "100")
    setDrawerVisible(true)

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    Animated.spring(drawerAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start()

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
    Animated.timing(drawerAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      setDrawerVisible(false)
      setSelectedIngredient(null)
      setGramsInput("100")
      scaleAnim.setValue(0.95)
      rotateAnim.setValue(0)
    })

    Keyboard.dismiss()
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  // Handle submit ingredient
  const handleSubmit = async () => {
    if (!selectedIngredient || !calculateNutrition) return

    const grams = Number.parseFloat(gramsInput)
    if (isNaN(grams) || grams <= 0) {
      showSnackbar("Please enter a valid weight in grams (greater than 0).")
      return
    }

    setSubmitting(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    try {
      const nutrition = calculateNutrition

      const foodLogData: FoodLogData[] = [
        {
          name: selectedIngredient.name,
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

      showSnackbar("Ingredient added successfully!")
      closeDrawer()
    } catch (err: any) {
      console.error(err)
      showSnackbar(err.response?.data?.message || "Failed to add ingredient. Please try again.")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setSubmitting(false)
    }
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

            <Circle cx={center} cy={center} r={innerRadius - 10} fill={paperTheme.dark ? "#2A2A2A" : "#FFFFFF"} />

            <SvgText x={center} y={center - 10} textAnchor="middle" fill={paperTheme.colors.secondary} fontSize={16}>
              {calculateNutrition.calories}
            </SvgText>
            <SvgText x={center} y={center + 15} textAnchor="middle" fill={paperTheme.colors.secondary} fontSize={14}>
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

  const renderTimingInfo = () => (
    <Animated.View
      style={[
        styles.timingContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <BlurView intensity={60} tint={theme.dark ? "dark" : "light"} style={styles.timingBlur}>
        <View style={styles.timingContent}>
          <View style={styles.timingItem}>
            <ClockIcon color={theme.colors.primary} size={20} />
            <Text style={[styles.timingLabel, { color: theme.colors.secondary }]}>Prep</Text>
            <Text style={[styles.timingValue, { color: theme.colors.primary }]}>{recipe.prep_time}</Text>
          </View>

          <View style={[styles.timingDivider, { backgroundColor: `${theme.colors.secondary}20` }]} />

          <View style={styles.timingItem}>
            <ClockIcon color={theme.colors.primary} size={20} />
            <Text style={[styles.timingLabel, { color: theme.colors.secondary }]}>Cook</Text>
            <Text style={[styles.timingValue, { color: theme.colors.primary }]}>{recipe.cook_time}</Text>
          </View>

          <View style={[styles.timingDivider, { backgroundColor: `${theme.colors.secondary}20` }]} />

          <View style={styles.timingItem}>
            <ServingsIcon color={theme.colors.primary} size={20} />
            <Text style={[styles.timingLabel, { color: theme.colors.secondary }]}>Serves</Text>
            <Text style={[styles.timingValue, { color: theme.colors.primary }]}>{recipe.servings}</Text>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  )

  const renderTabNavigation = () => (
    <Animated.View
      style={[
        styles.tabNavContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView intensity={60} tint={theme.dark ? "dark" : "light"} style={styles.tabNavBlur}>
        <View style={styles.tabNavContent}>
          {[
            { key: "ingredients", label: "Ingredients", icon: "list" },
            { key: "directions", label: "Directions", icon: "book" },
            { key: "nutrition", label: "Nutrition", icon: "fitness" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                setActiveTab(tab.key as any)
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }}
            >
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={activeTab === tab.key ? (theme.dark ? "#000" : "#fff") : theme.colors.secondary}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color: activeTab === tab.key ? (theme.dark ? "#000" : "#fff") : theme.colors.secondary,
                    fontFamily: theme.fonts.labelMedium.fontFamily,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BlurView>
    </Animated.View>
  )

  const renderIngredients = () => (
    <Animated.View
      style={[
        styles.contentSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text
        style={[styles.sectionTitle, { color: theme.colors.secondary, fontFamily: theme.fonts.titleMedium.fontFamily }]}
      >
        Ingredients
      </Text>
      {recipe.ingredient_grams.map((ingredient, index) => (
        <Animated.View
          key={index}
          style={[
            styles.ingredientItem,
            {
              backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
              opacity: fadeAnim,
              transform: [
                {
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.ingredientTouchable}
            onPress={() => openIngredientDrawer(ingredient)}
            activeOpacity={0.7}
          >
            <View style={styles.ingredientContent}>
              <Text
                style={[
                  styles.ingredientName,
                  { color: theme.colors.secondary, fontFamily: theme.fonts.bodyLarge.fontFamily },
                ]}
              >
                {ingredient.name}
              </Text>
              <Text
                style={[
                  styles.ingredientAmount,
                  { color: theme.colors.primary, fontFamily: theme.fonts.labelLarge.fontFamily },
                ]}
              >
                {ingredient.grams}
              </Text>
            </View>
            {ingredient.usda_ingredients_per_100g && (
              <View style={styles.ingredientNutrition}>
                <Text style={[styles.nutritionText, { color: `${theme.colors.secondary}80` }]}>
                  {ingredient.usda_ingredients_per_100g.calories} cal/100g
                </Text>
                <Ionicons name="add-circle-outline" size={16} color={theme.colors.primary} style={{ marginLeft: 8 }} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      ))}
    </Animated.View>
  )

  const renderDirections = () => (
    <Animated.View
      style={[
        styles.contentSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text
        style={[styles.sectionTitle, { color: theme.colors.secondary, fontFamily: theme.fonts.titleMedium.fontFamily }]}
      >
        Directions
      </Text>
      {recipe.directions.map((direction, index) => (
        <Animated.View
          key={index}
          style={[
            styles.directionItem,
            {
              backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
              opacity: fadeAnim,
              transform: [
                {
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
            <Text
              style={[
                styles.stepNumberText,
                { color: theme.dark ? "#000" : "#fff", fontFamily: theme.fonts.labelLarge.fontFamily },
              ]}
            >
              {index + 1}
            </Text>
          </View>
          <Text
            style={[
              styles.directionText,
              { color: theme.colors.secondary, fontFamily: theme.fonts.bodyMedium.fontFamily },
            ]}
          >
            {direction}
          </Text>
        </Animated.View>
      ))}
    </Animated.View>
  )

  const renderNutrition = () => {
    const nutritionItems = recipe.nutrition.split(", ")

    return (
      <Animated.View
        style={[
          styles.contentSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.secondary, fontFamily: theme.fonts.titleMedium.fontFamily },
          ]}
        >
          Nutrition Information
        </Text>
        <View style={styles.nutritionGrid}>
          {nutritionItems.map((item, index) => {
            const [name, value] = item.split(" ")
            const percentage = item.match(/(\d+)%/)?.[1]

            return (
              <Animated.View
                key={index}
                style={[
                  styles.nutritionItem,
                  {
                    backgroundColor: theme.dark ? "#2A2A2A" : "#FFFFFF",
                    opacity: fadeAnim,
                    transform: [
                      {
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.nutritionName,
                    { color: theme.colors.secondary, fontFamily: theme.fonts.bodyMedium.fontFamily },
                  ]}
                >
                  {name}
                </Text>
                <Text
                  style={[
                    styles.nutritionValue,
                    { color: theme.colors.primary, fontFamily: theme.fonts.labelLarge.fontFamily },
                  ]}
                >
                  {value}
                </Text>
                {percentage && (
                  <Text style={[styles.nutritionPercentage, { color: `${theme.colors.secondary}60` }]}>
                    {percentage}% DV
                  </Text>
                )}
              </Animated.View>
            )
          })}
        </View>
      </Animated.View>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "ingredients":
        return renderIngredients()
      case "directions":
        return renderDirections()
      case "nutrition":
        return renderNutrition()
      default:
        return renderIngredients()
    }
  }

  // Custom Snackbar component
  const CustomSnackbar = ({
    visible,
    onDismiss,
    message,
  }: {
    visible: boolean
    onDismiss: () => void
    message: string
  }) => {
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
            backgroundColor: paperTheme.dark ? "#444444" : "#333333",
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
            flex: 1,
          }}
        >
          {message}
        </Text>
      </Animated.View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientBlurBackground>
        <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeftIcon color={theme.colors.secondary} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
              <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={24}
                color={isFavorited ? "#FF6B6B" : theme.colors.secondary}
              />
            </TouchableOpacity>
          </Animated.View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <Animated.View
              style={[
                styles.heroSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}
            >
              <Image
                source={{ uri: recipe.img_src }}
                style={styles.heroImage}
              />
              <BlurView intensity={40} tint={theme.dark ? "dark" : "light"} style={styles.heroOverlay}>
                <Text
                  style={[styles.recipeTitle, { color: "#FFFFFF", fontFamily: theme.fonts.headlineMedium.fontFamily }]}
                >
                  {recipe.recipe_name}
                </Text>
                <Text style={[styles.recipeYield, { color: "#FFFFFF", fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
                  {recipe.yield}
                </Text>
              </BlurView>
            </Animated.View>

            {/* Timing Info */}
            {renderTimingInfo()}

            {/* Tab Navigation */}
            {renderTabNavigation()}

            {/* Tab Content */}
            {renderTabContent()}

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Ingredient Drawer */}
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
                        backgroundColor: paperTheme.dark ? "#1A1A1A" : "#FFFFFF",
                        transform: [{ translateY: drawerAnim }],
                      },
                    ]}
                  >
                    <View style={styles.drawerHandle}>
                      <View style={[styles.handle, { backgroundColor: paperTheme.dark ? "#555" : "#DDD" }]} />
                    </View>
                    <ScrollView style={styles.drawerScrollView}>
                      <View style={styles.foodHeaderContainer}>
                        <Text
                          style={[styles.selectedFoodName, { color: paperTheme.colors.secondary }]}
                          numberOfLines={2}
                        >
                          {selectedIngredient?.name}
                        </Text>
                        <View style={styles.weightInputContainer}>
                          <TextInput
                            mode="outlined"
                            label="Weight"
                            value={gramsInput}
                            onChangeText={setGramsInput}
                            keyboardType="numeric"
                            style={styles.weightInput}
                            outlineColor={paperTheme.dark ? "#444444" : "#DDDDDD"}
                            activeOutlineColor={paperTheme.colors.primary}
                            textColor={paperTheme.colors.secondary}
                            right={<TextInput.Affix text="g" textStyle={{ color: paperTheme.colors.secondary }} />}
                          />
                        </View>
                      </View>
                      <View style={styles.nutritionSection}>
                        <Text style={[styles.sectionTitle, { color: paperTheme.colors.secondary }]}>
                          Ingredient Details
                        </Text>
                        {renderPieChart()}
                        <View style={styles.macronutrientsContainer}>
                          <View style={styles.macronutrientItem}>
                            <View style={[styles.macronutrientIndicator, { backgroundColor: chartColors.carbs }]} />
                            <Text style={[styles.macronutrientLabel, { color: paperTheme.colors.secondary }]}>
                              Carbohydrate
                            </Text>
                            <Text style={[styles.macronutrientValue, { color: paperTheme.colors.secondary }]}>
                              {calculateNutrition?.carbs}g
                            </Text>
                          </View>
                          <View style={styles.macronutrientItem}>
                            <View style={[styles.macronutrientIndicator, { backgroundColor: chartColors.protein }]} />
                            <Text style={[styles.macronutrientLabel, { color: paperTheme.colors.secondary }]}>
                              Protein
                            </Text>
                            <Text style={[styles.macronutrientValue, { color: paperTheme.colors.secondary }]}>
                              {calculateNutrition?.protein}g
                            </Text>
                          </View>
                          <View style={styles.macronutrientItem}>
                            <View style={[styles.macronutrientIndicator, { backgroundColor: chartColors.fat }]} />
                            <Text style={[styles.macronutrientLabel, { color: paperTheme.colors.secondary }]}>Fat</Text>
                            <Text style={[styles.macronutrientValue, { color: paperTheme.colors.secondary }]}>
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
                              backgroundColor: paperTheme.colors.primary,
                              opacity: submitting ? 0.7 : 1,
                            },
                          ]}
                          onPress={handleSubmit}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <ActivityIndicator color={paperTheme.dark ? "#000" : "#fff"} size="small" />
                          ) : (
                            <>
                              <Ionicons
                                name="add-circle-outline"
                                size={20}
                                color={paperTheme.dark ? "#000" : "#fff"}
                                style={styles.buttonIcon}
                              />
                              <Text style={[styles.addButtonText, { color: paperTheme.dark ? "#000" : "#fff" }]}>
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
        </SafeAreaView>
      </GradientBlurBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  recipeYield: {
    fontSize: 16,
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timingContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  timingBlur: {
    borderRadius: 16,
  },
  timingContent: {
    flexDirection: "row",
    padding: 20,
  },
  timingItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  timingDivider: {
    width: 1,
    height: "100%",
    marginHorizontal: 16,
  },
  timingLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  timingValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  tabNavContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  tabNavBlur: {
    borderRadius: 12,
  },
  tabNavContent: {
    flexDirection: "row",
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  contentSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  ingredientItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientTouchable: {
    padding: 16,
  },
  ingredientContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  ingredientName: {
    fontSize: 16,
    flex: 1,
    textTransform: "capitalize",
  },
  ingredientAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  ingredientNutrition: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nutritionText: {
    fontSize: 12,
  },
  directionItem: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  directionText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  nutritionItem: {
    width: (width - 56) / 2,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionName: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  nutritionPercentage: {
    fontSize: 12,
  },
  bottomSpacing: {
    height: 100,
  },
  // Modal and drawer styles
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

export default RecipeDetailScreen
