import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getRecipe, setIsRecipeFavourite } from "../lib/api";

const primaryFontSize = 16;
const secondaryFontSize = 14;

export default function RecipeCard({navigation, recipe}) {
  const [isfavourite, setFavourite] = useState(recipe.favourite);

  //change isFavourite and send to backend
  const toggleFavourite = async () => {
    // recipe.isFavourite = !isfavourite;
    const result = await setIsRecipeFavourite(recipe.id, !isfavourite);
    if (!result || result.success === false) {
      console.error("Error: setIsRecipeFavourite " + result.success);
    }
    setFavourite(!isfavourite);
  };

  //this will be usefull later so we do not load all recipe data for recipeList
  const fetchDataNavigate = async () => {
    try {
      const fRecipe = await getRecipe(recipe.id);
  
      if (fRecipe && fRecipe.success) {
        // navigation.navigate('RecipePage', { recipe: recipe }) //could be used instead
        navigation.navigate('RecipePage', { recipe: fRecipe.data })
      } else {
        console.error("Error: Fetch recipe in RecipePage.")
        //navigate to error page
        return null
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      //navigate to error page
      return null;
    }
  }

  return (
    <View style={styles.recipeCard}>
      <View style={styles.recipeImageContainer}>
        <TouchableOpacity onPress={() => fetchDataNavigate()}
          style={styles.imageButton}
        >
          <Image source={{ uri: recipe.icon }} style={styles.recipeImage} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => toggleFavourite()}
          style={styles.favoriteIconContainer}
        >
          <Icon
            name={isfavourite ? 'heart' : 'heart-o'}
            size={30}
            color={isfavourite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
        {recipe.ingredients.some(ingredient => !ingredient.fulfilled) && (
          <Icon
            name="exclamation-circle"
            size={30}
            color="red"
            style={styles.exclamationIcon}
          />
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.recipeText}>{recipe.name}</Text>
      </View>
      <Text style={styles.descriptionText}>{recipe.description}</Text>
      <View style={styles.filterAndStarsContainer}>
        <View style={styles.filtersContainer}>
          {recipe.rules && recipe.rules.length > 0 && recipe.rules.map((filter, index) => (
            <React.Fragment key={index}>
              <Text style={styles.filterBadge}>
                {filter}
              </Text>
              {index < recipe.rules.length - 1 && <View style={styles.circle} />}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.starContainer}>
          <Text style={styles.recipeText}>
            {[...Array(5)].map((_, index) => {
              const rating = recipe.avg_rating / 2;
              if (index < Math.floor(rating)) {
                return (
                  <Icon 
                    key={index} 
                    name="star" 
                    size={20} 
                    color="gold" 
                  />
                );
              } else if (index < rating) {
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsScroll}>
        {recipe.ingredients.map((ingredient, index) => (
          <Text
            key={index}
            style={[
              styles.ingredientText,
              !ingredient.fulfilled && styles.missingIngredientText,
            ]}
          >
            {ingredient.name} ({ingredient.quantity}{ingredient.unit !== "quantity" ? " " + ingredient.unit : ""})
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: '#148B4E',
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  recipeImageContainer: {
    position: 'relative',
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imageButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0, // Ensure image button is under the favorite and exclamation icons
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
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 5,
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
  ingredientsScroll: {
    paddingVertical : 5,
  },
});
