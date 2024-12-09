import { Hono } from "hono";
import db from "../db.js";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const user = c.get("user");
    const [rules] = await db.query(
      "SELECT r.id FROM Rule r, UserRule ur WHERE ur.rule_id = r.id AND ur.user_id = ?",
      [user.id],
    );

    return c.json({
      success: true,
      data: {
        name: user.name,
        rules: rules.map((rule) => rule.id),
      },
    });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: "Error with the user" }, 500);
  }
});

export default app;
