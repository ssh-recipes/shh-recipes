import { fetch } from "expo/fetch";

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

export const getUser = async () => {
  try {
    const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Couldn't connect to backend" };
  }
};



export const getRules = async () => {
  try {
    const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/rules", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Couldn't connect to backend" };
  }
};

export const getRule = async (ruleId) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/rules/${ruleId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Couldn't connect to backend" };
  }
};

export const setIsRuleEnabled = async (ruleId, enabled) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/rules/${ruleId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Couldn't connect to backend" };
  }
};

export const getRecipes = async (category, skip, take) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/recipes?category=${category}&skip=${skip}&take=${take}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Couldn't connect to backend" };
  }
};

export const getRecipe = async (recipeId) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/recipes/${recipeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Couldn't connect to backend" };
  }
};

export const setIsRecipeFavourite = async (recipeId, favourite) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/recipes/${recipeId}/favourite`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favourite }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Couldn't connect to backend" };
  }
};

export const setRecipeRating = async (recipeId, rating) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/recipes/${recipeId}/rating`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      },
    );

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Couldn't connect to backend" };
  }
};

export const recordRecipeCooked = async (recipeId) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/recipes/${recipeId}/cooked`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Couldn't connect to backend" };
  }
};

export const getStaticResource = async (resource) => {
    return "${process.env.EXPO_PUBLIC_API_URL}/static/" + resource
}
