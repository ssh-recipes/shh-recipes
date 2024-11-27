import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const filters = ['Halal', 'Gluten Free', 'Dairy Free', 'Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Low Carb'];
const sortFilters = ['Smart Filter', 'Frequently Cooked', 'Favourites', 'Available to cook']
// Example recipes, will use fetch from backend

const recipes = [
  { id: 1, 
    title: "Chicken Spinach Gnocchi", 
    image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chicken_spinach_gnocchi_16914_16x9.jpg",
    description: "Good gnocchi",
    videoUrl: "",
    ingredients:[
      { name: 'Chicken', quantity: '200g', available: true },
      { name: 'Spinach', quantity: '100g', available: true },
      { name: 'Gnocchi', quantity: '250g', available: false }
    ],
    rating: 1,
    filter: "Halal",
    isFavourite: false,
    lastCooked: "2024-11-20"
  },
  { id: 2,
    title: "Chicken Casserole",
    image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chickencasserole_85719_16x9.jpg",
    description: "Good Casserole",
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
    filter: "Halal",
    isFavourite: false,
    lastCooked: "2024-11-20"
  },
  { id: 3,
    title: "Easy Spaghetti Bolognese",
    image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/easy_spaghetti_bolognese_93639_16x9.jpg",
    description: "Good bolognese",
    videoUrl: "",
    ingredients:[
      { name: 'spaghetti', quantity: '200g', available: true },
      { name: 'tomato', quantity: '100g', available: true },
      { name: 'onions', quantity: '250g', available: false }
    ],
    rating: 3,
    filter: "Halal",
    isFavourite: true,
    lastCooked: "2024-11-20"
  },
];


export default function Recipes() {
  
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
  const [selectedFilters, setSelectedFilters] = useState([]);
  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  
  //Sort Filters
  const [selectedSortFilter, setSelectedSortFilter] = useState("");
  const toggleSortFilter = (filter) => setSelectedSortFilter(filter === selectedSortFilter ? null : filter);
  
  // Modal visibility state for the filters menu
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
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
          {sortFilters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                selectedSortFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => toggleSortFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedSortFilter.includes(filter) && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Filters</Text>
            <ScrollView style={styles.scrollViewModal}>
              {filters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterButton,
                    selectedFilters.includes(filter) && styles.filterButtonActive,
                  ]}
                  onPress={() => toggleFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilters.includes(filter) && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeFilterModal}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Main Container */}
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.recipesContainer}>
          {recipes.map((recipe) => (
            <View key={recipe.id} style={styles.recipeCard}>
              {/* Recipe Image */}
              <View style={styles.recipeImageContainer}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                {/*Is Favourite*/}
                <TouchableOpacity
                  onPress={() => toggleFavourite(recipe.id)}
                  style={styles.favoriteIconContainer}
                >
                  <Icon
                    name={favourite.includes(recipe.id) ? 'heart' : 'heart-o'}  // 'heart' for filled, 'heart-o' for empty
                    size={30}
                    color={favourite.includes(recipe.id) ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
                {recipe.ingredients.some(ingredient => !ingredient.available) && (
                <Icon
                  name="exclamation-circle"
                  size={30}
                  color="red"
                  style={styles.exclamationIcon}
                />
              )}
              </View>
              {/* Recipe Title */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.recipeText}>{recipe.title}</Text>
              {/* Recipe Description */}
              </View>
              <Text style={styles.descriptionText}>{recipe.description}</Text>
              {/* Recipe Rating */}
              <View style={styles.starContainer}>
                <Text style={styles.recipeText}>
                  {[...Array(5)].map((_, index) => {
                    // Determine if this is a full, half, or empty star
                    if (index < Math.floor(recipe.rating)) {
                      return (
                        <Icon 
                          key={index} 
                          name="star" 
                          size={20} 
                          color="gold" 
                        />
                      );
                    } else if (index < recipe.rating) {
                      return (
                        <Icon 
                          key={index} 
                          name="star-half-o" 
                          size={20} 
                          color="gold" 
                        />
                      );
                    } else {
                      return (
                        <Icon 
                          key={index} 
                          name="star-o" 
                          size={20} 
                          color="gray" 
                        />
                      );
                    }
                  })}
                </Text>
              </View>
                 {/* Ingredients Horizontal Scroll */}
                 <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsScroll}>
  {recipe.ingredients.map((ingredient, index) => (
    <Text
      key={index}
      style={[
        styles.ingredientText,
        !ingredient.available && styles.missingIngredientText, // Apply red color for missing ingredients
      ]}
    >
      {ingredient.name} ({ingredient.quantity})
    </Text>
  ))}
</ScrollView>

                {/* Filters Below Recipe */}
                <View style={styles.filtersContainer}>
                  {recipe.filters && recipe.filters.map((filter, index) => (
                    <Text key={index} style={styles.filterBadge}>
                      {filter}
                    </Text>
                  ))}
                </View>
            </View>
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
  selectionView: {
    // position: 'absolute'
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    marginTop: 10,
    //paddingVertical: 10,
    //paddingRight: 10,
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
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
  contentText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  recipesContainer: {
    marginTop: 5,
    marginHorizontal: 10,
  },
  recipeCard: {
    // height: Dimensions.get('window').height * 0.35, // 35% of the screen height
    backgroundColor: '#148B4E',
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4, // Android shadows
  },
  recipeImage: {
    width: '100%', // Full width of the card
    height: undefined, // Let height be calculated based on aspect ratio
    aspectRatio: 16 / 9, // Maintain a 16:9 aspect ratio
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10, // Round the top corners of the image
  },
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
  available: {
    color: 'green',  
    fontWeight: 'bold',
  },
  missing: {
    color: 'red',    
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
    marginLeft: 10,
    fontStyle: 'italic',  
    fontFamily: 'Arial', 
    color: '#fff',
  },
  recipeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    padding: 0,
    marginLeft: 10,
    letterSpacing: 1,
    textTransform: 'capitalize', // Capitalize each word for better readability
  },
  starContainer: {
    flexDirection: 'row',      // Align items in a row
    justifyContent: 'flex-end', // Align the stars to the right
    alignItems: 'center',      // Center the stars vertically (optional)
    paddingRight: 10,          // Add some padding from the right edge (optional)
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
  ingredientsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  ingredientItem: {
    marginBottom: 5,
  },
  ingredientText: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
  },
  exclamationIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  filtersContainer: {
    flexDirection: 'row',  // To place filters horizontally
    flexWrap: 'wrap',      // Allow wrapping if too many filters
    marginTop: 10,         // Add some space between recipe info and filters
  },
  
  filterBadge: {
    backgroundColor: '#148B4E',
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  
  ingredientsScroll: {
    marginTop: 10,
    paddingVertical: 5,
  },
  /*
  ingredientContainer: {
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  */

  ingredientText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    marginLeft: 10,
    color: 'white', // Default color for available ingredients
  },
  missingIngredientText: {
    color: 'red', // Font color for missing ingredients
  },
  ingredientsScroll: {
    paddingVertical: 10, // Optional for spacing
  },
});
