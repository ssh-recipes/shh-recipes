import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const primaryFontSize = 16
const secondaryFontSize = 14

export default function RecipeCard({recipe}) {
  const [isfavourite, setFavourite] = useState(recipe.isFavourite);
  const toggleFavourite = () => {
    recipe.isFavourite = !isfavourite;
    setFavourite(!isfavourite);
    console.log(recipe);
  };

  return (
    <View style={styles.recipeCard}>
      {/* Recipe Image */}
      <View style={styles.recipeImageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        {/*Is Favourite*/}
        <TouchableOpacity
          onPress={() => toggleFavourite()}
          style={styles.favoriteIconContainer}
        >
          <Icon
            name={isfavourite ? 'heart' : 'heart-o'}  // 'heart' for filled, 'heart-o' for empty
            size={30}
            color={isfavourite ? 'red' : 'gray'}
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
      </View>
      
      {/* Recipe Description */}
      <Text style={styles.descriptionText}>{recipe.description}</Text>
      {/* Filters and Stars Container */}
      <View style={styles.filterAndStarsContainer}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          {recipe.filters && recipe.filters.length > 0 && recipe.filters.map((filter, index) => (
            <React.Fragment key={index}>
              <Text style={styles.filterBadge}>
                {filter}
              </Text>
              {index < recipe.filters.length - 1 && <View style={styles.circle} />}
            </React.Fragment>
          ))}
        </View>
        {/* Stars Rating */}
        <View style={styles.starContainer}>
          <Text style={styles.recipeText}>
            {[...Array(5)].map((_, index) => {
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