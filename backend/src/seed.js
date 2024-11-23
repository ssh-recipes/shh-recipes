const { config } = require('dotenv');
config({ path: '.env.local' });

const db = require('./db');

const seed = async () => {
    // Delete tables if they exist
    console.log("Dropping existing tables..");
    await db.query("DROP TABLE IF EXISTS RecipeIngredient");
    await db.query("DROP TABLE IF EXISTS IngredientRule");
    await db.query("DROP TABLE IF EXISTS UserRecipe");
    await db.query("DROP TABLE IF EXISTS Recipe");
    await db.query("DROP TABLE IF EXISTS Rule");
    await db.query("DROP TABLE IF EXISTS Ingredient");
    await db.query("DROP TABLE IF EXISTS User");

    // Create tables
    console.log("Creating tables..");

    await db.query(`
        CREATE TABLE User (
            id INTEGER AUTO_INCREMENT PRIMARY KEY
        )
    `);

    await db.query(`
        CREATE TABLE Ingredient (
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `);

    await db.query(`
        CREATE TABLE UserFridge (
            user_id INTEGER NOT NULL,
            ingredient_id INTEGER NOT NULL,
            quantity DECIMAL(10, 2) NOT NULL,
            unit VARCHAR(50) NOT NULL,
            last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, ingredient_id),
            FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE,
            FOREIGN KEY (ingredient_id) REFERENCES Ingredient (id) ON DELETE CASCADE
        )
    `);

    await db.query(`
        CREATE TABLE Recipe (
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT
        )
    `);

    await db.query(`
        CREATE TABLE RecipeIngredient (
            recipe_id INTEGER NOT NULL,
            ingredient_id INTEGER NOT NULL,
            quantity DECIMAL(10, 2) NOT NULL,
            unit VARCHAR(50) NOT NULL,
            PRIMARY KEY (recipe_id, ingredient_id),
            FOREIGN KEY (recipe_id) REFERENCES Recipe (id) ON DELETE RESTRICT,
            FOREIGN KEY (ingredient_id) REFERENCES Ingredient (id) ON DELETE CASCADE
        )
    `);

    await db.query(`
        CREATE TABLE UserRecipe (
            user_id INTEGER NOT NULL,
            recipe_id INTEGER NOT NULL,
            favourite BOOLEAN DEFAULT FALSE,
            last_cooked DATE,
            PRIMARY KEY (user_id, recipe_id),
            FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE,
            FOREIGN KEY (recipe_id) REFERENCES Recipe (id) ON DELETE RESTRICT
        )
    `);

    await db.query(`
        CREATE TABLE Rule (
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT
        )
    `);

    await db.query(`
        CREATE TABLE IngredientRule (
            ingredient_id INTEGER NOT NULL,
            rule_id INTEGER NOT NULL,
            required BOOLEAN NOT NULL,
            PRIMARY KEY (ingredient_id, rule_id),
            FOREIGN KEY (ingredient_id) REFERENCES Ingredient (id) ON DELETE CASCADE,
            FOREIGN KEY (rule_id) REFERENCES Rule (id) ON DELETE RESTRICT
        )
    `);

    // todo: add mock data
    
    console.log("Database seeded!");
};

seed();
