import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { DieatryReqs, RecipeCard } from '../components';

const sortFilters = ['Smart Filter', 'Frequently Cooked', 'Favourites', 'Available to cook']
const primaryFontSize = 16
const secondaryFontSize = 14
// Example recipes, will use fetch from backend

const recipes = [
  { id: 1, 
    title: "Chicken & Spinach Gnocchi (Serves 2-3)", 
    image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chicken_spinach_gnocchi_16914_16x9.jpg",
    description: "a comforting, savory dish with tender chicken",
    videoUrl: "",
    ingredients:[
      { name: 'Chicken', quantity: '200g', available: true },
      { name: 'Spinach', quantity: '100g', available: true },
      { name: 'Gnocchi', quantity: '250g', available: false }
    ],
    rating: 1,
    filters: ['Halal', 'Gluten Free'],
    isFavourite: false,
    lastCooked: "2024-11-20"
  },
  { id: 2,
    title: "Homemade Chicken Casserole",
    image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chickencasserole_85719_16x9.jpg",
    description: "with garlic and chilli",
    videoUrl: "",
    ingredients:[
      { name: 'Chicken', quantity: '500g', available: true },
      { name: 'Carrots', quantity: '2 large, sliced', available: true },
      { name: 'Onion', quantity: '1 medium, chopped', available: false },
      { name: 'Garlic', quantity: '2 cloves, minced', available: true },
      { name: 'Potatoes', quantity: '3 medium, peeled and cubed', available: true },
      { name: 'Celery', quantity: '2 stalks, chopped', available: true },
      { name: 'Chicken stock', quantity: '500ml', available: false },
      { name: 'Frozen peas', quantity: '100g', available: true },
      { name: 'Thyme', quantity: '1 tsp', available: true },
      { name: 'Bay leaves', quantity: '2', available: true },
      { name: 'Salt', quantity: 'to taste', available: true },
      { name: 'Black pepper', quantity: 'to taste', available: true }
    ],
    rating: 4.5,
    filters: ['Halal'],
    isFavourite: false,
    lastCooked: "2024-11-20"
  },
  { id: 3,
    title: "Easy Spaghetti Bolognese",
    image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/easy_spaghetti_bolognese_93639_16x9.jpg",
    description: "with fresh tomatoes",
    videoUrl: "",
    ingredients:[
      { name: 'spaghetti', quantity: '200g', available: true },
      { name: 'tomato', quantity: '100g', available: true },
      { name: 'onions', quantity: '250g', available: true }
    ],
    rating: 3,
    filters: [],
    isFavourite: true,
    lastCooked: "2024-11-20"
  },
];


export default function Recipes() {
  const [isDieatryFilterVisible, setDieatryFilterVisible] = useState(false);
  const [selectedSortFilter, setSelectedSortFilter] = useState("");
  
  //Set Recipe Favourite
  const [favourite, setFavourite] = useState([]);
  const toggleFavourite = (recipeId) => {
    if(favourite.includes(recipeId)){
      setFavourite(favourite.filter((item) => item !== recipeId));
    }
    else{
      setFavourite([...favourite, recipeId]);
    }
  };
  
  // All ingredients available
  const allIngredientsAvailable = (recipe) => {
    return recipe.ingredients.every(ingredient => ingredient.available);
  };

  //Filters
  // const toggleFilter = (filter) => {
  //   if (selectedFilters.includes(filter)) {
  //     setSelectedFilters(selectedFilters.filter((item) => item !== filter));
  //   } else {
  //     setSelectedFilters([...selectedFilters, filter]);
  //   }
  // };
  
  const toggleSortFilter = (filter) => 
    setSelectedSortFilter(
      filter === selectedSortFilter 
      ? null 
      : filter
    );

  const openFilterModal = () => {
    setDieatryFilterVisible(true);
  };

return (
    <View style={styles.container}>
      {/* Filters and Button Container */}
      <View style={styles.selectionView}>
        {/* Sort Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
        {/* Filter Button */}
        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
        {/* Filter Button */}
        {sortFilters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              selectedSortFilter === filter && styles.filterButtonActive, // Apply active style based on selected filter
            ]}
            onPress={() => toggleSortFilter(filter)} // Toggle selection on press
          >
            <Text
              style={[
                styles.filterText,
                selectedSortFilter === filter && styles.filterTextActive, // Apply active text style based on selected filter
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>
      {/* Filter Modal */}

      <DieatryReqs isFilterVisible={isDieatryFilterVisible} setFilterVisible={setDieatryFilterVisible}/>

      {/* Main Container */}
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.recipesContainer}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe}/>
          ))}
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
  },

  // Filter Section
  selectionView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 10,
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4, // Android shadows
    alignSelf: 'flex-start',
  },
  filterButtonActive: {
    backgroundColor: '#148B4E',
  },
  filterText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#fff',
  },

  // Recipe Card Section
  recipesContainer: {
    marginTop: 5,
    marginHorizontal: 10,
  },
  recipeCard: {
    backgroundColor: '#148B4E',
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4, // Android shadows
  },
  recipeImageContainer: {
    position: 'relative',
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9, // Maintain aspect ratio
  },
  recipeImage: {
    width: '100%',
    height: '100%', // Full container size
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure it's above the image
  },
  exclamationIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  filterAndStarsContainer: {
    flexDirection: 'row',  // Align filters and stars horizontally
    justifyContent: 'space-between',  // Space out filters and stars
    alignItems: 'center',  // Vertically center the content
    paddingHorizontal: 5,
  },

  // Recipe Texts
  recipeText: {
    fontSize: primaryFontSize,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    padding: 0,
    marginLeft: 10,
    marginTop: 5,
    letterSpacing: 1,
    textTransform: 'capitalize',
  },
  descriptionText: {
    fontSize: secondaryFontSize,
    marginLeft: 10,
    color: '#fff',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 5,
  },

  // Filter Badges (Applied to Recipe Filters)
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5,
  },
  filterBadge: {
    backgroundColor: '#148B4E',
    color: '#fff',
    borderRadius: 15,
    fontSize: secondaryFontSize,
    fontWeight: 'bold',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,  // Makes it circular
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginHorizontal: 5,
  },

  // Ingredients Section
  ingredientsScroll: {
    paddingVertical : 5,
  },
  ingredientText: {
    fontSize: secondaryFontSize,
    color: '#fff',
    marginLeft: 10,
    fontStyle: 'italic',
  },
  missingIngredientText: {
    color: 'red', // Font color for missing ingredients
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollViewModal: {
    maxHeight: 300,
    width: '100%',
  },
  modalCloseButton: {
    backgroundColor: '#148B4E',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },

  // Content Styles
  available: {
    color: 'green',
    fontWeight: 'bold',
  },
  missing: {
    color: 'red',
    fontWeight: 'bold',
  },

  contentText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});