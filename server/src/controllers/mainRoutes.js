import { Router } from "express";
import healthRoutes from "./healthDb.js";
import dataRoutes from "./data.js";

const routes = Router()

routes.use("", healthRoutes)
routes.use("", dataRoutes)

export default routes