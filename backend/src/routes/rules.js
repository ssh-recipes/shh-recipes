import { Hono } from "hono";
import db from "../db.js";

const app = new Hono();

app.get('/:id', async (c) => {
    try{
        const id = c.req.param('id');
        const [rows] = await db.query('SELECT * FROM Rule WHERE id = ?', [id]);
        if(rows.length === 0){
            return c.json({success: false, error: 'Rule not found'}, 404);
        }
        return c.json({success: true, rule: rows[0]});

    }catch(err){
        console.error(err);
        return c.json({success: false, error: 'Error with the rule'}, 500);
    }
});

app.get('/', async (c) => {
    try{
        const [rows] = await db.query('SELECT * FROM Rule');
        return c.json({success: true, rules: rows});
    }catch(err){
        console.error(err);
        return c.json({success: false, error: 'Error with the rules'}, 500);
    }
});


export default app;
