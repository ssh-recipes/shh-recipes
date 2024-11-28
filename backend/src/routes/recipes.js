import { Hono } from "hono"
import db from "../db.js"
const app = new Hono();

app.get('/', async (c) => {
    try {
        const { category, skip, take } = c.req.query();

        const [rows] = await db.query(
            'SELECT * FROM Recipe'
        );

        return c.json({
            success: true,
            data: rows.map(recipe => ({
                id: recipe.id,
                name: recipe.name,
                icon: recipe.icon,
                video: recipe.video,
                description: recipe.description,
                instructions: recipe.instructions,
            })),
        });
    } catch (err) {
        console.error(err);
        return c.json({ success: false, error: 'Error fetching recipes' }, 500);
    }
});

app.get('/:recipeId', async (c) => {
    try {
        const recipeId = c.req.param('recipeId');
        const [rows] = await db.query('SELECT * FROM Recipe WHERE id = ?', [recipeId]);

        if (rows.length === 0) {
            return c.json({ success: false, error: 'Recipe not found' }, 404);
        }

        const recipe = rows[0];
        const [ingredients] = await db.query(
            'SELECT i.id, i.name, ri.quantity, ri.unit FROM Ingredient i, RecipeIngredient ri WHERE ri.ingredient_id = i.id AND ri.recipe_id = ?',
            [recipeId]
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
                ingredients,
                times_cooked: recipe.times_cooked,
                favourite: recipe.favourite,
                last_cooked: recipe.last_cooked,
            },
        });
    } catch (err) {
        console.error(err);
        return c.json({ success: false, error: 'Error fetching recipe' }, 500);
    }
});

app.post('/:recipeId/cooked', async (c) => {
    try {
        const userId = c.get('user')["id"];
        const recipeId = c.req.param('recipeId');

        await db.query('UPDATE Recipe SET times_cooked = times_cooked + 1 WHERE id = ?', [recipeId]);

        await db.query(
            'UPDATE UserRecipe SET last_cooked = CURRENT_DATE, favourite = favourite + 1 WHERE user_id = ? AND recipe_id = ?',
            [userId,recipeId]
        );

        return c.json({ success: true });
    } catch (err) {
        console.error(err);
        return c.json({ success: false, error: 'Error recording recipe cooked' }, 500);
    }
});



export default app;
