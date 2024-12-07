import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const primaryFontSize = 16;
const secondaryFontSize = 14;

const recipeId = {
  title: "Easy chocolate fudge cake",
  video: "https://0c18e53b.media.greenvideo.io/0c18e53b610964fac175fe0e757adc30557e79b7/878e15a9abb541b09ff0df43c2b45f79bd5d4c9c/MEDIA/v1/HD/media.mp4",
  ingredients: [
    "150ml sunflower oil",
    "175g self-raising flour",
    "2 tbsp cocoa powder",
    "1 tsp bicarbonate of soda",
    "150g caster sugar",
    "2 tbsp golden syrup",
    "2 large eggs",
    "100g unsalted butter",
    "225g icing sugar",
    "40g cocoa powder",
  ],
  steps: [
    { text: "Heat the oven to 180C/160C fan/gas 4. Oil and line the base of two 18cm sandwich tins. Sieve the flour, cocoa powder and bicarbonate of soda into a bowl. Add the caster sugar and mix well.", timestamp: 8 },
    { text: "Make a well in the centre and add the golden syrup, eggs, sunflower oil and milk. Beat well with an electric whisk until smooth.", timestamp: 22 },
    { text: "Pour the mixture into the two tins and bake for 25-30 mins until risen and firm to the touch. Remove from oven, leave to cool for 10 mins before turning out onto a cooling rack.", timestamp: 36 },
    { text: "To make the icing, beat the unsalted butter in a bowl until soft. Gradually sieve and beat in the icing sugar and cocoa powder, then add enough of the milk to make the icing fluffy and spreadable.", timestamp: 45 },
    { text: "Add the egg mixture to the pasta and toss quickly to create a creamy sauce.", timestamp: 55 },
    { text: "Sandwich the two cakes together with the butter icing and cover the sides and the top of the cake with more icing.", timestamp: 65 },
  ],
};

export default function RecipeCard({navigation, recipe}) {
  const [isfavourite, setFavourite] = useState(recipe.isFavourite);
  const toggleFavourite = () => {
    recipe.isFavourite = !isfavourite;
    setFavourite(!isfavourite);
  };

  return (
    <View style={styles.recipeCard}>
      <View style={styles.recipeImageContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('RecipePage', { recipeId: recipeId })}
          style={styles.imageButton}
        >
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
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
        {recipe.ingredients.some(ingredient => !ingredient.available) && (
          <Icon
            name="exclamation-circle"
            size={30}
            color="red"
            style={styles.exclamationIcon}
          />
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.recipeText}>{recipe.title}</Text>
      </View>
      <Text style={styles.descriptionText}>{recipe.description}</Text>
      <View style={styles.filterAndStarsContainer}>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsScroll}>
        {recipe.ingredients.map((ingredient, index) => (
          <Text
            key={index}
            style={[
              styles.ingredientText,
              !ingredient.available && styles.missingIngredientText,
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
