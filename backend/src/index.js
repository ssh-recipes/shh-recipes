const { config } = require('dotenv');
config();

const { serve } = require('@hono/node-server');
const { Hono } = require('hono');

const app = new Hono();
app.get('/', (c) => c.text('Hello world'));

serve({
  fetch: app.fetch,
  port: process.env.PORT,
})
