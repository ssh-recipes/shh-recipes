import { config } from "dotenv";
config({ path: '.env.local' });

import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import user from './routes/user.js'
import rules from './routes/rules.js'
import recipes from './routes/recipes.js'

const app = new Hono();

app.notFound((c) => c.json({
    success: false,
    error: "This route does not exist."
}))

app.onError((err, c) => {
    console.error(err);
    return c.json({
	success: false,
	error: "An internal server error occured"
    })
})

app.route("/user", user);
app.route("/rules", rules);
app.route("/recipes", recipes);

serve({
    fetch: app.fetch,
    port: process.env.PORT,
})
