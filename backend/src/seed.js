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

  // Add new ingredients for tomato soup
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('butter', 'Butter')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('garlic', 'Garlic')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('onion', 'Onion')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('sugar', 'Sugar')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('stock', 'Stock or Water')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('cream', 'Cream')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('salt', 'Salt')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('pepper', 'Pepper')`);
  await db.query(`INSERT INTO Ingredient (id, name) VALUES ('basil', 'Basil')`);

  // Tag ingredients with rules
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('olive_oil', 'vegan')`);
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('butter', 'dairy')`);
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('milk', 'dairy')`);
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('cream', 'dairy')`);
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('tomato', 'vegan')`);
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('garlic', 'vegan')`);
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('onion', 'vegan')`);
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('basil', 'vegan')`);
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('salt', 'vegan')`);
  await db.query(`INSERT INTO IngredientRule (ingredient_id, rule_id) VALUES ('pepper', 'vegan')`);

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, steps, times_cooked)
        VALUES ('cheese_omellete', 'Cheese Omelette', 'cheese_omelette.png', 'pfXVx9xYXlE', 'A delicious cheese omelette.', '[{ "text": "lorem ipsum", "timestamp": 0 }]', 0)
    `);

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, steps, times_cooked)
        VALUES ('carrot_salad', 'Carrot Salad', 'carrot_salad.png', '48apTozJfo4', 'A healthy carrot salad.', '[{ "text": "lorem ipsum", "timestamp": 0 }]', 0)
    `);

  await db.query(`
      INSERT INTO Recipe (id, name, icon, video, description, steps, times_cooked)
      VALUES (
          'tomato_soup',
          'Tomato Soup',
          'tomato_soup.png',
          'tomato_soup.mp4',
          'A warm tomato soup.',
          '[{"text":"Hey, I''m John Kanell, and today on Preppy Kitchen, we''re making a rich and creamy tomato soup.","timestamp":2},{"text":"So, let''s get started. To make this recipe, you need two cans of whole peeled tomatoes, onion, garlic, olive oil, a little butter, a dash of sugar, some stock or water, cream, salt and pepper, basil, and any other herbs that you love.","timestamp":2},{"text":"First off, we''re gonna do some prep work. Grab a Dutch oven or a big pot. We''re gonna make a lotta soup, so you don''t want a little tiny pot that''s overflowing.","timestamp":18},{"text":"Good tomato soup has tons of flavor, so to get that started, I''m chopping up one and a little bit extra of yellow onion. Just give it like a nice chop. My twins, Lachlan and George, are obsessed with tomato soup.","timestamp":22},{"text":"Today we''re basically snowed in. There''s like black ice on the road. It is a wintry day. This is the perfect thing to warm you up on the inside and get all those cozy vibes.","timestamp":30},{"text":"Onion aside, now it''s time for six cloves or more of garlic. You can let me know in the comments what you would be adding to this recipe.","timestamp":40},{"text":"I''m gonna give my garlic a good smash, kind of release the oils and also release that papery skin. Give it a good mince. Everything''s all chopped up.","timestamp":58},{"text":"Now we''re gonna melt some butter and olive oil in our big pot. Open that Dutch oven up. We''re adding two tablespoons of butter right into the pot, along with three tablespoons of olive oil.","timestamp":70},{"text":"Let''s set this over medium heat. As soon as the butter''s melted, we can start adding in the onion and get to cooking. My butter is melted. It smells amazing already.","timestamp":78},{"text":"I''m gonna add the onion and get to stirring. It needs to be translucent and softened before we do anything else, okay, ah. You''ll be stirring occasionally for about eight minutes, and during this time, the onion''s sugars are breaking down and you''re getting a wonderful depth of flavor added to the soup.","timestamp":84},{"text":"I''m not adding the garlic yet because it would really get burnt, crispy, and bitter if it was added along with the onion. The onion takes a long time for those sugars to break down. The garlic cooks and burns like that.","timestamp":92},{"text":"While that cooks, I''m gonna open up my two cans of tomatoes. Tomato soup is typically something you make during the winter, and wintertime is not when tomatoes are best. These tomatoes were canned at peak freshness.","timestamp":100},{"text":"Adding the garlic. And here we wanna stir constantly. You do not want to have any burnt garlic in this tomato soup. Two things can make your tomato soup bitter. One would be burning the garlic and the other one is doing something with your olive oil.","timestamp":110},{"text":"Cook the garlic for about five minutes while stirring pretty regularly. You want this to be very aromatic without burning it. Just about five minutes later, we''re ready to add the tomatoes in, carefully, so they don''t splatter on you.","timestamp":120},{"text":"The liquid we add to the soup could be so many different things. It could be water if you want it just plain. It could be chicken stock. I''m using veggie stock today. I''m also gonna add a tablespoon of sugar.","timestamp":140},{"text":"The sugar works with the tomatoes and makes some magic happen. I''m also adding some black pepper. It''s kind of to taste, but at least 1/4 of a teaspoon.","timestamp":150},{"text":"We''re gonna bring this to a boil and then let it simmer for about half an hour. It''s gonna reduce the liquid and it just intensify all of the flavors. Then, we''ll talk about the consistency and mixing and what could go wrong.","timestamp":160},{"text":"I am also adding a generous pinch of salt right now. We''ll add more to taste later. Once this comes to a boil, we''re gonna reduce to a simmer and let that hang out for half an hour.","timestamp":170},{"text":"We''re adding some fresh basil to this at the very end, but you can definitely add some of your favorite spices to this too. I''m adding a pinch of dried thyme, a little bit of oregano.","timestamp":180},{"text":"Now it''ll simmer and infuse and just be a little bit more delicious. My soup reduced, all those flavors really melded together, and I tasted it and it''s delicious already.","timestamp":190},{"text":"The one thing is, there''s a lot of texture on this soup, so you have a couple options. You could use a potato ricer or a masher and just mash it all together. I''m gonna use an immersion blender.","timestamp":200},{"text":"If you put it into a blender, what happens with some brands of olive oil is they become incredibly bitter, like mind-bendingly bitter, so don''t do that. Don''t overblend your soup or use veggie oil instead.","timestamp":210},{"text":"We''re finishing this off with a little bit of cream. You can also add some salt and pepper to taste at the very end. Stir that in and the cream adds so much richness and mouthfeel and really balances out the acid from the tomatoes.","timestamp":220},{"text":"Our tomato soup is just about ready, but we''re gonna give it a taste. Let''s see if we need any more salt in this. That is really nice.","timestamp":230},{"text":"Get a ladle, fill your bowls up. This is a great moment for some homemade crunchy croutons or like a nice big crusty loaf of bread. And then, a little torn basil to finish it off and you''re ready to enjoy.","timestamp":240}]',
          0
      )
  `);

  await db.query(`
    INSERT INTO Recipe (id, name, icon, video, description, steps, times_cooked)
    VALUES ('pasta_primavera', 'Pasta Primavera', 'pasta_primavera.png', '48apTozJfo4', 'A delicious pasta.', '[{ "text": "lorem ipsum", "timestamp": 0 }]', 0)
  `);

  await db.query(`
        INSERT INTO Recipe (id, name, icon, video, description, steps, times_cooked)
        VALUES ('vegan_salad', 'Vegan Salad', 'vegan_salad.png', 'ijkl9101', 'A fresh vegan salad.', '[{ "text": "lorem ipsum", "timestamp": 0 }]', 0)
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
        VALUES ('tomato_soup', 'onion', 1, 'piece')
    `);
  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'garlic', 6, 'cloves')
    `);
  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'olive_oil', 3, 'tablespoons')
    `);
  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'butter', 2, 'tablespoons')
    `);
  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'sugar', 1, 'tablespoon')
    `);
  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'stock', 3, 'cups')
    `);
  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'cream', 100, 'ml')
    `);
  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'salt', 1, 'pinch')
    `);
  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'pepper', 1, 'pinch')
    `);
  await db.query(`
        INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit)
        VALUES ('tomato_soup', 'basil', 5, 'leaves')
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
        INSERT INTO UserRecipe (user_id, recipe_id, favourite, rating)
        VALUES (1, 'carrot_salad', TRUE, 7)
    `);

  await db.query(`
      INSERT INTO UserRecipe (user_id, recipe_id, favourite, rating)
      VALUES (1, 'tomato_soup', TRUE, 9)
  `);

  await db.query(`
    INSERT INTO UserRecipe (user_id, recipe_id, favourite, rating)
    VALUES (1, 'pasta_primavera', FALSE, 6)
  `);

  await db.query(`
        INSERT INTO UserRule (user_id, rule_id) 
        VALUES (1, 'dairy')
    `);

  console.log("Database seeded!");
  db.end();
};

seed();
