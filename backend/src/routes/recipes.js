import { Hono } from "hono";
import db from "../db.js";
const app = new Hono();

const calculateRecommendationScore = (recipe, userIngredients) => {
  let score = 0;
  if (recipe.favourite) score += 20;
  score += recipe.times_cooked * 2;

  const allIngredientsFulfilled = recipe.ingredients.every((ingredient) =>
    userIngredients.some(
      (userIngredient) =>
        userIngredient.id === ingredient.id && userIngredient.fulfilled,
    ),
  );

  if (allIngredientsFulfilled) score += 30;
  return score;
};

app.get("/", async (c) => {
  try {
    const user = c.get("user");
    const { category, skip, take } = c.req.query();

    const [rows] = await db.query(
      `
            SELECT DISTINCT r.*, AVG(urr.rating) AS avg_rating, urr.favourite, urr.last_cooked, urr.recipe_id
            FROM Recipe r
            LEFT JOIN RecipeIngredient ri ON r.id = ri.recipe_id
            LEFT JOIN IngredientRule ir ON ri.ingredient_id = ir.ingredient_id
            LEFT JOIN UserRule ur ON ir.rule_id = ur.rule_id AND ur.user_id = ?
            LEFT JOIN UserRecipe urr ON r.id = urr.recipe_id
            WHERE r.id NOT IN (
                SELECT r2.id
                FROM Recipe r2
                JOIN RecipeIngredient ri2 ON r2.id = ri2.recipe_id
                JOIN IngredientRule ir2 ON ri2.ingredient_id = ir2.ingredient_id
                JOIN UserRule ur2 ON ir2.rule_id = ur2.rule_id
                WHERE ur2.user_id = ?
            )
            GROUP BY r.id, urr.favourite, urr.last_cooked, urr.recipe_id;
        `,
      [user.id, user.id],
    );

    let recipesWithDetails = await Promise.all(
      rows.map(async (recipe) => {
        const [ingredients] = await db.query(
          "SELECT i.id, i.name, ri.quantity, ri.unit FROM Ingredient i, RecipeIngredient ri WHERE ri.ingredient_id = i.id AND ri.recipe_id = ?",
          [recipe.id],
        );

        const [rules] = await db.query(
          "SELECT DISTINCT ir.rule_id FROM IngredientRule ir , recipeingredient ri WHERE ri.recipe_id = ? AND ir.ingredient_id = ri.ingredient_id",
          [recipe.id],
        );

        const ingredientsWithFulfillment = await Promise.all(
          ingredients.map(async (ingredient) => {
            const [userIngredient] = await db.query(
              "SELECT 1 FROM UserIngredient WHERE user_id = ? AND ingredient_id = ?",
              [user.id, ingredient.id],
            );

            return {
              id: ingredient.id,
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              fulfilled: userIngredient.length > 0,
            };
          }),
        );

        return {
          ...recipe,
          ingredients: ingredientsWithFulfillment,
          rules: rules.map((rule) => rule.rule_id),
        };
      }),
    );

    if (category === "recent") {
      recipesWithDetails = recipesWithDetails.sort(
        (a, b) => new Date(b.last_cooked) - new Date(a.last_cooked),
      );
    } else if (category === "favourite") {
      recipesWithDetails = recipesWithDetails.filter(
        (recipe) => recipe.favourite,
      );
    } else if (category === "recommended") {
      recipesWithDetails = recipesWithDetails.sort(
        (a, b) =>
          calculateRecommendationScore(b) - calculateRecommendationScore(a),
      );
    }

    if (skip) recipesWithDetails = recipesWithDetails.slice(Number(skip));
    if (take) recipesWithDetails = recipesWithDetails.slice(0, Number(take));

    return c.json({
      success: true,
      data: recipesWithDetails.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        icon: recipe.icon,
        video: recipe.video,
        description: recipe.description,
        instructions: recipe.instructions,
        avg_rating: recipe.avg_rating,
        rules: recipe.rules,
        ingredients: recipe.ingredients,
        times_cooked: recipe.times_cooked,
        favourite: recipe.favourite,
        last_cooked: recipe.last_cooked,
      })),
    });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: "Error fetching recipes" }, 500);
  }
});

app.get("/:recipeId", async (c) => {
  try {
    const recipeId = c.req.param("recipeId");
    const [rows] = await db.query(
      `
            SELECT r.*, ur.favourite, ur.last_cooked, AVG(ur.rating) AS avg_rating
             FROM Recipe r
             LEFT JOIN UserRecipe ur ON r.id = ur.recipe_id
             WHERE r.id = ?
             GROUP BY r.id, ur.favourite, ur.last_cooked;`,
      [recipeId],
    );
    if (rows.length === 0) {
      return c.json({ success: false, error: "Recipe not found" }, 404);
    }

    const recipe = rows[0];
    const [ingredients] = await db.query(
      "SELECT i.id, i.name, ri.quantity, ri.unit FROM Ingredient i, RecipeIngredient ri WHERE ri.ingredient_id = i.id AND ri.recipe_id = ?",
      [recipeId],
    );

    return c.json({
      success: true,
      data: {
        id: recipe.id,
        name: recipe.name,
        icon: recipe.icon,
        video: recipe.video,
        description: recipe.description,
        instructions: recipe.instructions,
        avg_rating: recipe.avg_rating,
        ingredients: ingredients,
        times_cooked: recipe.times_cooked,
        favourite: recipe.favourite,
        last_cooked: recipe.last_cooked,
      },
    });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: "Error fetching recipe" }, 500);
  }
});

app.post("/:recipeId/cooked", async (c) => {
  try {
    const userId = c.get("user")["id"];
    const recipeId = c.req.param("recipeId");

    await db.query(
      "UPDATE Recipe SET times_cooked = times_cooked + 1 WHERE id = ?",
      [recipeId],
    );

    await db.query(
      "UPDATE UserRecipe SET last_cooked = CURRENT_TIMESTAMP WHERE user_id = ? AND recipe_id = ?",
      [userId, recipeId],
    );

    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json(
      { success: false, error: "Error recording recipe cooked" },
      500,
    );
  }
});

app.put("/:recipeId/favourite", async (c) => {
  try {
    const userId = c.get("user")["id"];
    const recipeId = c.req.param("recipeId");
    const { favourite } = await c.req.json();

    if (typeof favourite !== "boolean") {
      return c.json({ success: false, error: "Invalid favourite value" }, 400);
    }

    if (favourite) {
      await db.query(
        "INSERT INTO UserRecipe (user_id, recipe_id, favourite) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE favourite = 1",
        [userId, recipeId],
      );
    } else {
      await db.query(
        "UPDATE UserRecipe SET favourite = 0 WHERE user_id = ? AND recipe_id = ?",
        [userId, recipeId],
      );
    }

    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json(
      { success: false, error: "Error updating favourite status" },
      500,
    );
  }
});

app.put("/:recipeId/rating", async (c) => {
  try {
    const userId = c.get("user")["id"];
    const recipeId = c.req.param("recipeId");
    const { rating } = await c.req.json();

    if (rating < 1 || rating > 10 || !Number.isInteger(rating)) {
      return c.json(
        { success: false, error: "Rating must be an integer between 1 and 10" },
        400,
      );
    }

    await db.query(
      "INSERT INTO UserRecipe (user_id, recipe_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?",
      [userId, recipeId, rating, rating],
    );

    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: "Error submitting rating" }, 500);
  }
});

export default app;
