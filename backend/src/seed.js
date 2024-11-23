const { config } = require('dotenv');
config({ path: '.env.local' });

const db = require('./db');

const seed = async () => {
    // Delete tables if they exist
    await db.query("DROP TABLE IF EXISTS RecipeIngredient");
    await db.query("DROP TABLE IF EXISTS IngredientRule");
    await db.query("DROP TABLE IF EXISTS UserRecipe");
    await db.query("DROP TABLE IF EXISTS Recipe");
    await db.query("DROP TABLE IF EXISTS Rule");
    await db.query("DROP TABLE IF EXISTS Ingredient");
    await db.query("DROP TABLE IF EXISTS User");

    // Create tables
    await db.query(```
	CREATE TABLE IF NOT EXISTS \`User\` (
	id INTEGER AUTO_INCREMENT PRIMARY KEY```
    );

    console.log("Database seeded!");
};

seed();
