import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DietaryReqs, RecipeCard } from '../components';
import { getRecipes } from '../lib/api';

const sortFilters = ['Recommended', 'Recent', 'Favourites']

export default function Recipes({ navigation }) {
  const [isDietaryFilterVisible, setDietaryFilterVisible] = useState(false);
  const [selectedSortFilter, setSelectedSortFilter] = useState("Recommended");
  const [recipes, setRecipes] = useState([]);
  
  const selectSortFilter = (filter) => 
    setSelectedSortFilter(filter)

  const openFilterModal = () => {
    setDietaryFilterVisible(true);
  };

  useEffect(() => {
    fetchUserFilters();
  }, []);

  const fetchUserFilters = async () => {
    try {
      const fRecipes = await getRecipes(selectedSortFilter, 0, 20);

      if (fRecipes && fRecipes.success) {
        setRecipes(fRecipes.data);
      } else {
        console.error("Error: Fetch recipes in Recipes.")
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }

return (
  <View style={styles.container}>
    <View style={styles.selectionView}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
      <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
        <Text style={styles.filterText}>Dietary Filters</Text>
      </TouchableOpacity>
      <View style={styles.separator}/>
      {sortFilters.map((filter, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.filterButton,
            selectedSortFilter === filter && styles.filterButtonActive, // Apply active style based on selected filter
          ]}
          onPress={() => selectSortFilter(filter)}
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

    <DietaryReqs isFilterVisible={isDietaryFilterVisible} setFilterVisible={setDietaryFilterVisible}/>

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
  separator: {
    height: 25,
    width: 2,
    backgroundColor: 'gray',

    marginLeft: 10,
    marginBottom: 10,
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
    backgroundColor: "#FFB23F",
  },
  filterText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#000',
  },
  recipesContainer: {
    marginTop: 5,
    marginHorizontal: 10,
  },
  ingredientsScroll: {
    paddingVertical : 5,
  },
});