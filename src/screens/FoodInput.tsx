"use client"

import { useState, useCallback } from "react"
import { View, StyleSheet, FlatList, Keyboard, TouchableOpacity, Modal, Platform, ScrollView, KeyboardAvoidingView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Text, ActivityIndicator, Snackbar, TextInput, Button, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"

import { useFocusEffect } from "@react-navigation/native"
import { apiLinks } from "../utils"
import { useAppSelector } from "../hooks/hook"
import GradientBlurBackground from "../component/Layout/background"

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

const FoodInputScreen = () => {
  const paperTheme = useTheme()
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
  const [gramsInput, setGramsInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
const token = useAppSelector(state=>state.user?.token)
  // Determine time-based query
  const getTimeBasedQuery = (): string => {
    const hour = new Date().getHours()
    if (hour < 10) {
      return "breakfast"
    } else if (hour < 14) {
      return "lunch"
    } else if (hour < 18) {
      return "snack"
    } else {
      return "dinner"
    }
  }

  // Fetch foods from API
  const fetchFoods = async (newQuery: string, pageNum = 1, reset = false) => {
    if (isLoadingMore && !reset) return // Avoid duplicate calls

    if (reset) {
      setLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    setError(null)

    try {
      const params: any = {
        query: newQuery,
        pageSize: 20,
        pageNumber: pageNum,
        sortBy: "dataType.keyword",
        sortOrder: "asc",
        api_key: "gP07Q5U7ULsiXCXLbCGVqk4c2Y6Yx39nMWJiuJxx",
        dataType: "Survey (FNDDS)", // Fixed to Survey data type
      }

      const response = await axios.get<ApiResponse>("https://api.nal.usda.gov/fdc/v1/foods/search", {
        params,
        headers: {
          accept: "application/json",
        },
      })

      if (response.data.foods.length === 0 && pageNum === 1) {
        showSnackbar("No foods found. Try a different search term.")
      }
      setFoods((prev) => (reset ? response.data.foods : [...prev, ...response.data.foods]))
      setTotalPages(response.data.totalPages)
      setPage(pageNum + 1) // Increment page for next load
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
      return () => {
        // Cleanup if needed
      }
    }, []),
  )

  // Handle search
  const handleSearch = () => {
    const query = searchQuery.trim() || getTimeBasedQuery()
    Keyboard.dismiss()
    fetchFoods(query, 1, true) // Reset list with new search
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
  }

  // Get Energy info (prefer KCAL)
  const getEnergyInfo = (nutrients: FoodItem["foodNutrients"]) => {
    const energyNutrient =
      nutrients.find((nutrient) => nutrient.nutrientName === "Energy" && nutrient.unitName === "KCAL") ||
      nutrients.find((nutrient) => nutrient.nutrientName === "Energy")

    return energyNutrient
      ? { amount: Math.round(energyNutrient.value), unit: energyNutrient.unitName }
      : { amount: 0, unit: "KCAL" }
  }

  // Get macronutrients
  const getMacroNutrients = (nutrients: FoodItem["foodNutrients"]) => {
    const protein = nutrients.find((n) => n.nutrientName === "Protein")
    const carbs = nutrients.find((n) => n.nutrientName === "Carbohydrate, by difference")
    const fat = nutrients.find((n) => n.nutrientName === "Total lipid (fat)")

    return {
      protein: protein ? Math.round(protein.value) : 0,
      carbs: carbs ? Math.round(carbs.value) : 0,
      fat: fat ? Math.round(fat.value) : 0,
    }
  }

  // Open drawer for food input
  const openDrawer = (food: FoodItem) => {
    setSelectedFood(food)
    setGramsInput("")
    setDrawerVisible(true)
  }

  // Close drawer
  const closeDrawer = () => {
    setDrawerVisible(false)
    setSelectedFood(null)
    setGramsInput("")
    Keyboard.dismiss()
  }

  // Handle submit food log
  const handleSubmit = async () => {
    if (!selectedFood) return

    const grams = parseFloat(gramsInput)
    if (isNaN(grams) || grams <= 0) {
      showSnackbar("Please enter a valid weight in grams (greater than 0).")
      return
    }

    setSubmitting(true)

    try {
      const { amount: calories } = getEnergyInfo(selectedFood.foodNutrients)
      const macros = getMacroNutrients(selectedFood.foodNutrients)

      const foodLogData: FoodLogData[] = [{
        name: selectedFood.description,
        grams,
        calories,
        carbs: macros.carbs,
        fat: macros.fat,
        protein: macros.protein,
      }]

      // Replace with your actual API endpoint
      await axios.post(apiLinks.food.input_manual, foodLogData, {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          "Authorization": token
        },   
      })

      showSnackbar("Food added successfully!")
      closeDrawer()
    } catch (err: any) {
      console.error(err)
      showSnackbar(err.response?.data?.message || "Failed to add food. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Render food item
  const renderFoodItem = ({ item }: { item: FoodItem }) => {
    const { amount, unit } = getEnergyInfo(item.foodNutrients)
    const macros = getMacroNutrients(item.foodNutrients)

    return (
      <TouchableOpacity
        style={[styles.itemContainer, { backgroundColor: theme.dark ? "#2A2A2A" : "#F5F5F5" }]}
        onPress={() => openDrawer(item)}
      >
        <View style={styles.foodInfoContainer}>
          <Text
            style={[styles.foodName, { color: theme.colors.secondary, fontFamily: "Montserrat_600SemiBold" }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <View style={styles.macrosContainer}>
            <Text style={[styles.macroText, { color: theme.colors.secondary, opacity: 0.7 }]}>
              P: {macros.protein}g
            </Text>
            <Text style={[styles.macroText, { color: theme.colors.secondary, opacity: 0.7 }]}>C: {macros.carbs}g</Text>
            <Text style={[styles.macroText, { color: theme.colors.secondary, opacity: 0.7 }]}>F: {macros.fat}g</Text>
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

        <Ionicons name="add-circle" size={24} color={theme.colors.primary} style={styles.addIcon} />
      </TouchableOpacity>
    )
  }

  // List empty component
  const renderEmptyList = () => {
    if (loading) return null

    return (
      <View style={styles.emptyContainer}>
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
      </View>
    )
  }

  return (
    <GradientBlurBackground>
    <SafeAreaView style={[styles.safeArea]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" }]}>
          Add Food
        </Text>

        {/* Search bar */}
        <View style={styles.searchContainer}>
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
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={[
                styles.loadingText,
                { color: theme.colors.secondary, opacity: 0.7, fontFamily: "Montserrat_500Medium" },
              ]}
            >
              Finding foods...
            </Text>
          </View>
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

        {/* Drawer for entering grams */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={drawerVisible}
          onRequestClose={closeDrawer}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeDrawer}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalOverlay}
            >
              <View style={[styles.drawerContainer, { backgroundColor: theme.colors.background }]}>
                <ScrollView
                  contentContainerStyle={styles.drawerContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <TouchableOpacity activeOpacity={1}>
                    <Text
                      style={[
                        styles.drawerTitle,
                        { color: theme.colors.secondary, fontFamily: "Montserrat_700Bold" },
                      ]}
                    >
                      Add {selectedFood?.description}
                    </Text>

                    <TextInput
                      mode="outlined"
                      label="Weight (grams)"
                      value={gramsInput}
                      onChangeText={setGramsInput}
                      keyboardType="numeric"
                      style={styles.gramsInput}
                      outlineColor={theme.dark ? "#444444" : "#DDDDDD"}
                      activeOutlineColor={theme.colors.primary}
                      textColor={theme.colors.secondary}
                      placeholderTextColor={theme.colors.secondary + "80"}
                    />

                    <View style={styles.buttonContainer}>
                      <Button
                        mode="outlined"
                        onPress={closeDrawer}
                        style={styles.cancelButton}
                        labelStyle={{ fontFamily: "Montserrat_500Medium" }}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        labelStyle={{ fontFamily: "Montserrat_500Medium" }}
                        disabled={submitting}
                        loading={submitting}
                      >
                        Submit
                      </Button>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: theme.dark ? "#444444" : "#333333" }]}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </SafeAreaView>
    </GradientBlurBackground>
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
    fontSize: 24,
    marginVertical: 16,
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "transparent",
  },
  listContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodInfoContainer: {
    flex: 1,
    marginRight: 8,
  },
  foodName: {
    fontSize: 16,
    marginBottom: 4,
  },
  macrosContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroText: {
    fontSize: 12,
    marginRight: 8,
  },
  caloriesContainer: {
    alignItems: "center",
    marginRight: 12,
  },
  caloriesValue: {
    fontSize: 18,
  },
  caloriesUnit: {
    fontSize: 12,
  },
  addIcon: {
    marginLeft: 4,
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
  snackbar: {
    marginBottom: 20,
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
  drawerContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
  },
  drawerContent: {
    paddingVertical: 16,
    paddingBottom: 32, // Extra padding to ensure content is not cut off when keyboard appears
  },
  drawerTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  gramsInput: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
})

export default FoodInputScreen