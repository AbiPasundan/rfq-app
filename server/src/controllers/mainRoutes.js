import { Router } from "express";
import healthRoutes from "./healthDb.js";

const routes = Router()

routes.use("", healthRoutes)

export default routes