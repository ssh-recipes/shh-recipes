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
export const getUser = () => {
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
export const getRules = () => {
    return {
	"success": true,
	"data": [
	    {
		"id": "dairy-free",
		"name": "Dairy-Free",
		"description": "Does not contain milk or milk products, including cheese, butter, or any dairy derivatives."
	    },
	    {
		"id": "halal",
		"name": "Halal",
		"description": "Adheres to Islamic dietary laws, including the prohibition of pork, alcohol, and non-Halal-certified meat."
	    }
	]
    ]
}

// GET /rules/:ruleId
export const getRule = (ruleId) => { // i don't think would be used, but added for parity
    return {
	"success": true,
	"data": {
	    "id": "dairy-free",
	    "name": "Dairy-Free",
	    "description": "Does not contain milk or milk products, including cheese, butter, or any dairy derivatives."
	}
    ]
}

// PUT /rules/:ruleId
// body: {
// 	"enabled": true
// }
export const enableRule = (ruleId) => {
    return {
	"success": true,
    }
}
//
// PUT /rules/:ruleId
// body: {
// 	"enabled": false
// }
export const disableRule = (ruleId) => {
    return {
	"success": true,
    }
}

// GET /recipes
// params: category, skip & take
export const getRecipes = (category, skip, take) => {
    return {
	"success": true,
	"data": [
	    {
		"id": "cheese_omellete",
		"name": "Cheese Omelette",
		"icon": "icons/cheese_omellette.png", // the api will host static assets, so icon would be BASE_URL/static/icons/cheese_omellete.png for example
		"video": "pfXVx9xYXlE", // youtube video id, for potential embed? https://youtube.com/embed/pfXVx9xYXlE for example
		"description": "A delicious cheese omelette.",
		"instructions": "Whisk eggs and add cheese."
		"ingredients": [
		    {
			"id": "egg",
			"name": "Egg",
			"quantity": 2,
			"unit": "quantity"
		    },
		    {
			"id": "milk",
			"name": "Milk",
			"quantity": 100,
			"unit": "ml"
		    }
		],
		"favourite": false,
		"last_cooked": null, // last cooked may be null
	    },
	    {
		"id": "carrot_salad",
		"name": "Carrot Salad",
		"icon": "icons/carrot_salad.png",
		"video": "48apTozJfo4",
		"description": "A healthy carrot salad.",
		"instructions": "Grate carrots and add dressing."
		"ingredients": [
		    {
			"id": "carrot",
			"name": "Carrot",
			"quantity": 3,
			"unit": "quantity"
		    }
		],
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
	    "video": "pfXVx9xYXlE",
	    "description": "A delicious cheese omelette.",
	    "instructions": "Whisk eggs and add cheese."
	    "ingredients": [
		{
		    "id": "egg",
		    "name": "Egg",
		    "quantity": 2,
		    "unit": "quantity"
		},
		{
		    "id": "milk",
		    "name": "Milk",
		    "quantity": 100,
		    "unit": "ml"
		}
	    ],
	    "favourite": false,
	    "last_cooked": undefined
	},
    }

}

// PUT /recipes/:recipeId
// body: {
// 	"favourite": true
// }
export const favouriteRecipe = async (id) => {
    return {
	"success": true,
    }
}

// PUT /recipes/cheese_omellete
// body: {
// 	"favourite": false
// }
export const unfavouriteRecipe = async (id) => {
    return {
	"success": true,
    }
}
