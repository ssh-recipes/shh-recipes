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
	    steps TEXT,
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

  await db.query(
    `INSERT INTO Rule (id, name, description) VALUES ('dairy', 'Dairy', 'Contains milk or milk products, including cheese, butter, etc.') `,
  );
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('milk', 'Milk') `);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('egg', 'Egg')`);
  await db.query(
    `INSERT INTO Ingredient (id, name) VALUES ('carrot', 'Carrot')`,
  );

  await db.query(
    `INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('milk', 'dairy')`,
  );

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, steps, times_cooked)
        VALUES ('cheese_omellete', 'Cheese Omelette', 'cheese_omelette', 'pfXVx9xYXlE', 'A delicious cheese omelette.', '[]', 0)
    `);

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, steps, times_cooked)
        VALUES ('carrot_salad', 'Carrot Salad', 'carrot_salad.png', '48apTozJfo4', 'A healthy carrot salad.', '[]', 0)
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

  // Mock user
  const userResult = await db.query(
    `INSERT INTO User (name) VALUES ("Demo Account")`,
  );

  await db.query(
    `INSERT INTO UserIngredient (user_id, ingredient_id, quantity) VALUES (1, 'milk', 1000)`,
  );
  await db.query(
    `INSERT INTO UserIngredient (user_id, ingredient_id, quantity) VALUES (1, 'carrot', 200)`,
  );

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
