import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DieatryReqs, RecipeCard } from '../components';

const sortFilters = ['Smart Filter', 'Frequently Cooked', 'Favourites', 'Available to cook']
const primaryFontSize = 16
const secondaryFontSize = 14
// Example recipes, will use fetch from backend

const recipes = [
  { id: 1, 
    title: "Chocolate Chip Cookies", 
    image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2022%2F03%2F08%2F10813-best-chocolate-chip-cookies-mfs-step-7-148.jpg&q=60&c=sc&poi=auto&orient=true&h=512",
    description: "with a Hint of Cinnamon",
    videoUrl: "",
    ingredients:[
      { name: 'Sunflower oil', quantity: '150ml', available: true },
      { name: 'Self-raising flour', quantity: '175g', available: false },
      { name: 'Bicarbonate of soda', quantity: '2 tbsp', available: true },
      { name: 'Caster sugar', quantity: '150g', available: false },
      { name: 'Large egg', quantity: '2', available: true },
      { name: 'Unsalted butter', quantity: '175g', available: true },
      { name: 'Icing sugar', quantity: '225g', available: false },
      { name: 'Cocoa powder', quantity: '40g', available: false },
    ],
    rating: 4.5,
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


export default function Recipes({ navigation }) {
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
      <View style={styles.selectionView}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
        {sortFilters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              selectedSortFilter === filter && styles.filterButtonActive, // Apply active style based on selected filter
            ]}
            onPress={() => toggleSortFilter(filter)}
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

      <DieatryReqs isFilterVisible={isDieatryFilterVisible} setFilterVisible={setDieatryFilterVisible}/>

      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.recipesContainer}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} navigation={navigation}/>
          ))}
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({

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
    elevation: 4,
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
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  exclamationIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  filterAndStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
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
    borderRadius: 8,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginHorizontal: 5,
  },
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
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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