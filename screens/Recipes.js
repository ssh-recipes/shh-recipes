import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Modal } from 'react-native';

const filters = ['Halal', 'Gluten Free', 'Dairy Free', 'Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Low Carb'];
const sortFilters = ['Smart Filter', 'Frequently Cooked', 'Favourites', 'Available to cook']
const recipes = [
  { id: 1, title: "Nice food good food we love it. Recipe 1", image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chicken_spinach_gnocchi_16914_16x9.jpg" },
  { id: 2, title: "Nice food good food we love it. Recipe 2", image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chickencasserole_85719_16x9.jpg" },
  { id: 3, title: "Nice food good food we love it. Recipe 3", image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/easy_spaghetti_bolognese_93639_16x9.jpg" },
];

export default function Recipes() {

  //filters
  const [selectedFilters, setSelectedFilters] = useState([]);
  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  
  //sortFilters
  const [selectedSortFilters, setSelectedSortFilters] = useState([]);
  
  const toggleSortFilters = (filter) => {
    if (selectedSortFilters.includes(filter)) {
      setSelectedSortFilters(selectedSortFilters.filter((item) => item !== filter));
    } else {
      setSelectedSortFilters([...selectedSortFilters, filter]);
    }
  };
  
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
                selectedSortFilters.includes(filter) && styles.filterButtonActive,
              ]}
              onPress={() => toggleSortFilters(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedSortFilters.includes(filter) && styles.filterTextActive,
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

      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.recipesContainer}>
          {recipes.map((recipe) => (
            <View key={recipe.id} style={styles.recipeCard}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <Text style={styles.recipeText}>{recipe.title}</Text>
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
  recipeText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'left',
    padding: 10, // Padding to avoid text sticking to the bottom
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
});
