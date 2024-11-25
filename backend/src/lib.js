import { createMiddleware } from "hono/factory";
import db from "db.js";

export const getAuthorizationMw = () => {
    return createMiddleware(async (c, next) => {
    });
}
