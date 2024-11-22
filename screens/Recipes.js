import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';


const filters = ['Halal', 'Gluten Free', 'Dairy Free', 'Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Low Carb'];
const recipes = [
  { id: 1, title: "Nice food good food we love it. Recipe 1", image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chicken_spinach_gnocchi_16914_16x9.jpg" },
  { id: 2, title: "Nice food good food we love it. Recipe 2", image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chickencasserole_85719_16x9.jpg" },
  { id: 3, title: "Nice food good food we love it. Recipe 3", image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/easy_spaghetti_bolognese_93639_16x9.jpg" },
];

export default function Recipes() {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectionView}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
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
      </View>
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
    // margin: 10,
  },
  selectionView: {
    // position: 'absolute'
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
    paddingBottom: 50,
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
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10, // Round the top corners of the image
  },
  recipeText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'left',
    padding: 10, // Padding to avoid text sticking to the bottom
  },
});
