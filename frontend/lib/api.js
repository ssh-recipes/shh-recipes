// Every method's response follows the following schema
//
// Successful response:
// {
// 	"success": true,
// 	"data": obj | arr | undefined
// }
//
// Unsuccessful response:
// {
// 	"success": false,
// 	"error": string
// }
// 
// The methods do not raise errors, rather you should check response first. If an error occurs, a human readable message can be presented by simply looking at "error",
//

// GET /user
export const getUser = async () => {
	return {
		"success": true,
		"data": {
				"name": "Demo Account",
				"rules": [
			"dairy-free",
				]
		}
	}
}

// GET /rules
export const getRules = async () => {
	return {
		"success": true,
		"data": [
				{
			"id": "dairy-free",
			"name": "Dairy-Free",
			"description": "Does not contain milk or milk products, including cheese, butter, or any dairy derivatives."
				},
				{
			"id": "hala",
			"name": "Halal",
			"description": "Adheres to Islamic dietary laws, including the prohibition of pork, alcohol, and non-Halal-certified meat."
				}
		]
	}
}

// GET /rules/:ruleId
export const getRule = async (ruleId) => { // i don't think would be used, but added for parity
	return {
		"success": true,
		"data": {
			"id": "dairy-free",
			"name": "Dairy-Free",
			"description": "Does not contain milk or milk products, including cheese, butter, or any dairy derivatives."
		}
	}
}

// PUT /rules/:ruleId
// body: {
// 	"enabled": boolean
// }
export const setIsRuleEnabled = async (id, enabled) => {
	return {
		"success": true,
	}
}

// GET /recipes
// params: category, skip & take
export const getRecipes = async (category, skip, take) => {
	return {
		"success": true,
		"data": [
			{
				"id": "cheese_omellete",
				"name": "Cheese Omelette",
				"icon": "icons/cheese_omellette.png", // the api will host static assets, so icon would be BASE_URL/static/icons/cheese_omellete.png for example
				"video": "videos/cheese_omellete_vid.mp4",
				"description": "A delicious cheese omelette.",
				"instructions": "Whisk eggs and add cheese.",
				"avg_rating": 9, // 0-10, divide by 2 to get the "stars", e.g. 9 means 4.5/5
				"ingredients": [
					{
						"id": "egg",
						"name": "Egg",
						"quantity": 2,
						"unit": "quantity",
						"fulfilled": true
					},
					{
						"id": "milk",
						"name": "Milk",
						"quantity": 100,
						"unit": "ml",
						"fulfilled": true
					}
				],
				"times_cooked": 25000, // this is the total amount cooked, not per user
				"favourite": false,
				"last_cooked": null, // last cooked may be null
			},
			{
				"id": "carrot_salad",
				"name": "Carrot Salad",
				"icon": "icons/carrot_salad.png",
				"video": "videos/carrot_salad_video.mp4",
				"description": "A healthy carrot salad.",
				"instructions": "Grate carrots and add dressing.",
				"avg_rating": 6,
				"ingredients": [
					{
						"id": "carrot",
						"name": "Carrot",
						"quantity": 3,
						"unit": "quantity",
						"fulfilled": true,
					}
				],
				"times_cooked": 50000,
				"favourite": true,
				"last_cooked": new Date(new Date().getTime() - 10 * 60 * 1000) // 10 minutes ago
			}
		]
	}
}

// GET /recipes/:recipeId
export const getRecipe = async (id) => {
  return {
		"success": true,
		"data": {
				"id": "cheese_omellete",
				"name": "Cheese Omelette",
				"icon": "cheese_omellette",
				"video": "https://0c18e53b.media.greenvideo.io/0c18e53b610964fac175fe0e757adc30557e79b7/878e15a9abb541b09ff0df43c2b45f79bd5d4c9c/MEDIA/v1/HD/media.mp4",
				"description": "A delicious cheese omelette.",
				"instructions": "Whisk eggs and add cheese.",
				"avg_rating": 9,
				"steps": [
					{ "text": "Heat the oven to 180C/160C fan/gas 4. Oil and line the base of two 18cm sandwich tins. Sieve the flour, cocoa powder and bicarbonate of soda into a bowl. Add the caster sugar and mix well.", "timestamp": 8 },
					{ "text": "Make a well in the centre and add the golden syrup, eggs, sunflower oil and milk. Beat well with an electric whisk until smooth.", "timestamp": 22 },
					{ "text": "Pour the mixture into the two tins and bake for 25-30 mins until risen and firm to the touch. Remove from oven, leave to cool for 10 mins before turning out onto a cooling rack.", "timestamp": 36 },
					{ "text": "To make the icing, beat the unsalted butter in a bowl until soft. Gradually sieve and beat in the icing sugar and cocoa powder, then add enough of the milk to make the icing fluffy and spreadable.", "timestamp": 45 },
					{ "text": "Add the egg mixture to the pasta and toss quickly to create a creamy sauce.", "timestamp": 55 },
					{ "text": "Sandwich the two cakes together with the butter icing and cover the sides and the top of the cake with more icing.", "timestamp": 65 },
				],
				"ingredients": [
				{
					"id": "sunflower_oil",
					"name": "Sunflower oil",
					"quantity": 150,
					"unit": "ml",
					"fulfilled": true
				},
				{
					"id": "self_raising_flour",
					"name": "Self-raising flour",
					"quantity": 175,
					"unit": "g",
					"fulfilled": true
				},
				{
					"id": "cocoa_powder",
					"name": "Cocoa powder",
					"quantity": 2,
					"unit": "tbsp",
					"fulfilled": true
				},
				{
					"id": "bicarbonate_of_soda",
					"name": "Bicarbonate of soda",
					"quantity": 1,
					"unit": "tbp",
					"fulfilled": true
				},
				{
					"id": "caster_sugar",
					"name": "Caster sugar",
					"quantity": 150,
					"unit": "g",
					"fulfilled": true
				},
				{
					"id": "golden_syrup",
					"name": "Golden syrup",
					"quantity": 2,
					"unit": "tbsp",
					"fulfilled": true
				},
				{
					"id": "milk",
					"name": "Milk",
					"quantity": 100,
					"unit": "ml",
					"fulfilled": false
				},
				{
					"id": "egg",
					"name": "Large Eggs",
					"quantity": 2,
					"unit": "quantity",
					"fulfilled": false
				},
				{
					"id": "unsalted_butter",
					"name": "Unsalted butter",
					"quantity": 100,
					"unit": "g",
					"fulfilled": true
				},
				{
					"id": "icing sugar",
					"name": "Icing sugar",
					"quantity": 225,
					"unit": "g",
					"fulfilled": false
				},
				{
					"id": "cocoa powder",
					"name": "Cocoa powder",
					"quantity": 40,
					"unit": "g",
					"fulfilled": true
				}
				],
				"times_cooked": 25000,
				"favourite": false,
				"last_cooked": undefined
		},
  }
}

// PUT /recipes/:recipeId/favourite
// body: {
// 	"favourite": boolean
// }
export const setIsRecipeFavourite = async (recipeId, favourite) => {
    return {
	"success": true,
    }
}

// PUT /recipes/:recipeId/rating
// body: {
// 	"rating": number
// }
export const setRecipeRating = async (recipeId, rating) => {
    return {
	"success": true,
    }
}

// POST /recipes/:recipeId/cooked
export const recordRecipeCooked = async (recipeId) => {
    return {
	"success": true,
    }
}
