import { Hono } from "hono";
import db from "../db.js";

const app = new Hono();

app.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const [rows] = await db.query('SELECT * FROM User WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return c.json({ success: false, error: 'User not found' }, 404);
        }

        return c.json({ success: true, user: rows[0] });
    } catch (err) {
        console.error(err);
        return c.json({ success: false, error: 'Error with the user' }, 500);
    }
});

export default app;
