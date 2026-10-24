import { ping } from "#/db/con.js";
import { Router } from "express";

const healthRoutes = Router()

healthRoutes.get("/health", async (_req, res) => {
    await ping();
    res.json({ status: "ok" });
});

export default healthRoutes