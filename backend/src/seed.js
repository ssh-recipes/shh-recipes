import { config } from "dotenv";
config({ path: ".env.local" });

import db from "./db.js";

const seed = async () => {
  // Delete tables if they exist
  console.log("Dropping existing tables..");
  await db.query("DROP TABLE IF EXISTS RecipeIngredient");
  await db.query("DROP TABLE IF EXISTS IngredientRule");
  await db.query("DROP TABLE IF EXISTS UserIngredient");
  await db.query("DROP TABLE IF EXISTS UserRecipe");
  await db.query("DROP TABLE IF EXISTS UserRule");
  await db.query("DROP TABLE IF EXISTS Recipe");
  await db.query("DROP TABLE IF EXISTS Rule");
  await db.query("DROP TABLE IF EXISTS Ingredient");
  await db.query("DROP TABLE IF EXISTS User");

  // Create tables
  console.log("Creating tables..");

  await db.query(`
        CREATE TABLE User (
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `);

  await db.query(`
        CREATE TABLE Ingredient (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `);

  await db.query(`
        CREATE TABLE Rule (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT
        )
    `);

  await db.query(`
        CREATE TABLE Recipe (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            icon VARCHAR(255) NOT NULL,
            video VARCHAR(255),
            description TEXT,
            instructions TEXT,
            times_cooked INT
        )
    `);

  await db.query(`
        CREATE TABLE IngredientRule (
            ingredient_id VARCHAR(255) NOT NULL,
            rule_id VARCHAR(255) NOT NULL,
            PRIMARY KEY (ingredient_id, rule_id),
            FOREIGN KEY (ingredient_id) REFERENCES Ingredient (id) ON DELETE CASCADE,
            FOREIGN KEY (rule_id) REFERENCES Rule (id) ON DELETE RESTRICT
        )
    `);

  await db.query(`
        CREATE TABLE UserIngredient (
            user_id INTEGER NOT NULL,
            ingredient_id VARCHAR(255) NOT NULL,
            quantity INTEGER NOT NULL,
            PRIMARY KEY (user_id, ingredient_id),
            FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE,
            FOREIGN KEY (ingredient_id) REFERENCES Ingredient (id) ON DELETE CASCADE
        )
    `);

  await db.query(`
        CREATE TABLE RecipeIngredient (
            recipe_id VARCHAR(255) NOT NULL,
            ingredient_id VARCHAR(255) NOT NULL,
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
            recipe_id VARCHAR(255) NOT NULL,
            favourite BOOLEAN DEFAULT FALSE,
            last_cooked TIMESTAMP,
            rating INT DEFAULT NULL,
            PRIMARY KEY (user_id, recipe_id),
            FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE,
            FOREIGN KEY (recipe_id) REFERENCES Recipe (id) ON DELETE RESTRICT
        )
    `);

  await db.query(`
        CREATE TABLE UserRule (
            user_id INTEGER NOT NULL,
            rule_id VARCHAR(255) NOT NULL,
            PRIMARY KEY (user_id, rule_id),
            FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE,
            FOREIGN KEY (rule_id) REFERENCES Rule (id) ON DELETE CASCADE
        )
    `);

  // Seed mock data

  await db.query(`
    INSERT INTO Rule (id, name, description) VALUES ('dairy', 'Dairy', 'Contains milk or milk products, including cheese, butter, etc.')
  `);
  await db.query(`
    INSERT INTO Rule (id, name, description) VALUES ('gluten_free', 'Gluten Free', 'Does not contain gluten.')
  `);
  await db.query(`
    INSERT INTO Rule (id, name, description) VALUES ('vegan', 'Vegan', 'Does not contain any animal products.')
  `);

  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('milk', 'Milk')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('egg', 'Egg')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('carrot', 'Carrot')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('pasta', 'Pasta')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('tomato', 'Tomato')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('cheese', 'Cheese')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('lettuce', 'Lettuce')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('cucumber', 'Cucumber')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('olive_oil', 'Olive Oil')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('bread', 'Bread')`);

  await db.query(`
    INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('milk', 'dairy')
  `);
  await db.query(`
    INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('cheese', 'dairy')
  `);
  await db.query(`
    INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('pasta', 'gluten_free')
  `);
  await db.query(`
    INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('bread', 'gluten_free')
  `);

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, instructions, times_cooked)
        VALUES ('cheese_omellete', 'Cheese Omelette', 'cheese_omelette', 'pfXVx9xYXlE', 'A delicious cheese omelette.', 'Whisk eggs and add cheese.', 0)
    `);

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, instructions, times_cooked)
        VALUES ('carrot_salad', 'Carrot Salad', 'carrot_salad.png', '48apTozJfo4', 'A healthy carrot salad.', 'Grate carrots and add dressing.', 0)
    `);

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, instructions, times_cooked)
        VALUES ('pasta_primavera', 'Pasta Primavera', 'pasta_primavera.png', 'abcd1234', 'A fresh pasta dish with vegetables.', 'Cook pasta and mix with vegetables.', 0)
    `);

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, instructions, times_cooked)
        VALUES ('tomato_soup', 'Tomato Soup', 'tomato_soup.png', 'efgh5678', 'A warm tomato soup.', 'Cook tomatoes and blend.', 0)
    `);

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, instructions, times_cooked)
        VALUES ('vegan_salad', 'Vegan Salad', 'vegan_salad.png', 'ijkl9101', 'A fresh vegan salad.', 'Mix lettuce, cucumber, and olive oil.', 0)
    `);

  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('cheese_omellete', 'egg', 2, 'pieces')
    `);

  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('cheese_omellete', 'milk', 100, 'ml')
    `);

  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('carrot_salad', 'carrot', 3, 'pieces')
    `);

  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('pasta_primavera', 'pasta', 200, 'grams')
    `);

  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('pasta_primavera', 'tomato', 2, 'pieces')
    `);

  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'tomato', 5, 'pieces')
    `);

  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('vegan_salad', 'lettuce', 1, 'head')
    `);

  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('vegan_salad', 'cucumber', 1, 'piece')
    `);

  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('vegan_salad', 'olive_oil', 50, 'ml')
    `);

  // Mock user
  const userResult = await db.query(`
    INSERT INTO User (name) VALUES ("Demo Account")
  `);

  await db.query(`
    INSERT INTO UserIngredient (user_id, ingredient_id, quantity) VALUES (1, 'milk', 1000)
  `);
  await db.query(`
    INSERT INTO UserIngredient (user_id, ingredient_id, quantity) VALUES (1, 'carrot', 200)
  `);

  await db.query(`
        INSERT INTO UserRecipe (user_id, recipe_id, favourite)
        VALUES (1, 'carrot_salad', TRUE)
    `);

  await db.query(`
        INSERT INTO UserRule (user_id, rule_id) 
        VALUES (1, 'dairy')
    `);

  console.log("Database seeded!");
  db.end();
};

seed();