import { config } from "dotenv";
config({ path: ".env.local" });

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { serveStatic } from "@hono/node-server/serve-static";

import db from "./db.js";

import user from "./routes/user.js";
import rules from "./routes/rules.js";
import recipes from "./routes/recipes.js";

const app = new Hono();

app.use(cors());
app.use("/static/*", serveStatic({ root: "./" }));

app.notFound((c) =>
  c.json({
    success: false,
    error: "This route does not exist.",
  }),
);

app.onError((err, c) => {
  console.error(err);
  return c.json({
    success: false,
    error: "An internal server error occured",
  });
});

app.use(
  createMiddleware(async (c, next) => {
    const [rows, _] = await db.execute("SELECT * FROM User WHERE id=1");
    c.set("user", rows[0]);
    await next();
  }),
);

app.get("/test", (c) => {
  const user = c.get("user");
  return c.text("Hi, you are logged in as: " + JSON.stringify(user));
});

app.route("/user", user);
app.route("/rules", rules);
app.route("/recipes", recipes);

serve({
  fetch: app.fetch,
  port: process.env.PORT,
});
