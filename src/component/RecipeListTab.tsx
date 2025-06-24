"use client"

import { useState } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput as RNTextInput,
  Dimensions,
} from "react-native"
import { Text } from "react-native-paper"
import { BlurView } from "expo-blur"
import { useAppTheme } from "../libs/theme"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import * as Haptics from "expo-haptics"
import { recipeData } from "../constants/RecipeListMockData"

const { width } = Dimensions.get("window")

type Recipe = {
  id: string
  recipe_name: string
  img_src: string
}

const RecipeListTab = () => {
  const theme = useAppTheme()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipeData)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredRecipes(recipeData)
    } else {
      const filtered = recipeData.filter((recipe) => recipe.recipe_name.toLowerCase().includes(query.toLowerCase()))
      setFilteredRecipes(filtered)
    }
  }

  const handleRecipePress = (recipe: Recipe) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    navigation.navigate("RecipeDetail", { recipeId: recipe.id })
  }

  const renderRecipeCard = (recipe: Recipe, index: number) => (
    <TouchableOpacity key={recipe.id} style={styles.recipeCard} onPress={() => handleRecipePress(recipe)}>
      <BlurView intensity={60} tint={theme.dark ? "dark" : "light"} style={styles.recipeCardBlur}>
        <View style={styles.recipeCardContent}>
          <Image source={{ uri: recipe.img_src }} style={styles.recipeImage} />
          <View style={styles.recipeInfo}>
            <Text
              style={[
                styles.recipeName,
                {
                  fontFamily: theme.fonts.titleMedium.fontFamily,
                  color: theme.colors.secondary,
                },
              ]}
              numberOfLines={2}
            >
              {recipe.recipe_name}
            </Text>
            <View style={styles.recipeActions}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="heart-outline" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="bookmark-outline" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  )

  return (
    <View style={styles.tabContentContainer}>
      {/* Header */}
      <View style={styles.recipeHeader}>


        {/* Search Bar */}
        <View style={styles.recipeSearchContainer}>
          <BlurView intensity={60} tint={theme.dark ? "dark" : "light"} style={styles.searchBlur}>
            <View style={styles.recipeSearchInputContainer}>
              <Ionicons name="search" size={20} color={`${theme.colors.secondary}60`} />
              <RNTextInput
                style={[
                  styles.recipeSearchInput,
                  {
                    fontFamily: theme.fonts.bodyMedium.fontFamily,
                    color: theme.colors.secondary,
                  },
                ]}
                placeholder="Search recipes..."
                placeholderTextColor={`${theme.colors.secondary}60`}
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>
          </BlurView>
        </View>

    
      </View>

      {/* Recipe Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.recipeGrid}>{filteredRecipes.map((recipe, index) => renderRecipeCard(recipe, index))}</View>

        {filteredRecipes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color={`${theme.colors.secondary}40`} />
            <Text
              style={[
                styles.emptyText,
                {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                  color: `${theme.colors.secondary}60`,
                },
              ]}
            >
              No recipes found
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                {
                  fontFamily: theme.fonts.bodyMedium.fontFamily,
                  color: `${theme.colors.secondary}40`,
                },
              ]}
            >
              Try adjusting your search terms
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  tabContentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recipeHeader: {

  },
  recipeHeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recipeSearchContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  searchBlur: {
    borderRadius: 12,
  },
  recipeSearchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recipeSearchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  recipeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recipeCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeCardBlur: {
    borderRadius: 16,
  },
  recipeCardContent: {
    padding: 12,
  },
  recipeImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 20,
  },
  recipeActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
})

export default RecipeListTab
