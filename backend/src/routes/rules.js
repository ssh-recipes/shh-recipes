import { Hono } from "hono";
import db from "../db.js";

const app = new Hono();

app.get('/', async (c) => {
    try {
        const [rows] = await db.query('SELECT * FROM Rule');
        return c.json({
            success: true,
            data: rows.map(rule => ({
                id: rule.id,
                name: rule.name,
                description: rule.description,
            })),
        });
    } catch (err) {
        console.error(err);
        return c.json({ success: false, error: 'Error fetching rules' }, 500);
    }
});

app.get('/:ruleId', async (c) => {
    try {
        const ruleId = c.req.param('ruleId');
        const [rows] = await db.query('SELECT * FROM Rule WHERE id = ?', [ruleId]);

        if (rows.length === 0) {
            return c.json({ success: false, error: 'Rule not found' }, 404);
        }

        return c.json({
            success: true,
            data: rows[0],
        });
    } catch (err) {
        console.error(err);
        return c.json({ success: false, error: 'Error fetching rule' }, 500);
    }
});



export default app;
