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

app.put('/:ruleId', async (c) => {
    try {
        const userId = c.get('user')["id"];
        const ruleId = c.req.param('ruleId');
        const { enabled } = await c.req.json();

        if (typeof enabled !== 'boolean') {
            return c.json({ success: false, error: 'Invalid enabled value' }, 400);
        }

        if (enabled) {
            await db.query('INSERT INTO UserRule (user_id, rule_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE rule_id = rule_id', [userId,ruleId]);
        } else {
            
            await db.query('DELETE FROM UserRule WHERE user_id = ? AND rule_id = ?', [userId,ruleId]);
        }

        return c.json({ success: true });
    } catch (err) {
        console.error(err);
        return c.json({ success: false, error: 'Error updating rule' }, 500);
    }
});

export default app;
