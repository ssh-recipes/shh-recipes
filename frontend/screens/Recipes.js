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
import { getRecipes } from "../lib/api";
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

      if (fRecipes && fRecipes.success) {
        setRecipes(fRecipes.data);
      } else {
        console.error("Error: Fetch recipes in Recipes.");
        setRecipes([]);
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
      />

      <View style={RecipesPageStyles.mainContainer}>
        <ScrollView contentContainerStyle={RecipesPageStyles.recipesContainer}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     maxWidth: '65vh',
//     width: '100%',
//     justifyContent: 'center',
//     // alignItems: 'center',
//     marginHorizontal: 'auto',
//   },
//   mainContainer: {
//     flex: 1,
//   },
//   separator: {
//     height: 25,
//     width: 2,
//     backgroundColor: "gray",

//     marginLeft: 10,
//     marginBottom: 10,
//   },

//   // Filter Section
//   selectionView: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     marginTop: 10,
//     flexWrap: "wrap",
//     justifyContent: "flex-start",
//   },
//   scrollContainer: {
//     alignItems: "center",
//     paddingVertical: 10,
//     paddingRight: 10,
//   },
//   missingIngredientText: {
//     color: "red",
//   },
//   filterButton: {
//     backgroundColor: "#fff",
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     marginLeft: 10,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.5,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 4,
//     alignSelf: "flex-start",
//   },
//   filterButtonActive: {
//     backgroundColor: "#FFB23F",
//   },
//   filterText: {
//     color: "#000",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   filterTextActive: {
//     color: "#000",
//   },
//   recipesContainer: {
//     marginTop: 5,
//     marginHorizontal: 10,
//   },
//   ingredientsScroll: {
//     paddingVertical: 5,
//   },
// });
