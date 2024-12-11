import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { DietaryReqs, RecipeCard } from "../components";
import { getRecipes, getRules } from "../lib/api";
import { RecipesPageStyles } from "../styles";

const sortFilters = [
  {
    id: "recommended",
    name: "Recommended"
  },
  {
    id: "recent",
    name: "Recent"
  },
  {
    id: "favourite",
    name: "Favourites"
  }
];

export default function Recipes({ navigation }) {
  const [isDietaryFilterVisible, setDietaryFilterVisible] = useState(false);
  const [selectedSortFilter, setSelectedSortFilter] = useState(sortFilters[0]);
  const [recipes, setRecipes] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [filters, setFilters] = useState([]);

  const selectSortFilter = (filter) => {
    setSelectedSortFilter(filter);
    setReloadData(true);
  };

  const openFilterModal = () => {
    setDietaryFilterVisible(true);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (reloadData === true) {
      fetchRecipes();
      setReloadData(false);
    }
  }, [reloadData]);

  const fetchRecipes = async () => {
    try {
      const fRecipes = await getRecipes(selectedSortFilter.id, 0, 20);
      const fRules = await getRules();

      if (fRecipes && fRecipes.success) {
        setRecipes(fRecipes.data);
      } else {
        console.error("Error: Fetch recipes in Recipes.");
        setRecipes([]);
      }

      if (fRules && fRules.success) {
        setFilters(fRules.data);
      } else {
        console.error("Error: Fetch recipe in DietaryReqs.");
        setFilters([]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <View style={RecipesPageStyles.container}>
      <View style={RecipesPageStyles.selectionView}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={RecipesPageStyles.scrollContainer}
        >
          <TouchableOpacity
            style={RecipesPageStyles.filterButton}
            onPress={openFilterModal}
          >
            <Text style={RecipesPageStyles.filterText}>Dietary Filters</Text>
          </TouchableOpacity>
          <View style={RecipesPageStyles.separator} />
          {sortFilters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                RecipesPageStyles.filterButton,
                selectedSortFilter.id === filter.id && RecipesPageStyles.filterButtonActive, // Apply active style based on selected filter
              ]}
              onPress={() => selectSortFilter(filter)}
            >
              <Text
                style={[
                  RecipesPageStyles.filterText,
                  selectedSortFilter.id === filter.id && RecipesPageStyles.filterTextActive, // Apply active text style based on selected filter
                ]}
              >
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <DietaryReqs
        isFilterVisible={isDietaryFilterVisible}
        setFilterVisible={setDietaryFilterVisible}
        setReloadData={setReloadData}
        filters={filters}
      />

      <View style={RecipesPageStyles.mainContainer}>
        <ScrollView contentContainerStyle={RecipesPageStyles.recipesContainer}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              navigation={navigation}
              filters={filters}
            />
          ))}
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}