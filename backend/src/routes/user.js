import { Hono } from "hono";
import db from "../db.js";

const app = new Hono();

app.get('/', async (c) => {
    try {
        const [rows] = await db.query('SELECT * FROM User WHERE id = 1');
        const user = rows[0];

        const [rules] = await db.query('SELECT r.name FROM Rule r, UserRule ur WHERE ur.rule_id = r.id AND ur.user_id = ?', [user.id]);

        return c.json({
            success: true,
            data: {
                name: user.name,
                rules: rules.map(rule => rule.name),
            },
        });
    } catch (err) {
        console.error(err);
        return c.json({ success: false, error: 'Error with the user' }, 500);
    }
});


export default app;
